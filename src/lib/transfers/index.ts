import { useCallback } from 'react';
import useEvmTransfers from './evm';
import { IGlobalTransactionType } from '@/Models';
import useStarknetTransfers from './starknet';
import useTotas from '@/hooks/useTotas';
import useSwitchChain from '@/hooks/useSwitchChain';
import { getSelectedConnectorWallet } from 'starknetkit';
import { STARKNET_CHAIN } from '@/constants/rpc';
import { useNetwork } from 'wagmi';

export default function useTransfers({
    coinAddress
}: { coinAddress: string; }) {

    const { totasWarning } = useTotas();

    const { chain: chainGroup } = useNetwork()


    const { EvmTransfers } = useEvmTransfers({ coinAddress });
    const { StarknetTransfers } = useStarknetTransfers();
    const { switchChain } = useSwitchChain();

    const transfers = useCallback(
        async (
            params: IGlobalTransactionType[],
            is10Coin: boolean
        ) => {

            const { chain } = params[0];


            if (STARKNET_CHAIN.includes(chain)) {

                const r = getSelectedConnectorWallet();

                const provider = r?.account?.provider;

                const url = provider?.nodeUrl ||
                    provider?.baseUrl ||
                    provider?.provider?.baseUrl ||
                    provider?.provider?.nodeUrl ||
                    '';
                if (url.includes('mainnet')) {
                    await StarknetTransfers(params);
                } else {
                    totasWarning("Network mismatch");
                }

            } else {
                if (Number(chainGroup?.id) === Number(chain) || Number(chainGroup?.network) === Number(chain)) {

                    const res = await EvmTransfers(params, is10Coin);
                } else {
                    totasWarning("Network mismatch");
                    if (!isNaN(Number(chain))) {
                        switchChain(Number(chain));
                    }
                }
            }

        },
        [EvmTransfers, StarknetTransfers, chainGroup, switchChain, totasWarning],
    );

    return {
        transfers
    };
}
