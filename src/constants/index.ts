
export const BASE_NAME = "ORBITER_DASHBOARD_";
export const LOCAL = BASE_NAME + "LOCAL";

export const BASE_THEME_KEYWORD = "THEME_KEYWORD";
export const BASE_THEME_LIGHT = BASE_NAME + "_THEME_LIGHT";
export const BASE_THEME_DARK = BASE_NAME + "_THEME_DARK";

export const INVITECODE = "inviteCode";

export const TRANSACTIONHASH = BASE_NAME + "TRANSACTIONHASH";

export const LOCALBLOCKSYNCCHAINBLOCK = "LOCALBLOCKSYNCCHAINBLOCK";

export const GLOBALSEARCHACCOUNT = BASE_NAME + "GLOBAL_SEARCH_ACCOUNT";

export const ICEBERG_CHAINID = BASE_NAME + "CHAINID";

export const ICEBERG_CONNECT_WALLET = BASE_NAME + "CONNECT_WALLET";

export const GLOBAL_AUTH = BASE_NAME + "GLOBAL_AUTH";

export const GLOBAL_LOCAL_TRANSACTION_KEY = BASE_NAME + "TRANSACTION_KEY";


export const SELECT_KEY_ALL = "SELECT_KEY_ALL"

export const GLOBAL_ZERO_ADRESS = "0x0000000000000000000000000000000000000000"

export const DAY_TIME_STAMP = 3600 * 24 * 1000
export const TIME_INTERVAL = DAY_TIME_STAMP * 90


export const MAKER_ADDRESSES = (process.env.NEXT_PUBLIC_MAKER_ADDRESSES?.split(",") || []).map((item)=> item.toLocaleLowerCase())
export const WHITE_MAKER_ADDRESSES = (process.env.NEXT_PUBLIC_WHITE_MAKER_ADDRESSES?.split(",") || []).map((item)=> item.toLocaleLowerCase())


export const SN_GOERLI = "SN_GOERLI"
export const SN_MAIN = "SN_MAIN"

export const STARKNET_CHAIN = [SN_GOERLI, SN_MAIN];

export const TRANSFER_KEY = BASE_NAME + "TRANSFER" 
export const HISTORY_KEY = BASE_NAME + "HISTORY" 

