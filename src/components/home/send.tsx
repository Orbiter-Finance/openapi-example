import { ERC20_ABI } from '@/abi/ERC20';
import { Button } from '@/components/ui/button';
import { HISTORY_KEY, STARKNET_CHAIN } from '@/constants';
import useBalance from '@/hooks/useBalance';
import useSwitchChain from '@/hooks/useSwitchChain';
import useTotas from '@/hooks/useTotas';
import { reChains, rePageStatusKey, reSelectRouteGroupKey, reTransferAmount, reTransferHashKey } from '@/stores';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ZeroAddress, parseEther, parseUnits } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAccount, useContractWrite, useNetwork, useSendTransaction } from 'wagmi';

export default function Send() {

    const { openConnectModal } = useConnectModal();

    const { totasWarning, totasSuccess } = useTotas();

    const { balance } = useBalance();

    const { address } = useAccount();
    const { chain } = useNetwork();

    const chains = useRecoilValue(reChains);

    const transferAmount = useRecoilValue(reTransferAmount);
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const { sendTransactionAsync } = useSendTransaction();

    const [decimals, setDecimals] = useState(0);
    const { switchChain } = useSwitchChain();

    const setTransferHashKey = useSetRecoilState(reTransferHashKey);
    const setPageStatusKey = useSetRecoilState(rePageStatusKey);



    const { writeAsync } = useContractWrite({
        abi: ERC20_ABI,
        address: selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "transfer"
    });


    const transfer = useCallback(
        async () => {

            if (selectRouteGroupKey) {

                const isStarknet = STARKNET_CHAIN.includes(selectRouteGroupKey.srcChain);

                if (address) {

                    if (String(chain?.id).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase()) {


                        let hash = "";
                        const total = parseUnits(transferAmount, decimals) + parseUnits(selectRouteGroupKey.withholdingFee, decimals) + parseUnits(selectRouteGroupKey.vc, "wei");
                        if (selectRouteGroupKey.srcToken === ZeroAddress) {
                            const res = await sendTransactionAsync({
                                to: selectRouteGroupKey.endpoint,
                                value: total
                            });

                            hash = res?.hash || "";

                        } else {
                            const res = await writeAsync(
                                {
                                    args: [
                                        selectRouteGroupKey.endpoint,
                                        total
                                    ]
                                }
                            );
                            hash = res?.hash || "";

                        }

                        setTransferHashKey(hash);

                        totasSuccess("Transfer Hash: " + hash);
                        setPageStatusKey(HISTORY_KEY);
                    } else {
                        totasWarning("Network mismatch");
                        if (!isNaN(Number(selectRouteGroupKey.srcChain))) {
                            switchChain(Number(selectRouteGroupKey.srcChain));
                        }
                    }

                } else {
                    totasWarning("Connect Wallet");
                    if (!isStarknet) {
                        openConnectModal && openConnectModal();
                    }
                }
            }

        },
        [selectRouteGroupKey, address, chain, totasSuccess, setPageStatusKey, setTransferHashKey, transferAmount, decimals, sendTransactionAsync, writeAsync, totasWarning, switchChain, openConnectModal],
    );


    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && chains.length) {
            const decimals = chains.find((item) => String(item?.chainId)?.toLocaleLowerCase() === selectRouteGroupKey?.srcChain?.toLocaleLowerCase())?.tokens?.find((option: any) =>
                String(option?.address) === selectRouteGroupKey?.srcToken?.toLocaleLowerCase()
            )?.decimals;
            setDecimals(decimals);
        }

    }, [selectRouteGroupKey, chains]);


    return (
        <div className='w-full mt-5'>
            <Button disabled={!(parseEther(transferAmount || "0") > 0) || !selectRouteGroupKey?.endpoint ||
                (Number(selectRouteGroupKey.maxAmt) < Number(transferAmount)) ||
                (Number(selectRouteGroupKey.minAmt) > Number(transferAmount)) ||
                (Number(balance) < Number(transferAmount))
            } className='w-full' onClick={(event) => {
                event.stopPropagation();
                if ((parseEther(transferAmount || "0") > 0) && !!selectRouteGroupKey?.endpoint) {
                    if ((Number(balance) >= Number(transferAmount))) {
                        if ((Number(selectRouteGroupKey.maxAmt) >= Number(transferAmount)) &&
                            (Number(selectRouteGroupKey.minAmt) <= Number(transferAmount))
                        ) {
                            transfer();
                        } else {
                            totasWarning("Balance Insufficient");
                        }
                    } else {
                        totasWarning("Amount out of range");
                    }

                }
            }}> Send </Button>
        </div>
    );
}
