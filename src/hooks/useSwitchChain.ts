import { useCallback } from 'react';
import useTotas from './useTotas';
import { useSwitchChain as useSwitchChainA } from 'wagmi';

export default function useSwitchChain() {

  const { switchChain: switchChainSync } = useSwitchChainA();
  const { totasError } = useTotas();

  const switchChain = useCallback(


    async (chainId: number) => {

      if(switchChainSync) {
        try {
          const res = await switchChainSync({chainId});
          console.log("res", res)
        } catch (error) {
          console.log("error", error)
          const message = (error as any)?.message;

          if (message) {
            totasError(message as string);
          }
        }
      }


    },
    [totasError, switchChainSync],
  );


  return {
    switchChain
  };
}
