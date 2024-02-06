import { chainsJson } from '@/constants/chainLink';
import { reChains, reChainsWallet, reSourceChainKey, reSourceTokenKey } from '@/stores';
import { combiRaw } from '@/utils/combiRaw';
import { ZeroAddress, formatEther, formatUnits } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAccount } from 'wagmi';
import Web3, { HttpProvider } from 'web3';

export default function useAccountInfo() {

    const chains = useRecoilValue(reChains);
    const chainsWallet = useRecoilValue(reChainsWallet);

    const sourceChainKey = useRecoilValue(reSourceChainKey);
    const sourceTokenKey = useRecoilValue(reSourceTokenKey);

    const { address } = useAccount();

    const [balance, setBalance] = useState("0");
    const [nonce, setNonce] = useState("0");

    const getBalance = useCallback(
        async () => {
            if (address && chainsWallet.length && !!sourceChainKey && !!sourceTokenKey.value && !!chains.length) {

                try {

                    const group = chainsWallet.find((item) => String(item?.id).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());
                    const coinGroup = chains.find((item) => String(item?.chainId).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());

                    const decimals = coinGroup.tokens.find((item: any)=>String(item?.address).toLocaleLowerCase() ===  sourceTokenKey.value.toLocaleLowerCase() )?.decimals || 0

                    const web3 = new Web3(
                        group?.rpcUrls?.default?.http?.[0] || ""
                    );

                    let res: any = "";

                    if (sourceTokenKey.value === ZeroAddress) {
                        res = await web3.eth.getBalance(address as string);
                    } else {

                        const  result = await web3.eth.call({
                            from: address,
                            to: sourceTokenKey.value,
                            data: combiRaw("balanceOf(address)", [address])
                        });

                        res = web3.eth.abi.decodeParameters(
                            // 返回的参数类型
                            ["uint256"],
                            result || "")[0] || BigInt(0);

                    }

                    setBalance(formatUnits(res, decimals));
                } catch (error) {

                    setBalance("0");
                }
            }
        },
        [address, chainsWallet, sourceChainKey, sourceTokenKey.value, chains],
    );

    const getNoce = useCallback(
        async () => {
            if (address && chainsWallet.length && !!sourceChainKey) {

                try {

                    const group = chainsWallet.find((item) => String(item?.id).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());
                                const web3 = new Web3(
                        group?.rpcUrls?.default?.http?.[0] || ""
                    );

                    const n = await web3.eth.getTransactionCount(address, "pending")
                    setNonce(Number(formatEther(n)) === 0 ? "1" : formatUnits(n, "wei"))
                   
                } catch (error) {

                    setNonce("1")

                }
            }
        },
        [address, chainsWallet, sourceChainKey],
    );

    useEffect(() => {
        if (address && !!sourceChainKey && !!sourceTokenKey.value && chainsWallet.length && !!chains.length) {
            getBalance();
        }

    }, [address, getBalance, sourceTokenKey, sourceChainKey, chainsWallet, chains]);

    useEffect(() => {
        if (address && !!sourceChainKey) {
            getNoce();
        }

    }, [address, getNoce, sourceChainKey]);
    
    return ({
        balance,
        nonce
    });

}
