# 🔐 OdoSeal Beta

<div align="center">

[![Status](https://img.shields.io/badge/Status-Beta%20%E2%80%94%20Live%20on%20Android-brightgreen?style=for-the-badge)](https://github.com/MDBNB/Odoseal-Beta)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)](https://explorer.solana.com/address/138M7ApN4UZjBTBXeRZc8nboaaxLxkydnUDphMgDsesc?cluster=devnet)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?style=for-the-badge&logo=ipfs)](https://gateway.pinata.cloud/ipfs/QmQJvo2NyZD2fMGgwnts8nxsBjgPaFtyB4D5QtqopGrH3U)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Company](https://img.shields.io/badge/Odocar%20LLC-Wyoming%20%7C%20EIN%20Registered-orange?style=for-the-badge)](https://odocar.io)

**Decentralized Vehicle Data Verification Protocol**

*Seal your vehicle's OBD-II data on IPFS + Solana — tamper-proof, owner-controlled, AI-powered.*

[🌐 Website](https://odocar.io) · [📹 Demo Video](https://youtube.com/shorts/qvAWJ6Ljgc4) · [🔗 IPFS Proof](https://gateway.pinata.cloud/ipfs/QmQJvo2NyZD2fMGgwnts8nxsBjgPaFtyB4D5QtqopGrH3U) · [📧 Contact](mailto:mohamed.alzoum@gmail.com)

</div>

---

## 🚗 What is OdoSeal?

OdoSeal is a **decentralized vehicle data integrity protocol** built by [Odocar LLC](https://odocar.io). It reads real-time OBD-II data from any vehicle via Bluetooth, encrypts it with AES-256-GCM, stores it permanently on IPFS, and anchors a cryptographic proof on the Solana blockchain.

> **No central server owns your vehicle data. You do.**

### The Problem
- Odometer fraud costs consumers **$1 billion+ annually** in the US alone
- Used car buyers have no way to verify vehicle history independently
- Existing solutions (Carfax, etc.) are centralized, expensive, and incomplete

### The Solution
OdoSeal creates an **immutable, owner-controlled digital vault** for every vehicle reading — verifiable by anyone, owned by no one but the driver.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        OdoSeal Protocol                         │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────┐     Bluetooth     ┌──────────────────────────┐
  │  OBD-II Port │ ──────────────── ▶│   Android App (Kotlin)   │
  │  (ELM327)    │                   │   React Native / Expo    │
  └──────────────┘                   └────────────┬─────────────┘
                                                  │
                                          AES-256-GCM Encrypt
                                                  │
                                                  ▼
                                   ┌──────────────────────────┐
                                   │   OdoKey Server          │
                                   │   (Railway — Node.js)    │
                                   │   odokey-server-         │
                                   │   production.up.         │
                                   │   railway.app            │
                                   └────────────┬─────────────┘
                                                │
                              ┌─────────────────┼──────────────────┐
                              │                 │                  │
                              ▼                 ▼                  ▼
                    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
                    │  Pinata IPFS │  │  SQLite DB   │  │  Groq AI Engine  │
                    │  (CID Proof) │  │  (Index)     │  │  (Anomaly Detect)│
                    └──────┬───────┘  └──────────────┘  └──────────────────┘
                           │
                           │ CID Hash
                           ▼
                    ┌──────────────────────────────────┐
                    │         Solana Blockchain        │
                    │         (Devnet → Mainnet)       │
                    │  Program: 138M7ApN4UZjBTBX...   │
                    │  Immutable on-chain anchor       │
                    └──────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile** | React Native + Expo (Android) | OBD-II data capture & UI |
| **OBD Interface** | ELM327 Bluetooth Adapter | Vehicle data reader (OBD-II) |
| **Encryption** | AES-256-GCM + expo-crypto | Military-grade data encryption |
| **Backend** | Node.js + Express (Railway) | API gateway & file management |
| **Storage** | IPFS via Pinata | Decentralized permanent storage |
| **Blockchain** | Solana (Anchor framework) | Immutable on-chain proof |
| **AI** | Groq AI | Anomaly detection & trip analysis |
| **Database** | SQLite | Local CID index & metadata |
| **Language** | TypeScript / Kotlin / Rust | Full-stack type safety |

---

## ✅ Live Proof

| Item | Link |
|------|------|
| 📹 **Demo Video** | [youtube.com/shorts/qvAWJ6Ljgc4](https://youtube.com/shorts/qvAWJ6Ljgc4) |
| 🗂️ **IPFS Proof File** | [QmQJvo2NyZD2fMGgwnts8nxsBjgPaFtyB4D5QtqopGrH3U](https://gateway.pinata.cloud/ipfs/QmQJvo2NyZD2fMGgwnts8nxsBjgPaFtyB4D5QtqopGrH3U) |
| ⛓️ **Solana Program** | [138M7ApN4UZjBTBXeRZc8nboaaxLxkydnUDphMgDsesc](https://explorer.solana.com/address/138M7ApN4UZjBTBXeRZc8nboaaxLxkydnUDphMgDsesc?cluster=devnet) |
| 🌐 **Backend API** | [odokey-server-production.up.railway.app](https://odokey-server-production.up.railway.app) |
| 🏢 **Company Website** | [odocar.io](https://odocar.io) |
| 💻 **GitHub** | [github.com/MDBNB/Odoseal-Beta](https://github.com/MDBNB/Odoseal-Beta) |

---

## 🔐 How It Works

### 1. Connect
```
Driver plugs ELM327 OBD-II adapter → pairs via Bluetooth → opens OdoSeal app
```

### 2. Read
```
App reads: RPM, speed, odometer, engine load, coolant temp, DTC fault codes
```

### 3. Encrypt
```
Data → AES-256-GCM encryption → random IV per session → encrypted blob
```

### 4. Seal
```
Encrypted blob → Pinata IPFS → returns CID (content hash)
CID → Solana transaction → immutable on-chain record
```

### 5. Verify
```
Anyone can verify: CID on IPFS + Solana transaction = tamper-proof proof
```

---

## 📦 Repository Structure

```
OdoSeal-Beta/
├── App.tsx                    # Main React Native app
├── hooks/
│   └── useOdoKey.ts           # OdoKey API hook (AES-256 + upload)
├── app/
│   └── (tabs)/
│       ├── index.tsx          # Main dashboard
│       └── explore.tsx        # Vault explorer
├── components/                # UI components
├── android/                   # Android native build
├── scripts/                   # Build & setup scripts
└── odokey-server/             # Backend server (deployed on Railway)
    ├── server.js              # Express API
    ├── routes/files.js        # Upload/download routes
    ├── middleware/auth.js     # API key authentication
    └── db.js                  # SQLite database
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Android device or emulator
- ELM327 OBD-II Bluetooth adapter
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/MDBNB/Odoseal-Beta.git
cd Odoseal-Beta

# Install dependencies
npm install

# Start the app
npx expo start --android
```

### Environment Variables

Create a `.env` file in `odokey-server/`:

```env
PINATA_JWT=your_pinata_jwt_token
ENCRYPTION_MASTER_KEY=your_32_byte_key
PORT=3001
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Beta (Complete)
- [x] OBD-II Bluetooth data reading
- [x] AES-256-GCM encryption
- [x] IPFS storage via Pinata
- [x] Android app (React Native)
- [x] Backend API on Railway
- [x] Solana smart contract (Devnet)
- [x] Live demo & IPFS proof

### 🔄 Phase 2 — Production (In Progress)
- [ ] Solana Mainnet deployment
- [ ] iOS app release
- [ ] Hardware OBD dongle with ATECC608A secure element
- [ ] ZK-proof integration for privacy-preserving verification
- [ ] Multi-vehicle dashboard

### 🔮 Phase 3 — Ecosystem
- [ ] OdoSeal API for insurance companies
- [ ] Used car marketplace integration
- [ ] Fleet management dashboard
- [ ] Cross-chain bridge (IoTeX W3bstream)
- [ ] DAO governance for protocol upgrades

---

## 🌐 Ecosystem Overview

```
                        Odocar Ecosystem
                        ────────────────

  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
  │  OdoSeal    │    │   OdoCar    │    │   OdoKey        │
  │  (This Repo)│    │  (Mobile)   │    │   (Vault API)   │
  │             │    │             │    │                 │
  │ Data Sealing│    │ Trip Mgmt   │    │ IPFS Storage    │
  │ & Proof     │    │ & Analytics │    │ & Encryption    │
  └──────┬──────┘    └──────┬──────┘    └────────┬────────┘
         │                  │                    │
         └──────────────────┴────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Solana Chain  │
                    │  (Anchor v0.30)│
                    │  Program ID:   │
                    │  138M7ApN4... │
                    └────────────────┘
```

---

## 🏆 Grants Applied

| Grant Program | Status |
|--------------|--------|
| **Solana Foundation** | Applied |
| **DD.xyz** | Applied |
| **Avalanche** | Applied |

---

## 🏢 About Odocar LLC

**Odocar LLC** is a Wyoming-registered technology company (EIN registered) building decentralized infrastructure for the automotive industry.

| | |
|--|--|
| **Company** | Odocar LLC |
| **State** | Wyoming, United States |
| **Registration** | EIN Registered |
| **Website** | [odocar.io](https://odocar.io) |
| **Email** | [mohamed.alzoum@gmail.com](mailto:mohamed.alzoum@gmail.com) |
| **GitHub** | [github.com/MDBNB](https://github.com/MDBNB) |

---

## 🔒 Security

- **AES-256-GCM** encryption with random IV per session
- **IPFS content addressing** — data cannot be modified after upload
- **Solana on-chain anchoring** — cryptographic proof of existence
- **No plaintext storage** — VIN and sensitive data never stored unencrypted
- **API key authentication** on all backend endpoints

---

## 📄 License

MIT License — Copyright © 2025 Odocar LLC

See [LICENSE](LICENSE) for full details.

---

<div align="center">

**Built with ❤️ by [Odocar LLC](https://odocar.io) — Wyoming, United States**

*Decentralizing vehicle trust, one seal at a time.*

</div>
