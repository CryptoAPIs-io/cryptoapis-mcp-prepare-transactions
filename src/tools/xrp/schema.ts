import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareXrpAction = z.enum(["native-coins"]);

export const PrepareTransactionsXrpToolSchema = z
    .object({
        action: PrepareXrpAction.describe("Action to perform"),
        network: z.enum(["mainnet", "testnet"]).describe("Network name"),
        fromAddress: z.string().min(1).optional().describe("Sender's XRP address (required)"),
        toAddress: z.string().min(1).optional().describe("Recipient's XRP address (required)"),
        amount: z.string().optional().describe("Amount in drops (required)"),
        feePriority: z
            .enum(["slow", "standard", "fast"])
            .optional()
            .describe("Fee priority tier - defaults to standard if omitted"),
        destinationTag: z
            .string()
            .optional()
            .describe("Destination tag - commonly required when sending to an exchange address"),
        sequence: z.string().optional().describe("Override the account sequence number (advanced use)"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsXrpToolInput = z.infer<typeof PrepareTransactionsXrpToolSchema>;
