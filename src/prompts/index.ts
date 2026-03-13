import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { formatSupportedChains } from "@cryptoapis-io/mcp-shared";
import { supportedChains } from "../resources/supported-chains.js";

export function registerPrompts(server: McpServer): void {
    server.registerPrompt(
        "prepare-evm-transaction",
        {
            description: "Build an unsigned EVM transaction ready for signing",
            argsSchema: {
                blockchain: z.string().describe("EVM blockchain (e.g. ethereum, polygon, binance-smart-chain)"),
                network: z.string().describe("Network name (e.g. mainnet, sepolia, testnet)"),
                fromAddress: z.string().describe("Sender address"),
                toAddress: z.string().describe("Recipient address"),
                amount: z.string().describe("Amount in the native coin's smallest unit (e.g. wei)"),
            },
        },
        (args): GetPromptResult => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Use prepare_transactions_evm to build an unsigned transaction on ${args.blockchain}/${args.network} from ${args.fromAddress} to ${args.toAddress} for ${args.amount}. The tool will return the unsigned transaction hex and fee details. After preparing, the next steps are: 1) Sign locally using evm_sign, 2) Broadcast using broadcast_signed_transaction.\n\n${formatSupportedChains(supportedChains)}`,
                    },
                },
            ],
        }),
    );
}
