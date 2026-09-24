import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNativeCoinsInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    feePriority?: "slow" | "standard" | "fast";
    destinationTag?: string;
    sequence?: string;
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    return client.request<unknown>("POST", `/prepare-transactions/xrp/${input.network}/native-coins`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    amount: input.amount,
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                    ...(input.destinationTag !== undefined && { destinationTag: input.destinationTag }),
                    ...(input.sequence !== undefined && { sequence: input.sequence }),
                },
            },
        },
    });
}
