import type { CryptoApisHttpClient, McpLogger, RequestResult } from "@cryptoapis-io/mcp-shared";
import type { McpToolDef } from "../types.js";
import { PrepareTransactionsEvmToolSchema, type PrepareTransactionsEvmToolInput } from "./schema.js";
import * as api from "../../api/evm/index.js";
import { credits as fromAddrCredits } from "./prepare-transaction-from-address/credits.js";
import { credits as fungibleCredits } from "./prepare-fungible-token-transfer/credits.js";
import { credits as nftCredits } from "./prepare-nft-transfer/credits.js";

export const prepareTransactionsEvmTool: McpToolDef<typeof PrepareTransactionsEvmToolSchema> = {
    name: "prepare_transactions_evm",
    description: `Build unsigned EVM transactions ready for signing. Returns the raw unsigned transaction hex and fee details. After preparing, use a signing tool (e.g. evm_sign) to sign locally, then broadcast via broadcast_signed_transaction.

Actions:
• prepare-transaction-from-address: Build an unsigned native coin transfer (e.g. ETH, BNB)
• prepare-fungible-token-transfer: Build an unsigned ERC-20 token transfer
• prepare-nft-transfer: Build an unsigned ERC-721 NFT transfer`,
    credits: {
        "prepare-transaction-from-address": fromAddrCredits,
        "prepare-fungible-token-transfer": fungibleCredits,
        "prepare-nft-transfer": nftCredits,
    },
    inputSchema: PrepareTransactionsEvmToolSchema,
    handler: (client: CryptoApisHttpClient, logger: McpLogger) => async (input: PrepareTransactionsEvmToolInput) => {
        const base = { blockchain: input.blockchain, network: input.network, context: input.context };
        let result: RequestResult<unknown>;
        switch (input.action) {
            case "prepare-transaction-from-address":
                result = await api.prepareTransactionFromAddress(client, {
                    ...base,
                    fromAddress: input.fromAddress!,
                    toAddress: input.toAddress!,
                    value: input.value!,
                    gasLimit: input.gasLimit,
                    gasPrice: input.gasPrice,
                });
                break;
            case "prepare-fungible-token-transfer":
                result = await api.prepareFungibleTokenTransfer(client, {
                    ...base,
                    fromAddress: input.fromAddress!,
                    toAddress: input.toAddress!,
                    contractAddress: input.contractAddress!,
                    amount: input.amount!,
                });
                break;
            case "prepare-nft-transfer":
                result = await api.prepareNftTransfer(client, {
                    ...base,
                    fromAddress: input.fromAddress!,
                    toAddress: input.toAddress!,
                    contractAddress: input.contractAddress!,
                    tokenId: input.tokenId!,
                });
                break;
            default:
                throw new Error(`Unknown action: ${(input as Record<string, unknown>).action}`);
        }
        logger.logInfo({
            tool: "prepare_transactions_evm",
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
                    type: "text",
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
