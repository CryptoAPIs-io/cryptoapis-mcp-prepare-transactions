import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareNativeCoinsInput = {
    network: string;
    sender: string;
    recipient: string;
    amount: string;
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    return client.request<unknown>("POST", `/prepare-transactions/evm/tron/${input.network}/native-coins`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    sender: input.sender,
                    recipient: input.recipient,
                    amount: input.amount,
                },
            },
        },
    });
}
