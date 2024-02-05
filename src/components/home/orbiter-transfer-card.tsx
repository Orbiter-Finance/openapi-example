import { IOrbiterSelectItemType } from '@/Models/commponets';
import { OrbiterSelectGroup } from '@/components/orbiter-select';
import OrbiterSelectChain from '@/components/orbiter-select-chain';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { reSourceTokenKey } from '@/stores';
import React, { ReactNode } from 'react';
import { RecoilState, useRecoilValue } from 'recoil';

interface IOrbiterTransferCardType {

    label: string;

    tokenAtomKey: RecoilState<IOrbiterSelectItemType>,
    tokenSelectList: IOrbiterSelectItemType[],
    tokenHandleChangeCall?: (value: string) => void;

    chainAtomKey: RecoilState<string>,
    chainSelectList: IOrbiterSelectItemType[],
    chainHandleChangeCall?: (value: string) => void;

    isFrom?: boolean

}

export default function OrbiterTransferCard({
    isFrom,
    label,
    tokenAtomKey,
    tokenSelectList,
    tokenHandleChangeCall,
    chainAtomKey,
    chainSelectList,
    chainHandleChangeCall,
}: IOrbiterTransferCardType) {

    const chainAtomValue = useRecoilValue(chainAtomKey);
    const sourceTokenKey = useRecoilValue(reSourceTokenKey);

    return (
        <div className='w-full'>
            <div className="w-full">
                <div className="w-full flex justify-between items-cente">
                    <Label>{label}</Label>
                </div>
                <div className='w-full flex mt-1'>
                    <div className='w-2/3'>
                        <OrbiterSelectChain
                            disabled={!isFrom && !(sourceTokenKey.value)}
                            atomKey={chainAtomKey}
                            list={chainSelectList}
                            changeCall={(val) => {
                                chainHandleChangeCall && chainHandleChangeCall(val);
                            }}
                            placeholder='Source'
                        />
                    </div>
                    <div className='w-1/3'>
                        <OrbiterSelectGroup
                            disabled={!chainAtomValue}
                            atomKey={tokenAtomKey}
                            selectList={tokenSelectList}
                            placeholder={"Asset"}
                            changeCall={(val) => {
                                tokenHandleChangeCall && tokenHandleChangeCall(val);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
