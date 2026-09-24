import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsTronToolSchema, type PrepareTransactionsTronToolInput } from "./schema.js";
import * as tron from "../../api/tron/index.js";
import { credits as nativeCoinsCredits } from "./native-coins/credits.js";
import { credits as trc20Credits } from "./trc20-tokens/credits.js";
import { credits as nftCredits } from "./non-fungible-tokens/credits.js";

const PREPARE_TRON_DESCRIPTION = `Build unsigned Tron transactions ready for signing. Returns the unsigned transaction and fee details. After preparing, sign locally (tron_sign) and broadcast via broadcast_signed_transaction. These are Tron's dedicated prepare-transactions endpoints, distinct from the generic EVM ones used for other chains.

Actions:
• native-coins: Build an unsigned native TRX transfer
• trc20-tokens: Build an unsigned TRC-20 token transfer
• non-fungible-tokens: Build an unsigned TRC-721/TRC-1155 NFT transfer`;

export const prepareTransactionsTronTool: McpToolDef<typeof PrepareTransactionsTronToolSchema> = {
    name: "prepare_transactions_tron",
    description: PREPARE_TRON_DESCRIPTION,
    credits: {
        "native-coins": nativeCoinsCredits,
        "trc20-tokens": trc20Credits,
        "non-fungible-tokens": nftCredits,
    },
    inputSchema: PrepareTransactionsTronToolSchema,
    handler:
        (client: CryptoApisHttpClient, logger: McpLogger) =>
        async (input: PrepareTransactionsTronToolInput) => {
            const base = { network: input.network, context: input.context };
            let result: RequestResult<unknown>;
            switch (input.action) {
                case "native-coins":
                    if (!input.sender) throw new Error("sender is required for native-coins");
                    if (!input.recipient) throw new Error("recipient is required for native-coins");
                    if (!input.amount) throw new Error("amount is required for native-coins");
                    result = await tron.prepareNativeCoins(client, {
                        ...base,
                        sender: input.sender,
                        recipient: input.recipient,
                        amount: input.amount,
                    });
                    break;
                case "trc20-tokens":
                    if (!input.sender) throw new Error("sender is required for trc20-tokens");
                    if (!input.recipient) throw new Error("recipient is required for trc20-tokens");
                    if (!input.contract) throw new Error("contract is required for trc20-tokens");
                    if (!input.amount) throw new Error("amount is required for trc20-tokens");
                    result = await tron.prepareTrc20Tokens(client, {
                        ...base,
                        sender: input.sender,
                        recipient: input.recipient,
                        contract: input.contract,
                        amount: input.amount,
                        feeLimit: input.feeLimit,
                    });
                    break;
                case "non-fungible-tokens":
                    if (!input.sender) throw new Error("sender is required for non-fungible-tokens");
                    if (!input.recipient) throw new Error("recipient is required for non-fungible-tokens");
                    if (!input.contract) throw new Error("contract is required for non-fungible-tokens");
                    if (!input.tokenId) throw new Error("tokenId is required for non-fungible-tokens");
                    result = await tron.prepareNonFungibleTokens(client, {
                        ...base,
                        sender: input.sender,
                        recipient: input.recipient,
                        contract: input.contract,
                        tokenId: input.tokenId,
                        feeLimit: input.feeLimit,
                    });
                    break;
                default:
                    throw new Error(`Unknown action: ${(input as { action: string }).action}`);
            }

            logger.logInfo({
                tool: "prepare_transactions_tron",
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
