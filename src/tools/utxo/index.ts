import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsUtxoToolSchema, type PrepareTransactionsUtxoToolInput } from "./schema.js";
import * as utxo from "../../api/utxo/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";

const PREPARE_UTXO_DESCRIPTION = `Build unsigned UTXO transactions ready for signing (Bitcoin, Bitcoin Cash, Litecoin, Dogecoin, Dash, Zcash). Returns the unsigned transaction and fee details. After preparing, sign locally (utxo_sign) and broadcast via broadcast_signed_transaction.

Actions:
• native-coins: Build an unsigned native coin transfer, supporting multiple recipients in one transaction. Requires either feePriority or exactFee.`;

export const prepareTransactionsUtxoTool: McpToolDef<typeof PrepareTransactionsUtxoToolSchema> = {
    name: "prepare_transactions_utxo",
    description: PREPARE_UTXO_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
    },
    inputSchema: PrepareTransactionsUtxoToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsUtxoToolInput) => {
            const base = { blockchain: input.blockchain, network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins": {
                    if (!input.fromAddress) throw new Error("fromAddress is required for native-coins");
                    if (!input.recipients || input.recipients.length === 0)
                        throw new Error("recipients is required for native-coins");
                    if (!input.feePriority && !input.exactFee)
                        throw new Error("feePriority or exactFee is required for native-coins");

                    const feeOptions: { priority?: "slow" | "standard" | "fast"; exactAmount?: string } = {};
                    if (input.feePriority !== undefined) feeOptions.priority = input.feePriority;
                    if (input.exactFee !== undefined) feeOptions.exactAmount = input.exactFee;

                    result = await utxo.prepareNativeCoins(client, {
                        ...base,
                        fromAddress: input.fromAddress,
                        recipients: input.recipients,
                        feeOptions,
                        additionalData: input.additionalData,
                        locktime: input.locktime,
                        prepareStrategy: input.prepareStrategy,
                        replaceable: input.replaceable,
                    });
                    break;
                }
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_utxo",
                action: input.action,
                blockchain: input.blockchain,
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
