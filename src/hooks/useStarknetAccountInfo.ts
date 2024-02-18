import { useAccount, useBalance, useNetwork } from '@starknet-react/core';

export default function useStarknetAccountInfo() {
    const { address } = useAccount();

    const { data } = useBalance({
        address
    });
    const { chain } = useNetwork();

    return ({
        address,
        data,
        chain
    });
}
