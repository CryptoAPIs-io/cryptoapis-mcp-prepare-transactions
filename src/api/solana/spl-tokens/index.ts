import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareSplTokensInput = {
    network: string;
    fromAddress: string;
    toAddress: string;
    tokenContract: string;
    amount: string;
    tokenStandard?: "TOKEN" | "TOKEN-2022";
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareSplTokens(client: CryptoApisHttpClient, input: PrepareSplTokensInput) {
    return client.request<unknown>("POST", `/prepare-transactions/solana/${input.network}/spl-tokens`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    fromAddress: input.fromAddress,
                    toAddress: input.toAddress,
                    tokenContract: input.tokenContract,
                    amount: input.amount,
                    ...(input.tokenStandard !== undefined && { tokenStandard: input.tokenStandard }),
                    ...(input.feePriority !== undefined && { feeOptions: { priority: input.feePriority } }),
                },
            },
        },
    });
}
