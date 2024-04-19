import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Typography, Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { GetCountProceduresByIntern } from './Server.jsx';
import MenuLogo from './MenuLogo.jsx';
//------------------------------------------------

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function CardsDetailsInterns() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        GetCountProceduresByIntern()
            .then(fetchedData => {
                setData(fetchedData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data.');
            });
    }, []);

    const getInitials = (firstName, lastName) => {
        return `${firstName[0]}${lastName[0]}`;
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <>
        <MenuLogo/>
            <Grid container spacing={2}>
                {data.map((card, index) => (
                    <Grid item xs={6} sm={6} md={4} key={card.id || index}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {getInitials(card.firstName, card.lastName)}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={`${card.firstName} ${card.lastName}`}
                                subheader={card.date}
                            />
                            <CardMedia
                                component="img"
                                height="194"
                                image={card.image}
                                alt={card.title}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Rating: {card.internsRating}, Year: {card.internsYear}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
