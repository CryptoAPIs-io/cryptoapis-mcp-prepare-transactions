import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsSolanaToolSchema, type PrepareTransactionsSolanaToolInput } from "./schema.js";
import * as solana from "../../api/solana/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";
import { credits as splTokensCredits } from "./spl-tokens/credits.js";

const PREPARE_SOLANA_DESCRIPTION = `Build unsigned Solana transactions ready for signing. Returns the unsigned transaction and fee details. After preparing, sign locally and broadcast via broadcast_signed_transaction.

Actions:
• native-coins: Build an unsigned native SOL transfer
• spl-tokens: Build an unsigned SPL token transfer`;

export const prepareTransactionsSolanaTool: McpToolDef<typeof PrepareTransactionsSolanaToolSchema> = {
    name: "prepare_transactions_solana",
    description: PREPARE_SOLANA_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
        "spl-tokens": splTokensCredits,
    },
    inputSchema: PrepareTransactionsSolanaToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsSolanaToolInput) => {
            const base = { network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins":
                    if (!input.fromAddress) throw new Error("fromAddress is required for native-coins");
                    if (!input.toAddress) throw new Error("toAddress is required for native-coins");
                    if (!input.amount) throw new Error("amount is required for native-coins");
                    result = await solana.prepareNativeCoins(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        amount: input.amount,
                        feePriority: input.feePriority,
                    });
                    break;
                case "spl-tokens":
                    if (!input.fromAddress) throw new Error("fromAddress is required for spl-tokens");
                    if (!input.toAddress) throw new Error("toAddress is required for spl-tokens");
                    if (!input.tokenContract) throw new Error("tokenContract is required for spl-tokens");
                    if (!input.amount) throw new Error("amount is required for spl-tokens");
                    result = await solana.prepareSplTokens(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        tokenContract: input.tokenContract,
                        amount: input.amount,
                        tokenStandard: input.tokenStandard,
                        feePriority: input.feePriority,
                    });
                    break;
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_solana",
                action: input.action,
                network: input.network,
                creditsConsumed: result.creditsConsumed,
                creditsAvailable: result.creditsAvailable,
                responseTime: result.responseTime,
                throughputUsage: result.throughputUsage,
            });

            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify({
                            ...(result.data as object),
                            creditsConsumed: result.creditsConsumed,
                            creditsAvailable: result.creditsAvailable,
                            responseTime: result.responseTime,
                            throughputUsage: result.throughputUsage,
                        }),
                    },
                ],
            };
        },
};
