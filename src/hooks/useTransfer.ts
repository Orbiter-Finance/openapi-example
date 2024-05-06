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
    starknetApproveAndTransferToken,
    starknetTransferToken
  });
}
