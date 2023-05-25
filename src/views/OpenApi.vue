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
    import { providers } from 'ethers';

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
                // 切换网络
                await switchNetwork();
                const privateKeys = form.privateKeys;
                const res = await reqTx();
                // success
                if (res.code === 0) {
                    try {
                        const txHash = await handleEvm(res, privateKeys);
                        form.tx = `${ $env.txExploreUrl[form.fromChainId] }${ txHash }`;
                        ElNotification({
                            title: 'Success',
                            message: 'Transfer succeeded',
                            type: 'success',
                        });
                    } catch (e) {
                        console.error(e);
                        ElNotification({
                            title: 'Error',
                            message: e.message,
                            type: 'error',
                        });
                    }
                }
            };

            const handleEvm = async (res) => {
                const { txResponse, txRequest } = res.result;
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
