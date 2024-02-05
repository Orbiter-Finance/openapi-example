import { useCallback } from 'react';
import useTotas from './useTotas';
import { useSwitchNetwork } from 'wagmi';

export default function useSwitchChain() {

  const { switchNetworkAsync } = useSwitchNetwork();
  const { totasError } = useTotas();

  const switchChain = useCallback(


    async (chainId: number) => {

      if(switchNetworkAsync) {
        try {
          const res = await switchNetworkAsync(chainId);
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
    [totasError, switchNetworkAsync],
  );


  return {
    switchChain
  };
}
