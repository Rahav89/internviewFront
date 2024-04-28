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
import { database } from '../firebase'; // adjust path as necessary
import { ref, onValue, push, off } from 'firebase/database';


const ChatUI = ({ user, onBack }) => {


    const internID = JSON.parse(sessionStorage.getItem('currentUserID'));
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(database, 'messages/');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = [];
            for (const key in data) {             
                loadedMessages.push({ messages_id: key, ...data[key] });
            }
            //נטען רק את ההודעות בין 2 המשתמשים
            const filteredMessages = loadedMessages.filter(message => 
                (message.from_id === internID && message.to_id === user.Intern_id) ||
                (message.from_id === user.Intern_id && message.to_id === internID)
            );
            setChatMessages(filteredMessages);
            scrollToBottom();
        });

        // Detach listener when the component unmounts
        return () => off(messagesRef);
    }, [internID, user.Intern_id]);

    const handleSend = () => {
        if (input.trim() !== "") {
            const newMessageRef = ref(database,'messages/');
            const message = {
                from_id: internID,
                to_id: user.Intern_id,
                content: input.trim(),
                messages_date: new Date().toISOString() 
            };

            push(newMessageRef, message);
            setInput("");
        }
    };


    console.log(chatMessages);

    const messagesEndRef = useRef(null);  // Ref for the last message

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to the bottom of the messages every time the messages array changes
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const [input, setInput] = useState("");

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
                    mb: 2,
                    borderBottom: '1px solid  #E0E0E0'
                }}>

                    <IconButton onClick={onBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    {/* Title with the selected user's name */}
                    <Typography variant="h6">
                        {`${user.First_name} ${user.Last_name}`}  {/* Assuming 'user' is the name of the user */}
                    </Typography>
                    {/* Placeholder for any other element you want to keep on the right side */}
                    <Box sx={{ width: 48 }} /> {/* This box has the same width as IconButton to balance the title */}
                </Box>
                {chatMessages.map((message) => (
                    <Message key={message.messages_id} message={message} />
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
    const internID = JSON.parse(sessionStorage.getItem('currentUserID'));
    const isPartner = message.from_id != internID;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: isPartner ? "flex-start" : "flex-end",
                mb: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isPartner ? "row" : "row-reverse",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ width: "4vh", height: "4vh", bgcolor: isPartner ? "#99cfe0" : "#ade6bb", border: isPartner ? '1px solid #72bcd4' : '1px solid #72d48a' }}>
                    {isPartner ? "B" : "U"}
                </Avatar>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        mb: 0.9,
                        mt: -0.9,
                        ml: isPartner ? 0.5 : 0,
                        mr: isPartner ? 0 : 0.5,
                        backgroundColor: isPartner ? "#99cfe0" : "#ade6bb",
                        borderRadius: isPartner ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                    }}
                >
                    <Typography variant="body1">{message.content}</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default ChatUI;