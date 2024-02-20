import { reGlobalContractTransferDataVerifykey, reGlobalContractTransferToAddressStatusKey, reGlobalContractTransferToAddresskey, reGlobalContractTransferkey, reSelectRouteGroupKey, reTargetToeknKey } from '@/stores';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { STARKNET_CHAIN } from '@/constants';
import { Input } from '../ui/input';
import { useAccount } from 'wagmi';

export default function ContractTransferSwitch() {

    const { address } = useAccount();
    const targetTokenkey = useRecoilValue(reTargetToeknKey);

    const [globalContractTransferToAddresskey, setGlobalContractTransferToAddresskey] = useRecoilState(reGlobalContractTransferToAddresskey);
    const [globalContractTransferkey, setGlobalContractTransferkey] = useRecoilState(reGlobalContractTransferkey);
    const [globalContractTransferDataVerifykey, setGlobalContractTransferDataVerifykey] = useRecoilState(reGlobalContractTransferDataVerifykey);
    const [globalContractTransferToAddressStatusKey, setGlobalContractTransferToAddressStatusKey] = useRecoilState(reGlobalContractTransferToAddressStatusKey);
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    useEffect(() => {
        if (selectRouteGroupKey?.tgtChain) {

            if (STARKNET_CHAIN.includes(selectRouteGroupKey?.tgtChain) || STARKNET_CHAIN.includes(selectRouteGroupKey?.srcChain)) {
                setGlobalContractTransferkey(true);
            }
        }

    }, [selectRouteGroupKey, setGlobalContractTransferkey]);


    return (
        targetTokenkey?.value ? <>
            <div className='w-full mt-5' >
                <div className='w-full mt-2'>
                    <Label>Cross Chain Approach</Label>
                    <div className='w-full flex justify-between items-center border rounded px-4 py-2'>
                        <Label>EOA interaction / Contract interaction</Label>
                        <Switch
                            checked={globalContractTransferkey}
                            onCheckedChange={(checked) => {
                                if (!!STARKNET_CHAIN.includes(selectRouteGroupKey?.tgtChain) || !!STARKNET_CHAIN.includes(selectRouteGroupKey?.srcChain)) {
                                    setGlobalContractTransferkey(true);
                                } else {
                                    setGlobalContractTransferkey(checked);
                                }
                            }} />
                    </div>
                </div>
                <>
                    <div className='w-full mt-2'>
                        <Label>Security Code(VC)</Label>
                        <div className='w-full flex justify-between items-center border rounded px-4 py-2'>
                            <Label>Amount suffix / Calldata</Label>
                            <Switch
                                checked={globalContractTransferDataVerifykey}
                                onCheckedChange={(checked) => {
                                    setGlobalContractTransferDataVerifykey(checked);
                                }} />
                        </div>
                    </div>
                    <div className='w-full mt-2'>
                        <Label>Receiving address</Label>
                        <div className='w-full border rounded px-4 py-2'>
                            <div className='w-full flex justify-between items-center py-2'>
                                <Label>Source address / Custom receiving address</Label>
                                <Switch
                                    checked={globalContractTransferToAddressStatusKey}
                                    onCheckedChange={(checked) => {
                                        setGlobalContractTransferToAddressStatusKey(checked);
                                    }} />
                            </div>

                            {globalContractTransferToAddressStatusKey && <div className='w-full mt-1'>
                                <Input defaultValue={address} value={globalContractTransferToAddresskey} placeholder='Enter Address, default wallet address' onChange={(event) => {
                                    event.stopPropagation();
                                    const str = event.target.value.trim();
                                    setGlobalContractTransferToAddresskey(str);
                                }} />
                            </div>}
                        </div>
                    </div>

                </>

            </div>
        </> : null

    );
}
