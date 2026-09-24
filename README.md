# @cryptoapis-io/mcp-prepare-transactions

MCP server for [Crypto APIs](https://cryptoapis.io/) Prepare Transactions product. Build unsigned transactions for EVM, Tezos, Solana, Kaspa, XRP, UTXO, and Tron.

> **API Version:** Compatible with Crypto APIs version **2024-12-12**

## Features

- Prepare EVM native coin, ERC-20 fungible token, and ERC-721 NFT transfer transactions
- Prepare native Tezos (XTZ), FA1.2, and FA2 token transfer operations
- Prepare native SOL and SPL token transfer transactions on Solana
- Prepare native KAS transfers on Kaspa, with multi-recipient support
- Prepare native XRP transfers
- Prepare native coin transfers across 6 UTXO chains (Bitcoin, Bitcoin Cash, Litecoin, Dogecoin, Dash, Zcash)
- Prepare native TRX, TRC-20, and NFT transfers via Tron's dedicated prepare-transactions endpoints
- Returns unsigned transaction data ready for local signing

## Prerequisites

- Node.js 18+
- [Crypto APIs](https://cryptoapis.io/) account and API key ([sign up](https://app.cryptoapis.io/signup) | [get API key](https://app.cryptoapis.io/api-keys))

## Installation

```bash
npm install @cryptoapis-io/mcp-prepare-transactions
```

Or install all Crypto APIs MCP servers: `npm install @cryptoapis-io/mcp`

## Usage

```bash
# Run with API key
npx @cryptoapis-io/mcp-prepare-transactions --api-key YOUR_API_KEY

# Or use environment variable
export CRYPTOAPIS_API_KEY=YOUR_API_KEY
npx @cryptoapis-io/mcp-prepare-transactions

# HTTP transport (listens on 127.0.0.1; see "Exposing the server beyond localhost")
npx @cryptoapis-io/mcp-prepare-transactions --transport http --port 3000 --api-key YOUR_API_KEY
```

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "cryptoapis-prepare-transactions": {
      "command": "npx",
      "args": ["-y", "@cryptoapis-io/mcp-prepare-transactions"],
      "env": {
        "CRYPTOAPIS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "cryptoapis-prepare-transactions": {
      "command": "npx",
      "args": ["-y", "@cryptoapis-io/mcp-prepare-transactions"],
      "env": {
        "CRYPTOAPIS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx @cryptoapis-io/mcp-prepare-transactions --api-key YOUR_API_KEY
```

### n8n

1. Start the server in HTTP mode:
   ```bash
   npx @cryptoapis-io/mcp-prepare-transactions --transport http --port 3000 --api-key YOUR_API_KEY
   ```
2. In your n8n workflow, add an **AI Agent** node
3. Under **Tools**, add an **MCP Client Tool** and set the URL to `http://localhost:3000/mcp`

> **n8n in Docker:** `localhost` inside the container is not your machine. Start the server with `--host 0.0.0.0` and `MCP_AUTH_TOKEN` set (see [Exposing the server beyond localhost](#exposing-the-server-beyond-localhost)), use `http://host.docker.internal:3000/mcp` as the URL, and add an `Authorization: Bearer <token>` header to the MCP Client Tool credential.

> All servers default to port 3000. Use `--port` to assign different ports when running multiple servers.

## Available Tools

### `prepare_transactions_evm`

Prepare unsigned EVM transactions.

| Action | Description |
|--------|-------------|
| `prepare-transaction-from-address` | Prepare a native coin transfer from an address |
| `prepare-fungible-token-transfer` | Prepare an ERC-20 token transfer |
| `prepare-nft-transfer` | Prepare an ERC-721 NFT transfer |

### `prepare_transactions_tezos`

Prepare unsigned Tezos operations (mainnet, shadownet).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native XTZ transfer |
| `fa1-2-tokens` | Prepare an FA1.2 token transfer |
| `fa2-tokens` | Prepare an FA2 token transfer |

### `prepare_transactions_solana`

Prepare unsigned Solana transactions (mainnet, devnet).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native SOL transfer |
| `spl-tokens` | Prepare an SPL token transfer |

### `prepare_transactions_kaspa`

Prepare unsigned Kaspa transactions (mainnet only).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native KAS transfer, supporting multiple recipients in one transaction |

### `prepare_transactions_xrp`

Prepare unsigned XRP transactions (mainnet, testnet).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native XRP transfer |

### `prepare_transactions_utxo`

Prepare unsigned UTXO transactions (Bitcoin, Bitcoin Cash, Litecoin, Dogecoin, Dash, Zcash; mainnet, testnet).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native coin transfer, supporting multiple recipients. Requires `feePriority` or `exactFee` |

### `prepare_transactions_tron`

Prepare unsigned Tron transactions via Tron's dedicated prepare-transactions endpoints (mainnet, nile).

| Action | Description |
|--------|-------------|
| `native-coins` | Prepare a native TRX transfer |
| `trc20-tokens` | Prepare a TRC-20 token transfer |
| `non-fungible-tokens` | Prepare a TRC-721/TRC-1155 NFT transfer |

## CLI Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--api-key` | Crypto APIs API key | `CRYPTOAPIS_API_KEY` env var |
| `--transport` | Transport type: `stdio` or `http` | `stdio` |
| `--host` | HTTP host (use `0.0.0.0` to accept remote connections — requires an auth token with `--api-key`) | `127.0.0.1` |
| `--auth-token` | Bearer token callers must send (`Authorization: Bearer <token>`); prefer the `MCP_AUTH_TOKEN` env var | `MCP_AUTH_TOKEN` env var |
| `--allowed-hosts` | Comma-separated `Host` header allowlist for non-loopback binds | — |
| `--port` | HTTP port | `3000` |
| `--path` | HTTP path | `/mcp` |
| `--stateless` | Enable stateless HTTP mode | `false` |

### HTTP API Key Modes

When using HTTP transport, the server supports two API key modes:

- **With `--api-key`:** The key is used for all requests. `x-api-key` request headers are ignored.
- **Without `--api-key`:** Each request must include an `x-api-key` header with a valid Crypto APIs key. This enables hosting a public server where each user provides their own key.

```bash
# Per-request key mode (multi-tenant)
npx @cryptoapis-io/mcp-prepare-transactions --transport http --port 3000
# Clients send x-api-key header with each request
```

### Exposing the server beyond localhost

HTTP mode listens on `127.0.0.1` by default, so only processes on the same machine can reach it.
To accept connections from other machines or containers, bind explicitly and protect the port:

```bash
# Startup-key mode: callers must present the token (the server refuses to start without one)
export MCP_AUTH_TOKEN=$(openssl rand -hex 32)
npx @cryptoapis-io/mcp-prepare-transactions --transport http --host 0.0.0.0 --port 3000 --api-key YOUR_API_KEY \
  --allowed-hosts mcp.internal.example
# Clients send: Authorization: Bearer $MCP_AUTH_TOKEN

# Per-request key mode: no startup key, every request must carry the caller's own x-api-key
npx @cryptoapis-io/mcp-prepare-transactions --transport http --host 0.0.0.0 --port 3000
```

`--allowed-hosts` restricts the `Host` header (DNS rebinding protection) when not bound to loopback. Prefer `MCP_AUTH_TOKEN` over `--auth-token`: command-line arguments are visible in the process list.

> Stdio transport always requires an API key at startup.

## Important: API Key Required

> **Warning:** Making requests without a valid API key — or with an incorrect one — may result in your IP being banned from the Crypto APIs ecosystem. Always ensure a valid API key is configured before starting any server.

## Remote MCP Server

Crypto APIs provides an official remote MCP server with all tools available via HTTP Streamable transport at [https://ai.cryptoapis.io/mcp](https://ai.cryptoapis.io/mcp). Pass your API key via the `x-api-key` header — no installation required.

## License

MIT
