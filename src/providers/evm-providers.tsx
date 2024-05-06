
"use client";
import { ReactNode, useEffect, useState } from "react";

import { chainsJson } from "@/constants/chainLink";
import { connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet, bitgetWallet, metaMaskWallet, walletConnectWallet, rainbowWallet, coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http, WagmiProvider } from "wagmi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { reChains, reChainsWallet } from "@/stores";
import { Chain, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID as string;

type IChainListType = [Chain, ...Chain[]];

export function EvmProvider({ children }: { children: ReactNode; }) {

  const chainsGroup = useRecoilValue(reChains);
  const setChainsWallet = useSetRecoilState(reChainsWallet);

  const [chainList, setChainList] = useState([mainnet]);
  const [transportsGroup, setTransportsGroup] = useState({ [mainnet.id]: http() });


  useEffect(() => {
    if (chainsGroup) {
      const list = chainsJson.filter((item) => (chainsGroup || []).some((option: any) => (Number(option.chainId) === Number(item.chainId) || Number(option.networkId) === Number(item.chainId))) && !!item?.rpc?.length);
      let transportsG: any = {};
      const chainL = list.map((item, index) => {
        transportsG = {
          ...transportsG,
          [Number(item.chainId)]: http()
        };
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
              http: item.rpc.filter((option) => !option.includes("${"))
            },
            public: {
              http: item.rpc.filter((option) => !option.includes("${"))
            }
          }
        });
      });

      if (chainL.length) {
        setChainList(chainL as any[]);
        setChainsWallet(chainL);
        setTransportsGroup(transportsG);
      }
    }

  }, [chainsGroup, setChainsWallet]);


  const queryClient = new QueryClient();

  const connectors = connectorsForWallets([
    {
      groupName: 'Default',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
       coinbaseWallet,
      ],
    },
    {
      groupName: 'Wallets',
      wallets: [
        argentWallet,
        trustWallet,
        bitgetWallet,
        rainbowWallet
      ],
    },
  ], {
    appName: "Orbiter-demo",
    projectId
  });

  const wagmiConfig = createConfig({
    connectors,
    chains: chainList as unknown as IChainListType,
    transports: transportsGroup,
    multiInjectedProviderDiscovery: false
  });

  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>

          <RainbowKitProvider locale='en-US'
            modalSize="compact">
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>

  );
};