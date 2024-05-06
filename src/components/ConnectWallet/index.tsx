import { Wallet2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ResolveEVMWalletIcon } from '@/lib/wallet/evm/icon';
import { ResolveStarknetWalletIcon } from '@/lib/wallet/starknet/icon';
import useEvmAccountInfo from '@/hooks/useEvmAccountInfo';
import useStarknetAccountInfo from '@/hooks/useStarknetAccountInfo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import Image from "next/image";
import { useConnect } from '@starknet-react/core';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { reGlobalStarknetWalletDialog, reGlobalStarknetWalletId } from '@/stores/wallet';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import shortenAddress from '@/utils/shortenAddress';
import { decimalNum } from '@/utils/decimalNum';
import { Badge } from '../ui/badge';


export default function ConnectWallet() {

  const { openConnectModal } = useConnectModal();

  const { connectAsync, connectors } = useConnect();

  const EvmAccountInfo = useEvmAccountInfo();
  const starknetAccountInfo = useStarknetAccountInfo();
  const [starknetWalletId, setStarknetWalletId] = useRecoilState(reGlobalStarknetWalletId);

  const [show, setShow] = useRecoilState(reGlobalStarknetWalletDialog);

  const [walletOpen, setWalletOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (<div>

    <DropdownMenu open={walletOpen} onOpenChange={(open) => {

      if (open) {
        if (!!starknetWalletId || !!EvmAccountInfo.connector?.id) {
          setInfoOpen(true);
        } else {
          setWalletOpen(open);
        }
      } else {
        setWalletOpen(open);
      }

    }}>
      <DropdownMenuTrigger asChild>
        <div className='flex justify-center items-center border px-2 py-2 rounded-2xl'>
        {(!!starknetWalletId || !!EvmAccountInfo.connector?.id) ?
          <div className='flex'>
            {!!EvmAccountInfo.connector?.id && <div className='flex justify-center items-center w-6 h-6 mx-0.5'><EvmAccountInfo.icon /></div>}
            {!!starknetWalletId && <div className='flex justify-center items-center w-6 h-6 mx-0.5'><starknetAccountInfo.icon /></div>}
          </div>
          : <Wallet2Icon />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={(event) => {
          event.stopPropagation();
          openConnectModal && openConnectModal();
        }}>EVM</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(event) => {
          event.stopPropagation();
          setShow(true);
        }}>Starknet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={show} onOpenChange={(open) => {
      setShow(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div>
          {
            connectors.map((item) => <div className='flex justify-between items-center border rounded mt-2 p-2' key={item.id} onClick={async (event) => {
              const res = await connectAsync({
                connector: item
              });

              setStarknetWalletId(item.id);
              setShow(false);

            }}>
              <Image className='mr-4' width={24} height={24} src={item?.icon?.light || ""} alt={''} />
              {item?.name}</div>)
          }
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={infoOpen} onOpenChange={(open) => {
      setInfoOpen(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wallet</DialogTitle>
        </DialogHeader>
        <div>
          {EvmAccountInfo.address &&
            <div className='w-full border rounded p-2 mb-4' >
              <div className="flex justify-between item-center">
                <div className='font-bold flex items-center'>
                <div className='flex justify-center items-center w-6 h-6 mr-2'><EvmAccountInfo.icon /></div>
                  {shortenAddress(EvmAccountInfo.address)}
                </div>
                <div>{decimalNum(EvmAccountInfo?.balance?.data?.formatted, 8)} {EvmAccountInfo?.balance?.data?.symbol}</div>
              </div>
              <div className="flex justify-between item-center mt-1">
                <div>{EvmAccountInfo.chainName}</div>
                <Badge variant="outline" className='text-blue-500 cursor-pointer' onClick={async (event) => {
                  event.stopPropagation();
                  const res = await EvmAccountInfo.disconnectAsync();
                  setInfoOpen(false);
                }}>disconnect</Badge>
              </div>
            </div>
          }
          {
            (starknetAccountInfo?.address &&
              <div className='w-full mb-4 border rounded p-2'>
                <div className="flex justify-between item-center">

                  <div className='font-bold flex items-center'>
                  <div className='flex justify-center items-center w-6 h-6 mr-2'><starknetAccountInfo.icon /></div>
                    {shortenAddress(starknetAccountInfo.address)}
                  </div>
                  <div>{decimalNum(starknetAccountInfo?.balance?.data?.formatted, 8)} {starknetAccountInfo?.balance?.data?.symbol}</div>
                </div>
                <div className="flex justify-between item-center mt-1">

                  <div>{starknetAccountInfo.chain?.name}</div>
                  <Badge variant="outline" className='text-blue-500 cursor-pointer' onClick={async (event) => {
                    event.stopPropagation();
                    const res = await starknetAccountInfo.disconnectAsync();

                    setInfoOpen(false);
                    setStarknetWalletId("");
                  }}>disconnect</Badge>
                </div>
              </div>)
          }
          {
            (!EvmAccountInfo?.address || !starknetAccountInfo?.address) && <Button 
            onClick={(event) => {
              event.stopPropagation();
              if (!EvmAccountInfo?.address) {

                openConnectModal && openConnectModal();
              } else {
                setInfoOpen(false);
                setShow(true);
              }
            }}>Link a new Wallet</Button>
          }
        </div>
      </DialogContent>
    </Dialog>
  </div>
  );
}
