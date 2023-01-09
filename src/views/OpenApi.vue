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
                        <el-form-item label="发送地址">
                            <el-input :disabled="true" v-model="form.fromAddress"></el-input>
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
                    <div v-if="form.tx"><br/>
                        <a :href="form.tx">{{ form.tx }}</a>
                    </div>
                </div>
            </div>
        </div>
        <el-backtop :right="100" :bottom="100"/>
    </div>
</template>

<script>
    import { defineComponent, onMounted, reactive } from 'vue';
    import Web3 from 'web3';
    import http3 from "../plugins/axios3";
    import { Transaction as EthereumTx } from 'ethereumjs-tx';
    import Common from 'ethereumjs-common';
    import { $env } from "../env";
    import * as ethers from 'ethers';
    import * as zksync from 'zksync';
    import { ElNotification } from 'element-plus';
    import { utils } from 'zksync';
    import { submitSignedTransactionsBatch } from 'zksync/build/wallet';
    import { private_key_to_pubkey_hash, sign_musig } from 'zksync-crypto';
    import axios from 'axios';
    import * as zksync2 from 'zksync-web3';
    import { getStarknet, connect as getStarknetWallet } from 'get-starknet';
    import { Contract } from 'starknet';
    import BigNumber from "bignumber.js";
    import { DydxClient } from '@dydxprotocol/v3-client';
    import { providers } from 'ethers';
    import { ImmutableXClient } from '@imtbl/imx-sdk';
    import { generateKeyPair, UserAPI } from '@loopring-web/loopring-sdk';

    const tokenMap = {};
    const chainIdMap = {};

    export default defineComponent({
        setup() {
            const form = reactive({
                isConnectWallet: false,
                isConnectStarkNetWallet: false,
                privateKeys: '',
                fromAddress: '',
                toAddress: '',
                value: '0.01',
                fromChainId: '5',
                toChainId: '22',
                fromSymbol: 'ETH',
                toSymbol: 'ETH',
                fromChainIdOptions: [],
                toChainIdOptions: [],
                fromSymbolOptions: [],
                toSymbolOptions: [],
                tx: ''
            });

            const connectWallet = () => {
                if (window.ethereum) {
                    window.ethereum.enable().then((res) => {
                        form.fromAddress = res[0];
                        form.isConnectWallet = true;
                        alert("当前钱包地址:" + res[0]);
                    });
                } else {
                    alert("请安装MetaMask钱包");
                }
            };

            const connectStarkNetWallet = async () => {
                if (!getStarknet().isConnected) {
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
                        .then((address) => !!address?.length);

                    if (enabled) {
                        form.isConnectStarkNetWallet = true;
                        ElNotification({
                            title: 'Success',
                            message: 'Connect succeeded',
                            type: 'success',
                        });
                    }
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

            const sendTx = async () => {
                const fromChainId = +form.fromChainId;
                const id = `${ fromChainId }-${ form.toChainId }:${ form.fromSymbol }-${ form.toSymbol }`;
                console.log('id', id);
                // zk chains
                if (![3, 33, 4, 44, 8, 88, 9, 99, 11, 511, 12, 512, 14, 514].includes(fromChainId)) {
                    await switchNetwork();
                }
                const privateKeys = form.privateKeys;
                const fromAddress = form.fromAddress;
                const value = form.value;
                const res = await http3.get(`/tx?id=${ id }&value=${ value }&fromAddress=${ form.fromAddress }&toAddress=${ form.fromAddress }`);
                console.log('res', res);
                // success
                if (res.code === 0) {
                    let txHash = '';
                    if (fromChainId === 3 || fromChainId === 33) {
                        txHash = await handleZk(res, fromAddress);
                    } else if (fromChainId === 4 || fromChainId === 44) {
                        txHash = await handleStarknet(res);
                    } else if (fromChainId === 8 || fromChainId === 88) {
                        txHash = await handleImx(res, fromAddress);
                    } else if (fromChainId === 9 || fromChainId === 99) {
                        txHash = await handleLoopring(res, fromAddress);
                    } else if (fromChainId === 11 || fromChainId === 511) {
                        txHash = await handleDydx(res);
                    } else if (fromChainId === 12 || fromChainId === 512) {
                        txHash = await handleZkspace(fromAddress, fromChainId, res);
                    } else if (fromChainId === 14 || fromChainId === 514) {
                        txHash = await handleZksync(res);
                    } else {
                        txHash = await handleEvm(res, privateKeys);
                    }
                    form.tx = `${ $env.txExploreUrl[form.fromChainId] }${ txHash }`;
                    ElNotification({
                        title: 'Success',
                        message: 'Transfer succeeded',
                        type: 'success',
                    });
                }
            };

            const handleEvm = async (res, privateKeys) => {
                const {
                    rpc,
                    data,
                    opts: {
                        baseChain,
                        customChainParams,
                        hardfork
                    }
                } = res.result.txRequest;
                let transaction;
                const customCommon = Common.forCustomChain(
                    baseChain,
                    customChainParams,
                    hardfork
                );
                transaction = new EthereumTx(data, { common: customCommon });
                transaction.sign(
                    Buffer.from(privateKeys, 'hex')
                );

                const serializedTransaction = transaction.serialize();
                const web3 = new Web3(rpc);
                return new Promise((resolve) => {
                    web3.eth
                        .sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
                        .on('transactionHash', async (hash) => {
                            console.log('txHash', hash);
                            resolve(hash);
                        })
                        .on('error', (err) => {
                            console.log('error', err);
                        });
                });
            };

            const handleZk = async (res, fromAddress) => {
                const {
                    syncProvider,
                    changePubkeyLegacyMessage,
                    batchBuilder: {
                        signSyncChangePubKey,
                        addTransfer
                    },
                    syncTransfer
                } = res.result.txRequest;
                const web3Provider = new Web3(window.ethereum);
                const ethWallet = new ethers.providers.Web3Provider(web3Provider.currentProvider);
                // const syncProvider = await zksync.Provider.newHttpProvider('https://goerli-api.zksync.io/jsrpc');
                const syncWallet = await zksync.Wallet.fromEthSigner(
                    ethWallet.getSigner(fromAddress),
                    syncProvider
                );
                if (!(await syncWallet.isSigningKeySet())) {
                    const batchBuilder = syncWallet.batchBuilder(signSyncChangePubKey.params.nonce);
                    const newPubKeyHash = await syncWallet.signer.pubKeyHash();

                    const changePubKeyMessage = utils.getChangePubkeyLegacyMessage(
                        newPubKeyHash,
                        changePubkeyLegacyMessage.params.nonce,
                        changePubkeyLegacyMessage.params.accountId
                    );
                    const ethSignature = (
                        await syncWallet.getEthMessageSignature(changePubKeyMessage)
                    ).signature;

                    const changePubKeyTx = await syncWallet.signer.signSyncChangePubKey({
                        accountId: signSyncChangePubKey.params.accountId,
                        account: syncWallet.address(),
                        newPkHash: newPubKeyHash,
                        nonce: signSyncChangePubKey.params.nonce,
                        ethSignature: ethSignature,
                        validFrom: signSyncChangePubKey.params.validFrom,
                        validUntil: signSyncChangePubKey.params.validUntil,
                        fee: signSyncChangePubKey.params.fee,
                        feeTokenId: signSyncChangePubKey.params.feeTokenId,
                    });
                    batchBuilder.addChangePubKey({
                        tx: changePubKeyTx,
                        // @ts-ignore
                        alreadySigned: true,
                    });
                    batchBuilder.addTransfer({
                        to: addTransfer.params.to,
                        token: addTransfer.params.token,
                        amount: addTransfer.params.amount,
                        fee: addTransfer.params.fee,
                    });
                    const batchTransactionData = await batchBuilder.build();
                    const transactions = await submitSignedTransactionsBatch(
                        syncWallet.provider,
                        batchTransactionData.txs,
                        [batchTransactionData.signature]
                    );
                    let transaction;
                    for (const tx of transactions) {
                        if (tx.txData.tx.type !== 'ChangePubKey') {
                            transaction = tx;
                            break;
                        }
                    }
                    const transferReceipt = await transaction.awaitReceipt();
                    if (transferReceipt.success && !transferReceipt.failReason) {
                        console.log('txHash', transaction.txHash);
                        return transaction.txHash;
                    }
                } else {
                    const transaction = await syncWallet.syncTransfer(syncTransfer.params);
                    const transferReceipt = await transaction.awaitReceipt();
                    if (transferReceipt.success && !transferReceipt.failReason) {
                        console.log('txHash', transaction.txHash);
                        return transaction.txHash;
                    }
                }
            };

            const handleZkspace = async (fromAddress, fromChainId, res) => {
                const {
                    signature,
                    fastProcessing,
                    tx,
                    accountInfo,
                    message,
                    msgBytes,
                    l2Msg,
                    apiUrl,
                    registerInfo
                } = res.result.txRequest;
                let provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();

                const seed = ethers.utils.arrayify(await signer.signMessage(message));
                const privateKey = await zksync.crypto.privateKeyFromSeed(seed);

                if (registerInfo) {
                    const { registerMsg, curl } = registerInfo;
                    const pubKeyHash = ethers.utils
                        .hexlify(private_key_to_pubkey_hash(privateKey))
                        .substr(2);
                    const signMsg = registerMsg.replace(/pubKeyHash/g, pubKeyHash);
                    curl.param.tx.ethSignature = await signer.signMessage(signMsg);
                    curl.param.tx.newPkHash = `sync:` + pubKeyHash;
                    let transferResult = await axios.post(
                        apiUrl,
                        curl.param,
                        curl.ext
                    );
                    console.log('transferResult', transferResult);
                    if (transferResult?.data.success) {
                        accountInfo.pub_key_hash = transferResult.data;
                    }
                }

                const signaturePacked = sign_musig(privateKey, msgBytes);
                const pubKey = ethers.utils.hexlify(signaturePacked.slice(0, 32)).substr(2);
                const l2SignatureOne = ethers.utils
                    .hexlify(signaturePacked.slice(32))
                    .substr(2);

                const l2SignatureTwo = await signer.signMessage(l2Msg);
                const req = {
                    signature: {
                        type: signature.type,
                        signature: l2SignatureTwo,
                    },
                    fastProcessing,
                    tx: {
                        type: tx.type,
                        accountId: tx.accountId,
                        from: tx.from,
                        to: tx.to,
                        token: tx.token,
                        amount: tx.amount,
                        feeToken: tx.feeToken,
                        fee: tx.fee,
                        chainId: tx.chainId,
                        nonce: tx.nonce,
                        signature: {
                            pubKey: pubKey,
                            signature: l2SignatureOne,
                        },
                    },
                };
                let transferResult = await axios.post(apiUrl,
                    {
                        signature: req.signature,
                        fastProcessing: req.fastProcessing,
                        tx: req.tx,
                    }
                );
                const txHash = transferResult?.data?.data.replace('sync-tx:', '0x');
                console.log('txHash', txHash);
                return txHash;
            };

            const handleZksync = async (res) => {
                const provider = new zksync2.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                console.log('txRequest', res.result.txRequest);
                const transferResult = await signer.sendTransaction(res.result.txRequest);
                if (transferResult.hash) {
                    console.log('txHash', transferResult.hash);
                    return transferResult.hash;
                }
            };

            const handleStarknet = async (res) => {
                const {
                    amount,
                    tokenContract: {
                        params: {
                            erc20Abi,
                            tokenAddress,
                        }
                    },
                    crossContract: {
                        params: {
                            starkNetCrossAbi,
                            contractAddress
                        }
                    },
                    approveTransaction,
                    transferTransaction
                } = res.result.txRequest;
                let amountBig = new BigNumber(amount);
                const tokenContract = new Contract(
                    erc20Abi,
                    tokenAddress,
                    getStarknet().provider
                );

                const ownerAddress = getStarknet().selectedAddress;
                const allowances = await tokenContract.allowance(ownerAddress, contractAddress);
                const allowance = allowances?.remaining?.low;
                if (amountBig.gt(allowance)) {
                    await getStarknet().account.execute({
                        contractAddress: tokenContract.address,
                        entrypoint: approveTransaction.entrypoint,
                        calldata: approveTransaction.calldata,
                    });
                }
                const crossContract = new Contract(
                    starkNetCrossAbi,
                    contractAddress,
                    getStarknet().provider
                );
                const txhash = await getStarknet().account.execute({
                    contractAddress: crossContract.address,
                    entrypoint: transferTransaction.entrypoint,
                    calldata: transferTransaction.calldata,
                });
                if (txhash?.code === 'TRANSACTION_RECEIVED') {
                    console.log('txHash', txhash.transaction_hash);
                    return txhash.transaction_hash;
                }
            };

            const handleDydx = async (res) => {
                const {
                    createClientTransaction: {
                        params: {
                            networkId,
                            host,
                            ethereumAddress,
                            signature,
                            signingMethod
                        }
                    },
                    transferTransaction: {
                        params: {
                            clientId,
                            amount,
                            expiration,
                            receiverAccountId,
                            receiverPublicKey,
                            receiverPositionId
                        }
                    }
                } = res.result.txRequest;
                const web3 = new Web3(window.ethereum);
                const client = new DydxClient(host, {
                    networkId,
                    web3,
                });
                const userExists = await client.public.doesUserExistWithAddress(
                    ethereumAddress
                );
                if (userExists.exists) {
                    client.apiKeyCredentials = await client.onboarding.recoverDefaultApiCredentials(ethereumAddress, signingMethod);
                } else {
                    const keyPair = await client.onboarding.deriveStarkKey(ethereumAddress, signingMethod);
                    client.starkPrivateKey = keyPair;
                    const user = await client.onboarding.createUser(
                        { starkKey: keyPair.publicKey, starkKeyYCoordinate: keyPair.publicKeyYCoordinate },
                        ethereumAddress,
                        signature,
                        signingMethod
                    );
                    client.apiKeyCredentials = user.apiKey;
                }
                const { account } = await client.private.getAccount(ethereumAddress);

                const resp = await client.private.createTransfer(
                    {
                        clientId,
                        amount,
                        expiration,
                        receiverAccountId,
                        receiverPublicKey,
                        receiverPositionId
                    },
                    account.positionId
                );
                if (resp?.transfer?.id) {
                    console.log('txHash', resp?.transfer?.id);
                    return resp.transfer.id;
                }
            };

            const handleImx = async (res, fromAddress) => {
                const {
                    createClientTransaction: {
                        params: {
                            publicApiUrl,
                            starkContractAddress,
                            registrationContractAddress
                        }
                    },
                    transferTransaction
                } = res.result.txRequest;
                const web3Provider = new Web3(window.ethereum);
                const provider = new providers.Web3Provider(web3Provider.currentProvider);
                const signer = provider.getSigner(fromAddress);

                const imxClient = await ImmutableXClient.build({
                    publicApiUrl,
                    signer,
                    starkContractAddress,
                    registrationContractAddress,
                });

                const resp = await imxClient.transfer(transferTransaction.params);

                if (resp?.transfer_id) {
                    console.log('txHash', resp?.transfer_id);
                    return resp?.transfer_id;
                }
            };

            const handleLoopring = async (res) => {
                const {
                    netWorkId,
                    generateKeyPairFunc,
                    getUserApiKeyFunc,
                    getNextStorageIdFunc,
                    submitInternalTransaction
                } = res.result.txRequest;

                const userApi = new UserAPI({ chainId: netWorkId });
                const web3 = new Web3(window.ethereum);

                const eddsaKey = await generateKeyPair({
                    web3,
                    ...generateKeyPairFunc.params
                });

                const { apiKey } = await userApi.getUserApiKey(
                    getUserApiKeyFunc.params,
                    eddsaKey.sk
                );
                if (!apiKey) {
                    throw Error('Get Loopring ApiKey Error');
                }
                // step 3 get storageId
                const storageId = await userApi.getNextStorageId(
                    getNextStorageIdFunc.params,
                    apiKey
                );
                const request = submitInternalTransaction.params.request;
                request.storageId = storageId.offchainId;
                // step 4 transfer
                const response = await userApi.submitInternalTransfer({
                    request,
                    web3: web3,
                    eddsaKey: eddsaKey.sk,
                    apiKey: apiKey,
                    chainId: submitInternalTransaction.params.chainId,
                    walletType: submitInternalTransaction.params.walletType,
                    isHWAddr: submitInternalTransaction.params.isHWAddr,
                });
                if (response?.hash) {
                    console.log('txHash', response.hash);
                    return response.hash;
                }
            };

            onMounted(async () => {
                const chainRes = await http3.get(`/chains`);
                if (chainRes.code === 0) {
                    const { result } = chainRes;
                    const options = [];
                    for (const data of result) {
                        options.push({ label: data.name, value: data.internalId });
                        chainIdMap[data.internalId] = data.chainId;
                    }
                    form.toChainIdOptions = form.fromChainIdOptions = options;
                }
                const tokenRes = await http3.get(`/tokens`);
                if (tokenRes.code === 0) {
                    const { result } = tokenRes;
                    for (const data of result) {
                        const options = [];
                        const mainToken = data.nativeCurrency.symbol;
                        options.push({ label: mainToken, value: mainToken });
                        options.push(...data.tokens.map(item => {
                            return { label: item.symbol, value: item.symbol };
                        }));
                        tokenMap[data.internalId] = options;
                    }
                    form.fromSymbolOptions = tokenMap[form.fromChainId];
                    form.toSymbolOptions = tokenMap[form.toChainId];
                }
            });
            const changeFromChainId = () => {
                form.fromSymbolOptions = tokenMap[form.fromChainId];
            };
            const changeToChainId = () => {
                form.toSymbolOptions = tokenMap[form.toChainId];
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
