import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ENTER_NUMBER_RULE, ENTER_NUMBER_RULE2 } from '@/constants/rule';
import useBalance from '@/hooks/useBalance';
import { reChains, reSelectRouteGroupKey, reTransferAmount } from '@/stores';
import { decimalNum } from '@/utils/decimalNum';
import { formatEther, formatUnits, parseEther, parseUnits } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function Amount() {

    const chains = useRecoilValue(reChains);

    const { balance } = useBalance();

    const [value, setValue] = useRecoilState(reTransferAmount);

    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const [decimals, setDecimals] = useState(0);

    const [group, setGroup] = useState({
        total: "",
        receive: ""
    });

    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && !!value && !!decimals) {

            const total = parseUnits(value, decimals) + parseUnits(selectRouteGroupKey.withholdingFee, decimals) + parseUnits( selectRouteGroupKey.vc, "wei")
            const receive = parseEther(value) - parseEther(value) * parseEther(selectRouteGroupKey.tradeFee) / parseEther("1000000") +  parseUnits( selectRouteGroupKey.vc, "wei")

            setGroup({
                total: formatUnits(total, decimals),
                receive: formatEther(receive)
            })
        }
    }, [selectRouteGroupKey, value, decimals]);

    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && chains.length) {
            const decimals = chains.find((item) => String(item?.chainId)?.toLocaleLowerCase() === selectRouteGroupKey?.srcChain?.toLocaleLowerCase())?.tokens?.find((option: any) =>
                String(option?.address) === selectRouteGroupKey?.srcToken?.toLocaleLowerCase()
            )?.decimals;
            setDecimals(decimals);
        }

    }, [selectRouteGroupKey, chains]);


    return (
        <div className='w-full'>
            <div className='w-full mt-5'>
                <div className='w-full flex justify-between items-center'>

                    <Label>Amount</Label>
                    <div>{decimalNum(balance, 8) || "-"}</div>
                </div>
                <Input value={value}
                    onChange={(event) => {
                        const val = event.target.value.trim();
                        if ((decimals > 6 ? ENTER_NUMBER_RULE2 : ENTER_NUMBER_RULE).test(val)) {
                            setValue(val);
                        }
                    }}
                    className='text-right mt-1' placeholder={selectRouteGroupKey.minAmt && selectRouteGroupKey.maxAmt ? `${selectRouteGroupKey.minAmt} - ${selectRouteGroupKey.maxAmt}` : '0.0'} />
            </div>
            <div className='mt-5 border rounded'>
                <div className="px-4 py-2 w-full text-sm flex justify-between items-center ">
                    <div>Withholding Fee</div>
                    <div>{selectRouteGroupKey?.withholdingFee ? 
                    `${selectRouteGroupKey?.withholdingFee} ${selectRouteGroupKey?.srcSymbol}` :
                    "-"}</div>
                </div>
                <div className="px-4 py-2 w-full text-sm flex justify-between items-center ">
                    <div>Identification Code</div>
                    <div>{selectRouteGroupKey?.vc || "-"}</div>
                </div>
                <div className="px-4 py-2 w-full text-sm flex justify-between items-center ">
                    <div>TradingFee Code</div>
                    <div>{selectRouteGroupKey?.tradeFee ? formatEther(
                        parseEther(selectRouteGroupKey.tradeFee) / parseUnits("100", "wei")
                    ) + " ‱" : "-"}</div>
                </div>
                <div className="px-4 py-2 w-full text-sm flex justify-between items-center ">
                    <div>Total Send</div>
                    <div>{group.total || "-"}</div>
                </div>
                <div className="px-4 py-2 w-full text-sm flex justify-between items-center ">
                    <div>Received</div>
                    <div>{group.receive || "-"}</div>
                </div>
            </div>

        </div>
    );
}
