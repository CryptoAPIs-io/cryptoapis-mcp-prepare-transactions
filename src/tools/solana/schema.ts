import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareSolanaAction = z.enum(["native-coins", "spl-tokens"]);

export const PrepareTransactionsSolanaToolSchema = z
    .object({
        action: PrepareSolanaAction.describe("Action to perform"),
        network: z.enum(["mainnet", "devnet"]).describe("Network name"),
        fromAddress: z.string().min(1).optional().describe("Sender address (required for all actions)"),
        toAddress: z.string().min(1).optional().describe("Recipient address (required for all actions)"),
        amount: z
            .string()
            .optional()
            .describe("Amount in lamports for native-coins, or token base units for spl-tokens (required for all actions)"),
        tokenContract: z.string().optional().describe("SPL token mint address (required for spl-tokens)"),
        tokenStandard: z
            .enum(["TOKEN", "TOKEN-2022"])
            .optional()
            .describe("SPL token program standard (spl-tokens only)"),
        feePriority: z
            .enum(["slow", "standard", "fast"])
            .optional()
            .describe("Fee priority tier - defaults to standard if omitted"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsSolanaToolInput = z.infer<typeof PrepareTransactionsSolanaToolSchema>;
