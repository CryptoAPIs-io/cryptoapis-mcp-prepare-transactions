import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNonFungibleTokensInput = {
    network: string;
    sender: string;
    recipient: string;
    contract: string;
    tokenId: string;
    feeLimit?: number;
} & RequestMetadata;

export async function prepareNonFungibleTokens(client: CryptoApisHttpClient, input: PrepareNonFungibleTokensInput) {
    return client.request<unknown>(
        "POST",
        `/prepare-transactions/evm/tron/${input.network}/non-fungible-tokens`,
        {
            query: { context: input.context },
            body: {
                data: {
                    item: {
                        sender: input.sender,
                        recipient: input.recipient,
                        contract: input.contract,
                        tokenId: input.tokenId,
                        ...(input.feeLimit !== undefined && { feeLimit: input.feeLimit }),
                    },
                },
            },
        }
    );
}
