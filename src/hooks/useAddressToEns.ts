import { IAddress } from '@/Models/wallet';
import ethAddressUtils from '@/utils/ethAddressUtils';
import { useEnsName } from 'wagmi';

export default function useAddressToEns(address: IAddress): {isEns: boolean, ensName: IAddress} {
    const ethAddress = ethAddressUtils(address)
    const { data } = useEnsName({address: ethAddress });
    return data ? ({isEns: true, ensName: data}) :  ({isEns: false, ensName: ethAddress})
}
