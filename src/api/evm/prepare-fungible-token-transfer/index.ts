import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareFungibleTokenTransferInput = {
    blockchain: string;
    network: string;
    fromAddress: string;
    toAddress: string;
    contractAddress: string;
    amount: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareFungibleTokenTransfer(
    client: CryptoApisHttpClient,
    input: PrepareFungibleTokenTransferInput
) {
    return client.request<unknown>(
        "POST",
        `/prepare-transactions/evm/${input.blockchain}/${input.network}/fungible-tokens`,
        {
            query: { context: input.context },
            body: {
                data: {
                    item: {
                        sender: input.fromAddress,
                        recipient: input.toAddress,
                        contract: input.contractAddress,
                        amount: input.amount,
                        fee: { priority: input.feePriority ?? "standard" },
                    },
                },
            },
        }
    );
}
