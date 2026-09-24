# @cryptoapis-io/mcp-prepare-transactions

## 0.5.0

### Minor Changes

- 3167621: Security: the HTTP transport no longer serves unauthenticated callers with the operator's API key.

  Before, `--transport http --api-key <key>` listened on `0.0.0.0` and never authenticated the caller, so anyone who could reach the port could call every tool on the operator's key: spend their credits, and create, deactivate or delete their blockchain-event webhooks and HD-wallet syncs.

  - HTTP mode now listens on `127.0.0.1` by default, with DNS rebinding protection (Host header check).
  - Listening on a non-loopback address (`--host 0.0.0.0`) with a startup API key requires an auth token (`MCP_AUTH_TOKEN` or `--auth-token`); callers send `Authorization: Bearer <token>`. Without one the server refuses to start.
  - New `--allowed-hosts` restricts the Host header on non-loopback binds.
  - Per-request key mode (no startup key) now rejects requests without an `x-api-key` header with 401.
  - Stateful HTTP mode keeps one session per client; previously only the first client could ever connect.

  Breaking: clients connecting from another machine or container must now start the server with `--host 0.0.0.0` and an auth token. Reported by Syed Anas Mohiuddin.

### Patch Changes

- Updated dependencies [3167621]
  - @cryptoapis-io/mcp-shared@0.4.0

## 0.4.0

### Minor Changes

- cdb2c1f: Add Solana, Kaspa, XRP, generic UTXO, and Tron prepare-transactions.

  `prepare_transactions_solana` — `native-coins`, `spl-tokens`.
  `prepare_transactions_kaspa` — `native-coins` (multi-recipient, mainnet-only).
  `prepare_transactions_xrp` — `native-coins`.
  `prepare_transactions_utxo` — `native-coins` across bitcoin, bitcoin-cash, litecoin, dogecoin, dash, zcash (multi-recipient, requires `feePriority` or `exactFee`).
  `prepare_transactions_tron` — `native-coins`, `trc20-tokens`, `non-fungible-tokens`, via Tron's dedicated prepare-transactions endpoints (distinct from the generic EVM ones).

  Kaspa and UTXO both take a `recipients: [{address, amount}]` array (multiple outputs in one transaction), matching the underlying API rather than the single `toAddress`/`amount` pair used elsewhere. Tron uses `sender`/`recipient`/`contract` field names per its own API convention, distinct from every other domain's `fromAddress`/`toAddress`/`contractAddress`.

  `mcp-shared` gains `utxo` and expanded `other` entries in `system_info`'s `prepare-transactions` product-availability data.

- cdb2c1f: Add Tezos support to `mcp-blockchain-fees` and `mcp-prepare-transactions`.

  New `blockchain_fees_tezos` tool (`mcp-blockchain-fees`):

  - `get-fee-recommendations` — current minimal fee/cost rates from the mempool
  - `estimate-transfer` — fee estimate for a native XTZ transfer
  - `estimate-fa12-transfer` — fee estimate for an FA1.2 token transfer
  - `estimate-fa2-transfer` — fee estimate for an FA2 token transfer

  New `prepare_transactions_tezos` tool (`mcp-prepare-transactions`):

  - `native-coins` — unsigned native XTZ transfer
  - `fa1-2-tokens` — unsigned FA1.2 token transfer
  - `fa2-tokens` — unsigned FA2 token transfer

  `mcp-shared` gains a `tezos` entry in `system_info`'s blockchain list, product-availability data, and denominations.

### Patch Changes

- Updated dependencies [cdb2c1f]
- Updated dependencies [cdb2c1f]
- Updated dependencies [cdb2c1f]
  - @cryptoapis-io/mcp-shared@0.3.1

## 0.3.0

### Minor Changes

- Add MCP logging, resources, and prompts across all packages. Add debug-level tool call logging, replace console.error with McpLogger, remove .refine() from schemas for MCP client compatibility, and fix supply-chain vulnerabilities.

### Patch Changes

- Updated dependencies
  - @cryptoapis-io/mcp-shared@0.3.0

## 0.2.3

### Patch Changes

- Fix supply-chain vulnerabilities: update @modelcontextprotocol/sdk to ^1.27.1, express to ^4.22.1, add security warning to signer tool descriptions
- Updated dependencies
  - @cryptoapis-io/mcp-shared@0.2.3

## 0.2.2

### Patch Changes

- Add MCP Registry metadata (mcpName, server.json)
- Updated dependencies
  - @cryptoapis-io/mcp-shared@0.2.2

## 0.2.1

### Patch Changes

- Rename Hosted MCP Server to Remote MCP Server in documentation
- Updated dependencies
  - @cryptoapis-io/mcp-shared@0.2.1

## 0.2.0

### Minor Changes

- Add User-Agent and x-source headers to identify MCP traffic

### Patch Changes

- Updated dependencies
  - @cryptoapis-io/mcp-shared@0.2.0
