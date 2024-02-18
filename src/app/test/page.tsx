"use client";


import { useAccount, useBalance, useConnect, useDisconnect } from '@starknet-react/core';
import React from 'react';

import Image from "next/image";
import useStarknetAccountInfo from '@/hooks/useStarknetAccountInfo';

export default function Page() {

  const { address: starknetAddress,
    data: starknetData,
    chain } = useStarknetAccountInfo();

  const { address } = useAccount();

  const { connectAsync, connectors } = useConnect();
  const { data } = useBalance({
    address
  });
  const { disconnectAsync } = useDisconnect();


  console.log("connectors", connectors, data);

  console.log("starknetAddress", starknetAddress, starknetData, chain);

  return (
    <div>
      {
        connectors.map((item, index) => <div className='flex' key={item.id} onClick={async (event) => {
          const res = await connectAsync({
            connector: item
          });

          console.log("connectAsync", res);

        }}>
          <Image className='mr-4' width={24} height={24} src={item?.icon?.dark || ""} alt={''} />
          {item?.name}</div>)
      }
      <div onClick={async (event) => {
        const res = await connectAsync({
          connector: connectors[0]
        });

        console.log("connectAsync", res);

      }}>connect</div>
      <div onClick={async (event) => {
        const res = await disconnectAsync();
      }}>disconnect</div>
      <div>{address}</div>
    </div>
  );
}
