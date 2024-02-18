import { ERC20_ABI } from '@/abi/ERC20';
import { Button } from '@/components/ui/button';
import { HISTORY_KEY, STARKNET_CHAIN } from '@/constants';
import { ENTER_ETH_ADDRESS, ENTER_STARKNET_ADDRESS } from '@/constants/rule';
import useAccountInfo from '@/hooks/useAccountInfo';
import useSwitchChain from '@/hooks/useSwitchChain';
import useTotas from '@/hooks/useTotas';
import useTransfer from '@/hooks/useTransfer';
import { reChains, reGlobalContractAddresskey, reGlobalContractTransferDataVerifykey, reGlobalContractTransferToAddresskey, reGlobalContractTransferkey, rePageStatusKey, reSelectRouteGroupKey, reSourceChainKey, reTransferAmount, reTransferHashKey } from '@/stores';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ZeroAddress, parseEther, parseUnits } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useAccount, useContractRead, useContractWrite, useNetwork, useSendTransaction } from 'wagmi';
import Web3 from 'web3';

export default function Send() {

    const { openConnectModal } = useConnectModal();

    const { totasWarning, totasSuccess } = useTotas();

    const { balance } = useAccountInfo();

    const { address } = useAccount();
    const { chain } = useNetwork();

    const chains = useRecoilValue(reChains);
    const sourceChainKey = useRecoilValue(reSourceChainKey);

    const transferAmount = useRecoilValue(reTransferAmount);
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const { sendTransactionAsync } = useSendTransaction();

    const [timeHash, setTimeHash] = useState(0);

    const [decimals, setDecimals] = useState(0);
    const { approve, contractTransfer, contractTransferToken } = useTransfer();
    const [contractAddress, setContractAddress] = useRecoilState(reGlobalContractAddresskey);
    const { switchChain } = useSwitchChain();

    const globalContractTransferToAddresskey = useRecoilValue(reGlobalContractTransferToAddresskey);
    const globalContractTransferkey = useRecoilValue(reGlobalContractTransferkey);
    const globalContractTransferDataVerifykey = useRecoilValue(reGlobalContractTransferDataVerifykey);

    const setTransferHashKey = useSetRecoilState(reTransferHashKey);
    const setPageStatusKey = useSetRecoilState(rePageStatusKey);

    const { writeAsync } = useContractWrite({
        abi: ERC20_ABI,
        address: selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "transfer"
    });

    const result = useContractRead({
        abi: ERC20_ABI,
        address: !!selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "allowance",
        args: [address || "0x", contractAddress || "0x"]
    });


    const transfer = useCallback(
        async () => {

            if (selectRouteGroupKey) {

                const isStarknet = STARKNET_CHAIN.includes(selectRouteGroupKey.tgtChain);

                if (Number(selectRouteGroupKey.srcChain)) {

                    if (String(chain?.id).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase()) {

                        let addressN = globalContractTransferToAddresskey || address || "";

                        if (isStarknet || globalContractTransferkey) {

                            if (isStarknet) {
                                if (!ENTER_STARKNET_ADDRESS.test(addressN)) {
                                    totasWarning("To Address Not Address");
                                    return;
                                }
                            } else {
                                if (!ENTER_ETH_ADDRESS.test(addressN)) {
                                    totasWarning("To Address Not Address");
                                    return;
                                }
                            }

                            let total = parseUnits(transferAmount, decimals);
                            let data = ethAddressUtils("0x");


                            if (!!globalContractTransferDataVerifykey) {
                                data = ethAddressUtils(Web3.utils.stringToHex(`c=${selectRouteGroupKey.vc}&t=${addressN}`));
                            } else {
                                total += parseUnits(selectRouteGroupKey.vc, "wei");
                            }

                            let hash = "";

                            if (contractAddress) {


                                const group = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase())[0];

                                console.log("group", chains, group, selectRouteGroupKey)

                                if (group && (String(selectRouteGroupKey?.srcToken).toLocaleLowerCase() === String(group?.nativeCurrency?.address))) {

                                    const res = await contractTransfer({
                                        args: [
                                            selectRouteGroupKey.endpoint,
                                            data
                                        ],
                                        value: total
                                    });

                                    hash = res?.hash || "";

                                } else {

                                    if (!timeHash && ((result?.data || BigInt(0)) as any) < total) {
                                        console.log("contractAddress", timeHash, contractAddress);
                                        const res = await approve({
                                            args: [contractAddress, total]
                                        });

                                        setTimeHash(+new Date());

                                        return;
                                    }


                                    if (result?.error) {
                                        totasWarning("Allowance Error");
                                        return;
                                    }

                                    const res = await contractTransferToken({
                                        args: [
                                            selectRouteGroupKey.srcToken,
                                            selectRouteGroupKey.endpoint,
                                            total,
                                            data
                                        ]
                                    });
                                    hash = res?.hash || "";

                                }
                                setTimeHash(0);

                                setTransferHashKey(hash);

                                totasSuccess("Transfer Hash: " + hash);
                                setPageStatusKey(HISTORY_KEY);
                            } else {
                                totasWarning("Not Contract");
                            }


                        } else {

                            let hash = "";
                            const total = parseUnits(transferAmount, decimals) + parseUnits(selectRouteGroupKey.vc, "wei");

                            const group = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase())[0];

                            if (group && (String(selectRouteGroupKey?.srcToken).toLocaleLowerCase() === String(group?.nativeCurrency?.address))) {

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


                        }

                    } else {
                        totasWarning("Network mismatch");
                        if (!isNaN(Number(selectRouteGroupKey.srcChain))) {
                            switchChain(Number(selectRouteGroupKey.srcChain));
                        }
                    }
                }



            }

        },
        [selectRouteGroupKey, chain?.id, globalContractTransferToAddresskey, address, globalContractTransferkey, transferAmount, decimals, globalContractTransferDataVerifykey, contractAddress, totasWarning, setTransferHashKey, totasSuccess, setPageStatusKey, contractTransfer, timeHash, result?.data, result?.error, contractTransferToken, approve, chains, sendTransactionAsync, writeAsync, switchChain],
    );

    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && chains.length) {
            const decimals = chains.find((item) => String(item?.chainId)?.toLocaleLowerCase() === selectRouteGroupKey?.srcChain?.toLocaleLowerCase())?.tokens?.find((option: any) =>
                String(option?.address) === selectRouteGroupKey?.srcToken?.toLocaleLowerCase()
            )?.decimals;
            setDecimals(decimals);
        }
    }, [selectRouteGroupKey, chains]);

    useEffect(() => {
        if (!!sourceChainKey && !!chains.length) {
            const group = chains.filter((item) => item.chainId.toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase())?.[0];

            const contract = group?.contracts?.filter((item: any) => item?.name?.toLocaleLowerCase() === "OrbiterRouterV3".toLocaleLowerCase())?.[0];

            setContractAddress(contract?.address || "");

        }
    }, [chains, setContractAddress, sourceChainKey]);

    return (
        <div className='w-full mt-5'>
            <Button disabled={!(parseEther(transferAmount || "0") > 0) || !selectRouteGroupKey?.endpoint ||
                (Number(selectRouteGroupKey?.maxAmt) < Number(transferAmount)) ||
                (Number(selectRouteGroupKey?.minAmt) > Number(transferAmount)) ||
                ((Number(balance) < Number(transferAmount)) && !!address)
            } className='w-full' onClick={(event) => {
                event.stopPropagation();
                if (!!address) {
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
                } else {
                    totasWarning("Connect Wallet");
                    openConnectModal && openConnectModal();
                }
            }}> {
                    !!address ? (
                        (parseEther(transferAmount || "0") > 0) ? (
                            (Number(selectRouteGroupKey?.maxAmt) >= Number(transferAmount)) ? (
                                (Number(selectRouteGroupKey?.minAmt) <= Number(transferAmount)) ? (
                                    ((Number(balance) >= Number(transferAmount))) ? (
                                        "Send"
                                    ) : "Balance Insufficient"
                                ) : `Amount out of range, min: ${selectRouteGroupKey?.minAmt}`
                            ) : `Amount out of range, max: ${selectRouteGroupKey?.maxAmt}`
                        ) : "Enter Amount"
                    ) : "Connect Wallet"
                } </Button>
        </div>
    );
}
