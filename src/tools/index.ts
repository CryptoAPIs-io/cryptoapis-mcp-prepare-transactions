import { systemInfoTool } from "@cryptoapis-io/mcp-shared";
import { prepareTransactionsEvmTool } from "./evm/index.js";
import { prepareTransactionsTezosTool } from "./tezos/index.js";
import { prepareTransactionsSolanaTool } from "./solana/index.js";
import { prepareTransactionsKaspaTool } from "./kaspa/index.js";
import { prepareTransactionsXrpTool } from "./xrp/index.js";
import { prepareTransactionsUtxoTool } from "./utxo/index.js";
import { prepareTransactionsTronTool } from "./tron/index.js";

export const tools = [
    prepareTransactionsEvmTool,
    prepareTransactionsTezosTool,
    prepareTransactionsSolanaTool,
    prepareTransactionsKaspaTool,
    prepareTransactionsXrpTool,
    prepareTransactionsUtxoTool,
    prepareTransactionsTronTool,
    systemInfoTool,
] as const;
