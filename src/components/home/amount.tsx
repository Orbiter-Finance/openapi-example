import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ENTER_NUMBER_RULE, ENTER_NUMBER_RULE2 } from '@/constants/rule';
import useAccountInfo from '@/hooks/useAccountInfo';
import { reChains, reGlobalContractTransferDataVerifykey, reSelectRouteGroupKey, reTransferAmount } from '@/stores';
import { decimalNum } from '@/utils/decimalNum';
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

export default function Amount() {

    const chains = useRecoilValue(reChains);

    const { balance, nonce } = useAccountInfo();

    const [value, setValue] = useRecoilState(reTransferAmount);

    const globalContractTransferDataVerifykey = useRecoilValue(reGlobalContractTransferDataVerifykey)

    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);

    const [decimals, setDecimals] = useState(0);

    const [group, setGroup] = useState({
        total: "",
        receive: ""
    });

    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && !!value && !!decimals && (parseEther(value || "0") >= parseEther(selectRouteGroupKey?.minAmt || "1")) ) {

            const total = parseUnits(value, decimals) + parseUnits( 
                globalContractTransferDataVerifykey ? "0" : selectRouteGroupKey.vc, 1)

                const transferAmount = parseEther(value) - parseUnits(selectRouteGroupKey.withholdingFee || "0", decimals)
            const receive = transferAmount - transferAmount * parseEther(selectRouteGroupKey.tradeFee) / parseEther("1000000") +  parseUnits( nonce, 1)

            setGroup({
                total: formatUnits(total, decimals),
                receive: formatEther(receive)
            })
        } else {
            setGroup({
                total: "",
                receive: ""
            })
        }
    }, [selectRouteGroupKey, value, decimals, nonce, globalContractTransferDataVerifykey]);

    useEffect(() => {
        if (selectRouteGroupKey?.endpoint && !!chains.length) {

            const tokens =  chains.find((item) => String(item?.chainId)?.toLocaleLowerCase() === selectRouteGroupKey?.srcChain?.toLocaleLowerCase())?.tokens

            const decimals = tokens.find((option: any) =>
                String(option?.address).toLocaleLowerCase() === selectRouteGroupKey?.srcToken?.toLocaleLowerCase()
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
                        parseEther(selectRouteGroupKey.tradeFee) / parseUnits("100", 1)
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
