import type { SupportedChainsResource } from "@cryptoapis-io/mcp-shared";

/**
 * Supported blockchains, networks, and actions for the prepare-transactions package.
 */
export const supportedChains: SupportedChainsResource = {
    evm: {
        blockchains: [
            "ethereum",
            "ethereum-classic",
            "binance-smart-chain",
            "tron",
            "polygon",
            "avalanche",
            "arbitrum",
            "base",
            "optimism",
        ],
        networks: {
            ethereum: ["mainnet", "sepolia"],
            "ethereum-classic": ["mainnet", "mordor"],
            "binance-smart-chain": ["mainnet", "testnet"],
            tron: ["mainnet", "nile"],
            polygon: ["mainnet", "amoy"],
            avalanche: ["mainnet", "fuji"],
            arbitrum: ["mainnet", "sepolia"],
            base: ["mainnet", "sepolia"],
            optimism: ["mainnet", "sepolia"],
        },
        actions: {
            "prepare-transaction-from-address": [
                "ethereum", "ethereum-classic", "binance-smart-chain", "tron",
                "polygon", "avalanche", "arbitrum", "base", "optimism",
            ],
            "prepare-fungible-token-transfer": [
                "ethereum", "ethereum-classic", "binance-smart-chain", "tron",
                "polygon", "avalanche", "arbitrum", "base", "optimism",
            ],
            "prepare-nft-transfer": [
                "ethereum", "ethereum-classic", "binance-smart-chain", "tron",
                "polygon", "avalanche", "arbitrum", "base", "optimism",
            ],
        },
    },
    tezos: {
        blockchains: ["tezos"],
        networks: {
            tezos: ["mainnet", "shadownet"],
        },
        actions: {
            "native-coins": ["tezos"],
            "fa1-2-tokens": ["tezos"],
            "fa2-tokens": ["tezos"],
        },
    },
    solana: {
        blockchains: ["solana"],
        networks: {
            solana: ["mainnet", "devnet"],
        },
        actions: {
            "native-coins": ["solana"],
            "spl-tokens": ["solana"],
        },
    },
    kaspa: {
        blockchains: ["kaspa"],
        networks: {
            kaspa: ["mainnet"],
        },
        actions: {
            "native-coins": ["kaspa"],
        },
    },
    xrp: {
        blockchains: ["xrp"],
        networks: {
            xrp: ["mainnet", "testnet"],
        },
        actions: {
            "native-coins": ["xrp"],
        },
    },
    utxo: {
        blockchains: ["bitcoin", "litecoin", "dogecoin", "dash", "zcash", "bitcoin-cash"],
        networks: {
            bitcoin: ["mainnet", "testnet"],
            litecoin: ["mainnet", "testnet"],
            dogecoin: ["mainnet", "testnet"],
            dash: ["mainnet", "testnet"],
            zcash: ["mainnet", "testnet"],
            "bitcoin-cash": ["mainnet", "testnet"],
        },
        actions: {
            "native-coins": ["bitcoin", "litecoin", "dogecoin", "dash", "zcash", "bitcoin-cash"],
        },
    },
    tron: {
        blockchains: ["tron"],
        networks: {
            tron: ["mainnet", "nile"],
        },
        actions: {
            "native-coins": ["tron"],
            "trc20-tokens": ["tron"],
            "non-fungible-tokens": ["tron"],
        },
    },
};
