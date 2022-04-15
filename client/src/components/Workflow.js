import React, {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import RegisteringVoters from "./RegisteringVoters";
import RegisteringProposals from "./RegisteringProposals";
import Web3Context from "../Web3Context";


const steps =
        ['Registering Voters',
        'Proposals Registration',
        'Voting Session',
        'Votes Tallied'];


export default function Workflow() {
    const [activeStep, setActiveStep] = useState(0);
    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [workflowStatus, setWorkflowStatus] = useState("0");


    useEffect( async () => {
        try {
          //  setWorkflowStatus(await web3Data.contract.methods.workflowStatus().call());
           // setUser(await web3Data.contract.methods.getVoter((web3Data.accounts)[0]).call())
            if(workflowStatus === "0") setActiveStep(0);
            else if (workflowStatus === "1" || workflowStatus ==="2") setActiveStep(1);
            else if (workflowStatus === "3" || workflowStatus === "4") setActiveStep(2);
            else if (workflowStatus === "5") setActiveStep(3);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    },[workflowStatus]);

    async function handleNext () {
      /*  const accounts = web3Data.accounts;
        const contract = web3Data.contract;
        switch (activeStep) {
            case 0 :
                await contract.methods.startProposalsRegistering().send({from:accounts[0]});
            case 1 :
                await contract.methods.endProposalsRegistering().send({from:accounts[0]});
            case 2 :
                await contract.methods.startVotingSession().send({from:accounts[0]});
            case 3 :
                await contract.methods.endVotingSession().send({from:accounts[0]});
            case 4 :
                await contract.methods.tallyVotes().send({from:accounts[0]});

        }*/
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function renderStep() {
        console.log('STEEPPP :', activeStep);
        switch (activeStep) {
            case 0:
                return <RegisteringVoters setWorkflowStatus = {setWorkflowStatus} />;
            case 1:
                return <RegisteringProposals workflowStatus = {workflowStatus} setWorkflowStatus = {setWorkflowStatus} />;
            case 2:

            default:
                return <div>Not Found</div>;
        }
    }


    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
                <React.Fragment>
                    {renderStep()}
                </React.Fragment>
        </Box>
    );
}
