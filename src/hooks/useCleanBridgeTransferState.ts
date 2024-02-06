import { reSelectRouteGroupKey, reSelectRouteMakerKey, reTransferAmount, reSourceChainKey, reSourceTokenKey, reTargetChainKey, reTargetToeknKey, reRouterListSourceChainFilterKey, reRouterListSourceTokenFilterKey, reRouterListTargetChainFilterKey, reRouterListTargetTokenFilterKey } from '@/stores';
import { useCallback } from 'react'
import { useResetRecoilState } from 'recoil';

export default function useCleanBridgeTransferState() {

  const resetSelectRouteGroupKey = useResetRecoilState(reSelectRouteGroupKey);
  const resetSelectRouteMakerKey = useResetRecoilState(reSelectRouteMakerKey);
  const resetTransferAmount = useResetRecoilState(reTransferAmount);
  const resetSourceChainKey = useResetRecoilState(reSourceChainKey);
  const resetSourceTokenKey = useResetRecoilState(reSourceTokenKey);
  const resetTargetChainKey = useResetRecoilState(reTargetChainKey);
  const resetTargetToeknKey = useResetRecoilState(reTargetToeknKey);
  const resetRouterListSourceChainFilterKey = useResetRecoilState(reRouterListSourceChainFilterKey);
  const resetRouterListSourceTokenFilterKey = useResetRecoilState(reRouterListSourceTokenFilterKey);
  const resetRouterListTargetChainFilterKey = useResetRecoilState(reRouterListTargetChainFilterKey);
  const resetRouterListTargetTokenFilterKey = useResetRecoilState(reRouterListTargetTokenFilterKey);
  const resetGlobalContractTransferkey = useResetRecoilState(reGlobalContractTransferkey);
  const resetGlobalContractTransferDataVerifykey = useResetRecoilState(reGlobalContractTransferDataVerifykey);
  const resetGlobalContractTransferToAddresskey = useResetRecoilState(reGlobalContractTransferToAddresskey);
  const resetGlobalContractAddresskey = useResetRecoilState(reGlobalContractAddresskey);
  

  const cleanBridgeTransferState = useCallback(
    () => {
      
        resetSelectRouteGroupKey();
        resetSelectRouteMakerKey();
        resetSourceChainKey();
        resetSourceTokenKey();
        resetTargetChainKey();
        resetTargetToeknKey();
        resetTransferAmount();
        resetRouterListSourceChainFilterKey();
        resetRouterListSourceTokenFilterKey();
        resetRouterListTargetChainFilterKey();
        resetRouterListTargetTokenFilterKey();
        resetGlobalContractTransferkey()
resetGlobalContractTransferDataVerifykey()
resetGlobalContractTransferToAddresskey()
resetGlobalContractAddresskey()
    },
    [resetGlobalContractAddresskey, resetGlobalContractTransferDataVerifykey, resetGlobalContractTransferToAddresskey, resetGlobalContractTransferkey, resetRouterListSourceChainFilterKey, resetRouterListSourceTokenFilterKey, resetRouterListTargetChainFilterKey, resetRouterListTargetTokenFilterKey, resetSelectRouteGroupKey, resetSelectRouteMakerKey, resetSourceChainKey, resetSourceTokenKey, resetTargetChainKey, resetTargetToeknKey, resetTransferAmount],
  )
  

  return {
    cleanBridgeTransferState
  }
}
