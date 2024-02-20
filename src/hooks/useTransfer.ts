import { ERC20_ABI, STARKNET_ERC20_ABI } from '@/abi/ERC20';
import { Orbiter_V3_ABI_EVM, Orbiter_V3_ABI_STARKNET } from '@/abi/evm';
import { reGlobalContractAddresskey, reSelectRouteGroupKey } from '@/stores';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useContractWrite as useStarknetContractWrite } from '@starknet-react/core';
import { ZeroAddress } from 'ethers';
import { useRecoilValue } from 'recoil';
import { useContractWrite } from 'wagmi';

export default function useTransfer() {

  const contractAddress = useRecoilValue(reGlobalContractAddresskey);
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

  const { writeAsync: starknetApprove } = useStarknetContractWrite({
    abis: [STARKNET_ERC20_ABI],
    calls: [{
      contractAddress: selectRouteGroupKey?.srcToken || "",
      entrypoint: "approve"
    }]
  });

  const { writeAsync: starknetTransferToken } = useStarknetContractWrite({
    abis: [Orbiter_V3_ABI_STARKNET],
    calls: [{
      contractAddress: contractAddress || "",
      entrypoint: "transferERC20"
    }]
  });


  return ({
    approve,
    contractTransfer,
    contractTransferToken,
    starknetApprove,
    starknetTransferToken
  });
}
