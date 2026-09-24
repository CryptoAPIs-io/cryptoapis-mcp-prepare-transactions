import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsTezosToolSchema, type PrepareTransactionsTezosToolInput } from "./schema.js";
import * as tezos from "../../api/tezos/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";
import { credits as fa12Credits } from "./fa1-2-tokens/credits.js";
import { credits as fa2Credits } from "./fa2-tokens/credits.js";

const PREPARE_TEZOS_DESCRIPTION = `Build unsigned Tezos operations ready for signing. Returns the forged (unsigned) operation bytes and fee details. After preparing, sign locally and broadcast via broadcast_signed_transaction.

Actions:
• native-coins: Build an unsigned native XTZ transfer
• fa1-2-tokens: Build an unsigned FA1.2 token transfer
• fa2-tokens: Build an unsigned FA2 token transfer`;

export const prepareTransactionsTezosTool: McpToolDef<typeof PrepareTransactionsTezosToolSchema> = {
    name: "prepare_transactions_tezos",
    description: PREPARE_TEZOS_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
        "fa1-2-tokens": fa12Credits,
        "fa2-tokens": fa2Credits,
    },
    inputSchema: PrepareTransactionsTezosToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsTezosToolInput) => {
            const base = { network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins":
                    if (!input.fromAddress) throw new Error("fromAddress is required for native-coins");
                    if (!input.toAddress) throw new Error("toAddress is required for native-coins");
                    if (!input.amount) throw new Error("amount is required for native-coins");
                    result = await tezos.prepareNativeCoins(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        amount: input.amount,
                        fromPublicKey: input.fromPublicKey,
                        feePriority: input.feePriority,
                    });
                    break;
                case "fa1-2-tokens":
                    if (!input.fromAddress) throw new Error("fromAddress is required for fa1-2-tokens");
                    if (!input.toAddress) throw new Error("toAddress is required for fa1-2-tokens");
                    if (!input.contractAddress) throw new Error("contractAddress is required for fa1-2-tokens");
                    if (!input.amount) throw new Error("amount is required for fa1-2-tokens");
                    result = await tezos.prepareFa12Tokens(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        contractAddress: input.contractAddress,
                        amount: input.amount,
                        fromPublicKey: input.fromPublicKey,
                        feePriority: input.feePriority,
                    });
                    break;
                case "fa2-tokens":
                    if (!input.fromAddress) throw new Error("fromAddress is required for fa2-tokens");
                    if (!input.toAddress) throw new Error("toAddress is required for fa2-tokens");
                    if (!input.contractAddress) throw new Error("contractAddress is required for fa2-tokens");
                    if (!input.amount) throw new Error("amount is required for fa2-tokens");
                    if (!input.tokenId) throw new Error("tokenId is required for fa2-tokens");
                    result = await tezos.prepareFa2Tokens(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        contractAddress: input.contractAddress,
                        amount: input.amount,
                        tokenId: input.tokenId,
                        fromPublicKey: input.fromPublicKey,
                        feePriority: input.feePriority,
                    });
                    break;
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_tezos",
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
