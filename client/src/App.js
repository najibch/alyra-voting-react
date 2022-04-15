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

    const [owner, setOwner] = useState("");

    const steps = ['Registering Voters', 'Registering Proposals', 'Tallying Vote'];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [address, setAddress] = useState("");


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

      setWeb3Data({ web3, accounts, contract,isOwner });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  });

    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("Before change" + web3Data.accounts);
        console.log('accountsChanges',accounts);
        web3Data.accounts=accounts;
        const isOwner=(owner === accounts[0]);
        setWeb3Data({ accounts,isOwner });
        console.log("After change" + web3Data.accounts);
    });

    return (
        <Web3Context.Provider value={{ web3Data,setWeb3Data }}>
            <Box className="App">
                    <Workflow/>
            </Box>
        </Web3Context.Provider>
    )
}

export default App;
