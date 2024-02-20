import { ERC20_ABI, STARKNET_ERC20_ABI } from '@/abi/ERC20';
import { Button } from '@/components/ui/button';
import { HISTORY_KEY, STARKNET_CHAIN } from '@/constants';
import { ENTER_ETH_ADDRESS, ENTER_STARKNET_ADDRESS } from '@/constants/rule';
import useAccountInfo from '@/hooks/useAccountInfo';
import useEvmAccountInfo from '@/hooks/useEvmAccountInfo';
import useStarknetAccountInfo from '@/hooks/useStarknetAccountInfo';
import useSwitchChain from '@/hooks/useSwitchChain';
import useTotas from '@/hooks/useTotas';
import useTransfer from '@/hooks/useTransfer';
import { reChains, reGlobalContractAddresskey, reGlobalContractTransferDataVerifykey, reGlobalContractTransferToAddresskey, reGlobalContractTransferkey, rePageStatusKey, reSelectRouteGroupKey, reSourceChainKey, reTransferAmount, reTransferHashKey } from '@/stores';
import { reGlobalStarknetWalletDialog } from '@/stores/wallet';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useContractRead as useStarknetContractRead } from '@starknet-react/core';
import { ZeroAddress, parseEther, parseUnits } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useAccount, useContractRead, useContractWrite, useNetwork, useSendTransaction } from 'wagmi';
import Web3 from 'web3';

export default function Send() {

    const { openConnectModal } = useConnectModal();

    const { totasWarning, totasSuccess } = useTotas();

    const { balance } = useAccountInfo();

    const StarknetAccountInfo = useStarknetAccountInfo();
    const EvmAccountInfo = useEvmAccountInfo();

    const chains = useRecoilValue(reChains);
    const sourceChainKey = useRecoilValue(reSourceChainKey);

    const transferAmount = useRecoilValue(reTransferAmount);
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const { sendTransactionAsync } = useSendTransaction();

    const [timeHash, setTimeHash] = useState(0);

    const [decimals, setDecimals] = useState(0);
    const { approve, contractTransfer, contractTransferToken, starknetApprove, starknetTransferToken } = useTransfer();
    const [contractAddress, setContractAddress] = useRecoilState(reGlobalContractAddresskey);
    const { switchChain } = useSwitchChain();

    const globalContractTransferToAddresskey = useRecoilValue(reGlobalContractTransferToAddresskey);
    const globalContractTransferkey = useRecoilValue(reGlobalContractTransferkey);
    const globalContractTransferDataVerifykey = useRecoilValue(reGlobalContractTransferDataVerifykey);

    const setTransferHashKey = useSetRecoilState(reTransferHashKey);
    const setPageStatusKey = useSetRecoilState(rePageStatusKey);

    const setGlobalStarknetWalletDialog = useSetRecoilState(reGlobalStarknetWalletDialog);

    const { writeAsync } = useContractWrite({
        abi: ERC20_ABI,
        address: selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "transfer"
    });

    const result = useContractRead({
        abi: ERC20_ABI,
        address: !!selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "allowance",
        args: [EvmAccountInfo.address || "", contractAddress || ""]
    });

    const starknetResult = useStarknetContractRead({
        abi: STARKNET_ERC20_ABI,
        address: selectRouteGroupKey?.srcToken || "",
        functionName: "allowance",
        args: [StarknetAccountInfo.address || "", contractAddress || ""]
    });

    const transfer = useCallback(
        async () => {


            if (selectRouteGroupKey) {

                const isStarknet = STARKNET_CHAIN.includes(selectRouteGroupKey.tgtChain) || STARKNET_CHAIN.includes(selectRouteGroupKey.srcChain);

                const addressN = globalContractTransferToAddresskey || EvmAccountInfo.address || "";

                let total = parseUnits(transferAmount, decimals);
                let data = ethAddressUtils("0x");


                if (!!globalContractTransferDataVerifykey) {
                    data = ethAddressUtils(Web3.utils.stringToHex(`c=${selectRouteGroupKey.vc}&t=${addressN}`));
                } else {
                    total += parseUnits(selectRouteGroupKey.vc, "wei");
                }

                let hash = "";

                if (contractAddress) {

                    if (Number(selectRouteGroupKey.srcChain)) {

                        if (String(EvmAccountInfo.chain?.id).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase()) {

                            if (isStarknet || globalContractTransferkey) {

                                if (isStarknet) {
                                    if (!ENTER_STARKNET_ADDRESS.test(addressN)) {
                                        totasWarning("To Address Not Starknet Address");
                                        return;
                                    }
                                } else {
                                    if (!ENTER_ETH_ADDRESS.test(addressN)) {
                                        totasWarning("To Address Not Address");
                                        return;
                                    }
                                }

                                const group = chains.filter((item) => String(item.chainId).toLocaleLowerCase() === String(selectRouteGroupKey.srcChain).toLocaleLowerCase())[0];

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
                    } else {

                        if (isStarknet) {
                            if (StarknetAccountInfo.chain?.network?.toLocaleLowerCase() === "mainnet") {

                                if (!timeHash && (((starknetResult?.data as any)?.remaining?.low || BigInt(0)) as any) < total) {
                                    console.log("contractAddress", timeHash, contractAddress);
                                    const res = await starknetApprove({
                                        calls: [{
                                            contractAddress: selectRouteGroupKey.srcToken,
                                            calldata: [contractAddress, total],
                                            entrypoint: "approve"
                                        }]
                                    });

                                    setTimeHash(+new Date());

                                    return;
                                } else {

                                    const res = await starknetTransferToken({
                                        calls: [{
                                            contractAddress,
                                            calldata: [
                                                selectRouteGroupKey.srcToken,
                                                selectRouteGroupKey.endpoint,
                                                total,
                                                data
                                            ],
                                            entrypoint: "transferERC20"
                                        }]
                                    });
                                    hash = res?.transaction_hash || "";

                                    setTimeHash(0);

                                    setTransferHashKey(hash);

                                    totasSuccess("Transfer Hash: " + hash);
                                    setPageStatusKey(HISTORY_KEY);
                                }
                            } else {
                                totasWarning("Network mismatch, Please switch Starknet Network");
                            }
                        }
                    }

                } else {
                    totasWarning("Not Contract");
                }

            }

        },
        [selectRouteGroupKey, globalContractTransferToAddresskey, EvmAccountInfo, transferAmount, decimals, globalContractTransferDataVerifykey, contractAddress, globalContractTransferkey, chains, setTransferHashKey, totasSuccess, setPageStatusKey, totasWarning, contractTransfer, timeHash, result, contractTransferToken, approve, sendTransactionAsync, writeAsync, switchChain, StarknetAccountInfo, starknetResult, starknetApprove, starknetTransferToken],
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

            const contract = group?.contracts?.filter((item: any) =>
                item?.name?.toLocaleLowerCase() === "OrbiterRouterV3".toLocaleLowerCase() ||
                (item?.name?.toLocaleLowerCase() === "StarknetOrbiterRouter".toLocaleLowerCase())

            )?.[0];

            setContractAddress(contract?.address || "");

        }
    }, [chains, setContractAddress, sourceChainKey]);

    const isStarknet = STARKNET_CHAIN.includes(selectRouteGroupKey.srcChain);

    return (
        <div className='w-full mt-5'>
            <Button disabled={ (isStarknet ? !!StarknetAccountInfo.address : !!EvmAccountInfo.address) ? !(parseEther(transferAmount || "0") > 0) || !selectRouteGroupKey?.endpoint ||
                (Number(selectRouteGroupKey?.maxAmt) < Number(transferAmount)) ||
                (Number(selectRouteGroupKey?.minAmt) > Number(transferAmount)) ||
                (Number(balance) < Number(transferAmount)) : false
            } className='w-full' onClick={(event) => {
                event.stopPropagation();
                if (isStarknet ? !!StarknetAccountInfo.address : !!EvmAccountInfo.address) {
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
                    if (isStarknet) {
                        setGlobalStarknetWalletDialog(true);
                    } else {
                        openConnectModal && openConnectModal();
                    }
                }
            }}> {
                    (isStarknet ? !!StarknetAccountInfo.address : !!EvmAccountInfo.address) ? (
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
