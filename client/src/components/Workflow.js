import React, {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import RegisteringVoters from "./RegisteringVoters";
import RegisteringProposals from "./RegisteringProposals";
import VotingSession from "./VotingSession";
import Web3Context from "../Web3Context";
import TallyVotes from "./TallyVotes";


const steps =
        ['Registering Voters',
        'Proposals Registration',
        'Voting Session',
        'Votes Tallied'];


export default function Workflow(props) {
    const [activeStep, setActiveStep] = useState(0);
    const {web3Data, setWeb3Data} = useContext(Web3Context);
   // const [workflowStatus, setWorkflowStatus] = useState("0");


    useEffect( async () => {
        try {
            if(props.workflowStatus === "0") setActiveStep(0);
            else if (props.workflowStatus === "1" || props.workflowStatus ==="2") setActiveStep(1);
            else if (props.workflowStatus === "3" || props.workflowStatus === "4") setActiveStep(2);
            else if (props.workflowStatus === "5") setActiveStep(3);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    },[props.workflowStatus]);

    async function handleNext () {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function renderStep() {
        switch (activeStep) {
            case 0:
                return <RegisteringVoters  workflowStatus = {props.workflowStatus} setWorkflowStatus = {props.setWorkflowStatus}  />;
            case 1:
                return <RegisteringProposals workflowStatus = {props.workflowStatus} setWorkflowStatus = {props.setWorkflowStatus} />;
            case 2:
                return <VotingSession workflowStatus = {props.workflowStatus} setWorkflowStatus = {props.setWorkflowStatus}/>;
            case 3:
               return <TallyVotes workflowStatus = {props.workflowStatus} setWorkflowStatus = {props.setWorkflowStatus} />;
            default:
                return <div>NOT FOUND</div>;
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
