import ArgentX from "@/components/icons/Wallets/ArgentX";
import Braavos from "@/components/icons/Wallets/Braavos";
import { Coins, LucideProps } from "lucide-react";
import { JSX } from "react";

export const ResolveStarknetWalletIcon = ({ connector }: { connector: string }) => {
    switch (connector?.toLowerCase()) {
        case KnownKonnectors.ArgentX:
            return ArgentX
        case KnownKonnectors.Braavos:
            return Braavos
        default:
            return CoinsIcon
    }
}


const KnownKonnectors = {
    ArgentX: 'argentx',
    ArgentMobile: 'argent mobile',
    Braavos: 'braavos',
}

const CoinsIcon = (props: JSX.IntrinsicAttributes & LucideProps) => {
    return null
}