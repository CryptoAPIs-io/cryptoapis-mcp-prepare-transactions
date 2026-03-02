import { systemInfoTool } from "@cryptoapis-io/mcp-shared";
import { prepareTransactionsEvmTool } from "./evm/index.js";

export const tools = [prepareTransactionsEvmTool, systemInfoTool] as const;
