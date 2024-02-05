import { useCallback } from 'react';
import useEVMOnceTransfer from './useEVMOnceTransfer';
import { IGlobalTransactionType } from '@/Models';

export default function useEvmTransfers({
    coinAddress,
}: { coinAddress: string }) {

    const { onceEvmTransfers } = useEVMOnceTransfer({coinAddress})

    

    const EvmTransfers = useCallback(
        async (
            params: IGlobalTransactionType[],
            is10Coin: boolean
        ) => {

            if (!!params.length) {
                    if (params.length === 1) {
                        onceEvmTransfers(params[0], is10Coin);
                    }
            }

        },
        [onceEvmTransfers],
    );


    return {
        onceEvmTransfers,
        EvmTransfers
    };
}
