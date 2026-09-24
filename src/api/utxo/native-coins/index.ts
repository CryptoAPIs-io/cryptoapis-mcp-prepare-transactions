import type { CryptoApisHttpClient, RequestMetadata } from "@cryptoapis-io/mcp-shared";

export type UtxoRecipient = { address: string; amount: string };

export type PrepareNativeCoinsInput = {
    blockchain: string;
    network: string;
    fromAddress: string;
    recipients: UtxoRecipient[];
    feeOptions: { priority?: "slow" | "standard" | "fast"; exactAmount?: string };
    additionalData?: string;
    locktime?: number;
    prepareStrategy?: "none" | "minimize-dust" | "optimize-size";
    replaceable?: boolean;
} & RequestMetadata;

export async function prepareNativeCoins(client: CryptoApisHttpClient, input: PrepareNativeCoinsInput) {
    return client.request<unknown>(
        "POST",
        `/prepare-transactions/utxo/${input.blockchain}/${input.network}/native-coins`,
        {
            query: { context: input.context },
            body: {
                data: {
                    item: {
                        fromAddress: input.fromAddress,
                        recipients: input.recipients,
                        feeOptions: input.feeOptions,
                        ...(input.additionalData !== undefined && { additionalData: input.additionalData }),
                        ...(input.locktime !== undefined && { locktime: input.locktime }),
                        ...(input.prepareStrategy !== undefined && { prepareStrategy: input.prepareStrategy }),
                        ...(input.replaceable !== undefined && { replaceable: input.replaceable }),
                    },
                },
            },
        }
    );
}
