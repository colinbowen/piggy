import React, { Component } from 'react'

import Jumbotron from 'react-bootstrap/Jumbotron'

export default class Home extends Component {
    state = {}
    render() {
        return (<>
            <Jumbotron>
                <h1>Piggy Savings</h1>
                <p>
                    Piggy Savings is a Ethereum DApp to help you save towards your goals.
                </p>
            </Jumbotron>

            <>
                <h2>Time Locked Crypto</h2>
                <p>
                    Lock crypto away at the true price using ChainLink Price Aggregation Data
            </p>
            </>

            <>
                <h2>ChainLink Price Feeds</h2>
                <p>
                    Chainlink Price Feeds are the quickest way to connect your smart contracts to the real-world market prices of assets. They enable smart contracts to retrieve the latest price of an asset in a single call.
                </p>
            </>

            <br></br>

            <div>The stored value is: {this.props.storageValue}</div>
            <div>Current ETH Reference Price: {this.props.storageValue}</div>
            <div>ETH Price when saving started: {this.props.storageValue}</div>
        </>
        );
    }
}