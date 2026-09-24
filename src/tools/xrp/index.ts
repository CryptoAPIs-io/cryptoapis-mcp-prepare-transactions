import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsXrpToolSchema, type PrepareTransactionsXrpToolInput } from "./schema.js";
import * as xrp from "../../api/xrp/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";

const PREPARE_XRP_DESCRIPTION = `Build unsigned XRP transactions ready for signing. Returns the unsigned transaction and fee details. After preparing, sign locally (xrp_sign) and broadcast via broadcast_signed_transaction.

Actions:
• native-coins: Build an unsigned native XRP transfer`;

export const prepareTransactionsXrpTool: McpToolDef<typeof PrepareTransactionsXrpToolSchema> = {
    name: "prepare_transactions_xrp",
    description: PREPARE_XRP_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
    },
    inputSchema: PrepareTransactionsXrpToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsXrpToolInput) => {
            const base = { network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins":
                    if (!input.fromAddress) throw new Error("fromAddress is required for native-coins");
                    if (!input.toAddress) throw new Error("toAddress is required for native-coins");
                    if (!input.amount) throw new Error("amount is required for native-coins");
                    result = await xrp.prepareNativeCoins(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        toAddress: input.toAddress,
                        amount: input.amount,
                        feePriority: input.feePriority,
                        destinationTag: input.destinationTag,
                        sequence: input.sequence,
                    });
                    break;
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_xrp",
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
