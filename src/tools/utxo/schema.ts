import * as z from "zod";
import { RequestMetadataSchema } from "@cryptoapis-io/mcp-shared";

export const PrepareUtxoAction = z.enum(["native-coins"]);

export const PrepareTransactionsUtxoToolSchema = z
    .object({
        action: PrepareUtxoAction.describe("Action to perform"),
        blockchain: z
            .enum(["bitcoin", "litecoin", "dogecoin", "dash", "zcash", "bitcoin-cash"])
            .describe("Blockchain protocol"),
        network: z.enum(["mainnet", "testnet"]).describe("Network name"),
        fromAddress: z.string().min(1).optional().describe("Sender's address (required)"),
        recipients: z
            .array(z.object({ address: z.string(), amount: z.string() }))
            .optional()
            .describe(
                "Recipients as {address, amount} objects, amount in the chain's main denomination - one output per entry (required)"
            ),
        feePriority: z
            .enum(["slow", "standard", "fast"])
            .optional()
            .describe("Fee priority tier - required unless exactFee is given"),
        exactFee: z
            .string()
            .optional()
            .describe("Exact fee override in the chain's main denomination - required unless feePriority is given"),
        additionalData: z.string().optional().describe("OP_RETURN data to embed in the transaction"),
        locktime: z.number().int().optional().describe("Transaction locktime"),
        prepareStrategy: z
            .enum(["none", "minimize-dust", "optimize-size"])
            .optional()
            .describe("UTXO selection strategy"),
        replaceable: z.boolean().optional().describe("Mark the transaction as RBF-replaceable"),
    })
    .merge(RequestMetadataSchema);

export type PrepareTransactionsUtxoToolInput = z.infer<typeof PrepareTransactionsUtxoToolSchema>;
