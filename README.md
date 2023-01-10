# openapi-example

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### chain config
```
[
  {
    "api": {
      "url": "https://api-goerli.etherscan.io/api"
    },
    "chainId": "5",
    "networkId": "5",
    "internalId": "5",
    "name": "Görli",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://eth-goerli.public.blastapi.io",
      "https://rpc.ankr.com/eth_goerli",
      "https://rpc.goerli.mudit.blog",
      "https://eth-goerli.g.alchemy.com/v2/demo"
    ],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x783f0ab9199206ee7e70d4d728a9d93609610800"
    ]
  },
  {
    "api": {
      "url": "https://api-goerli.arbiscan.io/api"
    },
    "chainId": "421613",
    "networkId": "421613",
    "internalId": "22",
    "name": "Arbitrum Görli",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli-rollup.arbitrum.io/rpc",
      "https://arb-goerli.g.alchemy.com/v2/demo"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x783f0ab9199206ee7e70d4d728a9d93609610800"
    ]
  },
  {
    "api": {
      "url": "https://api-testnet.polygonscan.com/api"
    },
    "chainId": "80001",
    "networkId": "80001",
    "internalId": "66",
    "name": "Polygon Mumbai",
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://matic-testnet-archive-rpc.bwarelabs.com",
      "https://polygon-testnet.public.blastapi.io",
      "https://rpc.ankr.com/polygon_mumbai",
      "https://matic-mumbai.chainstacklabs.com"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x783f0ab9199206ee7e70d4d728a9d93609610800"
    ]
  },
  {
    "api": {
      "url": "https://api-goerli-optimism.etherscan.io/api"
    },
    "chainId": "420",
    "networkId": "420",
    "internalId": "77",
    "name": "Optimism Görli",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://goerli.optimism.io",
      "https://opt-goerli.g.alchemy.com/v2/demo"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [
      "0x2200a79aDdFE2EFd7bDe34300f4C8FE902E31d39"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x783f0ab9199206ee7e70d4d728a9d93609610800"
    ]
  },
  {
    "api": {
      "url": "https://api-testnet.bscscan.com/api"
    },
    "chainId": "97",
    "networkId": "97",
    "internalId": "515",
    "name": "BSC Görli",
    "debug": false,
    "contracts": [],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://bsc-testnet.public.blastapi.io"
    ],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ],
    "xvmList": [
      "0x783f0ab9199206ee7e70d4d728a9d93609610800"
    ]
  },
  {
    "api": {
      "url": "https://api-testnet.bobascan.com/api"
    },
    "chainId": "28",
    "internalId": "513",
    "name": "Boba Rinkeby Network",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "networkId": "28",
    "rpc": [
      "https://rinkeby.boba.network"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://stardust-explorer.metis.io/api"
    },
    "chain": "ETH",
    "chainId": "588",
    "networkId": "588",
    "internalId": "510",
    "name": "Metis Stardust Testnet",
    "nativeCurrency": {
      "name": "Metis Token",
      "symbol": "METIS",
      "decimals": 18,
      "address": "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
    },
    "rpc": [
      "https://stardust.metis.io/?owner=588"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "Ether (WETH)",
        "symbol": "ETH",
        "decimals": 18,
        "address": "0x420000000000000000000000000000000000000a"
      }
    ]
  },
  {
    "api": {
      "url": "https://goerli-api.zksync.io/api/v0.2"
    },
    "chainId": "zksync_test",
    "networkId": "zksync",
    "internalId": "33",
    "debug": false,
    "name": "ZKSync Goerli",
    "nativeCurrency": {
      "id": 0,
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ]
  },
  {
    "api": {
      "url": "https://api.stage.dydx.exchange"
    },
    "chainId": "dydx_test",
    "networkId": "dydx",
    "internalId": "511",
    "name": "Dydx Testnet",
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      }
    ]
  },
  {
    "api": {
      "url": "https://api.sandbox.x.immutable.com/v1"
    },
    "chainId": "immutableX_testnet",
    "networkId": "immutableX",
    "internalId": "88",
    "name": "ImmutableX Testnet",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://uat2.loopring.io"
    },
    "chainId": "loopring_testnet",
    "networkId": "5",
    "internalId": "99",
    "name": "Loopring Testnet",
    "nativeCurrency": {
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "id": 0,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "contracts": [],
    "tokens": []
  },
  {
    "api": {
      "url": "https://zksync2-testnet.zkscan.io/api"
    },
    "chainId": "280",
    "networkId": "280",
    "debug": true,
    "internalId": "514",
    "name": "ZkSync 2.0 Testnet",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x000000000000000000000000000000000000800A"
    },
    "rpc": [
      "https://zksync2-testnet.zksync.dev",
      "wss://zksync2-testnet.zksync.dev/ws"
    ],
    "watch": [
      "rpc"
    ],
    "contracts": [],
    "tokens": [
      {
        "name": "USDT",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x6b56404816A1CB8ab8E8863222d8C1666De942d5"
      },
      {
        "name": "USDC",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x1c8f9D9C1D74c38c8Aeb5033126EA1133728b32f"
      },
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0xFEf68eb974c562B0dCBF307d9690e0BD10e35cEa"
      }
    ]
  },
  {
    "api": {
      "url": "https://api.zkswap.info/v3-rinkeby"
    },
    "chainId": "zkspace_test",
    "networkId": "zkspace",
    "internalId": "512",
    "name": "ZKSpace Testnet",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "id": 0,
      "address": "0x0000000000000000000000000000000000000000"
    },
    "rpc": [],
    "watch": [
      "api"
    ],
    "tokens": []
  },
  {
    "api": {
      "url": "",
      "intervalTime": 60000
    },
    "chainId": "SN_GOERLI",
    "networkId": "goerli-alpha",
    "internalId": "44",
    "name": "Starknet Goerli Testnet",
    "debug": false,
    "contracts": [
      "0x0457bf9a97e854007039c43a6cc1a81464bd2a4b907594dabc9132c162563eb3"
    ],
    "nativeCurrency": {
      "id": 0,
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18,
      "address": "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    },
    "rpc": [],
    "watch": [
      "rpc"
    ],
    "tokens": [
      {
        "name": "DAI",
        "symbol": "DAI",
        "decimals": 18,
        "address": "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9"
      },
      {
        "name": "Tether USD",
        "symbol": "USDT",
        "decimals": 6,
        "address": "0x0386e8d061177f19b3b485c20e31137e6f6bc497cc635ccdfcab96fadf5add6a"
      },
      {
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "address": "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
      }
    ]
  }
]
```
