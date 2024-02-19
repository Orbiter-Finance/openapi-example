"use client";


import { useAccount, useBalance, useConnect, useDisconnect } from '@starknet-react/core';
import React from 'react';

import Image from "next/image";
import useStarknetAccountInfo from '@/hooks/useStarknetAccountInfo';
import useEvmAccountInfo from '@/hooks/useEvmAccountInfo';
import shortenAddress from '@/utils/shortenAddress';

export default function Page() {

  const { account, address: starknetAddress,
    data: starknetData,
    chain, nonce: starknetNonce } = useStarknetAccountInfo();

    const info = useEvmAccountInfo()

  const { connectAsync, connectors } = useConnect();

  const { disconnectAsync } = useDisconnect();


  console.log("starknetNonce", starknetNonce);
  console.log("account", account);
  console.log("info", info);
  console.log("connectors", connectors, starknetData);

  console.log("starknetAddress", starknetAddress, starknetData, chain);

  return (
    <div>
      <div onClick={async (event) => {
        const res = await disconnectAsync();
      }}>disconnect</div>
      <div>{starknetData?.formatted} {starknetData?.symbol}</div>
      <div>{shortenAddress(starknetAddress)}</div>
      <div>{starknetNonce}</div>
    </div>
  );
}
