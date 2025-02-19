import React, { Component } from 'react'
import cx from 'classnames'
import caver from 'klaytn/caver'

import './Count.scss'

/**
 * 'Count' 컴포넌트의 역할은 Klaytn 블록체인에 배포된 Count 컨트랙트와 상호작용하는 것입니다.
  In Count.sol, we declared several variables and functions like below:
  1.count
  2.lastParticipant
  3.plus - increase count storage variable by 1. (count = count + 1)
  4.minus - decrease count storage variable by 1. (count = count - 1)
Count.js 컴포넌트에는 Count 컨트랙트의 함수 및 변수와 상호작용하는 메서드가 있습니다.
 */

/**
 * To interact with the contract, we need a contract instance of the deployed contract.
  The contract instance can be made through caver.klay.Contract(ABI, contractAddress) API of caver-js. 자세한 내용은 caver.klay.Contract을 참고해주세요.
  With Contract ABI(Application Binary Interface), caver can call the contract method as if it is a local function,
  for example)
  contractInstance.methods.count().call()
  contractInstance.methods.plus().send({ ... })
  contractInstance.methods.minus().send({ ... })
  Contract address는 해당 컨트랙트의 컴파일 및 배포 이후에 build/contracts/Count.json 파일에서 찾을 수 있습니다. 여러분의 편의를 위해 Klaytn 테스트넷에 해당 컨트랙트를 배포하고 deployedABI와 deployedAddress 파일을 디렉토리에 넣어두었습니다. Those files contain the ABI of the Count contract and the deployed contract address.
  Thanks to the webpack configuration, we can access them via variables. (DEPLOYED_ADDRESS, DEPLOYED_ABI)
  For example)
  DEPLOYED_ADDRESS returns the deployed contact ddress.
  DEPLOYED_ABI returns the Count contract ABI.
 */
class Count extends Component {
  constructor() {
    super()
    // ** 1. 컨트랙트 인스턴스 생성 **
    // 예시: new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS)
    // 이 인스턴스를 통해 컨트랙트 메서드를 호출할 수 있습니다.
    // 이제 `this.countContract` 변수로 이 인스턴스에 접근할 수 있습니다.
    this.countContract = DEPLOYED_ABI
      && DEPLOYED_ADDRESS
      && new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS) // DEPLOYED_ABI와 DEPLOYED_ADDRESS를 cav.klay.Contract API에 전달하여 배포된 Count 컨트랙트와 상호작용할 컨트랙트 인스턴스를 생성합니다. 그리고 이 컨트랙트 인스턴스는 this.countContract에 저장됩니다.
    this.state = {
      count: '',
      lastParticipant: '',
      isSetting: false,
    }
  }

  intervalId = null

  getCount = async () => {
    /**
     * 컨트랙트 인스턴스가 있으므로 컨트랙트 메서드를 호출할 수 있습니다. Contract instance has a property, methods.
      It contains the functions of the contract, for example, count, lastParticipant, plus, and minus.
      컨트랙트 함수 호출이 프로미스 객체를 반환하기 때문에 위 코드에서 getCount 함수는 async로 선언되었습니다. We can fetch the count by calling this.countContract.methods.count().call().
      We can fetch the lastParticipant address by calling this.countContract.methods.lastParticipant().call().
      After fetching those variables, we set the state properties, count and lastParticipant with the received values.
      컨트랙트 메서드 호출에 대한 자세한 안내는 caver.klay.Contract를 참고해주세요.

        componentDidMount()에서 호출된다.
     */
    // ** 2. 컨트랙트 메서드 호출(CALL) **
    // 예시: this.countContract.methods.methodName(arguments).call()
    // 위와 같이 컨트랙트 메서드(CALL)를 호출할 수 있습니다.
    // 예를 들어 컨트랙트에 `count`라는 메서드가 있을 때,
    // 해당 메서드를 아래와 같이 호출할 수 있습니다.
    // 예시: this.countContract.methods.count().call()
    // 이는 프로미스를 반환하므로 .then() 또는 async-await으로 접근할 수 있습니다.
    const count = await this.countContract.methods.count().call()
    const lastParticipant = await this.countContract.methods.lastParticipant().call()
    this.setState({
      count,
      lastParticipant,
    })
  }

  setPlus = () => {
    /**
     * setPlus 함수는 Count 컴포넌트에서 가장 중요한 부분입니다. 이 함수는 컨트랙트 함수인 plus를 호출하여 컨트랙트와 상호작용합니다. Since this function is also a contract method, it is contained in the this.counterContract.methods.
      However, unlike count and lastParticipant that just reads data, plus function writes data to the Klaytn blockchain.
      Reading data is free, however writing data incurs cost for the use of computation and storage. 그리고 그 비용은 사용한 gas의 양에 따라 측정됩니다.
      따라서 트랜잭션을 보내려면 트랜잭션 수수료를 담당하는 Klaytn 노드에게 from: 속성을 알려야 합니다. gas: 트랜잭션 발신자가 트랜잭션을 보낼 때 지불하고자 하는 최대 가스양을 나타내는 속성입니다.
     */
    const walletInstance = caver.klay.accounts.wallet && caver.klay.accounts.wallet[0]

    // 컨트랙트 메서드 호출을 위해 지갑을 연동해야 합니다.
    if (!walletInstance) return

    this.setState({ settingDirection: 'plus' })

    // 3. ** 컨트랙트 메서드 호출 (SEND) **
    // 예시: this.countContract.methods.methodName(arguments).send(txObject)
    // 위와 같이 컨트랙트 메서드(SEND)를 호출할 수 있습니다.
    // 예를 들어 컨트랙트에 `plus`라는 메서드가 있을 때,
    // You can call it like below:
    // ex:) this.countContract.methods.plus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // PUT YOUR ADDRESS
    //   gas: '200000',
    // })
    this.countContract.methods.plus().send({ //트랜잭션을 보내려면 .call() 대신 .send()을 사용하는 것이 좋습니다.
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', (txHash) => {
        /**
         * 트랜잭션의 생명 주기
         * After sending a transaction, you can get the transaction status along the life cycle.
          transactionHash event is fired when you get the transaction hash. It is available before sending the transaction over the network.
          receipt is fired,when you can get the transaction receipt. 이는 트랜잭션이 블록에 들어갔음을 의미합니다. You can get the block number that contains your transaction by receipt.blockNumber.
          error is fired when an error occurred while sending a transaction.
          참고) settingDirection는 로딩 표시기(gif)를 보여주는 데에 사용됩니다. 트랜잭션이 블록에 포함되면 settingDirection을 null로 설정하여 로딩 표시기를 제거하세요.
         */
        console.log(`
          Sending a transaction... (Call contract's function 'plus')
          txHash: ${txHash}
          `
        )
      })
      .once('receipt', (receipt) => {
        console.log(`
          Received receipt! It means your transaction(calling plus function)
          is in klaytn block(#${receipt.blockNumber})
        `, receipt)
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        })
      })
      .once('error', (error) => {
        alert(error.message)
        this.setState({ settingDirection: null })
      })
  }

  setMinus = () => {
    const walletInstance = caver.klay.accounts.wallet && caver.klay.accounts.wallet[0]

    // 컨트랙트 메서드 호출을 위해 지갑을 연동해야 합니다.
    if (!walletInstance) return

    this.setState({ settingDirection: 'minus' })

    // 3. ** 컨트랙트 메서드 호출 (SEND) **
    // 예시: this.countContract.methods.methodName(arguments).send(txObject)
    // 위와 같이 컨트랙트 메서드(SEND)를 호출할 수 있습니다.
    // 예를 들어 컨트랙트에 `minus`라는 메서드가 있을 때,
    // 해당 메서드를 다음과 같이 호출할 수 있습니다.
    // 예시: this.countContract.methods.minus().send({
    //   from: '0x952A8dD075fdc0876d48fC26a389b53331C34585', // 본인의 주소를 적으세요.
    //   gas: '200000',
    // })

    // 이는 이벤트 이미터를 반환하므로 전송 후에 이벤트로 결과를 받아올 수 있습니다.
    // .on('transactionHash') 이벤트를 사용하세요.
    // : 트랜잭션을 전송한 후 로직을 처리하려는 경우
    // .once('receipt') 이벤트를 사용하세요.
    // : 트랜잭션이 블록에 포함된 후 로직을 처리하려는 경우
    // ex:) .once('receipt', (data) => {
    //   console.log(data)
    // })
    this.countContract.methods.minus().send({
      from: walletInstance.address,
      gas: '200000',
    })
      .once('transactionHash', (txHash) => {
        console.log(`
          Sending a transaction... (Call contract's function 'minus')
          txHash: ${txHash}
          `
        )
      })
      .once('receipt', (receipt) => {
        console.log(`
          Received receipt which means your transaction(calling minus function)
          is in klaytn block(#${receipt.blockNumber})
        `, receipt)
        this.setState({
          settingDirection: null,
          txHash: receipt.transactionHash,
        })
      })
      .once('error', (error) => {
        alert(error.message)
        this.setState({ settingDirection: null })
      })
  }

  componentDidMount() {
    /**
     * We want to fetch the count variable per 1 second, it can be achieved by setInterval.
     * It is the same as we did in the getBlockNumber in BlockNumber.js which calls caver.klay.getBlockNumber() intervally.
     */
    this.intervalId = setInterval(this.getCount, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { lastParticipant, count, settingDirection, txHash } = this.state
    return (
      <div className="Count">
        {Number(lastParticipant) !== 0 && (
          <div className="Count__lastParticipant">
            last participant: {lastParticipant}
          </div>
        )}
        <div className="Count__count">COUNT: {count}</div>
        {/* 
        - 버튼을 클릭하여 Plus Minus 기능을 호출할 수 있게 됩니다.
        - 버튼을 누른 후의 과정을 요약하면 다음과 같습니다.
        1. 컨트랙트 메서드인 plus를 호출하여 트랜잭션을 보냅니다.
        2. Just after sending a transaction, you will receive the transaction hash.
            3-a. After your transaction has been processed and included in a block, you will receive the transaction receipt.
            3-b. 트랜잭션을 보내는 동안 에러가 발생하면 에러 메세지를 받습니다. 그리고 receipt 블록은 호출되지 않습니다.
        */}
        <button
          onClick={this.setPlus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'plus',
          })}
        >
          +
        </button>
        <button
          onClick={this.setMinus}
          className={cx('Count__button', {
            'Count__button--setting': settingDirection === 'minus',
          })}
          disabled={count == 0}
        >
          -
        </button>
        {txHash && (
          <div className="Count__lastTransaction">
            <p className="Count__lastTransactionMessage">
              You can check your last transaction in klaytnscope:
            </p>
            <a
              target="_blank"
              href={`https://scope.klaytn.com/transaction/${txHash}`}
              className="Count__lastTransactionLink"
            >
              {txHash}
            </a>
          </div>
        )}
      </div>
    )
  }
}

export default Count
