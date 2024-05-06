import { reChains, reChainsWallet, reSelectRouteGroupKey, reSourceChainKey, reSourceTokenKey } from '@/stores';
import { combiRaw } from '@/utils/combiRaw';
import { ZeroAddress, formatUnits } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Web3 from 'web3';
import useEvmAccountInfo from './useEvmAccountInfo';
import useStarknetAccountInfo from './useStarknetAccountInfo';
import { STARKNET_CHAIN } from '@/constants';
import { useContractRead } from '@starknet-react/core';
import { STARKNET_ERC20_ABI } from '@/abi/ERC20';

export default function useAccountInfo() {

    const chains = useRecoilValue(reChains);
    const chainsWallet = useRecoilValue(reChainsWallet);

    const sourceChainKey = useRecoilValue(reSourceChainKey);
    const sourceTokenKey = useRecoilValue(reSourceTokenKey);
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const EvmAccountInfo = useEvmAccountInfo()
    const StarknetAccountInfo = useStarknetAccountInfo()

    const [balance, setBalance] = useState("0");

    const { data } = useContractRead({
        address: selectRouteGroupKey.srcToken,
        abi: STARKNET_ERC20_ABI,
        functionName: 'balanceOf',
        args: [StarknetAccountInfo?.address || ''], // Provide a default value if address is undefined
        watch: true
      });

    const isStarknet =  STARKNET_CHAIN.includes(selectRouteGroupKey?.srcChain)


    const getBalance = useCallback(
        async () => {
            if (EvmAccountInfo?.address && chainsWallet.length && !!sourceChainKey && !!sourceTokenKey.value && !!chains.length) {

                try {

                    const group = chainsWallet.find((item) => String(item?.id).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());
                    const coinGroup = chains.find((item) => String(item?.chainId).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());

                    const decimals = coinGroup.tokens.find((item: any)=>String(item?.address).toLocaleLowerCase() ===  sourceTokenKey.value.toLocaleLowerCase() )?.decimals || 0


                    if(isStarknet) {

                        setBalance(formatUnits((data as any)?.balance?.low || "0", decimals))

                    } else {
                        const web3 = new Web3(
                            group?.rpcUrls?.default?.http?.[0] || ""
                        );
    
                        let res: any = "";
    
                        if (sourceTokenKey.value === ZeroAddress) {
                            res = await web3.eth.getBalance(EvmAccountInfo.address as string);
                        } else {
    
                            const  result = await web3.eth.call({
                                from: EvmAccountInfo.address,
                                to: sourceTokenKey.value,
                                data: combiRaw("balanceOf(address)", [EvmAccountInfo.address])
                            });
    
                            res = web3.eth.abi.decodeParameters(
                                ["uint256"],
                                result || "")[0] || BigInt(0);
    
                        }
    
                        setBalance(formatUnits(res, decimals));
                    }

                    
                } catch (error) {

                    setBalance("0");
                }
            }
        },
        [EvmAccountInfo, data, chainsWallet, sourceChainKey, sourceTokenKey.value, chains],
    );

    useEffect(() => {
        if (EvmAccountInfo?.address && !!sourceChainKey && !!sourceTokenKey.value && chainsWallet.length && !!chains.length) {
            getBalance();
        }

    }, [EvmAccountInfo, getBalance, sourceTokenKey, sourceChainKey, chainsWallet, chains]);
    
    return ({
        balance,
        nonce: isStarknet ? StarknetAccountInfo.nonce : EvmAccountInfo.nonce
    });

}
