import React from "react";
import logo from "./ethereumLogo.png";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { addresses, abis } from "@project/contracts";
import "./App.css";

const GET_TRANSFERS = gql`
  {
    transfers(first: 10) {
      id
      from
      to
      value
    }
  }
`;

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const ceaErc20 = new Contract(addresses.ceaErc20, abis.erc20, defaultProvider);
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await ceaErc20.balanceOf("0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C");
  console.log({ tokenBalance: tokenBalance.toString() });
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="react-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        {/* Remove the "display: none" style and open the JavaScript console in the browser to see what this function does */}
        <button onClick={() => readOnChainData()} style={{ display: "none" }}>
          Read On-Chain Balance
        </button>
        <a
          className="App-link"
          href="https://ethereum.org/developers/#getting-started"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "0px" }}
        >
          Learn Ethereum
        </a>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="App-link" href="https://thegraph.com/docs/quick-start" target="_blank" rel="noopener noreferrer">
          Learn The Graph
        </a>
      </header>
    </div>
  );
}

export default App;
