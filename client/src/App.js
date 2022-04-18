import React, {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Web3Context from "./Web3Context";
import NavBar from "./components/NavBar";
import Workflow from "./components/Workflow";
import Typography from '@mui/material/Typography';

function App() {

    const [web3Data, setWeb3Data] = useState({
        web3: null,
        accounts: null,
        contract: null,
        isOwner : null
    });

    const [workflowStatus, setWorkflowStatus] = useState("0");
    const [owner, setOwner] = useState("");


  useEffect( async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const contract = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
      );
      const owner = await contract.methods.owner().call();
      setOwner(owner);
      const isOwner = (owner === accounts[0]);

      const currentWorkflowStatus = await contract.methods.workflowStatus().call();
      setWorkflowStatus(currentWorkflowStatus);
      setWeb3Data({ web3, accounts, contract,isOwner });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  });

    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    })

    return (
        <Web3Context.Provider value={{ web3Data,setWeb3Data }}>
            <NavBar />
            <Box className="App">
                    <Workflow workflowStatus = {workflowStatus} setWorkflowStatus = {setWorkflowStatus}/>
            </Box>
        </Web3Context.Provider>
    )
}

export default App;
