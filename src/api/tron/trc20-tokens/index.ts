import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type PrepareTrc20TokensInput = {
    network: string;
    sender: string;
    recipient: string;
    contract: string;
    amount: string;
    feeLimit?: number;
} & RequestMetadata;

export async function prepareTrc20Tokens(client: CryptoApisHttpClient, input: PrepareTrc20TokensInput) {
    return client.request<unknown>("POST", `/prepare-transactions/evm/tron/${input.network}/trc20-tokens`, {
        query: { context: input.context },
        body: {
            data: {
                item: {
                    sender: input.sender,
                    recipient: input.recipient,
                    contract: input.contract,
                    amount: input.amount,
                    ...(input.feeLimit !== undefined && { feeLimit: input.feeLimit }),
                },
            },
        },
    });
}
