<h1 align="center">Hello World, I'm Sola Awojobi</h1>
<h3 align="center">Building on Stellar/Soroban: backend & frontend contributions across open-source Web3 projects</h3>

<p align="center">
  My background is in Monitoring, Evaluation, Accountability & Learning (MEAL) and data analysis, which is part of why I lean toward rigorous testing, careful edge-case handling, and clear documentation in the code I ship.
</p>

---

### 🔭 Currently working on

- Building out production-grade tools and indexers on Stellar/Soroban: **[xlm-flow-indexer](https://xlm-flow-indexer.vercel.app)**, **[netpulse-xlm](https://netpulse-xlm.vercel.app)**, **[stellar-tip-jar](https://stellar-tip-jar-phi.vercel.app/)**, and **[sep-compliance-validator](https://github.com/solaawojobi00-bit/sep-compliance-validator)**
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
  <img src="https://img.shields.io/badge/SQL-E38C00?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

---

### 🚀 Live Shipped Projects (Deployed on Vercel & Web)

Production-ready applications and developer tools live on the web:

- **[xlm-flow-indexer](https://xlm-flow-indexer.vercel.app)** — [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://xlm-flow-indexer.vercel.app) · [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/solaawojobi00-bit/xlm-flow-indexer)  
  *Self-hostable Stellar ledger analytics indexer & live dashboard over PostgreSQL / SQLite.* Ingests live Horizon ledger transactions into relational schemas with analytical SQL views (`account_flow_daily`, `asset_velocity`, `anchor_payment_volume`, `trade_pair_activity`, `top_accounts_by_volume`), cross-job idempotency, index verification, and EXPLAIN query plan benchmarking.
- **[netpulse-xlm](https://netpulse-xlm.vercel.app)** — [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://netpulse-xlm.vercel.app) · [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/solaawojobi00-bit/netpulse-xlm)  
  *Real-time network health and performance monitor for the Stellar network.* Features Horizon SSE streaming + WebSocket push updates, 24-hour persistent historical metric tracking, CSV/JSON analytical data export, dark/light mode, and CI auditing.
- **[stellar-tip-jar](https://stellar-tip-jar-phi.vercel.app/)** — [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://stellar-tip-jar-phi.vercel.app/) · [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/solaawojobi00-bit/stellar-tip-jar)  
  *Zero-login, non-custodial Stellar donation page & tip-link builder.* Instant dynamic QR code generation, SEP-0007 / Freighter / Albedo wallet deep links, and live balance aggregation streamed directly from Horizon.
- **[delta-river-dashboard](https://solaawojobi00-bit.github.io/delta-river-dashboard/)** — [![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://solaawojobi00-bit.github.io/delta-river-dashboard/) · [![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/solaawojobi00-bit/delta-river-dashboard)  
  *Interactive MEAL dashboard (Python) with built-in small-cell disclosure-control governance.* Automatically suppresses disaggregated counts below 5 to protect participant privacy in sensitive programme data.

---

### ⚙️ Flagship Protocols & Developer Tools

- **[sep-compliance-validator](https://github.com/solaawojobi00-bit/sep-compliance-validator)** — 76 merged PRs. Started as a SEP-1/SEP-10 checker, now covers **SEP-1, SEP-10, SEP-12, SEP-24, and SEP-38** conformance end to end: live negative-case challenge submissions, JWT signature verification via anchor JWKS, muxed-account and memo support, 100% branch coverage on SEP-10 negative tests, and packaging as a reusable GitHub Action with an npm-published CLI (`--output`, `--only`, `--fail-on-warn`). Validated against Stellar's official testnet reference anchor.
- **[supply-chain-proof-of-delivery-payments](https://github.com/solaawojobi00-bit/supply-chain-proof-of-delivery-payments)** — Soroban (Rust) escrow smart contract that holds buyer payments on Stellar and only releases funds to the seller once a trusted attestor confirms delivery, with automated refund guarantees if the deadline expires. Verified end-to-end on testnet.

---

### 🔨 Protocol MVPs & Smart Contracts

Working MVPs built and verified end-to-end on Stellar testnet:

- **[stellar-vrf-service](https://github.com/solaawojobi00-bit/stellar-vrf-service)**: VRF-backed randomness oracle; a Soroban (Rust) contract paired with an off-chain oracle, deployed and demoed end-to-end on Stellar testnet.
- **[reg-asset-issuance-gateway](https://github.com/solaawojobi00-bit/reg-asset-issuance-gateway)**: SEP-8 compliant regulated asset issuance and redemption gateway for Stellar; investor whitelist, KYC stub, SEP-8 approval, and issuance settlement, demoed end-to-end against testnet with verifiable transaction hashes.
- **[earnest-escrow](https://github.com/solaawojobi00-bit/earnest-escrow)**: Real estate earnest-money deposit escrow built on Stellar Claimable Balances (no custom contract); working claim and reclaim-after-deadline demos on testnet.

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
