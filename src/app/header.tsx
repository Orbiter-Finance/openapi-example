"use client";

import React from 'react';
import { ModeToggleButton } from '@/components/ui/mode-toggle-btn';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';
export default function Header() {

  const router = useRouter()

  return (
    <header className="w-full px-2 lg:px-8 flex lg:space-x-10 h-20 border-b items-center">
      <label className="text-xl" onClick={(event)=>{
        event.stopPropagation()
        router.replace("/")
      }}>
        <strong>Orbiter Finance</strong>
      </label>

      <div className="flex flex-1 items-center justify-end lg:space-x-4">
        <ConnectButton />
        <div className='ml-2'>

        <ModeToggleButton/>
        </div>
      </div>
    </header>
  );
}
