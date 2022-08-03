import React, { Component, Fragment } from 'react'
import cx from 'classnames'
import caver from 'klaytn/caver'

import './Auth.scss'

/**
 * 1) 배경지식
      In a blockchain-based app, we usually interact with smart contracts.
      There are 2 types of interactions with a contract.
      1) Read data from a contract. 2) Write data to a contract.
      It is cost-free to read data from contracts.
      On the other hand, there is a cost for writing data to contract.
      cf) Sending a transaction
      Writing data to contracts or blockchain is called 'sending a transaction'.
      For example, if you send 5 KLAY to your friend, you could think of it as writing data to the blockchain that I sent 5 KLAY to my friend.
      Calling a contract method is the same. 즉 변수 X를 100으로 설정하겠다는 데이터를 스마트 컨트랙트에 기록한다고 볼 수 있습니다. 이처럼 블록체인이나 스마트 컨트랙트에 데이터를 기록하는 것과 관련된 모든 것은 트랜잭션 보내기랍니다.
      To write data to contract, you should have a Klaytn account which has KLAY to pay for the transaction fee.
      Auth component helps you log in to your app.

      Main features are:
      1) User can input private key to login.
      2) User can import a keystore file and input password to login.
      3) User can logout and clear the wallet instance information from the browser.

 */

/**
 * Auth component manages authentication.
 * It provides two different access method.
 * 1) By keystore(json file) + password
 * 2) By privatekey
 */
class Auth extends Component {
  constructor() {
    super()
    this.state = {
      accessType: 'keystore', // || 'privateKey'
      keystore: '',
      keystoreMsg: '',
      password: '',
      privateKey: '',
    }
  }

  handleChange = (e) => { // password 저장에 사용.
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  /**
   * reset method reset states to intial state.
   */
  reset = () => {
    this.setState({
      keystore: '',
      privateKey: '',
      password: '',
      keystoreMsg: ''
    })
  }

  /**
   * 키스토어와 비밀번호로 로그인하려면 handleImport와 handleLogin 메서드가 필요합니다.
   * handleImport method takes a file, read
   */
  handleImport = (e) => {
    const keystore = e.target.files[0] // e.target.files[0] contains meta information for the file. To read the content of the file, we call fileReader.readAsText(keystore) API.
    // 'FileReader'는 파일의 내용을 읽어오는 데에 사용됩니다.
    // 'onload' 핸들러와 'readAsText' 메서드를 사용할 것입니다.
    // * FileReader.onload
    // - 이 이벤트는 읽기 작업이 완료될 때마다 발생합니다.
    // * FileReader.readAsText()
    // - 내용을 읽어오기 시작합니다.
    const fileReader = new FileReader()
    fileReader.onload = (e) => { // After calling fileReader.readAsText(keystore), fileReader.onload function fires to take the content of the file as e.target.result. After importing the keystore file, we get password input.
      try {
        if (!this.checkValidKeystore(e.target.result)) {
          // If key store file is invalid, show message "Invalid keystore file."
          this.setState({ keystoreMsg: 'Invalid keystore file.' })
          return
        }
        // If key store file is valid,
        // 1) set e.target.result keystore
        // 2) show message "It is valid keystore. input your password."
        this.setState({
          keystore: e.target.result,
          keystoreMsg: 'It is valid keystore. input your password.', // passwork input은 221행 쯤.  입력된 값은 handleChange 메서드를 통해 password에 저장됩니다.
          keystoreName: keystore.name,
        }, () => document.querySelector('#input-password').focus())
      } catch (e) {
        this.setState({ keystoreMsg: 'Invalid keystore file.' })
        return
      }
    }
    fileReader.readAsText(keystore)
  }

  checkValidKeystore = (keystore) => {
    // e.target.result is popultaed by keystore contents.
    // Since keystore contents is JSON string, we should parse it to use.
    const parsedKeystore = JSON.parse(keystore)

    // Valid key store has 'version', 'id', 'address', 'crypto' properties.
    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.crypto

    return isValidKeystore
  }

  /**
   * handleLogin method
   * 키스토어 파일과 비밀번호가 모두 준비되었다면,
   * We can now decrypt the keystore file to extract the private key through cav.klay.accounts.decrypt(keystore, password) API. This API returns a wallet instance containing the private key. 개인키를 가져오면, 앞서 사용한 방법 그대로 integrateWallet 메서드를 사용할 수 있습니다.
   */
  handleLogin = () => {
    const { accessType, keystore, password, privateKey } = this.state

    // Access type2: access thorugh private key
    if (accessType == 'privateKey') {
      this.integrateWallet(privateKey)
      return
    }

    // Access type1: access through keystore + password
    try {
      const { privateKey: privateKeyFromKeystore } = caver.klay.accounts.decrypt(keystore, password)
      this.integrateWallet(privateKeyFromKeystore)
    } catch (e) {
      this.setState({ keystoreMsg: `Password doesn't match.` })
    }
  }

  /**
   * getWallet method get wallet instance from caver.
   */
  getWallet = () => {
    if (caver.klay.accounts.wallet.length) {
      return caver.klay.accounts.wallet[0]
    }
  }

  /**
   * 개인키로 로그인하려면 integrateWallet 메서드가 필요합니다.
   * integrateWallet method integrate wallet instance to caver. 개인키로 로그인하기 위한 함수.
   * In detail, this method works like the step below:
   * 1) it takes private key as an input argument. 
   * 2) get wallet instance through caver with private key.
   * 3) set wallet instance to session storage for storing wallet instance
   * cf) session storage stores item until tab is closed.
   */
  integrateWallet = (privateKey) => { //PrivateKey를 인자로 받아서 지갑 인스턴스를 생성한다.
    const walletInstance = caver.klay.accounts.privateKeyToAccount(privateKey) // walletInstance 변수에 지갑 인수턴스를 할당한다.
    caver.klay.accounts.wallet.add(walletInstance) // Transaction을 보내기 위해서 지갑 인스턴스를 caver에 추가한다.
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance)) // 브라우저 세션 저장공간에 값을 저장하기 위한 브라우저 API : sessionStorage.setItem. 새로고침을 해도 로그인 기록이 사라지지 않도록 하기 위해서 JSON string 으로써 session storage에 지갑 인스턴스 저장.
    this.reset() // input 정리.
  }

  /**
   * 사용자 로그아웃 후 브라우저에서 지갑 인스턴스 정보를 삭제
   * removeWallet method removes
   * 1) wallet instance from caver.klay.accounts
   * 2) 'walletInstance' value from session storage.
   * 'logout' means removing the wallet instance from the browser and caver.
   * cav.klay.accounts.wallet.clear() removes all wallet instances from caver.
   * sessionStorage.removeItem('walletInstance') removes the wallet instance from the browser's session storage.
   */
  removeWallet = () => {
    caver.klay.accounts.wallet.clear()
    sessionStorage.removeItem('walletInstance')
    this.reset()
  }

  /**
   * toggleAccessType method toggles access type
   * 1) By keystore.
   * 2) By private key.
   * After toggling access type, reset current state to intial state.
   */
  toggleAccessType = () => {
    const { accessType } = this.state
    this.setState({
      accessType: accessType === 'privateKey' ? 'keystore' : 'privateKey'
    }, this.reset)
  }

  renderAuth = () => {
    const { keystore, keystoreMsg, keystoreName, accessType } = this.state
    const walletInstance = this.getWallet()
    // 'walletInstance' exists means that wallet is already integrated.
    if (walletInstance) {
      return (
        <Fragment>
          <label className="Auth__label">Integrated: </label>
          <p className="Auth__address">{walletInstance.address}</p>
          <button className="Auth__logout" onClick={this.removeWallet}>Logout</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        {accessType === 'keystore'
          // View 1: Access by keystore + password.
          ? (
            <Fragment>
              <div className="Auth__keystore">
                <p className="Auth__label" htmlFor="keystore">Keystore:</p>
                <label className="Auth__button" htmlFor="keystore">Upload</label>
                <input
                  className="Auth__file"
                  id="keystore"
                  type="file"
                  onChange={this.handleImport}
                  accept=".json"
                />
                <p
                  className="Auth__fileName">
                  {keystoreName || 'No keystore file...'}
                </p>
              </div>
              <label className="Auth__label" htmlFor="password">Password:</label>
              <input 
                id="input-password"
                className="Auth__passwordInput"
                name="password"
                type="password"
                onChange={this.handleChange} // 입력된 값은 handleChange 메서드를 통해 password에 저장됩니다.
              />
            </Fragment>
          )
          // View 2: Access by private key.
          : (
            <Fragment>
              <label className="Auth__label">Private Key:</label>
              <input
                className="Auth__input"
                name="privateKey"
                onChange={this.handleChange}
              />
            </Fragment>
          )
        }
        <button className="Auth__button" onClick={this.handleLogin}>Login</button>
        <p className="Auth__keystoreMsg">{keystoreMsg}</p>
        <p className="Auth__toggleAccessButton" onClick={this.toggleAccessType}>
          {accessType === 'privateKey'
            ? 'Want to login with keystore? (click)'
            : 'Want to login with privatekey? (click)'
          }
        </p>
      </Fragment>
    )
  }

  render() {
    const { keystore } = this.state
    return (
      <div className={cx('Auth', {
        // If keystore file is imported, Adds a 'Auth--active' classname.
        'Auth--active': !!keystore,
      })}
      >
        <div className="Auth__flag" />
        <div className="Auth__content">
          {this.renderAuth()}
        </div>
      </div>
    )
  }
}

export default Auth
