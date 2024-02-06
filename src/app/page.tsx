"use client";

import { HISTORY_KEY, TRANSFER_KEY } from '@/constants';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Undo } from 'lucide-react';
import Proceed from '@/components/home/proceed';
import Transfer from '@/components/home/transfer';
import Dealer from '@/components/home/dealer';
import useCleanBridgeTransferState from '@/hooks/useCleanBridgeTransferState';
import { rePageStatusKey } from '@/stores';
import { useRecoilState } from 'recoil';

export default function Page() {

  const { cleanBridgeTransferState } = useCleanBridgeTransferState()

  const [pageStatusKey, setPageStatusKey] = useRecoilState(rePageStatusKey);

  return (
    <div className='w-full flex justify-center items-center mt-5'>
      <Card className="w-full max-w-lg min-w-80">
        <CardHeader >
          <div className='w-full flex justify-between items-center'>
            <CardTitle>Bridge</CardTitle>
            {pageStatusKey === HISTORY_KEY ? <Undo onClick={(event) => {
              event.stopPropagation();
              cleanBridgeTransferState()
              setPageStatusKey(TRANSFER_KEY);
            }} /> : null}
          </div>
          <CardDescription>
            <Dealer />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            {!!(pageStatusKey === HISTORY_KEY) ? <Proceed /> : <Transfer />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
