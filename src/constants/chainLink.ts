
import chainsJson from "@/constants/chains-all.json";

const CHAIN_ID = {
    zksync: 'zksync',
    starknet: 'SN_MAIN',
    loopring: 'loopring',
    zkspace: 'ZKSpace',
    dydx: 'dydx',
    imx: 'immutableX',
    mainnet: '1',
    ar: '42161',
    po: '137',
    op: '10',
    zksync2: '324',
    nova: '42170',
    base: '8453',
    zora: '7777777',
    metis: '1088',
    boba: '288',
    linea: '59144',
    pozkevm: '1101',
    bsc: '56',
    opbnb: '204',
    manta: '169',
    scroll: '534352',

    zksync_test: 'zksync_test',
    starknet_test: 'SN_GOERLI',
    loopring_test: 'loopring_test',
    zkspace_test: 'ZKSpace_test',
    dydx_test: 'dydx_test',
    imx_test: 'immutableX_test',
    goerli: '5',
    ar_test: '421613',
    po_test: '80001',
    op_test: '420',
    zksync2_test: '280',
    base_test: '84531',
    zora_test: '999',
    linea_test: '59140',
    pozkevm_test: '1442',
    bsc_test: '97',
    opbnb_test: '5611',
    manta_test: '3441005',
    scroll_test: '534353',
};


const otherChain: any = {
    txExploreUrl: {
        [CHAIN_ID.zksync]: 'https://zkscan.io/explorer/transactions',
        [CHAIN_ID.zksync_test]: 'https://goerli.zkscan.io/explorer/transactions',
        [CHAIN_ID.starknet]: 'https://voyager.online/tx',
        [CHAIN_ID.starknet_test]: 'https://goerli.voyager.online/tx',
        [CHAIN_ID.dydx]: 'https://trade.dydx.exchange',
        [CHAIN_ID.dydx_test]: 'https://trade.stage.dydx.exchange',
        [CHAIN_ID.imx]: 'https://explorer.immutable.com/tx',
        [CHAIN_ID.imx_test]: 'https://api.sandbox.x.immutable.com/v1/transfers',
        [CHAIN_ID.loopring]: 'https://explorer.loopring.io/tx',
        [CHAIN_ID.loopring_test]: 'https://loopring.io/#/l2assets/history/Transactions',
        [CHAIN_ID.zkspace]: 'https://zkspace.info/transaction',
        [CHAIN_ID.zkspace_test]: 'https://v3-rinkeby.zkswap.info/transaction'
    },
    accountExploreUrl: {
        [CHAIN_ID.zksync]: 'https://zkscan.io/explorer/accounts',
        [CHAIN_ID.zksync_test]: 'https://goerli.zkscan.io/explorer/accounts',
        [CHAIN_ID.starknet]: 'https://voyager.online/contract',
        [CHAIN_ID.starknet_test]: 'https://goerli.voyager.online/contract',
        [CHAIN_ID.imx]: 'https://explorer.immutable.com/address',
        [CHAIN_ID.imx_test]: 'https://api.sandbox.x.immutable.com/v1/transfers',
        [CHAIN_ID.loopring]: 'https://loopring.io/#/l2assets/history/Transactions',
        [CHAIN_ID.loopring_test]: 'https://loopring.io/#/l2assets/history/Transactions',
        [CHAIN_ID.dydx]: 'https://trade.dydx.exchange',
        [CHAIN_ID.dydx_test]: 'https://trade.stage.dydx.exchange',
        [CHAIN_ID.zkspace]: 'https://zkspace.info/account',
        [CHAIN_ID.zkspace_test]: 'https://v3-rinkeby.zkswap.info/account'
    },
    default: {
        [CHAIN_ID.zksync]: 'https://zkscan.io/explorer',
        [CHAIN_ID.zksync_test]: 'https://goerli.zkscan.io/explorer',
        [CHAIN_ID.starknet]: 'https://voyager.online',
        [CHAIN_ID.starknet_test]: 'https://goerli.voyager.online',
        [CHAIN_ID.imx]: 'https://explorer.immutable.com',
        [CHAIN_ID.imx_test]: 'https://api.sandbox.x.immutable.com',
        [CHAIN_ID.loopring]: 'https://loopring.io/#/l2assets',
        [CHAIN_ID.loopring_test]: 'https://loopring.io/#',
        [CHAIN_ID.dydx]: 'https://trade.dydx.exchange',
        [CHAIN_ID.dydx_test]: 'https://trade.stage.dydx.exchange',
        [CHAIN_ID.zkspace]: 'https://zkspace.info',
        [CHAIN_ID.zkspace_test]: 'https://v3-rinkeby.zkswap.info'
    }
};

let chainLinks: any = {};

chainsJson.forEach((item) => {

    const url = item?.explorers?.[0]?.url || "";
    chainLinks = {
        ...chainLinks,
        [String(item.chainId).toLocaleLowerCase()]: {
            ...(chainLinks[String(item.chainId).toLocaleLowerCase()] || {}),
            default: url,
            tx: url ? url + "/tx" : "",
            address: url ? url + "/address" : "",
            token: url ? url + "/token" : "",
        }
    };
});


Object.keys(otherChain).forEach((item: any, index: number) => {
    const group = {
        tx: "",
        address: "",
        token: ""
    };
    Object.keys(otherChain[item]).forEach((option) => {
        chainLinks = {
            ...chainLinks,
            [String(option).toLocaleLowerCase()]: {
                ...group,
                ...(chainLinks[option.toLocaleLowerCase()] || {}),
                ...(!index ? ({ tx: otherChain[item][option] }) : (index === 1 ? ({ address: otherChain[item][option], token: otherChain[item][option] }) : ({ default: otherChain[item][option] })))
            }
        };


    });
});


const balancesLinks : {[key: number]: string} = {
    1: 'https://etherscan.io/token/', // /token/
    5: 'https://goerli.etherscan.io/token/', // /token/
    2: 'https://arbiscan.io/address/', // /address/
    22: 'https://goerli.arbiscan.io/token/',
    3: 'https://etherscan.io/token/', // same as etherscan
    33: 'https://goerli.etherscan.io/token/',
    4: 'https://beta.voyager.online/token/',
    44: 'https://beta-goerli.voyager.online/token/',
    6: 'https://polygonscan.com/token/',
    66: 'https://mumbai.polygonscan.com/token/',
    7: 'https://optimistic.etherscan.io/token/',
    77: 'https://blockscout.com/optimism/goerli/token/',
    10: 'https://andromeda-explorer.metis.io/token/',
    510: 'https://stardust-explorer.metis.io/token/',
    11: 'https://trade.dydx.exchange/',
    511: 'https://trade.stage.dydx.exchange/',
    12: 'https://zkspace.info/token/',
    512: 'https://v3-rinkeby.zkswap.info/token/',
    13: 'https://blockexplorer.boba.network/',
    513: 'https://blockexplorer.rinkeby.boba.network/',
    14: 'https://explorer.zksync.io/tokens/',
    514: 'https://goerli.explorer.zksync.io/tokens/',
    15: 'https://bscscan.com/tokens',
    515: 'https://testnet.bscscan.com/tokens',
    16: 'https://nova-explorer.arbitrum.io/token/',
    516: 'https://goerli-rollup-explorer.arbitrum.io/token/',
    517: 'https://public.zkevm-test.net:8443/token/',
    518: 'https://l1scan.scroll.io/token/',
    19: 'https://scrollscan.com/token/',
    519: 'https://l2scan.scroll.io/token/',
    21: 'https://basescan.org/token/',

    23: 'https://explorer.linea.build/token/',
    24: 'https://explorer.mantle.xyz/token/',
    523: 'https://goerli.lineascan.build/token/',
    524: 'https://explorer.testnet.mantle.xyz/token/',
    25: 'https://mainnet.opbnbscan.com/token/',
    525: 'https://opbnbscan.com/token/',
    526: 'https://sepolia.etherscan.io/token/',
    527: 'https://www.okx.com/explorer/okbc-test/token/',
    30: 'https://explorer.zora.energy/address/',
    530: 'https://testnet.explorer.zora.energy/token/',
    31: 'https://manta-pacific.calderaexplorer.xyz/address/',
    38: 'https://scan.zkfair.io/token/',
    8: 'https://explorer.immutable.com/address/',
    9: 'https://explorer.loopring.io/tx/'
}


export {
    balancesLinks,
    chainsJson,
    chainLinks
};
