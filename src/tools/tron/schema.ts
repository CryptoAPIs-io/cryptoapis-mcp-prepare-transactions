import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareTronAction = z.enum(["native-coins", "trc20-tokens", "non-fungible-tokens"]);

export const PrepareTransactionsTronToolSchema = z
    .object({
        action: PrepareTronAction.describe("Action to perform"),
        network: z.enum(["mainnet", "nile"]).describe("Network name"),
        sender: z.string().min(1).optional().describe("Sender's Tron address (required for all actions)"),
        recipient: z.string().min(1).optional().describe("Recipient's Tron address (required for all actions)"),
        amount: z
            .string()
            .optional()
            .describe(
                "Amount in sun for native-coins, or token base units for trc20-tokens (required for native-coins, trc20-tokens)"
            ),
        contract: z
            .string()
            .optional()
            .describe("Token contract address (required for trc20-tokens, non-fungible-tokens)"),
        tokenId: z.string().optional().describe("NFT token ID (required for non-fungible-tokens)"),
        feeLimit: z
            .number()
            .int()
            .optional()
            .describe("Max TRX fee limit in sun (trc20-tokens, non-fungible-tokens only)"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsTronToolInput = z.infer<typeof PrepareTransactionsTronToolSchema>;
