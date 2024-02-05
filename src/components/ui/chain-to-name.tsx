import { useRecoilValue } from 'recoil';
import { reChains } from '@/stores';

export default function ChainToName({
    chain
}: {chain: string|number}) {

    const chains = useRecoilValue(reChains);

    const chainO = chains.filter((item)=> String(item.chainId).toLocaleLowerCase() === String(chain).toLocaleLowerCase() )[0]

    return (
        chainO?.name
    );
}