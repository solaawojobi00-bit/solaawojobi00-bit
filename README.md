<h1 align="center">Hello World, I'm Sola Awojobi</h1>
<h3 align="center">Building on Stellar/Soroban: backend & frontend contributions across open-source Web3 projects</h3>

<p align="center">
  My background is in Monitoring, Evaluation, Accountability & Learning (MEAL) and data analysis, which is part of why I lean toward rigorous testing, careful edge-case handling, and clear documentation in the code I ship.
</p>

---

### 🔭 Currently working on

- Building out **netpulse-xlm** and **sep-compliance-validator** as my flagship projects, both well past Phase 1 now (see Flagship projects below)
- Actively contributing across the Stellar/Soroban ecosystem: 61+ merged PRs across 15 projects(see Contributions below)
- Participating in the **Stellar Wave Program**

---

### 🛠️ Skills & Tools

<p align="left">
  <img src="https://img.shields.io/badge/Soroban-000000?style=for-the-badge&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/Horizon%20API-000000?style=for-the-badge&logo=stellar&logoColor=white" />
  <img src="https://img.shields.io/badge/Stellar%20SDK-000000?style=for-the-badge&logo=stellar&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20%2F%20Next.js-000000?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js%20%2F%20TypeScript-339933?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

---

### 🚀 Flagship projects

My two most actively developed projects, each grown well past an initial prototype into a genuinely deep, well-tested tool:

- **[sep-compliance-validator](https://github.com/solaawojobi00-bit/sep-compliance-validator)** — 51 merged PRs. Started as a SEP-1/SEP-10 checker, now covers **SEP-1, SEP-10, SEP-12, SEP-24, and SEP-38** conformance end to end: live negative-case challenge submissions, JWT signature verification via anchor JWKS, muxed-account and memo support, 100% branch coverage on SEP-10 negative tests, and packaging as a reusable GitHub Action with an npm-published CLI (`--output`, `--only`, `--fail-on-warn`). Validated against Stellar's official testnet reference anchor.
- **[netpulse-xlm](https://github.com/solaawojobi00-bit/netpulse-xlm)** — 38 merged PRs. Grew from a Phase 1 dashboard into a production-grade Stellar network monitor: replaced polling with Horizon SSE streaming + WebSocket push, added persistent historical storage with 24h trend views, CSV/JSON export, an accessibility pass, dark/light theming, and a CI pipeline with CodeQL scanning, dependency auditing, and secret scanning.

---

### 🔨 Building

Four more Stellar/Soroban prototypes, each a working Phase 1/MVP built and verified end-to-end on testnet (Phase 2+ work tracked as issues in each repo):

- **[stellar-vrf-service](https://github.com/solaawojobi00-bit/stellar-vrf-service)**: VRF-backed randomness oracle; a Soroban (Rust) contract paired with an off-chain oracle, deployed and demoed end-to-end on Stellar testnet.
- **[earnest-escrow](https://github.com/solaawojobi00-bit/earnest-escrow)**: Real estate earnest-money deposit escrow built on Stellar Claimable Balances (no custom contract); working claim and reclaim-after-deadline demos on testnet.
- **[supply-chain-proof-of-delivery-payments](https://github.com/solaawojobi00-bit/supply-chain-proof-of-delivery-payments)**: Soroban (Rust) escrow contract that releases a buyer's payment once a trusted attestor confirms delivery, or returns it after a deadline; working end-to-end on testnet.
- **[reg-asset-issuance-gateway](https://github.com/solaawojobi00-bit/reg-asset-issuance-gateway)**: SEP-8 compliant regulated asset issuance/redemption gateway for Stellar; investor whitelist, KYC stub, SEP-8 approval, and issuance settlement, demoed end-to-end against testnet with verifiable transaction hashes.

---

### 📌 Contributions

Merged pull requests to established, multi-contributor Stellar/Soroban open-source projects:

- **[GreenPay](https://github.com/Stellar-Search/GreenPay)** (Stellar-Search): open-source Stellar/Soroban climate-donation platform; 23 merged PRs spanning Horizon donation-event handling, Redis-backed rate limiting, push notifications, and transactional event-sourcing fixes.
- **[Stellar-MarketPay](https://github.com/Stellar-MarkeyPay/Stellar-MarketPay)** (Stellar-MarkeyPay): Stellar-based marketplace/job-search platform; 6 merged PRs covering Postgres full-text search indexing, i18n CI gating, and architecture decision records.
- **[YieldVault-RWA](https://github.com/Junirezz/YieldVault-RWA)** (Junirezz): Stellar/Soroban RWA vault; 8 merged PRs covering withdrawal partial-failure recovery, idempotent transfer orchestration, and the vault comparison UI.
- **[spoovault](https://github.com/spoo-vault/spoovault)** (spoo-vault): multi-chain (Soroban/EVM) document and NFT vault; 4 merged PRs adding a TTL cache for contract view calls and list virtualization for large galleries.
- **[escrow-backend](https://github.com/Goldii-locks/escrow-backend)** (Goldii-locks): Node.js backend for Soroban milestone escrow; 4 merged PRs on schema-manager concurrency locking, diagnostics logging, and threshold alerting.
- **[Soter](https://github.com/Pulsefy/Soter)** (Pulsefy): open-source aid-distribution platform on Stellar; 3 merged PRs adding deeper health checks, mobile certificate pinning, and campaign-level escrow pause controls.
- **[StellarStream](https://github.com/StellarStream-HQ/StellarStream)** (StellarStream-HQ): real-time Soroban payroll-streaming protocol; 2 merged PRs implementing milestone-based vesting directly in the Rust contract.
- **[remitlend](https://github.com/LabsCrypt/remitlend)** (LabsCrypt): decentralized lending & cross-border remittance protocol on Stellar/Soroban; 2 merged PRs fixing a DB migration mismatch and adding notification input validation.
- **[Stellar-GreenPay](https://github.com/Emmy123222/Stellar-GreenPay)** (Emmy123222): parallel GreenPay fork; 2 merged PRs adding a contributor-attribution page and a configurable upload directory.
- **["Stellar-MarketPay-"](https://github.com/Emmy123222/Stellar-MarketPay-)** (Emmy123222): parallel Stellar-MarketPay fork; 2 merged PRs adding adversarial test coverage for platform fees/referral bonuses and the contract upgrade path.
- **[StarForge](https://github.com/Nanle-code/StarForge)** (Nanle-code): template-registry project; 2 merged PRs adding registry schema validation and cursor pagination/cache validators.
- **[stellar-dev-dashboard](https://github.com/Nanle-code/stellar-dev-dashboard)** (Nanle-code): Stellar developer dashboard; 2 merged PRs handling storage-quota exhaustion and cancelling stale Horizon requests.
- **[Hunty-contract](https://github.com/Samuel1-ona/Hunty-contract)** (Samuel1-ona): Soroban smart contract project; 2 merged PRs on reward-pool sponsorship/pro-rata refunds and a checks-effects-interactions security fix (1 more PR open in review).
- **[Kora-Frontend](https://github.com/OpenLedger-Foundation/Kora-Frontend)** (OpenLedger Foundation): invoice-finance app; closed i18n gaps across en/es/ar/pt-BR (merged upstream).
- **[flowfi](https://github.com/LabsCrypt/flowfi)** (LabsCrypt): programmable DeFi payment streaming/subscriptions on Stellar/Soroban; merged a fix requiring on-chain finality before committing DB state.
- **[soroban-crashlab](https://github.com/SorobanCrashLab/soroban-crashlab)** (SorobanCrashLab): open-source fuzzing/QE toolkit for Soroban contracts; merged empty-state UI coverage across the run/log/artifact views.

---

### 📊 Data & MEAL

- **[delta-river-dashboard](https://github.com/solaawojobi00-bit/delta-river-dashboard)**: interactive MEAL dashboard (Python) built on a fully synthetic, seeded dataset; demonstrates small-cell disclosure-control governance (suppressing any disaggregated count below 5) for reporting on sensitive programme data.

---

### 📊 GitHub Stats

<p align="left">
  <img height="165" src="https://github-readme-stats.vercel.app/api?username=solaawojobi00-bit&show_icons=true&theme=default&hide_border=true&count_private=true&cache_seconds=1800" />
  <img height="220" src="https://raw.githubusercontent.com/solaawojobi00-bit/solaawojobi00-bit/main/assets/language-pie-chart.svg" alt="Language breakdown pie chart" />
</p>

<p align="left">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=solaawojobi00-bit&hide_border=true" alt="GitHub Streak" />
</p>

---

### 🔗 Connect with me

<p align="left">
  <a href="https://www.linkedin.com/in/sola-awojobi-177625191" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://x.com/solaawojobi?s=11" target="_blank">
    <img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" />
  </a>
</p>
