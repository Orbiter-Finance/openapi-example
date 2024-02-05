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

      let routerList: IRoutersExtendsType[] = []

      data.forEach((item: IRouters) => {

        const line = item.line;

        const [_chain, coin] = line.split("-");

        const [srcSymbol, tgtSYmbol] = coin.split("/");

        const endpoint = item.endpoint.toLocaleLowerCase()
        const srcChain = item.srcChain.toLocaleLowerCase()
        const srcToken = item.srcToken.toLocaleLowerCase()
        const tgtChain = item.tgtChain.toLocaleLowerCase()
        const tgtToken = item.tgtToken.toLocaleLowerCase()

        const flag = routerList.some((option)=>{
          const optionEndpoint = option.endpoint.toLocaleLowerCase()
          const optionSrcChain = option.srcChain.toLocaleLowerCase()
          const optionSrcToken = option.srcToken.toLocaleLowerCase()
          const optionTgtChain = option.tgtChain.toLocaleLowerCase()
          const optionTgtToken = option.tgtToken.toLocaleLowerCase()

          return (
            (endpoint === optionEndpoint) && (srcChain === optionSrcChain) &&
            (srcToken === optionSrcToken) && (tgtChain === optionTgtChain) &&
            (tgtToken === optionTgtToken)
          )
        })

        if(!flag) {
          routerList = routerList.concat([{
            ...item,
            srcSymbol,
            tgtSYmbol
          }])
        }

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
