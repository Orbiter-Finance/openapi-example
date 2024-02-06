import React, { useCallback, useEffect, useState } from 'react';
import OrbiterTransferCard from './orbiter-transfer-card';
import { reChains, reSourceTokenKey, reSourceChainKey, reTargetChainKey, reTargetToeknKey, reSelectRouteGroupKey, reSelectRouteMakerKey, reRouterListSourceTokenFilterKey, reRouterListTargetChainFilterKey, reRouterListTargetTokenFilterKey } from '@/stores';
import { IOrbiterSelectItemType } from '@/Models/commponets';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { IRoutersExtendsType } from '@/Models/chain';

export default function To() {

    const chains = useRecoilValue(reChains);

    const sourceChainKey = useRecoilValue(reSourceChainKey);
    const sourceTokenKey = useRecoilValue(reSourceTokenKey);
    const targetChainKey = useRecoilValue(reTargetChainKey);

    const setSelectRouteGroupKey = useSetRecoilState(reSelectRouteGroupKey);
    const setSelectRouteMakerKey = useSetRecoilState(reSelectRouteMakerKey);

    const routerListSourceTokenFilterKey = useRecoilValue(reRouterListSourceTokenFilterKey);
    const [routerListTargetChainFilterKey, setRouterListTargetChainFilterKey] = useRecoilState(reRouterListTargetChainFilterKey);
    const setRouterListTargetTokenFilterKey = useSetRecoilState(reRouterListTargetTokenFilterKey);

    const resetTargetToeknKey = useResetRecoilState(reTargetToeknKey);

    const [tokenList, setTokenList] = useState<IOrbiterSelectItemType[]>([]);

    const [targetList, setTargetList] = useState<IOrbiterSelectItemType[]>([]);

    const chainChangeFilter = useCallback(
        (val: string) => {

            const list: IRoutersExtendsType[] = routerListSourceTokenFilterKey.filter((item) => {
                return item.tgtChain.toLocaleLowerCase() === val.toLocaleLowerCase();
            });

            setRouterListTargetChainFilterKey(list);

        },
        [routerListSourceTokenFilterKey, setRouterListTargetChainFilterKey],
    );

    const tokenChangeFilter = useCallback(
        (val: string) => {

            const list: IRoutersExtendsType[] = routerListTargetChainFilterKey.filter((item) => {
                return item.tgtToken.toLocaleLowerCase() === val.toLocaleLowerCase();
            });

            setSelectRouteGroupKey(list[0] || {});
            setSelectRouteMakerKey(({
                label: list[0].endpoint || "",
                value: list[0].endpoint || ""
            }));

            setRouterListTargetTokenFilterKey(list);


        },
        [routerListTargetChainFilterKey, setRouterListTargetTokenFilterKey, setSelectRouteGroupKey, setSelectRouteMakerKey],
    );


    useEffect(() => {

        if (routerListSourceTokenFilterKey.length && !!sourceChainKey && !!sourceTokenKey.value) {

            let list: IOrbiterSelectItemType[] = [];

            routerListSourceTokenFilterKey.forEach((item) => {
                const tgtChain = String(item.tgtChain).toLocaleLowerCase();
                const flag = list.some((option) => option.value.toLocaleLowerCase() === tgtChain);

                const group = chains.find((option) => option.chainId.toLocaleLowerCase() === tgtChain);

                if (!flag) {
                    list = list.concat([{
                        label: group?.name || tgtChain,
                        value: item.tgtChain
                    }]);
                }
            });

            setTargetList(list);

        }

    }, [routerListSourceTokenFilterKey, sourceChainKey, sourceTokenKey, chains]);

    useEffect(() => {

        if (routerListTargetChainFilterKey.length && !!sourceChainKey && !!sourceTokenKey.value && !!targetChainKey) {

            let list: IOrbiterSelectItemType[] = [];

            routerListTargetChainFilterKey.forEach((item) => {
                const tgtChain = String(item.tgtChain).toLocaleLowerCase();


                const flag = list.some((option) => option.value.toLocaleLowerCase() === tgtChain);

                if (!flag) {
                    list = list.concat([{
                        label: item.tgtSYmbol,
                        value: item.tgtToken
                    }]);
                }
            });

            setTokenList(list);

        }

    }, [routerListTargetChainFilterKey, sourceChainKey, sourceTokenKey, chains, targetChainKey]);


    return (
        <div className='w-full'>
            <OrbiterTransferCard
                label={"To"}
                tokenAtomKey={reTargetToeknKey}
                tokenSelectList={tokenList}
                chainAtomKey={reTargetChainKey}
                chainSelectList={targetList}
                chainHandleChangeCall={(val) => {
                    resetTargetToeknKey();
                    chainChangeFilter(val);
                }}
                tokenHandleChangeCall={(val) => {
                    tokenChangeFilter(val);
                }}
            />
        </div>
    );
}
