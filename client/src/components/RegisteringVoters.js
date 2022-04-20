import Button from "@mui/material/Button";
import React, {useContext, useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Web3Context from "../Web3Context";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import StartIcon from '@mui/icons-material/Start';
import Container from '@mui/material/Container';
import MessageCard from "./MessageCard";




export default function RegisteringVoters(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [inputAddress, setInputAddress] = useState("");
    const [userAddress, setUserAddress] = useState();
    useEffect( async () => {
        try {
            setUserAddress(web3Data.accounts[0]);
          //  setUser(await web3Data.contract.methods.getVoter(web3Data.accounts[0]).call())
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    },[web3Data.accounts]);

    async function addVoter() {
        try{
            await web3Data.contract.methods.addVoter(inputAddress).send({from: web3Data.accounts[0]});
        }
        catch(error){
           console.log(error);
        }
    };

    async function startProposalsRegistering() {
        await web3Data.contract.methods.startProposalsRegistering().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("1");
    };

    if(userAddress && !web3Data.isOwner) {
        return (
            <Container>
                 <MessageCard message={ "We are registering Voters. Please wait for the Proposals Registration."} />
            </Container>
        );
    }
    return (
        <React.Fragment>
                <Container>
                    <TextField id="outlined-helperText" label="Address" fullWidth margin="dense"
                               value={inputAddress}
                               onChange={(e) => setInputAddress(e.target.value)}/>
                </Container>
                <Container>
                    <Button variant="outlined" startIcon={<AddReactionIcon />} onClick={() => addVoter()} disabled={inputAddress === ""}>
                        Add Voter
                    </Button>
                </Container>
                <Container>
                    <Button variant="contained" endIcon={<StartIcon />} onClick={() => startProposalsRegistering()} >
                        Start Proposals Registration
                    </Button>
                </Container>
        </React.Fragment>

    );
}