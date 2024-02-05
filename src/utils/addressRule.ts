import { STARKNET_CHAIN } from '@/constants/rpc';

export default function addressRule(
    chain: string,
    address: string
) {
    const len = address.length
   
   
   return STARKNET_CHAIN.includes(chain) ? (len === 66) : (len === 42)

}
