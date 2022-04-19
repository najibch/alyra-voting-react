import React, {useContext, useEffect, useState} from "react";
import Web3Context from "../Web3Context";
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MessageCard from "./MessageCard";



export default function TallyVotes() {

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [voter, setVoter] = useState();
    const [winningProposal, setWinningProposal] = useState("");
    const [winningProposalId, setWinningProposalId] = useState();
    useEffect( async () => {
        try {
            const voter = await web3Data.contract.methods.getVoter(web3Data.accounts[0]).call();
            setVoter(voter);
            const winningProposalId = await web3Data.contract.methods.winningProposalID().call();
            setWinningProposalId(winningProposalId);
            const proposal = await web3Data.contract.methods.getOneProposal(winningProposalId).call();
            setWinningProposal(proposal);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    });

    if(voter && !voter.isRegistered) {
        return (
            <Container>
                <MessageCard message={ "You are not registered as a Voter. Please ask to be registered for the next vote."} />
            </Container>
        );
    }
    return (
        <React.Fragment>
            <Container>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Winning Proposal ID# {winningProposalId}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {winningProposal.description}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Vote Count : {winningProposal.voteCount}
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </React.Fragment>

    );
}