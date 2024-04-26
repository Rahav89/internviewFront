import * as React from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Avatar,
    Grid,
    Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import '../App.css';

const ChatUI = ({ user, onBack }) => {

    const messages = [
        { id: 1, text: "היוששששש", sender: "bot" },
        { id: 2, text: "מה קורהההה", sender: "user" },
        { id: 4, text: "How can I assist you today?", sender: "bot" },
        { id: 5, text: "fine!", sender: "user" },
        { id: 6, text: "and you?", sender: "user" },
        { id: 7, text: "and you?", sender: "user" },
        { id: 8, text: "and you?", sender: "user" },
        { id: 9, text: "סבבה וזה איך אתה?", sender: "user" },
    ];
    const messagesEndRef = useRef(null);  // Ref for the last message

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to the bottom of the messages every time the messages array changes
    useEffect(() => {
        scrollToBottom();
    }, []);
    
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() !== "") {
            console.log(input);
            setInput("");
        }
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    return (
        <Box
            sx={{
                height: "60vh", // Keeping the height consistent
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
                 // This should be the margin of the whole component, if not working, consider looking at parent elements
                overflowX: "hidden", // This will remove the horizontal scrollbar
                
            }}
        >
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    position: "sticky",
                    top: -16,
                    zIndex: 2, // Make sure the title bar stays above the messages
                    justifyContent: "space-between",
                    p: 0,
                    backgroundColor: 'white',
                    mb:2,
                    borderBottom: '1px solid  #E0E0E0'
                }}>

                    <IconButton onClick={onBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    {/* Title with the selected user's name */}
                    <Typography variant="h6">
                        {user}  {/* Assuming 'user' is the name of the user */}
                    </Typography>
                    {/* Placeholder for any other element you want to keep on the right side */}
                    <Box sx={{ width: 48 }} /> {/* This box has the same width as IconButton to balance the title */}
                </Box>
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {/* Scroll to this element */}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Type a message"
                            variant="outlined"
                            value={input}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={handleSend}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

const Message = ({ message }) => {
    const isBot = message.sender === "bot";

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isBot ? "flex-start" : "flex-end",
                mb: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isBot ? "row" : "row-reverse",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ width:"4vh",height:"4vh", bgcolor: isBot ? "#99cfe0" : "#ade6bb", border: isBot ? '1px solid #72bcd4': '1px solid #72d48a' }}>
                    {isBot ? "B" : "U"}
                </Avatar>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,           
                        mb:0.9,
                        mt:-0.9,
                        ml: isBot ? 0.5 : 0,
                        mr: isBot ? 0 : 0.5,
                        backgroundColor: isBot ? "#99cfe0" : "#ade6bb",
                        borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                    }}
                >
                    <Typography variant="body1">{message.text}</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default ChatUI;