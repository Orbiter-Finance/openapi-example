import { reGlobalContractTransferDataVerifykey, reGlobalContractTransferToAddresskey, reGlobalContractTransferkey, reSelectRouteGroupKey, reTargetToeknKey } from '@/stores';
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
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    useEffect(() => {
        if (selectRouteGroupKey?.tgtChain) {

            if (STARKNET_CHAIN.includes(selectRouteGroupKey?.tgtChain)) {
                setGlobalContractTransferkey(true);
            }
        }

    }, [selectRouteGroupKey, setGlobalContractTransferkey]);


    return (
        targetTokenkey?.value ? <>
            <div className='w-full mt-5' >
                <div className='w-full flex justify-between items-center'>
                    <Label>Contract Transfer</Label>
                    <Switch
                        checked={globalContractTransferkey}
                        onCheckedChange={(checked) => {
                            if (!!STARKNET_CHAIN.includes(selectRouteGroupKey?.tgtChain)) {
                                setGlobalContractTransferkey(true);
                            } else {
                                setGlobalContractTransferkey(checked);
                            }
                        }} />
                </div>
                <>
                    {
                        globalContractTransferkey && <>
                            <div className='w-full mt-2 flex justify-between items-center'>
                                <Label>Data Verify</Label>
                                <Switch
                                    checked={globalContractTransferDataVerifykey}
                                    onCheckedChange={(checked) => {

                                        setGlobalContractTransferDataVerifykey(checked);
                                    }} />
                            </div>
                            <div className='w-full mt-2'>
                                <Label>To Address</Label>
                                <Input defaultValue={address} value={globalContractTransferToAddresskey} placeholder='Enter Address, default wallet address' onChange={(event) => {
                                    event.stopPropagation();
                                    const str = event.target.value.trim();
                                    setGlobalContractTransferToAddresskey(str);
                                }} />
                            </div>
                        </>
                    }
                </>
            </div>
        </> : null

    );
}
