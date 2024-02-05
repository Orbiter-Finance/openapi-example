

"use client";
import { ReactNode, useEffect, useState } from "react";

import { chainsJson } from "@/constants/chainLink";
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet, bitgetWallet, metaMaskWallet, walletConnectWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, mainnet, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { reChains, reChainsWallet } from "@/stores";


const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID as string;

export function EvmProvider({ children }: { children: ReactNode; }) {

  const chainsGroup = useRecoilValue(reChains);
  const setChainsWallet = useSetRecoilState(reChainsWallet);
  

  const [chainList, setChainList] = useState([mainnet]);


  const { chains, publicClient } = configureChains(
    chainList,
    [
      publicProvider()
    ]
  );


  const connectors = connectorsForWallets([
    {
      groupName: 'Default',
      wallets: [
        metaMaskWallet({ projectId, chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
    {
      groupName: 'Wallets',
      wallets: [
        argentWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
        bitgetWallet({ projectId, chains }),
        rainbowWallet({ projectId, chains }),
      ],
    },
  ]);


  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  });


  useEffect(() => {
    if (chainsGroup) {
      const list = chainsJson.filter((item) => (chainsGroup || []).some((option: any) => (Number(option.chainId) === Number(item.chainId) || Number(option.networkId) === Number(item.chainId))) && !!item?.rpc?.length );
      const chainL = list.map((item, index) => {
        return ({
          blockExplorers: {
            default: {
              name: (item.explorers as any[] || [])[0]?.name,
              url: (item.explorers as any[] || [])[0]?.url,
            },
            etherscan: {
              name: (item.explorers as any[] || [])[0]?.name,
              url: (item.explorers as any[] || [])[0]?.url,
            }
          },
          contracts: {},
          fees: undefined,
          formatters: undefined,
          name: item.name,
          id: item.chainId,
          nativeCurrency: item.nativeCurrency,
          network: item.name,
          serializers: undefined,
          rpcUrls: {
            default: {
              http: item.rpc.filter((option)=> !option.includes("${"))
            },
            public: {
              http: item.rpc.filter((option)=> !option.includes("${"))
            }
          }
        })
      }) 

      if(chainL.length) {
        setChainList(chainL as any[]);
        setChainsWallet(chainL)
      }
    }

  }, [chainsGroup, setChainsWallet]);


  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider locale='en-US'
        modalSize="compact"
        chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};