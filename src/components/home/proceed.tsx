import { fetchTransactionStatus } from '@/api';
import { Label } from '@/components/ui/label';
import { reChains, reSelectRouteGroupKey, reTransferAmount, reTransferHashKey } from '@/stores';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function Proceed() {

  const chains = useRecoilValue(reChains);

  const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);
  const transferAmount = useRecoilValue(reTransferAmount);
  const transferHashKey = useRecoilValue(reTransferHashKey);

  const [time, setTime] = useState(0);

  const [data, setData] = useState<any>({});

  const getData = useCallback(
    async () => {
      const res = await fetchTransactionStatus(transferHashKey.toLocaleLowerCase());

      if ((Number(res?.status) !== 3) && (Number(res?.opStatus) !== 97) && (Number(res?.opStatus) !== 99)) {
        setTimeout(() => {
          setTime(+new Date());
        }, 3000);
      }

      setData(res);

    },
    [transferHashKey],
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      getData();
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [getData, transferHashKey, time]);

  const sourceChainName = chains?.find((item) => String(item?.chainId).toLocaleLowerCase() === String(selectRouteGroupKey?.srcChain))?.name;
  const targetChainName = chains?.find((item) => String(item?.chainId).toLocaleLowerCase() === String(selectRouteGroupKey?.tgtChain))?.name;

  return (
    <div className='w-full'>
      <div>
        <Label>Amount: {transferAmount} {selectRouteGroupKey?.srcSymbol}</Label>
      </div>
      <div className='w-full mt-8'>
        <Label>From {sourceChainName}</Label>
        <div className='w-full flex mt-2 justify-between items-center'>
          <Label>Status: </Label>
          <div>{
            Number(data?.status) !== 2 ? <div> {
              Number(data?.status) === 3 ? "Faild" : "Pending..."
            }</div> : "Success"
          }</div>

        </div>
        <div className='w-full flex mt-4 justify-between items-center'>
          <Label>Tx: </Label>
          <div className='truncate'>{transferHashKey}</div>
        </div>
      </div>

      <div className='w-full mt-8'>
        <Label>To {targetChainName} {selectRouteGroupKey?.tgtSYmbol}</Label>
        <div className='w-full flex mt-2 justify-between items-center'>
          <Label>Status: </Label>
          <div className=''>{
            Number(data?.status) === 2 ? (
              Number(data?.opStatus) === 97 ? "Faild" : (
                Number(data?.opStatus) === 99 ? "Success" : "Pending..."
              )
            ) : ""
          }</div>
        </div>
        <div className='w-full flex mt-4 justify-between items-center'>
          <Label>Tx: </Label>
          <div className='truncate'>{data?.targetId}</div>
        </div>
      </div>
    </div>
  );
}
