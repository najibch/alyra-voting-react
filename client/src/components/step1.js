import Button from "@mui/material/Button";
import React, {useContext, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import Web3Context from "../Web3Context";

export default function RegisteringVoters(props) {

    const {web3Data, setWeb3Data} = useContext(Web3Context);

    const [address, setAddress] = useState("");

    async function addVoter() {

        //  const {accounts, contract, address} = this.state;

        const accounts = web3Data.accounts;
        const contract = web3Data.contract;
        //console.log(contract.methods);
        // Interaction avec le smart contract pour ajouter un compte
        await contract.methods.addVoter(address).send({from:accounts[0]});
        // Récupérer la liste des comptes autorisés
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid >
                    <TextField id="filled-basic" label="Address" variant="filled"
                               value={address}
                               onChange={(e) => setAddress(e.target.value)}/>
                </Grid>
                <Grid >
                    <Button variant="contained" color="primary" onClick={() => addVoter()} >
                        Add Voter
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}