"use client";

import { HISTORY_KEY, TRANSFER_KEY } from '@/constants';
import { rePageStatusKey, reRouterListSourceChainFilterKey, reRouterListSourceTokenFilterKey, reRouterListTargetChainFilterKey, reRouterListTargetTokenFilterKey, reSelectRouteGroupKey, reSelectRouteMakerKey, reSourceChainKey, reSourceTokenKey, reTargetChainKey, reTargetToeknKey, reTransferAmount } from '@/stores';
import React from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Undo } from 'lucide-react';
import Proceed from '@/components/home/proceed';
import Transfer from '@/components/home/transfer';

export default function Page() {

  const resetSelectRouteGroupKey = useResetRecoilState(reSelectRouteGroupKey);
  const resetSelectRouteMakerKey = useResetRecoilState(reSelectRouteMakerKey);
  const resetTransferAmount = useResetRecoilState(reTransferAmount);
  const resetSourceChainKey = useResetRecoilState(reSourceChainKey);
  const resetSourceTokenKey = useResetRecoilState(reSourceTokenKey);
  const resetTargetChainKey = useResetRecoilState(reTargetChainKey);
  const resetTargetToeknKey = useResetRecoilState(reTargetToeknKey);
  const resetRouterListSourceChainFilterKey = useResetRecoilState(reRouterListSourceChainFilterKey);
  const resetRouterListSourceTokenFilterKey = useResetRecoilState(reRouterListSourceTokenFilterKey);
  const resetRouterListTargetChainFilterKey = useResetRecoilState(reRouterListTargetChainFilterKey);
  const resetRouterListTargetTokenFilterKey = useResetRecoilState(reRouterListTargetTokenFilterKey);

  const [pageStatusKey, setPageStatusKey] = useRecoilState(rePageStatusKey);

  return (
    <div className='w-full flex justify-center items-center mt-5'>
      <Card className="w-full max-w-lg min-w-80">
        <CardHeader >
          <div className='w-full flex justify-between items-center'>
            <CardTitle>Bridge</CardTitle>
            {pageStatusKey === HISTORY_KEY ? <Undo onClick={(event) => {
              event.stopPropagation();
              setPageStatusKey(TRANSFER_KEY);
              resetSelectRouteGroupKey();
              resetSelectRouteMakerKey();
              resetSourceChainKey();
              resetSourceTokenKey();
              resetTargetChainKey();
              resetTargetToeknKey();
              resetTransferAmount();
              resetRouterListSourceChainFilterKey();
              resetRouterListSourceTokenFilterKey();
              resetRouterListTargetChainFilterKey();
              resetRouterListTargetTokenFilterKey();
            }} /> : null}
          </div>
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
