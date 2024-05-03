import React, { useState, useRef, useEffect } from 'react';
import { Fab, Popover, DialogTitle, List, ListItem, ListItemText, Typography, Divider, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatUI from './Chat'; // Import your Chat component
import { GetInternsForChat } from './Server.jsx';
import { Badge } from '@mui/material';
import { database } from '../firebase'; // the data from Firebase Realtime Database
import { ref, onValue, off } from 'firebase/database';

export default function FloatingChatButton() {

    const internID = JSON.parse(sessionStorage.getItem('currentUserID'));
    const [internsToTalk, setInternsToTalk] = useState([]);
    //for opening the chat
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedIntern] = useState(null);
    //GET all the partners to chat
    useEffect(() => {
        GetInternsForChat(internID)
            .then((data) => { setInternsToTalk(data) })
            .catch((error) => {
                console.error("Error in GetInternsForChat: ", error);
            });

    }, []);

    useEffect(() => {
        // Reference to messages in Firebase
        const messagesRef = ref(database, 'messages/');

        // Listen for realtime updates
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            setInternsToTalk(currentInterns => {
                // Map current interns to incorporate updates
                return currentInterns.map(intern => {
                    let notReadMessages = 0;
                    let lastMessage = null;
                    for (const key in data) {
                        const message = data[key];
                        if (message.to_id === internID && message.from_id === intern.Intern_id && !message.read) {
                            notReadMessages++; // Increment unread messages if unread

                        }
                        if ((message.from_id === internID && message.to_id === intern.Intern_id) ||
                            (message.from_id === intern.Intern_id && message.to_id === internID)) {
                            lastMessage = message;
                        }
                    }
                    // Return a new intern object with updated data
                    return { ...intern, notReadMessages, lastMessage };
                });
            });


        });
        // Cleanup function to detach the listener
        return () => off(messagesRef);
    }, [selectedUser]);

    //console.log(internsToTalk);

    const allUnreadMessages = () => {
        return internsToTalk.reduce((sum, intern) => {
            if (intern.notReadMessages !== null && !isNaN(intern.notReadMessages)) {
                return sum + intern.notReadMessages;
            } else {
                return sum;
            }
        }, 0);
    };



    const anchorRef = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedIntern(null);
    };

    return (
        <>
            {console.log(internsToTalk)}
            <Fab color="primary" aria-label="chat" onClick={handleClickOpen}
                style={{ position: 'fixed', bottom: 20, right: 20 }} ref={anchorRef}>
                {/* הודעות שלא נקראו*/}
                <Badge badgeContent={allUnreadMessages()} color="error"
                    sx={{
                        '.MuiBadge-badge':
                            { top: '-10px', right: '-7px', height: '21px', minWidth: '21px', fontSize: '0.8rem', },
                    }}>
                    <ChatIcon />
                </Badge>
            </Fab>

            <Popover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        maxHeight: 'calc(80vh - 48px)', // Adjust the height relative to the view height and the button size
                        maxWidth: '300px',
                        overflow: 'auto',
                        mt: '-75px',
                    }
                }}
            >
                {selectedUser == null ? (
                    <>
                        <DialogTitle id="user-select-title" sx={{ textAlign: 'right', mr: 2 }}>צ'אטים </DialogTitle>
                        <List sx={{ pt: 0, height: "50vh" }} dir="rtl">
                            {internsToTalk.map((intern, index, array) => (
                                <React.Fragment key={intern.Intern_id}>
                                    <ListItem button onClick={() => { setSelectedIntern(intern) }}>
                                        <Badge badgeContent={intern.notReadMessages} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                            <Avatar sx={{ width: "4vh", height: "4vh", bgcolor: '#99cfe0' }}>
                                                {/* Using the first letter of the first name as the Avatar content */}
                                                { `${intern.First_name[0]}${intern.Last_name[0]}`}
                                            </Avatar>
                                        </Badge>
                                        <ListItemText
                                            sx={{ textAlign: 'right', mr: 2 }}
                                            primary={`${intern.First_name} ${intern.Last_name}`}
                                            secondary={intern.lastMessage ? intern.lastMessage.content : 'ללא הודעות'} />
                                        <Typography sx={{ ml: 1 , mr: 0.3, fontSize: '13.5px', mt: 2, color: 'text.secondary', width: '30px' }}>
                                            {intern.lastMessage ? intern.lastMessage.messages_date.slice(11, 16) : ''}
                                        </Typography>
                                    </ListItem>
                                    {index < array.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </>
                ) :
                    <ChatUI user={selectedUser} onBack={() => { setSelectedIntern(null) }} />
                }
            </Popover >
        </>
    );
}