import React, {useContext, useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Web3Context from "../Web3Context";
import Button from '@mui/material/Button';


export default function NavBar (){

    const {web3Data, setWeb3Data} = useContext(Web3Context);
    const [userAddress, setUserAddress] = useState();

    useEffect( async () => {
        try {
            setUserAddress(web3Data.accounts[0]);
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
        }
    });
        return (
            <Box >
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" >
                            Alyra Voting Dapp -
                        </Typography>
                        <Typography variant="h6" align ="right">
                            Account : {userAddress}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        );
}

