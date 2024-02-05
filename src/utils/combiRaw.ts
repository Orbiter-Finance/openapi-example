
import Web3 from "web3"

export const combiRaw = (callFunc: string, callArgs: any[]) => {
    const web3P = new Web3();

    let raw = "";

    const list = callFunc.slice(callFunc.indexOf("(") + 1, callFunc.length - 1).split(",").map((item) => item.trim());


    if (callArgs.length) {
        raw = web3P.eth.abi.encodeFunctionSignature(callFunc) +
            web3P.eth.abi.encodeParameters(list,
                callArgs).slice(2);

    } else {
        raw = web3P.eth.abi.encodeFunctionSignature(callFunc);
    }

    return raw;
};
