"use client";

import React from 'react';
import { ModeToggleButton } from '@/components/ui/mode-toggle-btn';
import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function Header() {

  return (
    <header className="w-full px-2 lg:px-8 flex lg:space-x-10 h-20 border-b items-center">
      <label className="text-xl">
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
