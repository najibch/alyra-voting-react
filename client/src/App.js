import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Web3Context from "./Web3Context";
import NavBar from "./components/NavBar";
import Workflow from "./components/Workflow";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function App() {

    const [web3Data, setWeb3Data] = useState({
        web3: null,
        accounts: null,
        contract: null,
        isOwner : null
    });

    const [workflowStatus, setWorkflowStatus] = useState("0");
    const [owner, setOwner] = useState("");
    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState("success");
    const [alertMessage, setAlertMessage] = React.useState("Empty Alert");

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


        await contract.events.VoterRegistered()
            .on("data",  event => {
                setSeverity("success");
                setAlertMessage("Voter add with success: " + event.returnValues.voterAddress+".");
                setOpen(true);
            })
            .on("changed", changed => console.log(changed))
            .on("error", err => console.log(err))
            .on("connected", str => console.log(str));


        await contract.events.ProposalRegistered()
            .on("data",  event => {
                setSeverity("success");
                setAlertMessage("Proposal registered with success: " + event.returnValues.proposalId+".");
                setOpen(true);
            })
            .on("changed", changed => console.log(changed))
            .on("error", err => console.log(err))
            .on("connected", str => console.log(str));

        await contract.events.WorkflowStatusChange()
            .on("data",  event => {
                setSeverity("success");
                setAlertMessage("Workflow changed from : " + event.returnValues.previousStatus + " to " + event.returnValues.newStatus+".") ;
                setOpen(true);
            })
            .on("changed", changed => console.log(changed))
            .on("error", err => console.log(err))
            .on("connected", str => console.log(str));

        await contract.events.Voted()
            .on("data",  event => {
                setSeverity("success");
                setAlertMessage(event.returnValues.voter + " voted for proposal " + event.returnValues.proposalId+" with success.") ;
                setOpen(true);
            })
            .on("changed", changed => console.log(changed))
            .on("error", err => console.log(err))
            .on("connected", str => console.log(str));



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

    function handleClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    return (
        <Web3Context.Provider value={{ web3Data,setWeb3Data }}>
            <NavBar />
            <Box className="App">
                    <Workflow workflowStatus = {workflowStatus} setWorkflowStatus = {setWorkflowStatus}/>
            </Box>
            <div>
                <Snackbar open={open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{vertical : 'top', horizontal: 'right'}} >
                    <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} >
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </div>
        </Web3Context.Provider>
    )
}

export default App;
