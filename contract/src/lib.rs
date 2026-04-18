#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype, symbol_short, token, Address, BytesN,
    Env,
};

// Persistent certificate records survive beyond a single tx burst;
// Admin/Token live in instance storage because they are read by every mutation.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Token,
    Cert(BytesN<32>),
}

#[contracttype]
#[derive(Clone)]
pub struct Certificate {
    pub owner: Address,
    pub issuer: Address,
    pub verified: bool,
}

// Human-readable error variants — the frontend maps these to copy,
// never surfacing raw HostError / ScVal to the user.
#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    AlreadyExists = 4,
    NotFound = 5,
    InvalidAmount = 6,
}

// ~30d / ~60d in testnet ledgers — keeps certificates alive through a bootcamp demo window.
const TTL_THRESHOLD: u32 = 518_400;
const TTL_EXTEND: u32 = 1_036_800;

#[contract]
pub struct StellaroidEarn;

#[contractimpl]
impl StellaroidEarn {
    /// One-shot bootstrap: admin funds rewards and holds the token treasury.
    pub fn init(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
        env.events().publish((symbol_short!("init"),), admin);
        Ok(())
    }

    /// Issuer registers a certificate hash bound to a student wallet.
    /// Duplicate hashes are rejected — that is the tamper / double-issuance guard.
    pub fn register_certificate(
        env: Env,
        issuer: Address,
        student: Address,
        cert_hash: BytesN<32>,
    ) -> Result<(), Error> {
        issuer.require_auth();

        let key = DataKey::Cert(cert_hash.clone());
        if env.storage().persistent().has(&key) {
            return Err(Error::AlreadyExists);
        }

        let cert = Certificate {
            owner: student.clone(),
            issuer: issuer.clone(),
            verified: false,
        };
        env.storage().persistent().set(&key, &cert);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);

        env.events()
            .publish((symbol_short!("cert_reg"), student), cert_hash);
        Ok(())
    }

    /// Flips the certificate to verified=true and emits an indexable event
    /// employers can scan on stellar.expert. Returns false when the hash is unknown.
    pub fn verify_certificate(env: Env, cert_hash: BytesN<32>) -> bool {
        let key = DataKey::Cert(cert_hash.clone());
        match env.storage().persistent().get::<DataKey, Certificate>(&key) {
            Some(mut cert) => {
                cert.verified = true;
                env.storage().persistent().set(&key, &cert);
                env.events()
                    .publish((symbol_short!("cert_ver"), cert.owner), cert_hash);
                true
            }
            None => {
                env.events()
                    .publish((symbol_short!("cert_fail"),), cert_hash);
                false
            }
        }
    }

    /// Admin-triggered XLM/SAC reward to a student whose cert is registered.
    /// The token client handles the actual transfer; we only gate + emit.
    pub fn reward_student(
        env: Env,
        student: Address,
        cert_hash: BytesN<32>,
        amount: i128,
    ) -> Result<(), Error> {
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)?;
        admin.require_auth();

        let key = DataKey::Cert(cert_hash);
        let cert: Certificate = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(Error::NotFound)?;
        if cert.owner != student {
            return Err(Error::Unauthorized);
        }

        let token_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::NotInitialized)?;
        token::Client::new(&env, &token_addr).transfer(&admin, &student, &amount);

        env.events()
            .publish((symbol_short!("reward"), student), amount);
        Ok(())
    }

    /// Employer pays a verified student directly via the configured token.
    /// Employer authorizes the transfer — contract is just the coordination layer.
    pub fn link_payment(
        env: Env,
        employer: Address,
        student: Address,
        cert_hash: BytesN<32>,
        amount: i128,
    ) -> Result<(), Error> {
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        employer.require_auth();

        let cert: Certificate = env
            .storage()
            .persistent()
            .get(&DataKey::Cert(cert_hash))
            .ok_or(Error::NotFound)?;
        if !cert.verified || cert.owner != student {
            return Err(Error::Unauthorized);
        }

        let token_addr: Address = env
            .storage()
            .instance()
            .get(&DataKey::Token)
            .ok_or(Error::NotInitialized)?;
        token::Client::new(&env, &token_addr).transfer(&employer, &student, &amount);

        env.events()
            .publish((symbol_short!("payment"), employer), amount);
        Ok(())
    }

    pub fn get_certificate(env: Env, cert_hash: BytesN<32>) -> Option<Certificate> {
        env.storage().persistent().get(&DataKey::Cert(cert_hash))
    }
}

#[cfg(test)]
mod test;
