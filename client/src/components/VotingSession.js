import Web3Context from "../Web3Context";
import React, {useContext, useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Paper} from "@mui/material";
import StartIcon from "@mui/icons-material/Start";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function VotingSession(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [voter, setVoter] = useState();
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

    async function setVote(idProposal) {
        try{
            await web3Data.contract.methods.setVote(idProposal).send({from: web3Data.accounts[0]});
            const proposals = await web3Data.contract.methods.getProposals().call();
            setProposals(proposals);
        }
        catch(error){
            console.log(error);
        }
    }

    async function tallyVotes() {
        await web3Data.contract.methods.tallyVotes().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("5");
    }


    async function endVotingSession() {
        await web3Data.contract.methods.endVotingSession().send({from: web3Data.accounts[0]});
        props.setWorkflowStatus("4");
    }


    if(voter && !voter.isRegistered) {
        return (
            <div>Not Showing the content</div>
        );
    }

    if(voter && voter.hasVoted && !web3Data.isOwner)  {
        return (
            <div>You have already voted for {voter.votedProposalId}</div>
        );
    }

    if(voter && voter.hasVoted && !web3Data.isOwner)  {
        return (
            <Container>
             <div>You have already voted for {voter.votedProposalId}</div>
                <Button variant="contained" endIcon={<StartIcon />} onClick={() => tallyVotes()} >
                    Tally Votes
                </Button>
            </Container>
        );
    }



    if(props.workflowStatus ==="4"){
        return(
            <Container>
                <div>END OF Voting Session</div>
                <Button variant="contained" endIcon={<StartIcon />} onClick={() => tallyVotes()} >
                    Tally Votes
                </Button>
            </Container>
        );
    }


    return (
        <React.Fragment>
            <Container>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Proposal ID</TableCell>
                                <TableCell>Proposal Description</TableCell>
                                <TableCell>Vote Count</TableCell>
                                <TableCell>Vote</TableCell>
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
                                    <TableCell align="center">{proposal.description}</TableCell>
                                    <TableCell align="center">{proposal.voteCount}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" startIcon={<ThumbUpIcon />} onClick={() => setVote(index)}>
                                            Vote
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Container>
                <Button variant="contained" endIcon={<StartIcon />} onClick={() => endVotingSession()} >
                    End Voting Session
                </Button>
            </Container>
        </React.Fragment>

    );

}