import Web3Context from "../Web3Context";
import React, {useContext, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Paper} from "@mui/material";
import StartIcon from "@mui/icons-material/Start";
import MessageCard from "./MessageCard";

export default function RegisteringProposals(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [inputProposal, setInputProposal] = useState("");
    const [voter, setVoter] = useState(null);
    const [proposals, setProposals] = useState([]);

    useEffect( async () => {
        try {
            const voter = await web3Data.contract.methods.getVoter(web3Data.accounts[0]).call();
            setVoter(voter);
            const proposals = await web3Data.contract.methods.getProposals().call();
            setProposals(proposals);
            console.log("INFO Voter " + voter.isRegistered);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    }, [web3Data.accounts]);

    async function addProposal() {
        try{
            await web3Data.contract.methods.addProposal(inputProposal).send({from: web3Data.accounts[0]});
            const proposals = await web3Data.contract.methods.getProposals().call();
            setProposals(proposals);
        }
        catch(error){
            console.log(error);
        }
    }



    async function endProposalsRegistering() {
        await web3Data.contract.methods.endProposalsRegistering().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("2");
    }


    async function startVotingSession() {
        await web3Data.contract.methods.startVotingSession().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("3");
    }


    if(voter && !voter.isRegistered) {
        return (
            <Container>
                <MessageCard message={ "You are not registered as a Voter. Please ask to be registered for the next vote."} />
            </Container>
        );
    }

    if(props.workflowStatus ==="2" && web3Data.isOwner){
        return(
        <Container>
                <MessageCard message={ "End of Proposal Registration. The voting session will start soon."} />
            <Button variant="contained" endIcon={<StartIcon />} onClick={() => startVotingSession()} >
                Start Voting Session
            </Button>
        </Container>
        );
    }

    if(props.workflowStatus ==="2" && !web3Data.isOwner){
        return(
            <Container>
                <MessageCard message={ "End of Proposal Registration. The voting session will start soon."} />
            </Container>
        );
    }

    if(voter && voter.isRegistered && web3Data.isOwner) {
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
                <Container>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Proposal ID</TableCell>
                                    <TableCell>Proposal Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {proposals.map((proposal, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index}
                                        </TableCell>
                                        <TableCell align="right">{proposal.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
                <Container>
                <Button variant="contained" endIcon={<StartIcon />} onClick={() => endProposalsRegistering()} >
                    End Proposals Registration
                </Button>
                </Container>
        </React.Fragment>

    );

    }

    if(voter && voter.isRegistered && !web3Data.isOwner) {
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
                <Container>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Proposal ID</TableCell>
                                    <TableCell>Proposal Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {proposals.map((proposal, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index}
                                        </TableCell>
                                        <TableCell align="right">{proposal.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </React.Fragment>

        );

    }

    return (<div></div>);

}