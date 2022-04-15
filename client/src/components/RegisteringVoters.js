import Button from "@mui/material/Button";
import React, {useContext, useEffect, useState} from "react";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import Web3Context from "../Web3Context";
import AddReactionIcon from '@mui/icons-material/AddReaction';
import StartIcon from '@mui/icons-material/Start';
import Container from '@mui/material/Container';




export default function RegisteringVoters(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [inputAddress, setInputAddress] = useState("");
    const [user, setUser] = useState();

    useEffect( async () => {
        try {
          //  setUser(await web3Data.contract.methods.getVoter(web3Data.accounts[0]).call())
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    });

    async function addVoter() {
        try{
            await web3Data.contract.methods.addVoter(inputAddress).send({from: web3Data.accounts[0]});
        }
        catch(error){
           console.log(error);
        }
    };

    async function startProposalsRegistering() {
   //     await web3Data.contract.methods.startProposalsRegistering().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("1");
        return undefined;
    };

    if(web3Data && !web3Data.isOwner) {
        return (
            <div>Not Showing the content</div>
        );
    }
    return (
        <React.Fragment>
                <Container>
                    <TextField id="filled-basic" label="Address" variant="filled"
                               value={inputAddress}
                               onChange={(e) => setInputAddress(e.target.value)}/>
                    <Button variant="outlined" startIcon={<AddReactionIcon />} onClick={() => addVoter()} disabled={inputAddress === ""}>
                        Add Voter
                    </Button>
                    <Button variant="contained" endIcon={<StartIcon />} onClick={() => startProposalsRegistering()} >
                        Start Proposals Registration
                    </Button>
                </Container>
        </React.Fragment>

    );
}