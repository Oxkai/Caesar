# CAESER 🏛️

A decentralized Web3 application on the Sui blockchain that brings real-world assets (RWAs) on-chain through tokenization, cross-chain swapping, and peer-to-peer lending.

## 🌟 Overview

CAESER enables users to invest in tokenized assets (properties, bonds), perform cross-chain token swaps, mint NFTs for property documents, and engage in peer-to-peer lending using tokenized assets as collateral. Built with compliance in mind, the platform includes a built-in KYC flow to ensure only verified users can access RWA functions.

Each physical asset is represented by an NFT-like on-chain token – a real-world asset NFT – encoding ownership of real property or securities. By leveraging Sui's parallel-processing architecture for high throughput and low fees, combined with Wormhole's cross-chain bridges, CAESER targets the large market of asset tokenization and compliant DeFi.

## ✨ Core Features

### 🔗 Wallet Integration
- **Suiet Wallet Kit**: Seamless connection to any Sui-compatible wallet
- Easy authentication and transaction signing with Sui addresses
- React hooks and UI components for wallet interactions

### 🛡️ KYC Verification System
- Mandatory Know-Your-Customer verification for new users
- On-chain or off-chain credential recording (zk-proofs, soulbound tokens)
- Compliance-first approach gating access to RWA functions
- Ensures only verified participants can mint or trade wrapped tokens

### 🏢 RWA Investment Platform
- Browse and invest in tokenized real-world assets
- Each asset minted as unique on-chain token with IPFS metadata
- NFT-like functionality representing legal rights to underlying assets
- Fractional ownership and decentralized trading capabilities

### 🌉 Cross-Chain Swapping
- **Wormhole SDK Integration**: Bridge tokens from 22+ supported chains into Sui
- Automated gas relaying for seamless user experience
- Support for Ethereum, BSC, Solana, Avalanche, and more
- Deep liquidity through cross-ecosystem asset movement

### 🏠 Property Tokenization Module
- Mint NFTs representing property documents
- Immutable storage of legal documents via IPFS/Arweave
- On-chain PropertyToken NFTs with metadata links
- Transparent and tamper-evident ownership records

### 💰 P2P Lending & Borrowing
- Create and accept peer-to-peer loan offers
- Use tokenized assets as collateral
- Smart contract-managed loan lifecycle
- Automated escrow, interest tracking, and settlement

## 🔄 User Flow

1. **Connect Wallet**: Open CAESER and connect Sui wallet via Suiet Wallet Kit
2. **Complete KYC**: First-time users verify identity through integrated KYC widget
3. **Access Features**: KYC-compliant users can:
   - Invest in tokenized RWAs
   - Swap assets across chains via Wormhole
   - Mint property NFTs
   - Participate in P2P lending with token collateral

## 🔧 Smart Contract Architecture

### Core Modules

#### `RWAPropertyToken`
- Defines NFT struct representing real-world properties
- Contains metadata URIs pointing to IPFS/Arweave documents
- Functions: `mint_property_token()`, `transfer_property_token()`, `burn_property_token()`
- Ensures unique and tamper-evident property tokens

#### `LoanEscrow`
- Manages collateral during loan periods
- Escrows borrower's tokens until loan completion
- Prevents collateral withdrawal while loan is active
- Automatic release upon repayment or liquidation

#### `P2PLoanRegistry`
- Registry of all peer-to-peer loans
- Stores loan metadata (ID, parties, terms, collateral, status)
- Functions for creating offers, accepting loans, recording repayments
- Interfaces with LoanEscrow for collateral management

#### `TokenizationRegistry`
- Tracks all tokenized assets
- Prevents duplicate tokenization of same asset
- Asset verification and issuer lookup functionality
- Maintains unique identifier mapping to tokens

## 🚀 Technical Benefits

### High-Performance Sui Blockchain
- Parallel, object-centric execution model
- 120,000+ TPS potential with sub-2-second finality
- Significantly higher throughput than Ethereum (15-30 TPS)
- Minimal gas fees for high-volume operations

### Cross-Chain Liquidity
- Access to assets across 22+ blockchain networks
- Wormhole Connect with automatic gas funding
- Portal Bridge covering major ecosystems
- Unlimited liquidity beyond Sui-native tokens

### NFT-Style RWA Tokenization
- Non-fungible tokens representing real-world asset ownership
- Provenance and indivisibility properties
- Fractional ownership capabilities
- Off-chain document references with on-chain verification

### On-Chain KYC Compliance
- Regulatory compliance through identity verification
- Privacy-preserving options (zk-proofs, soulbound tokens)
- Gated access to regulated asset trading
- Compatible with securities and real estate regulations

### Modular Design
- Open-source, extensible architecture
- Standalone Move contract packages
- Easy integration of new asset types
- Community-friendly contribution model

## 🛠️ Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Wallet Integration**: Suiet Wallet Kit (React)
- **Smart Contracts**: Sui Move language
- **Cross-Chain**: Wormhole Connect and Portal bridges
- **Storage**: IPFS/Arweave for metadata and documents
- **Backend**: Optional Node.js/Express for off-chain tasks

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Sui wallet (Suiet extension recommended)
- Testnet SUI tokens

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/caeser.git
   cd caeser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Set up Sui devnet or testnet node
   - Ensure wallet has testnet SUI tokens
   - Create `.env` file with required API keys:
     ```env
     NEXT_PUBLIC_SUI_NETWORK=testnet
     NEXT_PUBLIC_KYC_API_KEY=your_kyc_api_key
     NEXT_PUBLIC_WORMHOLE_CONFIG=testnet
     ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Open `http://localhost:3000`
   - Connect your Sui wallet
   - Complete KYC verification
   - Test features (mint RWA tokens, cross-chain swaps, etc.)

### Additional Scripts
```bash
# Build for production
npm run build

# Run tests
npm test

# Deploy smart contracts
npm run deploy:contracts

# Lint code
npm run lint
```

