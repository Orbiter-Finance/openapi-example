export interface IRouters {
    compRatio: string;
    endpoint: string;
    endpointContract: string|null;
    line: string;
    maxAmt: string;
    minAmt: string;
    spentTime: string;
    srcChain: string;
    srcToken: string;
    state: string;
    tgtChain: string;
    tgtToken: string;
    tradeFee: string;
    vc: string;
    withholdingFee: string;
}

export type IChainBaseType = {
    token: string;
    account: string;
    tx: string;
};

export type IChainLinksType = {
    [key: string | number]: IChainBaseType;
};

export interface IRoutersExtendsType extends IRouters {
    srcSymbol: string,
    tgtSYmbol: string
};