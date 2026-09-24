import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNativeCoinsInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    return client.request<unknown>("POST", `/prepare-transactions/solana/${input.network}/native-coins`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    amount: input.amount,
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                },
            },
        },
    });
}
