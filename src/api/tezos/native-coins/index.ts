import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNativeCoinsInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    fromPublicKey?: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    return client.request<unknown>("POST", `/prepare-transactions/tezos/${input.network}/native-coins`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    amount: input.amount,
                    ...(input.fromPublicKey !== undefined && { fromPublicKey: input.fromPublicKey }),
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                },
            },
        },
    });
}
