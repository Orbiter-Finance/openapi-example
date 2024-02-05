"use client";

import { useCallback, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { reChains, reRouterListKey} from '@/stores';
import { fetchChains, fetchRoutes } from '@/api';
import { useAccount, useChainId } from 'wagmi';
import { IRouters, IRoutersExtendsType } from '@/Models/chain';

export default function ReData() {

  const setChains = useSetRecoilState(reChains);
  const setRouterListKey = useSetRecoilState(reRouterListKey);

  const getData = useCallback(
    async () => {

      const res = await fetchChains();
      setChains(res || []);
    },
    [setChains],
  );


  const getRoutes = useCallback(
    async () => {

      const data = await fetchRoutes();

      let routerList: IRoutersExtendsType[] = data.map((item: IRouters) => {

        const line = item.line;

        const [_chain, coin] = line.split("-");

        const [sourceSymbol, targetSymbol] = coin.split("/");
        return ({
          ...item,
          srcSymbol: sourceSymbol,
          tgtSYmbol: targetSymbol
        })

      });

      setRouterListKey(routerList)
    },
    [setRouterListKey],
  );



  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      getData();
      getRoutes();
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  }, [getData, getRoutes]);

  return (
    null
  );
}
