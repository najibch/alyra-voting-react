import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function MessageCard(props) {

    return (
        <React.Fragment>
            <Container>
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Hello !
                        </Typography>
                        <Typography variant="h5" component="div">
                            {props.message}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Thank you !
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </React.Fragment>

    );


}