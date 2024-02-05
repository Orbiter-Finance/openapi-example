import { IRoutersExtendsType } from '@/Models/chain';
import { OrbiterSelectGroup } from '@/components/orbiter-select';
import { Label } from '@/components/ui/label';
import { reRouterListTargetTokenFilterKey, reSelectRouteGroupKey, reSelectRouteMakerKey, reTargetToeknKey } from '@/stores';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function MakerRouter() {

    
    const targetTokenkey = useRecoilValue(reTargetToeknKey)
    const routerListTargetTokenFilterKey = useRecoilValue(reRouterListTargetTokenFilterKey)
    const setSelectRouteGroupKey = useSetRecoilState(reSelectRouteGroupKey);


    return (
        targetTokenkey.value ?  <div className='w-full mt-5'>
            <Label>Maker Router</Label>
            <OrbiterSelectGroup
                atomKey={reSelectRouteMakerKey}
                selectList={!targetTokenkey.value ? [] : routerListTargetTokenFilterKey.map((item)=>({
                    label: item.endpoint,
                    value: item.endpoint,
                }))}
                placeholder={"Router"}
                changeCall={(val) => {
                    const group = routerListTargetTokenFilterKey.find((item)=> item.endpoint.toLocaleLowerCase() === val.toLocaleLowerCase())
                    console.log(group, '--group')
                    setSelectRouteGroupKey((group || {}) as IRoutersExtendsType)
                }}
            />
        </div> : null 
    );
}
