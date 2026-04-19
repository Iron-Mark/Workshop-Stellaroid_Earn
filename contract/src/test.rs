#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    token, Address, BytesN, Env, String,
};

struct Ctx<'a> {
    env: Env,
    client: StellaroidEarnClient<'a>,
    admin: Address,
    token_admin: token::StellarAssetClient<'a>,
    token_addr: Address,
}

fn setup<'a>() -> Ctx<'a> {
    let env = Env::default();
    let contract_id = env.register(StellaroidEarn, ());
    let client = StellaroidEarnClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = sac.address();
    let token_admin = token::StellarAssetClient::new(&env, &token_addr);

    Ctx {
        env,
        client,
        admin,
        token_admin,
        token_addr,
    }
}

fn text(env: &Env, value: &str) -> String {
    String::from_str(env, value)
}

fn register_issuer(ctx: &Ctx<'_>, issuer: &Address) {
    ctx.client.register_issuer(
        issuer,
        &text(&ctx.env, "Stellaroid Academy"),
        &text(&ctx.env, "https://stellaroid.dev"),
        &text(&ctx.env, "bootcamp"),
    );
}

fn approve_issuer(ctx: &Ctx<'_>, issuer: &Address) {
    ctx.client.approve_issuer(&ctx.admin, issuer);
}

fn register_certificate(
    ctx: &Ctx<'_>,
    issuer: &Address,
    student: &Address,
    hash: &BytesN<32>,
) {
    ctx.client.register_certificate(
        issuer,
        student,
        hash,
        &text(&ctx.env, "Stellar Smart Contract Bootcamp Completion"),
        &text(&ctx.env, "Stellar PH Bootcamp 2026"),
        &text(
            &ctx.env,
            "https://stellaroid-earn-demo.vercel.app/proof-metadata/sample.json",
        ),
    );
}

// T1 — Happy path: approved issuer registers + verifies, then admin rewards.
#[test]
fn t1_happy_path_with_approved_issuer() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[1u8; 32]);

    register_issuer(&ctx, &issuer);
    approve_issuer(&ctx, &issuer);
    register_certificate(&ctx, &issuer, &student, &hash);
    ctx.client.verify_certificate(&issuer, &hash);

    let cert = ctx.client.get_certificate(&hash).unwrap();
    assert_eq!(cert.status, CredentialStatus::Verified);
    assert_eq!(
        cert.title,
        text(&ctx.env, "Stellar Smart Contract Bootcamp Completion")
    );

    ctx.token_admin.mint(&ctx.admin, &1_000);
    ctx.client.reward_student(&student, &hash, &500);

    let balance = token::Client::new(&ctx.env, &ctx.token_addr).balance(&student);
    assert_eq!(balance, 500);
}

// T2 — Pending issuers cannot publish credentials.
#[test]
fn t2_unapproved_issuer_cannot_issue() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[2u8; 32]);

    register_issuer(&ctx, &issuer);

    let err = ctx
        .client
        .try_register_certificate(
            &issuer,
            &student,
            &hash,
            &text(&ctx.env, "Stellar Smart Contract Bootcamp Completion"),
            &text(&ctx.env, "Stellar PH Bootcamp 2026"),
            &text(
                &ctx.env,
                "https://stellaroid-earn-demo.vercel.app/proof-metadata/sample.json",
            ),
        )
        .err()
        .unwrap()
        .unwrap();
    assert_eq!(err, Error::IssuerNotApproved);
}

// T3 — Suspended issuers cannot publish new credentials.
#[test]
fn t3_suspended_issuer_cannot_issue() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[3u8; 32]);

    register_issuer(&ctx, &issuer);
    approve_issuer(&ctx, &issuer);
    ctx.client.suspend_issuer(&ctx.admin, &issuer);

    let err = ctx
        .client
        .try_register_certificate(
            &issuer,
            &student,
            &hash,
            &text(&ctx.env, "Stellar Smart Contract Bootcamp Completion"),
            &text(&ctx.env, "Stellar PH Bootcamp 2026"),
            &text(
                &ctx.env,
                "https://stellaroid-earn-demo.vercel.app/proof-metadata/sample.json",
            ),
        )
        .err()
        .unwrap()
        .unwrap();
    assert_eq!(err, Error::IssuerSuspended);
}

// T4 — A different approved issuer cannot verify someone else's credential.
#[test]
fn t4_wrong_approved_issuer_cannot_verify() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer_a = Address::generate(&ctx.env);
    let issuer_b = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[4u8; 32]);

    register_issuer(&ctx, &issuer_a);
    register_issuer(&ctx, &issuer_b);
    approve_issuer(&ctx, &issuer_a);
    approve_issuer(&ctx, &issuer_b);

    register_certificate(&ctx, &issuer_a, &student, &hash);

    let err = ctx
        .client
        .try_verify_certificate(&issuer_b, &hash)
        .err()
        .unwrap()
        .unwrap();
    assert_eq!(err, Error::Unauthorized);
}

// T5 — Revocation persists and blocks downstream payments.
#[test]
fn t5_revoked_credential_blocks_payment() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let employer = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[5u8; 32]);

    register_issuer(&ctx, &issuer);
    approve_issuer(&ctx, &issuer);
    register_certificate(&ctx, &issuer, &student, &hash);
    ctx.client.verify_certificate(&issuer, &hash);
    ctx.client.revoke_certificate(&issuer, &hash);

    let cert = ctx.client.get_certificate(&hash).unwrap();
    assert_eq!(cert.status, CredentialStatus::Revoked);

    let err = ctx
        .client
        .try_link_payment(&employer, &student, &hash, &250)
        .err()
        .unwrap()
        .unwrap();
    assert_eq!(err, Error::CredentialRevoked);
}

// T6 — Issuer registration and approval emit events.
#[test]
fn t6_issuer_events_emit() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    register_issuer(&ctx, &issuer);
    approve_issuer(&ctx, &issuer);

    let e = &ctx.env;
    assert_eq!(
        ctx.env.events().all(),
        vec![
            (false, (symbol_short!("init"),).into_val(e), ctx.admin.into_val(e)),
            (false, (symbol_short!("iss_reg"),).into_val(e), issuer.into_val(e)),
            (false, (symbol_short!("iss_appr"),).into_val(e), issuer.into_val(e)),
        ]
    );
}
