/**
 * truffle-config.js : truffle의 환경설정 파일입니다.
 * 
 * 
 * 원격 EN 노드로 배포하려면 truffle-hdwallet-provider-klaytn을 사용해야 합니다.
 * truffle-hdwallet-provider-klaytn은 truffle-hdwallet-provider에서 파생된 자바스크립트 HD 지갑 제공자입니다.
 * truffle-hdwallet-provider : HD Wallet(Hierarchical Deterministic Wallet)을 이용하는 Web3 provider 구현 패키지입니다. HD Wallet은 하나의 Mnemonic Phrases라는 12개의 단어를 사용하여 2의 32 승개의 주소가 자동으로 결정되는 암호화폐 지갑 방식입니다. 대부분의 지갑들은 이 방식을 사용하며 네트워크에 따라 Mnemonic Phrases를 구성하는 단어 수는 다른 경우도 있습니다.
 */

/**
 * truffle-config.js는 컨트랙트 코드를 어떻게 배포할지에 대한 파일입니다. truffle-config.js에서 다음 항목들을 설정할 수 있습니다.
  1) Who will deploy the contract (Which Klaytn account will deploy the contract)?
  2) Which network will you deploy to?
  3) How many gas are you willing to pay to deploy the contract?
  컨트랙트를 배포하는 데에는 개인키를 이용하는 방법과 잠금 해제된 계정을 이용하는 방법 두 가지가 있습니다 
*/
const HDWalletProvider = require("truffle-hdwallet-provider-klaytn")

/**
 * NETWORK_ID: Specifies the network id in Klaytn (1001 for Baobab)
 * URL: URL for the remote node you will be using
 * Endpoint Node URL 주소
 * mainnet : https://api.cypress.klaytn.net:8651
 * baobab : https://api.baobab.klaytn.net:8651
 * GASLIMIT: How much gas limit will you endure to deploy your contract. 가스의 최대용량
 */
const NETWORK_ID = '1001'
const URL = 'https://api.baobab.klaytn.net:8651'
const GASLIMIT = '8500000'

/**
 * ** WARNING **
 * You shouldn't expose your private key. Otherwise, your account would be hacked.
 * PRIVATE_KEY: Private key of the account that pays for the transaction (Change it to your own private key)
 */
const PRIVATE_KEY = '0x2e09cbdb9fd9c00e014002109bbe7f5548c4421368d847b401acdc2fedf2ebe6'


module.exports = {
  /**
   * [ truffle deploy --network baobab ] 명령어로 컨트랙트 배포시 네트워크별 사용되는 옵션입니다.
   * gasPrice : 1 가스당 지불할 가격입니다. 현재 Klaytn에서는 1 가스당 가격이 25000000000으로 고정되어 있습니다. null로 설정하면 트러플에서 자동으로 고정 가스 가격이 설정됩니다.
   * 컨트랙트를 배포하는 데에는 개인키를 이용하는 방법과 잠금 해제된 계정을 이용하는 방법 두 가지가 있습니다.
   * 사용된 방법은 개인키를 이용하는 방법입니다. 잠금 해제된 계정을 이용하는 방법은 꽤 까다롭습니다. Klaytn 풀노드가 필요하며, Klaytn 노드 콘솔에 접속해서 작업해야 합니다.
   */
  networks: {
    /**
     * 1. DEPLOY METHOD 1: By private key
     * If you want to deploy your contract using the private key, `provider` option is needed.
     * 1) Pass your private key as the 1st argument of `new HDWalletProvider()`.
     * 2) Pass your Klaytn node's URL as the 2nd argument of `new HDWalletProvider()`.
     *
     * If you deploy your contract with private key connector,
     * You don't need to set `host`, `port`, `from` option.
     */
    baobab: {
      // 배포 방법 1: 개인키
      // 경고: 개인키를 노출하면 안 됩니다. 만약 노출할 경우 계정이 해킹될 수도 있습니다.
      // 개인키를 사용하여 컨트랙트를 배포하려면 provider 옵션이 필요합니다.
      // 1) Pass your private key as the 1st argument of new HDWalletProvider().
      // 2) Pass your Klaytn node's URL as the 2nd argument of new HDWalletProvider().
      provider: () => new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
      // 위의 코드에서 networks 속성을 봐주세요. 이 속성에는 baobab 키가 있는데, 이 키에는 또 다시 provider, network_id, gas, gasPrice 등 4개의 속성이 있습니다.
      // provider: new HDWalletProvider(PRIVATE_KEY, URL) 행은 컨트랙트를 배포하는 계정과 배포 대상 네트워크의 노드 URL을 받아옵니다.
      // network_id: NETWORK_ID 행은 Klaytn에서의 네트워크 ID를 지정합니다. Baobab 네트워크(testnet)는 1001입니다.
      // gas: GASLIMIT 행은 컨트랙트를 배포하는 데에 얼마까지 가스를 지불할 것인지 한도를 지정합니다.
      // gasPrice: null 행은 1 가스당 지불할 금액을 트러플에 전달합니다. 현재 Klaytn에서는 1 가스당 가격이 25000000000으로 고정되어 있습니다. 이 부분을 null로 설정하면 트러플에서 자동적으로 고정 가스 가격으로 설정합니다.
    },

    /**
     * 2. DEPLOY METHOD 2: By unlocked account
     * You must set `host`, `port`, `from` option
     * to deploy your contract with unlocked account.
     *
     * If you deploy your contract with unlocked account on klaytn node,
     * You don't need to set `provider` option.
     * 베포 방법 2: 잠금 해제된 계정을 이용(어려운 방법)
        To deploy a contract by unlocked account, you should have your Klaytn full node.
        Access your Klaytn node console by typing $ klay attach http://localhost:8551 If you don't have a Klaytn account in the node, generate it by typing personal.newAccount() on the console.
        If you already have one, unlock your account through personal.unlockAccount().
        After ensuring account is unlocked,
        you should set the properties, host, port, network_id, and from. 1) Which network to deploy (host, port, network_id)
        2) Who will deploy (from) 3) How much gas will you endure to deploy your contract (gas)
        잠금 해제한 계정을 from에 입력하세요. 자체적으로 Klaytn 풀노드를 운용 중이라면 해당 노드의 호스트를 host로, 포트 번호를 port로 설정하세요.
        예시) 아래의 baobab: { 이하 내용 참조
     */
    // baobab: {
    //   host: HOST,
    //   port: PORT,
    //   network_id: NETWORK_ID,
    //   from: FROM,
    //   gas: GASLIMIT,
    //   gasPrice: null,
    // },

  },
  // 3. Specify the version of compiler, we use 0.5.6
  compilers: {
    solc: {
      version: '0.5.6',
    },
  },
}
