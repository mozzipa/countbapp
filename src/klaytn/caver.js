/**
 * caver-js library helps making connection with klaytn node.
 * You can connect to specific klaytn node by setting 'rpcURL' value.
 * default rpcURL is 'https://api.baobab.klaytn.net:8651'.
 */
import Caver from 'caver-js' // caver-js는 HTTP 또는 웹소켓 연결을 사용하여 Klaytn 노드와 상호작용할 수 있도록 하는 자바스크립트 API 라이브러리입니다.

/**
 * Endpoint Node URL 주소
 * mainnet : https://api.cypress.klaytn.net:8651/
 * baobab : https://api.baobab.klaytn.net:8651/
 */
const BAOBAB_TESTNET_RPC_URL = 'https://api.baobab.klaytn.net:8651/'

const rpcURL = BAOBAB_TESTNET_RPC_URL

const caver = new Caver(rpcURL)

export default caver
