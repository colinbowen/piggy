import React, { Component } from "react";
import Timelock from './contracts/Timelock.json'
import getWeb3 from "./getWeb3";

import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home'
import Navigation from './components/Navigation'

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    const result = await contract.methods.lock( accounts[0], "1595780490").call();

    console.log(result);

    const balance = await contract.methods.balanceOfContract().call();

    console.log(balance);

    const latestPrice = await contract.methods.getLatestPrice().call();

    console.log(latestPrice);

    const latestPriceTimestamp = await contract.methods.getLatestPriceTimestamp().call();

    console.log(latestPriceTimestamp);



    // Stores a given value, 5 by default.
    // const response = await contract.methods.getLatestPrice().call();
    // await contract.methods.set(10).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
  };

  initContract = async () => {
    const { accounts, contract } = this.state;



    // Stores a given value, 5 by default.
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
      </div>
    );
  }
}

export default App;
