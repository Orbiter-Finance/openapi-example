<template>
    <div class="maker">
        <div
                class="maker-block maker-header maker-header--balances"
                element-loading-text="Loading Balances"
        >
            <div style="background-color: #ffffff;width: 100%;height: 100%;padding-top: 3vh">
                <div style="display: flex;align-items: center;justify-content: center;">
                    <el-form>
                        <el-form-item label="发送地址私钥">
                            <el-input v-model="form.privateKeys"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.privateKeys && !form.withoutRpcList.includes(form.fromChainId)" label="RPC">
                            <el-input v-model="form.rpc"></el-input>
                        </el-form-item>
                        <el-form-item label="发送地址">
                            <el-input v-model="form.fromAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="接收地址">
                            <el-input v-model="form.toAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="发送金额">
                            <el-input v-model="form.value"></el-input>
                        </el-form-item>
                        <el-form-item label="发送链">
                            <el-select v-model="form.fromChainId" placeholder="请选择链" @change="changeFromChainId">
                                <el-option
                                        v-for="item in form.fromChainIdOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接收链">
                            <el-select v-model="form.toChainId" placeholder="请选择链" @change="changeToChainId">
                                <el-option
                                        v-for="item in form.toChainIdOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发送币种">
                            <el-select v-model="form.fromSymbol" placeholder="请选择币种">
                                <el-option
                                        v-for="item in form.fromSymbolOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="接收币种">
                            <el-select v-model="form.toSymbol" placeholder="请选择币种">
                                <el-option
                                        v-for="item in form.toSymbolOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="display: flex;align-items: center;justify-content: center;">
                    <el-button type="success" style="margin: 20px" @click="connectWallet" v-if="form.isConnectWallet">钱包已连接</el-button>
                    <el-button style="margin: 20px" v-else @click="connectWallet">连接钱包</el-button>
                    <el-button type="success" style="margin: 20px" @click="connectStarkNetWallet" v-if="form.isConnectStarkNetWallet">StarkNet钱包已连接</el-button>
                    <el-button style="margin: 20px" v-else @click="connectStarkNetWallet">连接StarkNet钱包</el-button>
                    <el-button style="margin: 20px" @click="sendTx">发送交易</el-button>
                </div>
                <div v-if="form.tx">
                    <a :href="form.tx">{{ form.tx }}</a>
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100"/>
    </div>
</template>

<script>
    import { defineComponent, onMounted, reactive } from 'vue';
    import http3 from "../plugins/axios3";
    import { $env } from "../env";
    import * as ethers from 'ethers';
    import { ElNotification } from 'element-plus';
    import { getStarknet, connect as getStarknetWallet } from 'get-starknet';
    import { toUtf8Bytes } from "ethers/lib/utils";
    import { providers } from 'ethers';
    import BN from 'bn.js';
    import hashJS from 'hash.js';
    import elliptic from 'elliptic';
    const { ec: EC, curves } = elliptic;
    export const ec = new EC(
        new curves.PresetCurve({
            type: 'short',
            prime: null,
            p: '800000000000011000000000000000000000000000000000000000000000001',
            a: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001',
            b: '06f21413 efbe40de 150e596d 72f7a8c5 609ad26c 15c915c1 f4cdfcb9 9cee9e89',
            n: '800000000000010FFFFFFFFFFFFFFFFB781126DCAE7B2321E66A241ADC64D2F',
            hash: hashJS.sha256,
            gRed: false,
            g: [
                '1ef15c18599971b7beced415a40f0c7deacfd9b0d1819e03d723d8bc943cfca',
                '5668060aa49730b7be4801df46ec62de53ecd11abe43a32873000c36e8dc1f',
            ],
        })
    );

    const chainIdMap = {};
    const fromTokenMap = {};
    const toTokenMap = {};
    let routeList = [];

    export default defineComponent({
        setup() {
            const form = reactive({
                isConnectWallet: false,
                isConnectStarkNetWallet: false,
                rpc: '',
                privateKeys: '',
                fromAddress: '',
                toAddress: '',
                value: '0.0001',
                fromChainId: '',
                toChainId: '',
                fromSymbol: '',
                toSymbol: '',
                fromChainIdOptions: [],
                toChainIdOptions: [],
                fromSymbolOptions: [],
                toSymbolOptions: [],
                tx: '',
                withoutRpcList: [4, 44, 14, 514]
            });

            const connectWallet = () => {
                if (window.ethereum) {
                    window.ethereum.enable().then((res) => {
                        form.fromAddress = form.toAddress = res[0];
                        form.isConnectWallet = true;
                        ElNotification({
                            title: 'Success',
                            message: 'Connect succeeded',
                            type: 'success',
                        });
                    });
                } else {
                    alert("请安装MetaMask钱包");
                }
            };

            const connectStarkNetWallet = async () => {
                const { href } = window.location;
                const match = href.match(/referer=(\w*)/i);
                const refer = match?.[1] ? match[1].toUpperCase() : '';
                const isArgentX = refer === 'argent'.toUpperCase();
                const isBraavos = refer === 'braavos'.toUpperCase();

                const obj = {
                    order: isArgentX
                        ? ['argentX']
                        : isBraavos
                            ? ['braavos']
                            : ['argentX', 'braavos'],
                };
                const wallet = await getStarknetWallet(obj);
                if (!wallet) {
                    return;
                }
                const enabled = await wallet
                    .enable({ showModal: false })
                    .then((address) => {
                            form.fromAddress = address;
                            return !!address?.length;
                        }
                    );

                if (enabled) {
                    form.isConnectStarkNetWallet = true;
                    ElNotification({
                        title: 'Success',
                        message: 'Connect succeeded',
                        type: 'success',
                    });
                }
            };

            const switchNetwork = async (networkId) => {
                const chainId = networkId || chainIdMap[form.fromChainId];
                console.log('switch chainId', chainId);
                const switchParams = {
                    chainId: '0x' + Number(chainId).toString(16),
                };
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [switchParams],
                });
            };

            const reqTx = async (cursor, prevData) => {
                const privateKeys = form.privateKeys;
                const type = privateKeys ? 2 : 1;
                const fromChainId = +form.fromChainId;
                const id = `${ fromChainId }-${ form.toChainId }:${ form.fromSymbol }-${ form.toSymbol }`;
                const fromAddress = form.fromAddress;
                const toAddress = form.fromAddress;
                const value = form.value;
                const url = cursor ?
                    `/tx?id=${ id }&value=${ value }&fromAddress=${ fromAddress }&toAddress=${ toAddress }&type=${ type }&cursor=${ cursor }&prevData=${ JSON.stringify(prevData) }` :
                    `/tx?id=${ id }&value=${ value }&fromAddress=${ fromAddress }&toAddress=${ toAddress }&type=${ type }`;
                const res = await http3.get(url);
                console.log('res', res);
                return res;
            };

            const sendTx = async () => {
                const fromChainId = +form.fromChainId;
                // zk chains
                if (![3, 33, 4, 44, 8, 88, 9, 99, 11, 511, 12, 512].includes(fromChainId)) {
                    await switchNetwork();
                }
                const privateKeys = form.privateKeys;
                const res = await reqTx();
                // success
                if (res.code === 0) {
                    let txHash = '';
                    try {
                        if (fromChainId === 3 || fromChainId === 33) {
                            txHash = await handleZk(res);
                        } else if (fromChainId === 4 || fromChainId === 44) {
                            txHash = await handleStarknet(res);
                        } else {
                            txHash = await handleEvm(res, privateKeys);
                        }
                    } catch (e) {
                        console.error(e);
                        ElNotification({
                            title: 'Error',
                            message: e.message,
                            type: 'error',
                        });
                        return;
                    }
                    form.tx = `${ $env.txExploreUrl[form.fromChainId] }${ txHash }`;
                    ElNotification({
                        title: 'Success',
                        message: 'Transfer succeeded',
                        type: 'success',
                    });
                }
            };

            const handleEvm = async (res) => {
                const { txResponse, txRequest } = res.result;
                console.log('txRequest ===', txRequest);
                const privateKeys = form.privateKeys;
                let hash;
                if (privateKeys) {
                    // 私钥发送
                    console.log('Send transaction by private key');
                    const provider = new providers.JsonRpcProvider(form.rpc);
                    const signer = new ethers.Wallet(privateKeys).connect(provider);
                    const response = await signer.sendTransaction(txRequest);
                    hash = response.hash;
                } else {
                    // 钱包发送
                    console.log('Send transaction by wallet');
                    if (!form.isConnectWallet) {
                        await connectWallet();
                    }
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                    );
                    const signer = provider.getSigner();
                    const response = await signer.sendTransaction(txRequest);
                    hash = response.hash;
                }
                if (txResponse?.next) {
                    const res = await reqTx(txResponse?.next, { hash });
                    return await handleEvm(res, privateKeys);
                } else {
                    return hash;
                }
            };

            const handleZk = async (res) => {
                const { txResponse, txRequest } = res.result;
                const privateKeys = form.privateKeys;
                const fromChainId = form.fromChainId;
                if (privateKeys) {
                    console.log('Send transaction by private key');
                    if (txResponse.next) {
                        const message = toUtf8Bytes(txRequest);
                        const provider = +fromChainId === 3 ?
                            ethers.providers.getDefaultProvider('mainnet') :
                            ethers.providers.getDefaultProvider('rinkeby');
                        const signer = new ethers.Wallet(privateKeys).connect(provider);
                        const signature = await signer.signMessage(message);
                        const res = await reqTx(txResponse.next, { signature });
                        return await handleZk(res);
                    } else {
                        return txResponse.hash;
                    }
                } else {
                    console.log('Send transaction by wallet');
                    if (txResponse.next) {
                        const message = toUtf8Bytes(txRequest);
                        const provider = new ethers.providers.Web3Provider(
                            window.ethereum
                        );
                        let signer = provider.getSigner();
                        const signature = await signer.signMessage(message);
                        const res = await reqTx(txResponse.next, { signature });
                        return await handleZk(res);
                    } else {
                        return txResponse.hash;
                    }
                }
            };

            const handleStarknet = async (res) => {
                const { txResponse, txRequest } = res.result;
                const privateKeys = form.privateKeys;

                const getKeyPair = (privateKeys) => {
                    return ec.keyFromPrivate(removeHexPrefix(toHex(toBN(privateKeys))), 'hex');
                };

                const removeHexPrefix = (hex) => {
                    return hex.replace(/^0x/, '');
                };

                const addHexPrefix = (hex) => {
                    return `0x${ removeHexPrefix(hex) }`;
                };

                const toHex = (number) => {
                    return addHexPrefix(number.toString('hex'));
                };

                const toBN = (number, base) => {
                    if (typeof number === 'string') {
                        // eslint-disable-next-line no-param-reassign
                        number = number.toLowerCase();
                    }
                    if (typeof number === 'string' && isHex(number) && !base)
                        return new BN(removeHexPrefix(number), 'hex');
                    return new BN(number, base);
                };

                const isHex = (hex) => {
                    return /^0x[0-9a-f]*$/i.test(hex);
                };

                if (privateKeys) {
                    console.log('Send transaction by private key');
                    if (txResponse.next) {
                        const keyPair = getKeyPair(privateKeys);
                        const { r, s } = keyPair.sign(txRequest);
                        const signature = {
                            r: toHex(r),
                            s: toHex(s),
                        };
                        const res = await reqTx(txResponse.next, { signature });
                        return await handleStarknet(res);
                    } else {
                        return txResponse.hash;
                    }
                } else {
                    console.log('Send transaction by wallet');
                    return (await getStarknet().account.execute(txRequest)).transaction_hash;
                    // if (txResponse.next) {
                    //     // const { r, s } = await getStarknet().account.signer.keyPair.sign(txRequest);
                    //     const { r, s } = await getStarknet().account.sign(txRequest);
                    //     const signature = {
                    //         r: toHex(r),
                    //         s: toHex(s),
                    //     };
                    //     const res = await reqTx(txResponse.next, { signature });
                    //     return await handleStarknet(res);
                    // } else {
                    //     return txResponse.hash;
                    // }
                }
            };

            onMounted(async () => {
                const chainRes = await http3.get(`/chains`);
                if (chainRes.code === 0) {
                    const { result } = chainRes;
                    for (const data of result) {
                        chainIdMap[data.internalId] = data.chainId;
                    }
                }
                const routeRes = await http3.get(`/routes`);
                if (routeRes.code === 0) {
                    const { result } = routeRes;
                    routeList = result;
                    const fromChainIdOptions = [];
                    for (const data of result) {
                        if (!fromChainIdOptions.find(item => item.value === data.fromChain.id)) {
                            fromChainIdOptions.push({ label: data.fromChain.name, value: data.fromChain.id });
                        }
                        fromTokenMap[data.fromChain.id] = fromTokenMap[data.fromChain.id] || [];
                        if (!fromTokenMap[data.fromChain.id].find(it => it.value === data.fromChain.symbol)) {
                            fromTokenMap[data.fromChain.id].push({
                                label: data.fromChain.symbol,
                                value: data.fromChain.symbol
                            });
                        }
                        toTokenMap[data.toChain.id] = toTokenMap[data.toChain.id] || [];
                        if (!toTokenMap[data.toChain.id].find(it => it.value === data.toChain.symbol)) {
                            toTokenMap[data.toChain.id].push({
                                label: data.toChain.symbol,
                                value: data.toChain.symbol
                            });
                        }
                    }
                    form.fromChainIdOptions = fromChainIdOptions;
                }
            });
            const changeFromChainId = () => {
                const toChainIdOptions = [];
                for (const route of routeList) {
                    if (route.fromChain.id === form.fromChainId && !toChainIdOptions.find(item => item.value === route.toChain.id)) {
                        toChainIdOptions.push({ label: route.toChain.name, value: route.toChain.id });
                    }
                }
                form.toChainIdOptions = toChainIdOptions;
                form.fromSymbolOptions = fromTokenMap[form.fromChainId];
            };
            const changeToChainId = () => {
                form.toSymbolOptions = toTokenMap[form.toChainId];
            };

            return {
                sendTx,
                connectWallet,
                connectStarkNetWallet,
                form,
                changeFromChainId,
                changeToChainId
            };
        },
    });
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 600px) {
        /* 移动端 */
        .desc {
            width: 50vw;
        }
        .warn-input {
            width: 15vw
        }
    }

    @media screen and (min-width: 600px) {
        /* PC端 */
        .desc {
            width: 400px;
        }
        .warn-input {
            width: 150px
        }
    }

    .box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1000px;
        margin: 30px;
    }

    .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 50px;
        height: 50px;
    }

    .maker-header--balances__info {
        white-space: nowrap;
    }

    .maker {
        font-size: 0.2rem;

        a {
            color: #{var(--el-table-font-color)};
            text-decoration: none;

            &:hover {
                color: #{var(--el-color-primary)};
            }
        }
    }

    .maker-block {
        display: block;
        margin: 0 auto;
        padding: 12px;
        background-color: white;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }

    .maker-search__item > * {
        margin-bottom: 8px;
    }

    .maker-header {
        border-bottom: 1px solid #e8e8e8;
        background-color: #f8f8f8;
    }

    .maker-header--balances {
        display: flex;
        flex-direction: row;

        .el-empty {
            padding: 0;
        }

        .el-card__header {
            font-size: 18px;
            font-weight: bold;
            color: #555555;
        }

        & > * {
            margin-right: 20px;
            flex: 1;
        }

        & > *:last-child {
            margin-right: 0;
        }

        &__names {
            margin-top: calc(#{var(--el-card-padding)} * -1);

            & .el-tabs__item {
                font-size: 13px;
                font-weight: normal;
            }
        }

        &__value {
            font-weight: bold;
        }

        &__info {
            color: #555555;
            font-size: 13px;
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 4px;

            > * {
                display: contents;
            }
        }
    }

    .maker-header--search {
        .el-row {
            margin-top: 10px;

            &:first-child {
                margin-top: 0;
            }
        }
    }

    .maker-header__statistics {
        font-size: 14px;
        color: #555555;
        display: flex;
        flex-direction: row;
        align-items: center;

        & > * {
            margin-right: 16px;
        }
    }

    .user-addresses {
        max-height: 300px;
        overflow-y: scroll;

        > * {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            text-align: center;

            &:hover {
                background-color: #f8f8f8;
                cursor: pointer;
            }

            &:last-child {
                border-bottom: none;
            }

            span {
                font-size: 13px;
                color: #{var(--el-color-primary)};
            }
        }
    }

    .table-timestamp {
        font-size: 12px;
        color: #888888;
        width: max-content;
    }

    .maker__chain-tag {
        display: block;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 5px;
        text-align: center;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .state-tag--1 {
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }

        &:active {
            opacity: 1;
        }
    }

    .chain_info_wrap {
        .chain_info {
            height: 165px;
        }

        .el-col:nth-child(n + 7) .chain_info {
            margin-top: 16px;
        }
    }
</style>
