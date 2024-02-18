"use client";

import React, { ReactNode } from 'react';

import { goerli, mainnet, sepolia } from "@starknet-react/chains";
import {
    StarknetConfig,
    publicProvider,
    argent,
    braavos,
    useInjectedConnectors,
    injected,
} from "@starknet-react/core";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID as string;

export default function StarknetProviders({ children }: { children: ReactNode; }) {

    const chains = [mainnet, goerli, sepolia];
    const provider = publicProvider();
    const { connectors } = useInjectedConnectors({
        // Show these connectors if the user has no connector installed.
        recommended: [argent(), braavos()],
        // Hide recommended connectors if the user has any connector installed.
        includeRecommended: "onlyIfNoConnectors",
        // Randomize the order of the connectors.
        order: "random",
      });

    return (
        <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
            {children}
        </StarknetConfig>
    );
}
