import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareTransactionFromAddressInput = {
    blockchain: string;
    network: string;
    fromAddress: string;
    toAddress: string;
    value: string;
    feePriority?: "slow" | "standard" | "fast";
    gasLimit?: string;
    gasPrice?: string;
} & RequestMetadata;

export async function prepareTransactionFromAddress(
    client: CryptoApisHttpClient,
    input: PrepareTransactionFromAddressInput
) {
    return client.request<unknown>(
        "POST",
        `/prepare-transactions/evm/${input.blockchain}/${input.network}/native-coins`,
        {
            query: { context: input.context },
            body: {
                data: {
                    item: {
                        sender: input.fromAddress,
                        recipient: input.toAddress,
                        amount: input.value,
                        fee: { priority: input.feePriority ?? "standard" },
                        ...(input.gasLimit != null && { gasLimit: input.gasLimit }),
                        ...(input.gasPrice != null && { gasPrice: input.gasPrice }),
                    },
                },
            },
        }
    );
}
