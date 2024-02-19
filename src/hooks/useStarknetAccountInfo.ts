import { ResolveStarknetWalletIcon } from '@/lib/wallet/starknet/icon';
import { reSourceChainKey } from '@/stores';
import { reGlobalStarknetWalletId } from '@/stores/wallet';
import { useAccount, useBalance, useDisconnect, useNetwork } from '@starknet-react/core';
import { formatUnits } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function useStarknetAccountInfo() {

    const { disconnectAsync } = useDisconnect()

    const { account, address } = useAccount();
    const starknetWalletId = useRecoilValue(reGlobalStarknetWalletId);
    const sourceChainKey = useRecoilValue(reSourceChainKey);

    const balance = useBalance({
        address
    });
    const { chain } = useNetwork();

    const [nonce, setNonce] = useState("0");


    const getNoce = useCallback(
        async () => {
            if (account) {
                const n = await account.getNonce();
                console.log("n", n);
                setNonce(formatUnits(n, "wei"));
            }

        },
        [account],
    );

    useEffect(() => {
        if (address && !!sourceChainKey) {
            getNoce();
        }

    }, [address, getNoce, sourceChainKey]);

    return ({
        account,
        address,
        balance,
        chain,
        nonce,
        icon: ResolveStarknetWalletIcon({ connector: starknetWalletId }),
        disconnectAsync
    });
}
