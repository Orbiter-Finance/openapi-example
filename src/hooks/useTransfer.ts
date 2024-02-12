import { ERC20_ABI } from '@/abi/ERC20';
import { Orbiter_V3_ABI_EVM } from '@/abi/evm';
import { reGlobalContractAddresskey, reSelectRouteGroupKey } from '@/stores';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { ZeroAddress } from 'ethers';
import { useRecoilValue } from 'recoil';
import { useContractWrite } from 'wagmi';

export default function useTransfer() {

    const contractAddress = useRecoilValue(reGlobalContractAddresskey)
    const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);


    const { writeAsync: approve } = useContractWrite({
        abi: ERC20_ABI,
        address: selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== ZeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(ZeroAddress),
        functionName: "approve"
    });

    const { writeAsync: contractTransfer } = useContractWrite({
        abi: Orbiter_V3_ABI_EVM,
        address: contractAddress ? ethAddressUtils(contractAddress) : ethAddressUtils(ZeroAddress),
        functionName: "transfer"
    });

    const { writeAsync: contractTransferToken } = useContractWrite({
        abi: Orbiter_V3_ABI_EVM,
        address: contractAddress ? ethAddressUtils(contractAddress) : ethAddressUtils(ZeroAddress),
        functionName: "transferToken"
    });
  return ({
    approve,
    contractTransfer,
    contractTransferToken
  })
}
