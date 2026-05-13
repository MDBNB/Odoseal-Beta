<div align="center">

# 🔐 OdoSeal Beta

### *Decentralized Vehicle Data Integrity — Proof of Concept*

[![Odo Protocol](https://img.shields.io/badge/Odo_Protocol-DePIN-blueviolet?style=for-the-badge)](https://github.com/MDBNB/Odoseal-Beta)
[![React Native](https://img.shields.io/badge/React_Native-Expo_Native-61DAFB?style=for-the-badge&logo=react)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![IPFS](https://img.shields.io/badge/Storage-IPFS_via_Pinata-65C2CB?style=for-the-badge)](https://pinata.cloud)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **OdoSeal Beta** is the functional Proof-of-Concept for the **Odo Protocol** — a DePIN (Decentralized Physical Infrastructure Network) layer designed to bring cryptographic trust to automotive data on Solana.

</div>

---

## 🌐 The Problem: A $6B Industry Built on Unverifiable Data

The global used-car market processes over **40 million transactions annually**, yet the foundational data layer — odometer readings, trip logs, and maintenance records — remains trivially falsifiable. A single OBD-II port manipulation can erase 100,000 km of vehicle history in seconds, costing buyers billions and destroying market trust.

**OdoSeal solves this at the hardware-software boundary.**

---

## 🧬 Value Proposition: The Odo Protocol's Trust Anchor

OdoSeal Beta demonstrates the **client-side cryptographic pipeline** that forms the foundation of the Odo Protocol:

```
Physical Vehicle Data (OBD-II)
        │
        ▼
┌─────────────────────────────────┐
│  Mobile Device (Native Android) │
│  ┌───────────────────────────┐  │
│  │  expo-crypto SecureRandom │  │  ← Hardware Entropy (Android SecureRandom)
│  │  AES-256-CBC Encryption   │  │  ← Client-Side, Zero-Knowledge to Server
│  │  IV + Ciphertext Bundle   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│  OdoKey Vault (Node.js + SQLite)│
│  ┌───────────────────────────┐  │
│  │  IPFS Upload via Pinata   │  │  ← Content-Addressed Storage
│  │  CID Indexing in SQLite   │  │  ← Immutable Cryptographic Fingerprint
│  └───────────────────────────┘  │
└─────────────────────────────────┘
        │
        ▼
   IPFS / Solana (Next Phase)      ← On-Chain Attestation Layer
```

The CID returned by IPFS is a **SHA-256 cryptographic fingerprint** of the encrypted payload — making any post-hoc data manipulation mathematically detectable.

---

## ⚙️ Key Technical Pillars

### 1. 🎲 Native Hardware Entropy
```typescript
// expo-crypto bridges to Android's java.security.SecureRandom
// — NOT Math.random(), NOT window.crypto (unavailable in Hermes)
const randomBytes = await ExpoCrypto.getRandomBytesAsync(16);
```
Every encryption operation generates a **cryptographically secure, hardware-backed IV** via Android's `SecureRandom` PRNG. This eliminates the predictable IV vulnerability present in browser-based crypto implementations.

### 2. 🔒 AES-256 Client-Side Encryption
```typescript
const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});
```
Data is encrypted **on the mobile device before transmission**. The OdoKey server receives only ciphertext — it has zero knowledge of the plaintext OBD payload. This is a prerequisite for trustless DePIN architecture.

### 3. 🧮 Cryptographic Fingerprinting via IPFS CIDs
```
CID: QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
```
Every sealed data packet is pinned to IPFS via Pinata. The resulting **Content Identifier (CID)** is a deterministic hash of the content — any modification to the encrypted payload produces a completely different CID, providing **tamper-evidence without a trusted third party**.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Mobile Client** | React Native + Expo (Native Build) | Native Android APK — no Expo Go dependency |
| **Language** | TypeScript 5.x | Type-safe cryptographic operations |
| **Encryption** | CryptoJS 4.x + expo-crypto | AES-256-CBC with hardware-backed IV |
| **Backend** | Node.js + Express | OdoKey Vault API |
| **Database** | SQLite (better-sqlite3) | CID indexing and file metadata |
| **Decentralized Storage** | IPFS via Pinata | Immutable content-addressed storage |
| **Build System** | Gradle + React Native CLI | Native Android compilation |
| **Package ID** | `com.odoseal.app` | Production Android package identifier |

---

## 🏆 MVP Accomplishments

| Milestone | Status |
|---|---|
| ✅ Native Android APK compiled via Gradle (no Expo Go) | **COMPLETE** |
| ✅ Hardware-entropy IV generation via `expo-crypto` | **COMPLETE** |
| ✅ AES-256-CBC client-side encryption pipeline | **COMPLETE** |
| ✅ Secure API tunneling via `adb reverse` (Metro + OdoKey) | **COMPLETE** |
| ✅ IPFS upload and CID retrieval via Pinata | **COMPLETE** |
| ✅ SQLite data indexing with timestamp and size metadata | **COMPLETE** |
| ✅ `view-data.js` — CLI vault inspector for backend verification | **COMPLETE** |

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+
- Android Studio + Android SDK (API 33+)
- Android device with **USB Debugging enabled**
- ADB installed and in PATH

### 1. Clone & Install

```bash
git clone https://github.com/MDBNB/Odoseal-Beta.git
cd Odoseal-Beta
npm install --legacy-peer-deps
```

### 2. Start the OdoKey Backend

```bash
cd odokey-server
npm install
node server.js
# Server runs on http://localhost:3001
```

### 3. Bridge ADB Ports (Critical Step)

Connect your Android device via USB, then run:

```bash
# Bridge Metro bundler port
adb reverse tcp:8081 tcp:8081

# Bridge OdoKey server port
adb reverse tcp:3001 tcp:3001
```

> This routes the device's network requests through the USB cable to your development machine — no Wi-Fi configuration required.

### 4. Build & Deploy to Device

```bash
cd Odoseal-Beta
npx expo run:android
```

> **Note:** After any `npx expo prebuild --clean`, restore the splash screen color:
> ```powershell
> Set-Content "android\app\src\main\res\values\colors.xml" `
>   "<resources>`n  <color name=`"colorPrimary`">#6200EE</color>`n  <color name=`"colorPrimaryDark`">#3700B3</color>`n  <color name=`"splashscreen_background`">#1a1a2e</color>`n</resources>"
> ```

### 5. Verify Data in Vault

```bash
cd odokey-server
node view-data.js
```

---

## 📁 Repository Structure

```
Odoseal-Beta/
├── app/                    # Expo Router screens
│   └── (tabs)/
│       ├── index.tsx       # Main OBD data sealing interface
│       └── explore.tsx     # Vault explorer
├── hooks/
│   └── useOdoKey.ts        # Core cryptographic pipeline hook
├── android/                # Native Android project (Gradle)
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── res/values/
│           └── colors.xml  # Includes splashscreen_background
├── odokey-server/          # OdoKey Vault backend
│   ├── server.js           # Express API
│   ├── db.js               # SQLite interface
│   ├── routes/files.js     # Upload/download endpoints
│   └── view-data.js        # CLI vault inspector
└── app.json                # Expo config (package: com.odoseal.app)
```

---

## 🔭 Roadmap: From PoC to Solana DePIN

```
Phase 1 (Current) ──► Phase 2 ──────────────────► Phase 3
OdoSeal Beta MVP       Solana Attestation Layer     Full DePIN Network
─────────────────      ─────────────────────────    ──────────────────
✅ AES-256 Encryption  ◻ On-chain CID anchoring     ◻ Hardware OBD dongle
✅ IPFS Storage        ◻ Solana Program (Anchor)    ◻ ZK-proof mileage
✅ Native Android      ◻ Token-gated data access    ◻ Insurance integrations
✅ CID Fingerprinting  ◻ Validator node network     ◻ Marketplace launch
```

---

## 🤝 Built for the Odo Protocol Ecosystem

OdoSeal Beta is the **mobile data ingestion layer** of the broader Odo Protocol stack, which includes:

- **OdoCar** — Vehicle telemetry aggregation
- **OdoKey** — Decentralized data vault
- **Odomia Bridge** — Cross-chain data relay
- **OdoSeal** *(this repo)* — Client-side cryptographic sealing

---

<div align="center">

**Built with cryptographic rigor for the DePIN generation.**

*Odo Protocol — Trustless Automotive Data Infrastructure*

</div>
