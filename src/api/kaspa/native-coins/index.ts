import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type KaspaRecipient = { address: string; amount: string };

export type PrepareNativeCoinsInput = {
    network: string;
    fromAddress: string;
    recipients: KaspaRecipient[];
    feePriority?: "slow" | "standard" | "fast";
    exactFee?: string;
    prepareStrategy?: "none" | "minimize-dust" | "optimize-size";
    locktime?: number;
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    const feeOptions: Record<string, string> = {};
    if (input.feePriority !== undefined) feeOptions.priority = input.feePriority;
    if (input.exactFee !== undefined) feeOptions.exactAmount = input.exactFee;

    return client.request<unknown>("POST", `/prepare-transactions/kaspa/${input.network}/native-coins`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    recipients: input.recipients,
                    ...(Object.keys(feeOptions).length > 0 && { feeOptions }),
                    ...(input.prepareStrategy !== undefined && { prepareStrategy: input.prepareStrategy }),
                    ...(input.locktime !== undefined && { locktime: input.locktime }),
                },
            },
        },
    });
}
