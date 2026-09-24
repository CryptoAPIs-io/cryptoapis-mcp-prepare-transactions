import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareFa2TokensInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    contractAddress: string;
    amount: string;
    tokenId: string;
    fromPublicKey?: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareFa2Tokens(client: CryptoApisHttpClient, input: PrepareFa2TokensInput) {
    return client.request<unknown>("POST", `/prepare-transactions/tezos/${input.network}/fa2-tokens`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    contractAddress: input.contractAddress,
                    amount: input.amount,
                    tokenId: input.tokenId,
                    tokenStandard: "FA_2",
                    ...(input.fromPublicKey !== undefined && { fromPublicKey: input.fromPublicKey }),
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                },
            },
        },
    });
}
