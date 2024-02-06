

export const ENTER_NUMBER_RULE = new RegExp("^[0-9]*?\d*(\\.?([0-9]{0,1}))$")
export const ENTER_NUMBER_RULE2 = new RegExp("^[0-9]*?\d*(\\.?([0-9]{0,4}))$")
export const ENTER_ETH_ADDRESS = new RegExp("^(0x)?[0-9a-fA-F]{40}$")
export const ENTER_STARKNET_ADDRESS = new RegExp("^(0x)?[0-9a-fA-F]{64}$")


export const BLOCK_AMOUNT_RULE = new RegExp(/^\+?[1-9]\d*$/)
