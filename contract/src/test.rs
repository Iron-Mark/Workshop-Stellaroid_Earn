#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    token, Address, BytesN, Env,
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

// T1 — Happy path: init → register → verify → admin rewards student with SAC token.
#[test]
fn t1_happy_path() {
    let ctx = setup();
    ctx.env.mock_all_auths();

    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[1u8; 32]);

    ctx.client.register_certificate(&issuer, &student, &hash);
    assert!(ctx.client.verify_certificate(&hash));

    ctx.token_admin.mint(&ctx.admin, &1_000);
    ctx.client.reward_student(&student, &hash, &500);

    let balance = token::Client::new(&ctx.env, &ctx.token_addr).balance(&student);
    assert_eq!(balance, 500);
}

// T2 — Unauthorized: register without mocked auths must fail.
#[test]
fn t2_unauthorized_register_fails() {
    let ctx = setup();
    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[2u8; 32]);

    let res = ctx.client.try_register_certificate(&issuer, &student, &hash);
    assert!(res.is_err(), "register should fail without issuer auth");
}

// T3 — State verification: after register, storage reflects owner/issuer/verified=false.
#[test]
fn t3_state_after_register() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[3u8; 32]);
    ctx.client.register_certificate(&issuer, &student, &hash);

    let cert = ctx.client.get_certificate(&hash).unwrap();
    assert_eq!(cert.owner, student);
    assert_eq!(cert.issuer, issuer);
    assert!(!cert.verified);
}

// T4 — Edge case: duplicate registration returns Error::AlreadyExists.
#[test]
fn t4_duplicate_registration_rejected() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[4u8; 32]);
    ctx.client.register_certificate(&issuer, &student, &hash);

    let err = ctx
        .client
        .try_register_certificate(&issuer, &student, &hash)
        .err()
        .unwrap()
        .unwrap();
    assert_eq!(err, Error::AlreadyExists);
}

// T5 — Event emission: register_certificate publishes an event from the contract.
#[test]
fn t5_event_emission_on_register() {
    let ctx = setup();
    ctx.env.mock_all_auths();
    ctx.client.init(&ctx.admin, &ctx.token_addr);

    let issuer = Address::generate(&ctx.env);
    let student = Address::generate(&ctx.env);
    let hash = BytesN::from_array(&ctx.env, &[5u8; 32]);
    ctx.client.register_certificate(&issuer, &student, &hash);

    let events = ctx.env.events().all();
    assert!(
        !events.is_empty(),
        "expected at least one event emitted by register_certificate"
    );
}
