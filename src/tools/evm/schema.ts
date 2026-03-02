import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";
import { PrepareEvmAction, EvmBlockchain, EvmNetwork } from "./base-schema.js";

export const PrepareTransactionsEvmToolSchema = z
    .object({
        action: PrepareEvmAction.describe("Action to perform"),
        blockchain: EvmBlockchain.describe("Blockchain protocol"),
        network: EvmNetwork.describe("Network name"),
        fromAddress: z.string().min(1).optional().describe("Sender address (required for all actions)"),
        toAddress: z.string().min(1).optional().describe("Recipient address (required for all actions)"),
        value: z.string().optional().describe("Amount in native coin's smallest unit, e.g. wei (required for prepare-transaction-from-address)"),
        gasLimit: z.string().optional().describe("Custom gas limit override (prepare-transaction-from-address only; auto-estimated if omitted)"),
        gasPrice: z.string().optional().describe("Custom gas price in wei (prepare-transaction-from-address only; auto-estimated if omitted)"),
        contractAddress: z.string().optional().describe("Token contract address (required for prepare-fungible-token-transfer and prepare-nft-transfer)"),
        amount: z.string().optional().describe("Token amount to transfer (required for prepare-fungible-token-transfer)"),
        tokenId: z.string().optional().describe("NFT token ID (required for prepare-nft-transfer)"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsEvmToolInput = z.infer<typeof PrepareTransactionsEvmToolSchema>;
