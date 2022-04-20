// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "./../node_modules/@openzeppelin/contracts/access/Ownable.sol";
/// @title Alyra Voting Contract
/// @author Najib Ch (based on a contract from Cyril.C)
/// @notice You can use this contract to run a simple vote
/// @dev Voting system based on a specific workflow. Owner is the one leading the vote.
contract Voting is Ownable {

    // arrays for draw, uint for single
    // uint[] winningProposalsID;
    // Proposal[] public winningProposals;
    uint public winningProposalID;

    uint public winningProposalIDVoteCount;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[]  proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);


    /// @notice Modifiers to only allow registered voters
    /// @dev Verify that sender is registered in voters mapping
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Get Voter structure
    /// @dev Get Voter structure
    /// @param _addr address of the voter
    /// @return Voter Structure
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Get a proposal from the proposals list using its ID
    /// @dev Get a proposal from the proposals list using its ID
    /// @param _id id of the proposal
    /// @return A proposal with id
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /// @notice Get the list of proposals
    /// @dev Get the list of proposals
    /// @return Proposals Array
    function getProposals() external onlyVoters view returns (Proposal[] memory){
        return proposalsArray;
    }


    // ::::::::::::: REGISTRATION ::::::::::::: //

    /// @notice Allow to register a voter
    /// @dev Add a voter to the voters mapping
    /// @param _addr address of the voter
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /* facultatif
     * function deleteVoter(address _addr) external onlyOwner {
     *   require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
     *   require(voters[_addr].isRegistered == true, 'Not registered.');
     *   voters[_addr].isRegistered = false;
     *  emit VoterRegistered(_addr);
    }*/

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Allow to add a proposal to the list using a description
    /// @dev Add a proposal to proposalArrays using a description
    /// @param _desc description of the proposal
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Allow a voter to vote for a specific proposal and update voter's status
    /// @dev Allow a voter to vote for a specific proposal and update voter's status
    /// @param _id id of the proposal voted by the voter
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id <= proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        if(proposalsArray[_id].voteCount > winningProposalIDVoteCount) {
            winningProposalIDVoteCount = proposalsArray[_id].voteCount;
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /* on pourrait factoriser tout ça: par exemple:
    *
    *  modifier checkWorkflowStatus(uint  _num) {
    *    require (workflowStatus=WorkflowStatus(uint(_num)-1, "bad workflowstatus");
    *    require (num != 5, "il faut lancer tally votes");
    *    _;
    *  }
    *
    *  function setWorkflowStatus(WorkflowStatus _num) public checkWorkflowStatus( _num) onlyOwner {
    *    WorkflowStatus old = workflowStatus;
    *    workflowStatus = WorkflowStatus(_num);
    *    emit WorkflowStatusChange(old, workflowStatus);
    *   }
    *
    *  ou plus simplement:
    *  function nextWorkflowStatus() onlyOwner{
    *    require (uint(workflowStatus)!=4, "il faut lancer tallyvotes");
    *    WorkflowStatus old = workflowStatus;
    *    workflowStatus= WorkflowStatus(uint (workflowstatus) + 1);
    *    emit WorkflowStatusChange(old, workflowStatus);
    *  }
    *
    */

    /// @notice Allow the owner to startProposalsRegistering
    /// @dev  Allow the owner to startProposalsRegistering
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Allow the owner to endProposalsRegistering
    /// @dev  Allow the owner to endProposalsRegistering
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Allow the owner to startVotingSession
    /// @dev  Allow the owner to startVotingSession
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Allow the owner to endVotingSession
    /// @dev  Allow the owner to endVotingSession
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /* function tallyVotesDraw() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        uint highestCount;
        uint[5]memory winners; // egalite entre 5 personnes max
        uint nbWinners;
        for (uint i = 0; i < proposalsArray.length; i++) {
            if (proposalsArray[i].voteCount == highestCount) {
                winners[nbWinners]=i;
                nbWinners++;
            }
            if (proposalsArray[i].voteCount > highestCount) {
                delete winners;
                winners[0]= i;
                highestCount = proposalsArray[i].voteCount;
                nbWinners=1;
            }
        }
        for(uint j=0;j<nbWinners;j++){
            winningProposalsID.push(winners[j]);
            winningProposals.push(proposalsArray[winners[j]]);
        }
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    } */

    /// @notice Allow the owner to tallyVotes and announce winning proposal
    /// @dev  Allow the owner to tallyVotes and announce winning proposal
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        /* uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;*/

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}