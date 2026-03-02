import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNftTransferInput = {
    blockchain: string;
    network: string;
    fromAddress: string;
    toAddress: string;
    contractAddress: string;
    tokenId: string;
    feePriority?: "slow" | "standard" | "fast";
} & RequestMetadata;

export async function prepareNftTransfer(
    client: CryptoApisHttpClient,
    input: PrepareNftTransferInput
) {
    return client.request<unknown>(
        "POST",
        `/prepare-transactions/evm/${input.blockchain}/${input.network}/non-fungible-tokens`,
        {
            query: { context: input.context },
            body: {
                data: {
                    item: {
                        sender: input.fromAddress,
                        recipient: input.toAddress,
                        contract: input.contractAddress,
                        tokenId: input.tokenId,
                        fee: { priority: input.feePriority ?? "standard" },
                    },
                },
            },
        }
    );
}
