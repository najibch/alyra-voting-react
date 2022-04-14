import React, {useContext, useEffect, useState} from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import NavBar from "./components/NavBar"
import "./App.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import AddressForm from "./components/step1";
import RegisteringVoters from "./components/step1";
import Web3Context from "./Web3Context";


function App() {
    /*const { web3,accounts,contract } = React.useContext(Web3Context);*/
    /*const [web3Value, setWeb3Value] = useState();
    const [accountsValue, setAccountsValue] = useState();
    const [contractValue, setContractValue] = useState();*/

    const [web3Data, setWeb3Data] = useState({
        web3: null,
        accounts: null,
        contract: null
    });


    const steps = ['Registering Voters', 'Registering Proposals', 'Tallying Vote'];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const [address, setAddress] = useState("");


  useEffect( async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const contract = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
        setWeb3Data({ web3, accounts, contract });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  });

    async function addVoter() {

      //  const {accounts, contract, address} = this.state;
       // const accounts = web3Data[0].accounts;
      //  const contract = web3Data[0].contract;
        //console.log(contract.methods);
        // Interaction avec le smart contract pour ajouter un compte
      //  await contract.methods.addVoter(address).send({from:accounts[0]});
        // Récupérer la liste des comptes autorisés
    }

    function _renderStepContent(step) {
        console.log('STEEPPP :', step);
        switch (step) {
            case 0:
                return <RegisteringVoters />;
            case 1:
            // return <PaymentForm formField={formField} />;
            case 2:
            // return <ReviewOrder />;
            default:
                return <div>Not Found</div>;
        }
    }

    return (
        <Web3Context.Provider value={{ web3Data,setWeb3Data }}>
            <Box className="App">
              <NavBar/>
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
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
                {activeStep === steps.length ? (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {_renderStepContent(activeStep)}
                      <Typography sx={{ mt: 2, mb: 1 }}>In progress : Step {activeStep + 1}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </Box>
                    </React.Fragment>
                )}
              </Box>
            </Box>
            </Web3Context.Provider>
    )
}

export default App;
