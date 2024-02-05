import { I0XAddress, IAddress } from "@/Models/wallet";


export default function ethAddressUtils(address: IAddress): I0XAddress {

    let account = address

    const ipfsRegExp = /^0x.*/

    if (!ipfsRegExp.test(account) && account) {
        account = "0x" + account
    }

    return account as I0XAddress

}
