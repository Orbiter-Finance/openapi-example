import { useCallback } from 'react';
import { IGlobalTransactionType } from '@/Models';

import { CallData, uint256 } from 'starknet';
import { parseUnits } from 'ethers';

import { getSelectedConnectorWallet } from 'starknetkit';
import { useRecoilState, useRecoilValue } from 'recoil';
import { reTransactionLocalTransfer } from '@/stores/bridge/transaction';
import { updateLocalTransaction } from '@/utils/localTransaction';
import useTotas from '@/hooks/useTotas';
import { reChains } from '@/stores';

export default function useStarknetTransfers() {

    const [transactionLocalTransfer, setTransactionLocalTransfer] = useRecoilState(reTransactionLocalTransfer);

    const { totasError, totasSuccess } = useTotas();
    const chains = useRecoilValue(reChains);


    const local = useCallback(
        (params: IGlobalTransactionType[], hash: string) => {
            let localData: { [key: string]: string; } = transactionLocalTransfer;
            params.forEach((item) => {
                localData = {
                    ...localData,
                    [item.id.toLocaleLowerCase() || ""]: hash || ""
                };
            });

            updateLocalTransaction(localData);
            setTransactionLocalTransfer(localData);

            totasSuccess("Transfer hash: " + hash || "");
        },
        [setTransactionLocalTransfer, totasSuccess, transactionLocalTransfer],
    );

    const StarknetTransfers = useCallback(
        async (
            params: IGlobalTransactionType[],
        ) => {

            let str: string[] = []

            const list = params.map((item) => {
                const { chain, token }: IGlobalTransactionType = item;

                const chainsGroup = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(chain).toLocaleLowerCase())[0];

                const coinGroup = chainsGroup?.tokens.filter((item: any) => item?.address?.toLocaleLowerCase() === token?.toLocaleLowerCase())[0];
                if(!coinGroup?.decimals) {
                    str = str.concat([item.userAddress])
                }
                return ({
                    ...item,
                    decimals : coinGroup?.decimals
                });
            });

            if (!str.length) {

                if (!!list.length) {

                    try {
                        const r = getSelectedConnectorWallet();

                        const data: any = list.map((item) => {
                            return ({
                                contractAddress: item.token,
                                entrypoint: 'transfer',
                                calldata: CallData.compile({
                                    spender: item.userAddress,
                                    amount: uint256.bnToUint256(parseUnits(item.amount, item.decimals))
                                })
                            });
                        });

                        const { transaction_hash } = await r.account.execute(data);

                        local(params, transaction_hash || "");
                    } catch (error) {
                        totasError(String(error));
                    }
                }
            } else {
                totasError("Coin decimals Error" + str.join(","), 10000);
            }

        },
        [chains, local, totasError],
    );


    return {
        StarknetTransfers
    };
}

