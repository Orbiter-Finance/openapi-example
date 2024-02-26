import { ERC20_ABI, STARKNET_ERC20_ABI } from '@/abi/ERC20';
import { Orbiter_V3_ABI_EVM, Orbiter_V3_ABI_STARKNET } from '@/abi/evm';
import { reGlobalContractAddresskey, reSelectRouteGroupKey } from '@/stores';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useContractWrite as useStarknetContractWrite } from '@starknet-react/core';
import { zeroAddress } from 'viem';
import { useRecoilValue } from 'recoil';
import { useContractWrite } from 'wagmi';

export default function useTransfer() {

  const contractAddress = useRecoilValue(reGlobalContractAddresskey);
  const selectRouteGroupKey = useRecoilValue(reSelectRouteGroupKey);


  const { writeAsync: approve } = useContractWrite({
    abi: ERC20_ABI,
    address: selectRouteGroupKey?.srcToken && (selectRouteGroupKey?.srcToken !== zeroAddress) ? ethAddressUtils(selectRouteGroupKey?.srcToken || "") : ethAddressUtils(zeroAddress),
    functionName: "approve"
  });

  const { writeAsync: contractTransfer } = useContractWrite({
    abi: Orbiter_V3_ABI_EVM,
    address: contractAddress ? ethAddressUtils(contractAddress) : ethAddressUtils(zeroAddress),
    functionName: "transfer"
  });

  const { writeAsync: contractTransferToken } = useContractWrite({
    abi: Orbiter_V3_ABI_EVM,
    address: contractAddress ? ethAddressUtils(contractAddress) : ethAddressUtils(zeroAddress),
    functionName: "transferToken"
  });

  const { writeAsync: starknetApproveAndTransferToken } = useStarknetContractWrite({
    abis: [STARKNET_ERC20_ABI, Orbiter_V3_ABI_STARKNET],
    calls: [{
      contractAddress: selectRouteGroupKey?.srcToken || "",
      entrypoint: "approve",
      calldata: []
    }, {
      contractAddress: contractAddress || "",
      entrypoint: "transferERC20",
      calldata: []
    }],
  });

  const { writeAsync: starknetTransferToken } = useStarknetContractWrite({
    abis: [Orbiter_V3_ABI_STARKNET],
    calls: [{
      contractAddress: contractAddress || "",
      entrypoint: "transferERC20",
      calldata: []
    }],
  });


  return ({
    approve,
    contractTransfer,
    contractTransferToken,
    starknetApproveAndTransferToken,
    starknetTransferToken
  });
}
