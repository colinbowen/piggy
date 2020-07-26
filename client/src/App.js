import React, { Component } from "react";
import Timelock from './contracts/Timelock.json'
import getWeb3 from "./getWeb3";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home'
import Navigation from './components/Navigation'

import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/'
import Container from 'react-bootstrap/Container'

var moment = require('moment'); // require

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, currentPrice: 0, balance: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Timelock.networks[networkId];

      const instance = new web3.eth.Contract(
        Timelock.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({ address: this.state.contract.options.address })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

    this.getBalance()
    this.getLockStatus();
  };

  getBalance = async () => {
    const { web3, contract } = this.state;
    let balance = await contract.methods.balance().call();

    console.log(balance);
    balance = web3.utils.fromWei(balance, 'ether');
    this.setState({ balance: balance });
  }

  lockContract = async () => {
    const { contract } = this.state;
    const result = await contract.methods.lock("1695780490").call();

    console.log(result);
  }

  releaseContract = async () => {
    const { contract } = this.state;

    const result = await contract.methods.release().call();

    console.log(result);

  }

  deposit = async () => {
    const { accounts, contract, web3, address } = this.state;

    const send = await contract.methods.deposit().send({
      from: accounts[0],
      to: address,
      value: web3.utils.toWei('1', "ether"),
      gas: 470000,
    })

    console.log(send)
    this.getBalance();

  }

  getLockStatus = async () => {
    const { contract } = this.state;

    const result = await contract.methods.lockStatus().call();

    console.log(result)

  }

  getReleaseTime = async () => {
    const { contract } = this.state;

    const result = await contract.methods.getReleaseTime().call();

    console.log(result)

  }


  updatePrice = async () => {
    // const latestPrice = await contract.methods.getLatestPrice().call();

    // console.log(latestPrice);

    // const latestPriceTimestamp = await contract.methods.getLatestPriceTimestamp().call();

    // console.log(latestPriceTimestamp);

  }

  runExample = async () => {
    const { contract } = this.state;

    console.log(contract);

    // Stores a given value, 5 by default.
    // const response = await contract.methods.getLatestPrice().call();
    // await contract.methods.set(10).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <p>Loading Web3, accounts, and contract...</p>;
    }
    return (
      <div className="App">
        <Navigation />
        <Home storageValue={this.state.storageValue} />

        <br></br>
        <br></br>

        <p>Current ETH Reference Price: {this.state.currentPrice}</p>
        <p>Total ETH Stored: {this.state.balance}</p>
        {this.state.locked ? <p>Locked Until: {this.state.releaseTime}</p> : <p>Piggy Bank is not locked</p>}

        <br></br>
        <br></br>

        <Container>
          <Button onClick={this.deposit} variant="primary" size="lg" block>Send 1 Ether to Piggybank</Button>
          <Button onClick={this.updatePrice} variant="info" size="lg" block>Get Latest Ether Price</Button>
          <br></br>
          {this.state.locked ? <p>Locked Until: {this.state.releaseTime}</p>
            :<>
            <ButtonGroup>
            <Button onClick={this.lockContract} variant="secondary" size="lg">Lock for 1 day</Button>
            <Button onClick={this.lockContract} variant="warning" size="lg">Lock for 1 week</Button>
            <Button onClick={this.lockContract} variant="danger" size="lg">Lock for 1 month</Button>
            </ButtonGroup>
            </>
              }
              <br></br>
              <br></br>

              <Button onClick={this.releaseContract} variant="success" size="lg" block>Release Funds</Button>
              <Button onClick={this.getBalance} variant="info" size="lg" block>Get Balance of PiggyBank</Button>
              <Button onClick={this.getReleaseTime} variant="info" size="lg" block>Get Release Time of PiggyBank</Button>
              <Button onClick={this.getLockStatus} variant="info" size="lg" block>Get Lock Status of PiggyBank</Button>
        </Container>

            <br></br>
            <br></br>

      </div>
    );
  }
}

export default App;
