import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsKaspaToolSchema, type PrepareTransactionsKaspaToolInput } from "./schema.js";
import * as kaspa from "../../api/kaspa/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";

const PREPARE_KASPA_DESCRIPTION = `Build unsigned Kaspa transactions ready for signing. Returns the unsigned transaction and fee details. After preparing, sign locally (kaspa_sign) and broadcast via broadcast_signed_transaction.

Actions:
• native-coins: Build an unsigned native KAS transfer, supporting multiple recipients in one transaction`;

export const prepareTransactionsKaspaTool: McpToolDef<typeof PrepareTransactionsKaspaToolSchema> = {
    name: "prepare_transactions_kaspa",
    description: PREPARE_KASPA_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
    },
    inputSchema: PrepareTransactionsKaspaToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsKaspaToolInput) => {
            const base = { network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins":
                    if (!input.fromAddress) throw new Error("fromAddress is required for native-coins");
                    if (!input.recipients || input.recipients.length === 0)
                        throw new Error("recipients is required for native-coins");
                    result = await kaspa.prepareNativeCoins(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        recipients: input.recipients,
                        feePriority: input.feePriority,
                        exactFee: input.exactFee,
                        prepareStrategy: input.prepareStrategy,
                        locktime: input.locktime,
                    });
                    break;
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_kaspa",
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
