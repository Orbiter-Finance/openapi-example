import { IRoutersExtendsType } from "@/Models/chain";
import { IOrbiterSelectItemType } from "@/Models/commponets";
import { HISTORY_KEY, TRANSFER_KEY } from "@/constants";
import { atom } from "recoil";

export const reChains = atom({
    key: 'reChains',
    default: [] as any[]
});

export const reRouterListKey = atom({
    key: 'reRouterListKey',
    default: [] as IRoutersExtendsType[]
});

export const reRouterListSourceChainFilterKey = atom({
    key: 'reRouterListSourceChainFilterKey',
    default: [] as IRoutersExtendsType[]
});

export const reRouterListSourceTokenFilterKey = atom({
    key: 'reRouterListSourceTokenFilterKey',
    default: [] as IRoutersExtendsType[]
});
export const reRouterListTargetChainFilterKey = atom({
    key: 'reRouterListTargetChainFilterKey',
    default: [] as IRoutersExtendsType[]
});

export const reRouterListTargetTokenFilterKey = atom({
    key: 'reRouterListTargetTokenFilterKey',
    default: [] as IRoutersExtendsType[]
});

export const reSourceChainKey = atom({
    key: 'reSourceChainKey',
    default: "1"
});

export const reTargetChainKey = atom({
    key: 'reTargetChainKey',
    default: ""
});

export const reSourceTokenKey = atom({
    key: 'reSourceTokenKey',
    default: {label:"", value: ""} as IOrbiterSelectItemType
});

export const reTargetToeknKey = atom({
    key: 'reTargetToeknKey',
    default: {label:"", value: ""} as IOrbiterSelectItemType
});

export const reSelectRouteGroupKey = atom({
    key: 'reSelectRouteGroupKey',
    default: {} as IRoutersExtendsType
});

export const reSelectRouteMakerKey = atom({
    key: 'reSelectRouteKey',
    default: {label:"", value: ""} as IOrbiterSelectItemType
});

export const reChainsWallet = atom({
    key: 'reChainsWallet',
    default: [] as any[]
});

export const reTransferAmount = atom({
    key: 'reTransferAmount',
    default: ""
});

export const rePageStatusKey = atom({
    key: 'rePageStatusKey',
    default: TRANSFER_KEY as typeof TRANSFER_KEY | typeof HISTORY_KEY
});


export const reTransferHashKey = atom({
    key: 'reTransferHashKey',
    default: ""
});

export const reGlobalDealerKey = atom({
    key: 'reGlobalDealerKey',
    default: ""
});

export const reGlobalContractTransferkey = atom({
    key: 'reGlobalContractTransferkey',
    default: false
});

export const reGlobalContractTransferDataVerifykey = atom({
    key: 'reGlobalContractTransferDataVerifykey',
    default: false
});

export const reGlobalContractTransferToAddresskey = atom({
    key: 'reGlobalContractTransferToAddresskey',
    default: ""
});


export const reGlobalContractAddresskey = atom({
    key: 'reGlobalContractAddresskey',
    default: ""
});