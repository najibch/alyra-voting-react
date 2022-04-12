const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require("Voting");

contract('Voting', function (accounts) {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const proposal = "MyProposal";
    const emptyProposal = "";
    const idProposal = new BN(0);
    const secondProposal = "MySecondProposal";
    const secondIdProposal = new BN(1);
    let VotingInstance;


    // ::::::::::::: MODIFIERS ONLYOWNER ::::::::::::: //
    describe("Testing Modifier OnlyOwner", function () {

        before('reuse deployed VotingInstance for OnlyOwner Modifier', async () => {
            VotingInstance = await Voting.deployed();
        });

        it('onlyOwner should be able to addvoter', async () => {
            await expectRevert(VotingInstance.addVoter(voter1, {'from': voter1}), "Ownable: caller is not the owner");
        });

        it('onlyOwner should be able to StartProposalRegistering', async () => {
            await expectRevert(VotingInstance.startProposalsRegistering({'from': voter1}), "Ownable: caller is not the owner");
        });

        it('onlyOwner should be able to endProposalsRegistering', async () => {
            await expectRevert(VotingInstance.endProposalsRegistering({'from': voter1}), "Ownable: caller is not the owner");
        });

        it('onlyOwner should be able to startVotingSession', async () => {
            await expectRevert(VotingInstance.startVotingSession({'from': voter1}), "Ownable: caller is not the owner");
        });

        it('onlyOwner should be able to endVotingSession', async () => {
            await expectRevert(VotingInstance.endVotingSession({'from': voter1}), "Ownable: caller is not the owner");
        });

        it('onlyOwner should be able to tallyVotes', async () => {
            await expectRevert(VotingInstance.tallyVotes({'from': voter1}), "Ownable: caller is not the owner");
        });
    });

    // ::::::::::::: MODIFIERS ONLYVOTERS ::::::::::::: //
    describe("Testing Modifier OnlyVoter", function () {

        before('reuse deployed VotingInstance for Only Voters', async () => {
            VotingInstance = await Voting.deployed();
        });

        it('onlyVoters should be able to getVoter', async () => {
        await expectRevert(VotingInstance.getVoter(voter1,{'from': voter1}), "You're not a voter");
        });

        it('onlyVoters should be able to getOneProposal', async () => {
            await expectRevert(VotingInstance.getOneProposal(idProposal,{'from': voter1}), "You're not a voter");
        });

        it('onlyVoters should be able to addProposal', async () => {
            await expectRevert(VotingInstance.addProposal(proposal,{'from': voter1}), "You're not a voter");
        });

        it('onlyVoters should be able to setVote', async () => {
            await expectRevert(VotingInstance.setVote(idProposal,{'from': voter1}), "You're not a voter");
        });
    });

    // ::::::::::::: REQUIRES ::::::::::::: //
    describe("Testing All Requires", function () {

        beforeEach('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
        });

        it('owner should add voters only during RegisteringVoters state', async () =>{
            await VotingInstance.startProposalsRegistering({'from': owner});
            await expectRevert(VotingInstance.addVoter(voter1, {'from': owner}), "Voters registration is not open yet");
        });

        it('voter should be registered only once', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await expectRevert(VotingInstance.addVoter(voter1, {'from': owner}), "Already registered");
        });

        it('voter should add proposals only during ProposalsRegistration state', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await expectRevert(VotingInstance.addProposal(proposal, {'from': voter1}), "Proposals are not allowed yet");
        });

        it('voter should NOT add empty proposal', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await expectRevert(VotingInstance.addProposal(emptyProposal, {'from': voter1}), "Vous ne pouvez pas ne rien proposer");
        });

        it('voter should vote only during VotingSession state', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await expectRevert(VotingInstance.setVote(idProposal, {'from': voter1}), "Voting session havent started yet");
        });

        it('voter should vote only once', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await VotingInstance.addProposal(proposal, {'from': voter1});
            await VotingInstance.endProposalsRegistering({'from': owner});
            await VotingInstance.startVotingSession({'from': owner});
            await VotingInstance.setVote(idProposal, {'from': voter1});
            await expectRevert(VotingInstance.setVote(idProposal, {'from': voter1}), "You have already voted");
        });

        it('voter should vote for an existing proposal', async () =>{
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await VotingInstance.endProposalsRegistering({'from': owner});
            await VotingInstance.startVotingSession({'from': owner});
            await expectRevert(VotingInstance.setVote(idProposal, {'from': voter1}), "Proposal not found");
        });

        it('proposal registration should start after registering voters', async () =>{
            await VotingInstance.startProposalsRegistering({'from': owner});
            await expectRevert(VotingInstance.startProposalsRegistering({'from': owner}), "Registering proposals cant be started now");
        });

        it('end of proposal registration should start after registering proposals', async () =>{
            await expectRevert(VotingInstance.endProposalsRegistering({'from': owner}), "Registering proposals havent started yet");
        });

        it('voting session should start after end of registering proposals', async () =>{
            await expectRevert(VotingInstance.startVotingSession({'from': owner}), "Registering proposals phase is not finished");
        });

        it('ending voting session should start during voting session', async () =>{
            await expectRevert(VotingInstance.endVotingSession({'from': owner}), "Voting session havent started yet");
        });

        it('tally votes should start after ending voting session', async () =>{
            await expectRevert(VotingInstance.tallyVotes({'from': owner}), "Current status is not voting session ended");
        });

    });

    // ::::::::::::: EVENTS ::::::::::::: //
    describe("Testing Common Events submission", function () {

        beforeEach('should setup the contract VotingInstance for testing events submission', async () => {
            VotingInstance = await Voting.new({'from': owner});
        });

        it('should emit a VoterRegistered event', async () => {
            VotingInstance = await Voting.new({'from': owner});
            expectEvent(await VotingInstance.addVoter(voter1, {'from': owner}), 'VoterRegistered', {voterAddress: voter1});
        });

        it('should emit a ProposalRegistered event', async () => {
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            expectEvent(await VotingInstance.addProposal(proposal, {'from': voter1}), 'ProposalRegistered', {proposalId: new BN(0)});
        });

        it('should emit a Voted event', async () => {
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await VotingInstance.addProposal(proposal,{'from': voter1});
            await VotingInstance.endProposalsRegistering({'from': owner});
            await VotingInstance.startVotingSession({'from': owner});
            expectEvent(await VotingInstance.setVote(idProposal, {'from': voter1}), 'Voted', {voter: voter1, proposalId: new BN(0)});
        });
    });

    describe("Testing State Events submission", function () {

        before('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
        });

        it('should emit a WorkflowStatus event for starting proposal registering', async () => {
                expectEvent(await VotingInstance.startProposalsRegistering({'from': owner}), 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus: new BN(1)});
        });

        it('should emit a WorkflowStatus event for ending proposal registering', async () => {
                expectEvent(await VotingInstance.endProposalsRegistering({'from': owner}), 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus: new BN(2)});
        });

        it('should emit a WorkflowStatus event for starting voting session', async () => {
                expectEvent(await VotingInstance.startVotingSession({'from': owner}), 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus: new BN(3)});
        });

        it('should emit a WorkflowStatus event for ending voting session', async () => {
                expectEvent(await VotingInstance.endVotingSession({'from': owner}), 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus: new BN(4)});
        });

        it('should emit a WorkflowStatus event for ending voting session', async () => {
                expectEvent(await VotingInstance.tallyVotes({'from': owner}), 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus: new BN(5)});
        });
    });

    // ::::::::::::: FUNCTIONS BEHAVIOR ::::::::::::: //

    // ::::::::::::: REGISTRATION ::::::::::::: //
    describe("Testing Registering Voter", function () {

        it('should register a voter', async () =>{
            VotingInstance = await Voting.new({'from': owner});
            await VotingInstance.addVoter(voter1,{'from': owner});
            let voterStatusAfterAddVoter = (await VotingInstance.getVoter(voter1,{'from': voter1})).isRegistered;
            expect(voterStatusAfterAddVoter,"Voter was not registered.").to.be.true;
        });

    });

    // ::::::::::::: PROPOSAL ::::::::::::: //
    describe("Testing Registering Proposals", function () {

        beforeEach('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
        });

        it('should add one proposal in the proposals array', async () =>{
            await VotingInstance.addProposal(proposal,{'from': voter1});
            let descriptionProposalAfterRegisteringProposal = (await VotingInstance.getOneProposal(idProposal,{'from': voter1})).description;
            expect(descriptionProposalAfterRegisteringProposal).to.equal(proposal, "Proposal was not added in the list");
        });

        it('should add many proposals in the proposals array', async () =>{
            let numberOfProposals = 10;
            for (let i = 0; i < numberOfProposals; i++) {
                await VotingInstance.addProposal(proposal+i,{'from': voter1});
            }
            let getlastProposalDescription = (await VotingInstance.getOneProposal(new BN(numberOfProposals-1),{'from': voter1})).description;
            expect(getlastProposalDescription).to.equal(proposal+(numberOfProposals-1), "Proposal was not added in the list");
        });
    });

    // ::::::::::::: VOTE ::::::::::::: //
    describe("Testing Vote", function () {

        beforeEach('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await VotingInstance.addProposal(proposal,{'from': voter1});
            await VotingInstance.endProposalsRegistering({'from': owner});
            await VotingInstance.startVotingSession({'from': owner});
        });

        it('should save the proposalId that the voter has chosen', async () =>{
            let voterBeforeVote = await VotingInstance.getVoter(voter1,{'from': voter1});
            expect(new BN(voterBeforeVote.votedProposalId)).to.be.bignumber.equal(idProposal, "Proposal Id already save.");
            await VotingInstance.setVote(idProposal, {'from': voter1});
            let voterAfterVote = await VotingInstance.getVoter(voter1,{'from': voter1});
            expect(new BN(voterAfterVote.votedProposalId)).to.be.bignumber.equal(idProposal, "Proposal Id was not save properly.");
        });

        it('should save the fact that the voter has voted', async () =>{
            await VotingInstance.setVote(idProposal, {'from': voter1});
            let voterAfterVote = await VotingInstance.getVoter(voter1,{'from': voter1});
            expect(voterAfterVote.hasVoted, "Voter's vote was not save.").to.be.true;
        });

        it('should increment proposal vote count', async () =>{
            let proposalVoteCountBeforeVote = (await VotingInstance.getOneProposal(idProposal,{'from': voter1})).voteCount;
            await VotingInstance.setVote(idProposal, {'from': voter1});
            let proposalVoteCountAfterVote = (await VotingInstance.getOneProposal(idProposal,{'from': voter1})).voteCount;
            expect(new BN(proposalVoteCountAfterVote)).to.be.bignumber.equal(new BN(proposalVoteCountBeforeVote+1), "Proposal voteCount was not incremented.");
        });

    });

    // ::::::::::::: STATE ::::::::::::: //

    describe("Testing State Change", function () {

        before('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
        });

        it('should start with RegisteringVoters status', async () => {
            let status = (await VotingInstance.workflowStatus({'from': owner}));
            expect(status).to.be.bignumber.equal(new BN(0), "RegisteringVoters not the current status.");
        });

        it('should change to ProposalsRegistrationStarted status', async () => {
            await VotingInstance.startProposalsRegistering({'from': owner})
            let status = (await VotingInstance.workflowStatus({'from': owner}));
            expect(status).to.be.bignumber.equal(new BN(1), "ProposalsRegistrationStarted not the current status.");
        });

        it('should change to ProposalsRegistrationEnded status', async () => {
            await VotingInstance.endProposalsRegistering({'from': owner})
            let status = (await VotingInstance.workflowStatus({'from': owner}));
            expect(status).to.be.bignumber.equal(new BN(2), "ProposalsRegistrationEnded not the current status.");
        });

        it('should change to VotingSessionStarted status', async () => {
            await VotingInstance.startVotingSession({'from': owner})
            let status = (await VotingInstance.workflowStatus({'from': owner}));
            expect(status).to.be.bignumber.equal(new BN(3), "VotingSessionStarted not the current status.");
        });

        it('should change to VotingSessionEnded status', async () => {
            await VotingInstance.endVotingSession({'from': owner})
            let status = (await VotingInstance.workflowStatus({'from': owner}));
            expect(status).to.be.bignumber.equal(new BN(4), "VotingSessionEnded not the current status.");
        });
    });

    describe("Testing Tally Votes", function () {

        before('should setup the contract VotingInstance', async () => {
            VotingInstance = await Voting.new({'from': owner});
        });

        it('should tallyVotes', async () => {
            await VotingInstance.addVoter(voter1,{'from': owner});
            await VotingInstance.addVoter(voter2,{'from': owner});
            await VotingInstance.addVoter(voter3,{'from': owner});
            await VotingInstance.startProposalsRegistering({'from': owner});
            await VotingInstance.addProposal(proposal, {'from': voter1});
            await VotingInstance.addProposal(secondProposal, {'from': voter1});
            await VotingInstance.endProposalsRegistering({'from': owner});
            await VotingInstance.startVotingSession({'from': owner});
            await VotingInstance.setVote(idProposal, {'from': voter1})
            await VotingInstance.setVote(idProposal, {'from': voter2})
            await VotingInstance.setVote(secondIdProposal, {'from': voter3})
            await VotingInstance.endVotingSession({'from': owner});
            let winningProposalId = await VotingInstance.winningProposalID({'from': owner});
            expect(new BN(winningProposalId)).to.be.bignumber.equal(idProposal, "Wrong winning proposal Id");
        });

    });

});