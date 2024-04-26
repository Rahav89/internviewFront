import React, { useState, useRef } from 'react';
import { Fab, Popover, DialogTitle, List, ListItem, ListItemText, IconButton, Divider, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ChatUI from './Chat'; // Import your Chat component

export default function FloatingChatButton() {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const anchorRef = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    const handleBackToList = () => {
        setSelectedUser(null);
    };

    return (
        <>
            <Fab color="primary" aria-label="chat" onClick={handleClickOpen}
                style={{ position: 'fixed', bottom: 20, right: 20 }} ref={anchorRef}>
                <ChatIcon />
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
                        maxWidth: '300px', // Adjust the width as needed
                        overflow: 'auto',
                        mt: '-75px' // Adjust this based on the Fab button size to move the popover up
                    }
                }}
            >
                {/* Use the IconButton with CloseIcon for a closing button if needed */}
                {selectedUser == null ? (
                    <>
                        <DialogTitle id="user-select-title">Select a user to chat with</DialogTitle>
                        <List sx={{ pt: 0, height: "50vh" }}>
                            {['User 1', 'User 2', 'User 3', 'User 4'].map((user, index, array) => (
                                <React.Fragment key={user}>
                                    <ListItem button onClick={() => handleUserSelect(user)}>
                                        <Avatar sx={{
                                            width:"4vh",
                                            height:"4vh",
                                            border: '1px solid #72bcd4',
                                            mr: 2,
                                            bgcolor: '#99cfe0'
                                        }}>{user[1]}</Avatar>
                                        <ListItemText primary={user} />
                                    </ListItem>
                                    {index < array.length - 1 && <Divider />}
                                </React.Fragment>
                                
                            ))}
                        </List>
                    </>
                ) : (
                    <ChatUI user={selectedUser} onBack={handleBackToList} />
                )}
            </Popover>
        </>
    );
}