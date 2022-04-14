import React,{Component} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


class NavBar extends Component{

    render() {
        return (
            <Box >
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" >
                            Alyra Voting Dapp
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}

export default NavBar;
