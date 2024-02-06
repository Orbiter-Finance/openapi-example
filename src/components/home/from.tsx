import { reChains, reSourceTokenKey, reSourceChainKey, reRouterListKey, reRouterListSourceChainFilterKey, reTargetToeknKey, reTargetChainKey, reRouterListSourceTokenFilterKey } from '@/stores';
import React, { useCallback, useEffect, useState } from 'react';
import OrbiterTransferCard from './orbiter-transfer-card';
import { IOrbiterSelectItemType } from '@/Models/commponets';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { IRoutersExtendsType } from '@/Models/chain';

export default function From() {

    const chains = useRecoilValue(reChains);

    const routerListKey = useRecoilValue(reRouterListKey);
    const [routerListSourceChainFilterKey, setRouterListSourceChainFilterKey] = useRecoilState(reRouterListSourceChainFilterKey);
    const setRouterListSourceTokenFilterKey = useSetRecoilState(reRouterListSourceTokenFilterKey);

    const resetSourceTokenKey = useResetRecoilState(reSourceTokenKey);
    const resetTargetChainKey = useResetRecoilState(reTargetChainKey);
    const resetTargetToeknKey = useResetRecoilState(reTargetToeknKey);

    const sourceChainKey = useRecoilValue(reSourceChainKey);

    const [tokenList, setTokenList] = useState<IOrbiterSelectItemType[]>([]);

    const [sourceList, setSourceList] = useState<IOrbiterSelectItemType[]>([]);


    const tokenChangeFilter = useCallback(
        (val: string) => {

            const list: IRoutersExtendsType[] = routerListSourceChainFilterKey.filter((item) => {
                return item.srcToken.toLocaleLowerCase() === val.toLocaleLowerCase();
            });

            setRouterListSourceTokenFilterKey(list);

        },
        [routerListSourceChainFilterKey, setRouterListSourceTokenFilterKey],
    );

    useEffect(() => {
        setSourceList(chains.map((item) => ({ label: item.name, value: item.chainId })));
    }, [chains]);

    useEffect(() => {

        if (routerListKey.length && !!sourceChainKey) {

            let list: IOrbiterSelectItemType[] = [];
            let filterList: IRoutersExtendsType[] = [];

            routerListKey.forEach((item) => {
                if (String(item.srcChain).toLocaleLowerCase() === sourceChainKey.toLocaleLowerCase()) {
                    const flag = list.some((option) => option.value.toLocaleLowerCase() === item.srcToken.toLocaleLowerCase());
                    if (!flag) {
                        list = list.concat([{
                            label: item.srcSymbol,
                            value: item.srcToken
                        }]);
                    }

                    filterList = filterList.concat([item]);

                }
            });

            setTokenList(list);
            setRouterListSourceChainFilterKey(filterList);
        }

    }, [sourceChainKey, routerListKey, setRouterListSourceChainFilterKey]);



    return (
        <div className='w-full'>
            <OrbiterTransferCard
                label='From'
                isFrom
                tokenAtomKey={reSourceTokenKey}
                tokenSelectList={tokenList}
                chainAtomKey={reSourceChainKey}
                chainSelectList={sourceList}
                chainHandleChangeCall={() => {
                    resetSourceTokenKey();
                    resetTargetChainKey();
                    resetTargetToeknKey();
                }}
                tokenHandleChangeCall={(val) => {
                    resetTargetChainKey();
                    resetTargetToeknKey();
                    tokenChangeFilter(val);
                }}
            />
        </div>
    );
}
