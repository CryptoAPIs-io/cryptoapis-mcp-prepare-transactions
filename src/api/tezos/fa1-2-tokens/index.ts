import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareFa12TokensInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    contractAddress: string;
    amount: string;
    fromPublicKey?: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareFa12Tokens(client: CryptoApisHttpClient, input: PrepareFa12TokensInput) {
    return client.request<unknown>("POST", `/prepare-transactions/tezos/${input.network}/fa1-2-tokens`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    contractAddress: input.contractAddress,
                    amount: input.amount,
                    tokenStandard: "FA_1_2",
                    ...(input.fromPublicKey !== undefined && { fromPublicKey: input.fromPublicKey }),
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                },
            },
        },
    });
}
