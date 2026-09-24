import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareTezosAction = z.enum(["native-coins", "fa1-2-tokens", "fa2-tokens"]);

export const PrepareTransactionsTezosToolSchema = z
    .object({
        action: PrepareTezosAction.describe("Action to perform"),
        network: z.enum(["mainnet", "shadownet"]).describe("Network name"),
        fromAddress: z.string().min(1).optional().describe("Sender's Tezos address (required for all actions)"),
        toAddress: z.string().min(1).optional().describe("Recipient's Tezos address (required for all actions)"),
        amount: z
            .string()
            .optional()
            .describe(
                "Amount to send, in mutez for native-coins, or in the token's base units for fa1-2-tokens/fa2-tokens (required for all actions)"
            ),
        contractAddress: z
            .string()
            .optional()
            .describe("FA1.2/FA2 token contract address (KT1...) - required for fa1-2-tokens, fa2-tokens"),
        tokenId: z.string().optional().describe("FA2 token ID - required for fa2-tokens"),
        fromPublicKey: z
            .string()
            .optional()
            .describe("Sender's public key - required only when the source account is unrevealed"),
        feePriority: z
            .enum(["slow", "standard", "fast"])
            .optional()
            .describe("Fee priority tier - defaults to standard if omitted"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsTezosToolInput = z.infer<typeof PrepareTransactionsTezosToolSchema>;
