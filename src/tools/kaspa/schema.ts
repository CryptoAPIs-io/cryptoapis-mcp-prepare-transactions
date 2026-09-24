import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareKaspaAction = z.enum(["native-coins"]);

export const PrepareTransactionsKaspaToolSchema = z
    .object({
        action: PrepareKaspaAction.describe("Action to perform"),
        network: z.enum(["mainnet"]).describe("Network name - Kaspa is mainnet-only"),
        fromAddress: z.string().min(1).optional().describe("Sender's Kaspa address (required)"),
        recipients: z
            .array(z.object({ address: z.string(), amount: z.string() }))
            .optional()
            .describe(
                "Recipients as {address, amount} objects, amount in KAS main units - one output per entry, multiple recipients supported in a single transaction (required)"
            ),
        feePriority: z
            .enum(["slow", "standard", "fast"])
            .optional()
            .describe("Fee priority tier - defaults to standard if omitted"),
        exactFee: z
            .string()
            .optional()
            .describe("Exact fee override in KAS - bypasses mass-based fee calculation when set"),
        prepareStrategy: z
            .enum(["none", "minimize-dust", "optimize-size"])
            .optional()
            .describe("UTXO selection strategy"),
        locktime: z.number().int().optional().describe("Transaction locktime"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsKaspaToolInput = z.infer<typeof PrepareTransactionsKaspaToolSchema>;
