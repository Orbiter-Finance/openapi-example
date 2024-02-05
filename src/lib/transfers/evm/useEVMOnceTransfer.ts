import { IGlobalTransactionType } from '@/Models';
import { ERC20_ABI } from '@/abi/ERC20';
import useTotas from '@/hooks/useTotas';
import { reChains } from '@/stores';
import { reTransactionLocalTransfer } from '@/stores/bridge/transaction';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { updateLocalTransaction } from '@/utils/localTransaction';
import { parseUnits } from 'ethers';
import { useCallback } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { useAccount, useContractWrite, useSendTransaction } from 'wagmi';

export default function useEVMOnceTransfer(
    {
        coinAddress
    }: { coinAddress: string; }
) {

    const { address } = useAccount()

    const [transactionLocalTransfer, setTransactionLocalTransfer] = useRecoilState(reTransactionLocalTransfer)

    const { sendTransactionAsync } = useSendTransaction();

    const { totasError, totasSuccess } = useTotas();

    const chains = useRecoilValue(reChains);

    const { writeAsync } = useContractWrite({
        abi: ERC20_ABI,
        address: ethAddressUtils(coinAddress),
        functionName: "transfer"
    });

    const local = useCallback(
        (params: IGlobalTransactionType, hash: string) => {

            const localData: { [key: string]: string; } = {
                ...transactionLocalTransfer,
               [params.id.toLocaleLowerCase()] : hash
            };

            updateLocalTransaction(localData);
            setTransactionLocalTransfer(localData)

            totasSuccess("Transfer hash: " + hash || "");
        },
        [setTransactionLocalTransfer, totasSuccess, transactionLocalTransfer],
    );

    const onceEvmTransfers = useCallback(
        async (
            params: IGlobalTransactionType,
            is10Coin: boolean
        ) => {

            const ethereum = (globalThis as any).ethereum;

            if (!ethereum) {
                throw new Error('Please install metamask wallet first!');
            }

            const { chain, token, userAddress, amount } = params

            const chainsGroup = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(chain).toLocaleLowerCase())[0];

            const coinGroup = chainsGroup?.tokens.filter((item: any) => item?.address?.toLocaleLowerCase() === token?.toLocaleLowerCase())[0];
            if (coinGroup?.decimals) {
                    if (address) {
                        try {
                            if (is10Coin) {
                                const {hash} =  await sendTransactionAsync({
                                    to: userAddress,
                                    value: parseUnits(amount, coinGroup.decimals)
                                });
                                local(params, hash)

                            } else {

                                const { hash } = await writeAsync(
                                    {
                                        args: [
                                            userAddress,
                                            parseUnits(amount, coinGroup.decimals)
                                        ]
                                    }
                                );

                                local(params, hash)
                            }

                        } catch (error) {
                            const message = (error as any)?.data?.message || (error as any)?.message;
                            if (message) {
                                totasError(message as string);
                            } else {
                                totasError((error as Error).toString()?.slice(0, 240))                            
                            }
                        }
                    }
                
            } else {
                totasError("Coin decimals Error");
            }

        },
        [chains, address, sendTransactionAsync, local, writeAsync, totasError],
    );

    return ({
        onceEvmTransfers
    });
}
