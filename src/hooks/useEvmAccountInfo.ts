import { ResolveEVMWalletIcon } from '@/lib/wallet/evm/icon';
import { reChains, reChainsWallet, reSourceChainKey, reSourceTokenKey } from '@/stores';
import { formatEther, formatUnits } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAccount, useBalance, useDisconnect, useChainId, useChains } from 'wagmi';
import Web3 from 'web3';

export default function useEvmAccountInfo() {

  const chainsWallet = useRecoilValue(reChainsWallet);

  const sourceChainKey = useRecoilValue(reSourceChainKey);

  const { disconnectAsync } = useDisconnect()

  const { address, connector } = useAccount();
  const chainId = useChainId();
  const Chains = useChains();
  const balance = useBalance({address: "0x646592183ff25A0c44f09896A384004778F831ED"});

  const [nonce, setNonce] = useState("0");

  const getNoce = useCallback(
    async () => {
      if (address && chainsWallet.length && !!sourceChainKey) {

        try {

          const group = chainsWallet.find((item) => String(item?.id).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase());
          const web3 = new Web3(
            group?.rpcUrls?.default?.http?.[0] || ""
          );

          const n = await web3.eth.getTransactionCount(address, "pending");
          setNonce(Number(formatEther(n)) === 0 ? "1" : formatUnits(n, "wei"));

        } catch (error) {

          setNonce("1");

        }
      }
    },
    [address, chainsWallet, sourceChainKey],
  );


  useEffect(() => {
    if (address && !!sourceChainKey) {
      getNoce();
    }

  }, [address, getNoce, sourceChainKey]);

  return ({
    address,
    chainId, 
    balance,
    nonce,
    chainName: Chains.find((item)=> item.id === chainId)?.name || "",
    connector,
    icon: ResolveEVMWalletIcon({ connector: connector?.id || "" }),
    disconnectAsync
  });
}
