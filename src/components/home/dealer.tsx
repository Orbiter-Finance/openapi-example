import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useRecoilState } from 'recoil';
import { reGlobalDealerKey } from '@/stores';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { isAddress } from 'viem';
import useTotas from '@/hooks/useTotas';
import { Trash2 } from 'lucide-react';
import useCleanBridgeTransferState from '@/hooks/useCleanBridgeTransferState';

export default function Dealer() {

    const { totasWarning } = useTotas();
    const { cleanBridgeTransferState } = useCleanBridgeTransferState()

    const [globalDealerKey, setGlobalDealerKey] = useRecoilState(reGlobalDealerKey);

    const [value, setValue] = useState("");
    const [show, setShow] = useState(false);

    return (
        <div className='w-full'>
            <Dialog open={show} onOpenChange={(open) => {
                setShow(open);
                if (open) {
                    setValue(globalDealerKey);
                } else {
                    setValue("");
                }
            }}>
                <div className='w-full flex justify-between items-center'>
                    <DialogTrigger className='flex-1' asChild>
                        <Button className='w-full block truncate' onClick={() => {

                        }}>{globalDealerKey ? globalDealerKey : "Add DealerId"}</Button>
                    </DialogTrigger>
                    {!!globalDealerKey && <Trash2 className='ml-2' onClick={(event)=>{
                        setGlobalDealerKey("")
                        cleanBridgeTransferState()
                    }} />}
                </div>
                <DialogContent className="w-full max-w-lg min-w-80">
                    <DialogHeader>
                        <DialogTitle>DealerId</DialogTitle>
                        <DialogDescription>
                            {"Match corresponding rules based on different \"DealerIds\""}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full">
                        <Label htmlFor="name" className="text-right">
                            Enter DealerId
                        </Label>
                        <Input id="name" defaultValue={globalDealerKey} value={value} className='mt-2' onChange={(event) => {
                            event.stopPropagation();
                            const str = event.target.value.trim();
                            setValue(str);

                        }} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={(event) => {
                            event.stopPropagation();
                            setShow(false);
                        }}>Cancel</Button>
                        <Button onClick={(event) => {
                            event.stopPropagation();
                            if (isAddress(value)) {
                                cleanBridgeTransferState()
                                setGlobalDealerKey(value);
                                setShow(false);
                            } else {
                                totasWarning("Not Address");
                            }
                        }}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
