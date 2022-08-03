import React, { Component } from 'react'
import caver from 'klaytn/caver'

import './BlockNumber.scss'

/**
 * BlockNumber component get the current block number per 1 second.(1000ms)
 * current block number can be fetched through caver.js library
 * which make a connection, communicating with klaytn node.
 * cf) If you want to connect to specific klaytn node,
 * change 'rpcURL' config in klaytn/caver.js
 */
class BlockNumber extends Component {
  /**
   * BlockNumber component has a 'currentBlockNumber' state.
   */
  state = {
    currentBlockNumber: '...loading',
  }

  /**
   * 'getBlockNumber' method works
   * 1) get current block number from klaytn node by calling 'caver.klay.getBlockNumber()'
   * 2) set 'currentBlockNumber' state to the value fetched from step 1).
   * getBlockNumber 메서드는 비동기 함수로 선언됩니다. 함수를 비동기로 선언하면 비동기 값(promise)을 쉽게 처리할 수 있습니다. cav.klay.getBlockNumber는 프로미스를 반환하고 await 키워드를 추가하여 해당 결과를 쉽게 처리할 수 있습니다.
   * cav.klay.getBlockNumber()의 결과로 반환된 현재 블록 번호를 blockNumber에 저장했다면 this.setState 리액트 API를 호출합니다. 
   * this.setState({ currentBlockNumber: blockNumber })은 말 그대로 상태를 나타내는 변수 currentBlockNumber를 blockNumber로 설정합니다. this.setState(nextState)는 현재 상태를 업데이트하고 컴포넌트를 다시 렌더링합니다.
   */
  getBlockNumber = async () => {
    const blockNumber = await caver.klay.getBlockNumber()
    this.setState({ currentBlockNumber: blockNumber })
  }

  /**
   * intervalId value will be populated by the value returned from `setInterval`.
   * intervalId will be used to clear interval, preventing memory leak.
   */
  intervalId = null

  /**
   * In 'componentDidMount' lifecycle, call 'getBlockNumber' method intervally.
   * 튜토리얼의 애플리케이션이 현재 블록 번호를 생생하게 보여주게 하기 위해서 getBlockNumber를 1초(1000ms)에 한 번씩 호출하겠습니다. setInterval 함수로 주기적인 호출을 할 수 있습니다. 
   * setInterval(func, delay)는 특정 시간마다 반복적으로 주어진 함수를 호출합니다. 또한 setInterval의 실행 후 어떤 식별자가 반환되는데요. 이렇게 반환된 식별자를 this.intervalId 변수에 저장합니다. 이후에 설정된 주기를 초기화할 때 이 식별자를 사용합니다.
   */
  componentDidMount() {
    this.intervalId = setInterval(this.getBlockNumber, 1000)
  }

  /**
   * In 'componentWillUnmount' lifecycle, clear interval
   * which calls getBlockNumber per 1000ms.
   * 컴포넌트의 마운트를 해제하면 주기를 초기화하여 현재 블록 번호를 불러오는 것을 중지하세요.
   */
  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  /**
   * In 'render' lifecycle, show 'currentBlockNumber' state like below:
   * <p>Block No. {currentBlockNumber}</p>
   */
  render() {
    const { currentBlockNumber } = this.state
    return (
      <div className="BlockNumber">
        <p className="BlockNumber__current">Block No. {currentBlockNumber}</p>
      </div>
    )
  }
}

export default BlockNumber
