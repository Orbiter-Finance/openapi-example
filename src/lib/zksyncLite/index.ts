import { useCallback } from 'react';
import { IGlobalTransactionType } from '@/Models';

import useTotas from '@/hooks/useTotas';
import useEvmAccountInfo from '@/hooks/useEvmAccountInfo';
import * as zksync from "zksync";
import { reChains } from '@/stores';
import { useRecoilValue } from 'recoil';
import { parseUnits } from 'viem';
import { ZKSYNC_LITE_GOERLI } from '@/constants/network';
import { useEthersSigner } from '@/lib/ethersToViem/ethers';


export default function useZksyncLiteTransfers() {

    const EvmAccountInfo = useEvmAccountInfo();


    const { totasError } = useTotas();
    const chains = useRecoilValue(reChains);

    const signer = useEthersSigner();

    const ZksyncLiteTransfers = useCallback(
        async (
            params: IGlobalTransactionType,
        ) => {

            const { token, chain, userAddress, amount } = params;

            const chainsGroup = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(chain).toLocaleLowerCase())[0];

            const coinGroup = chainsGroup?.tokens.filter((item: any) => item?.address?.toLocaleLowerCase() === token?.toLocaleLowerCase())[0];

            if (coinGroup?.decimals) {
                if (EvmAccountInfo.address) {

                    if (signer) {
                        let syncProvider: zksync.Provider;

                        if (chain.toLocaleLowerCase() === ZKSYNC_LITE_GOERLI.toLocaleLowerCase()) {
                            syncProvider = await zksync.Provider.newHttpProvider(
                                'https://goerli-api.zksync.io/jsrpc'
                            );
                        } else {
                            syncProvider = await zksync.getDefaultProvider('mainnet');
                        }

                        try {
                            const syncWallet = await zksync.Wallet.fromEthSigner(
                                signer,
                                syncProvider
                            );

                            const transferAmount = zksync.utils.closestPackableTransactionAmount(
                                parseUnits(amount, coinGroup.decimals)
                            );

                            const transferFee = await syncProvider.getTransactionFee(
                                'Transfer',
                                syncWallet.address() || '',
                                token
                            );

                            try {
                                const transfer = await syncWallet.syncTransfer({
                                    to: userAddress,
                                    token,
                                    amount: transferAmount,
                                    fee: transferFee.totalFee
                                });

                                const transferReceipt = await transfer.awaitReceipt();
                            } catch (error) {
                                totasError((error as any)?.message ? String((error as any)?.message) : String(error), 10000);
                            }
                        } catch (error) {
                            totasError((error as any)?.message ? String((error as any)?.message) : String(error), 10000);
                        }
                    }
                }
            } else {
                totasError("Coin decimals Error");
            }

        },
        [chains, EvmAccountInfo, totasError, signer],
    );


    return {
        ZksyncLiteTransfers
    };
}

