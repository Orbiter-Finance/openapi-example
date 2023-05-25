## Orbiter-OpenApi 用例示范
### 运行环境
```
node 14+
```
### 项目运行
```
npm install
npm run dev
```
### 介绍
```
交易发送查看sendTx函数。有两种发送方式，可以使用前端钱包发送或者服务端私钥发送
测试网支持[网络名称(内部ID)]: Görli(5)、Arbitrum(22)、Polygon(66)、Optimism(77)、zkSync Era(514)、BSC(515)、Polygon zkEVM(517)、Scroll Alpha(519)、Base(521)、Linea(522)
API文档 https://openapi2.orbiter.finance/swagger-ui/index.html
```
### 实现过程
```
https://openapi2.orbiter.finance/v1/tx?id=${ id }&value=${ value }&fromAddress=${ fromAddress }&toAddress=${ toAddress }&type=${ type }
id:交易对ID,由内部ID和币种组成,如5-22:ETH-USDT代表从Görli网络发送ETH，在Arbitrum网络接收USDT
value:金额 fromAddress:发送地址 toAddress:接收地址 type:执行方式(1.钱包调用 2.私钥调用)
注:跨地址、跨币种是通过合约交互，交易费用较高
例:https://openapi2.orbiter.finance/v1/tx?id=5-22:ETH-ETH&value=0.005&fromAddress=0xD2712E385A72E2810C9858Fb6E149755dA5E2630&type=1

获取到以上/v1/tx接口数据{txResponse, txRequest}
使用ethers工具包将txRequest进行签名发送
```
