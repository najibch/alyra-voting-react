import Web3Context from "../Web3Context";
import React, {useContext, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import StartIcon from "@mui/icons-material/Start";

export default function RegisteringProposals(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [inputProposal, setInputProposal] = useState("");
    const [voter, setVoter] = useState();

    useEffect( async () => {
        try {
            const voter = await web3Data.contract.methods.getVoter(web3Data.accounts[0]).call();
            setVoter(voter);
           console.log("INFO Voter " + voter.isRegistered);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    },[web3Data.accounts]);

    async function addProposal() {
        try{
            await web3Data.contract.methods.addProposal(inputProposal).send({from: web3Data.accounts[0]});
        }
        catch(error){
            console.log(error);
        }
    }

    if(voter && !voter.isRegistered) {
        return (
            <div>Not Showing the content</div>
        );
    }
    return (
        <React.Fragment>
                <Container>
                    <TextField id="filled-basic" label="Proposal Description" variant="filled"
                               value={inputProposal}
                               onChange={(e) => setInputProposal(e.target.value)}/>
                    <Button variant="outlined" startIcon={<AddReactionIcon/>} onClick={() => addProposal()}
                            disabled={inputProposal === ""}>
                        Add Proposal
                    </Button>
                </Container>
        </React.Fragment>

    );

}