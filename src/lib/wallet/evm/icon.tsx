
import BitKeep from "@/components/icons/Wallets/BitKeep";
import CoinbaseIcon from "@/components/icons/Wallets/Coinbase";
import MetaMaskIcon from "@/components/icons/Wallets/MetaMask";
import RainbowIcon from "@/components/icons/Wallets/Rainbow";
import WalletConnectIcon from "@/components/icons/Wallets/WalletConnect";
import { LucideProps } from "lucide-react"
import { JSX } from "react";

export const ResolveEVMWalletIcon = ({ connector }: { connector: string }) => {
    switch (connector?.toLocaleLowerCase()) {
        case KnownKonnectors.MetaMask:
            return MetaMaskIcon
        case KnownKonnectors.WalletConnect:
            return WalletConnectIcon
        case KnownKonnectors.Rainbow:
            return RainbowIcon
        case KnownKonnectors.BitKeep:
            return BitKeep
        case KnownKonnectors.CoinbaseWallet:
            return CoinbaseIcon
        default:
            return CoinsIcon
    }
}

const KnownKonnectors = {
    MetaMask: 'metamask',
    WalletConnect: 'walletconnect',
    Rainbow: 'rainbow',
    BitKeep: 'bitkeep',
    CoinbaseWallet: 'coinbasewallet'
}

const CoinsIcon = (props: JSX.IntrinsicAttributes & LucideProps) => {
    return null
}