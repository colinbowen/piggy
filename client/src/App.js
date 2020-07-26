import React, { Component } from "react";
import Timelock from './contracts/Timelock.json'
import getWeb3 from "./getWeb3";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home'
import Navigation from './components/Navigation'

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

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
      this.setState({address: this.state.contract.options.address})
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getBalance = async () => {
    const { contract } = this.state;
    const balance = await contract.methods.balance().call();

    console.log(balance);
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
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navigation />
        <Home storageValue={this.state.storageValue} />

        <br></br>
        <br></br>

        <div>Current ETH Reference Price: {this.state.currentPrice}</div>
        <div>Total ETH Stored: {this.state.balance}</div>

        <br></br>
        <br></br>

        <Container>
          <Button onClick={this.deposit} variant="primary" size="lg" block>Send 1 Ether to Piggybank</Button>
          <Button onClick={this.updatePrice} variant="secondary" size="lg" block>Get Latest Ether Price</Button>
          <Button onClick={this.lockContract} variant="danger" size="lg" block>Lock</Button>
          <Button onClick={this.releaseContract} variant="success" size="lg" block>Release Funds</Button>
          <Button onClick={this.getBalance} variant="warning" size="lg" block>Get Balance of PiggyBank</Button>
        </Container>

      </div>
    );
  }
}

export default App;
