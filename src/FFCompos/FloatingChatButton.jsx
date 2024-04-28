import React, { useState, useRef, useEffect } from 'react';
import { Fab, Popover, DialogTitle, List, ListItem, ListItemText, IconButton, Divider, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatUI from './Chat'; // Import your Chat component
import { GetInternsForChat } from './Server.jsx';
import { Badge } from '@mui/material';

export default function FloatingChatButton() {
    const internID = JSON.parse(sessionStorage.getItem('currentUserID'));
    const [internsToTalk, setInternsToTalk] = useState([]);

    useEffect(() => {
        GetInternsForChat(internID)
            .then((data) => { setInternsToTalk(data); })
            .catch((error) => {
                console.error("Error in GetInternsForChat: ", error);
            });
    }, []);

    console.log(internsToTalk);
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

    const [unreadCount, setUnreadCount] = useState(1);


    return (
        <>

            <Fab color="primary" aria-label="chat" onClick={handleClickOpen}
                style={{ position: 'fixed', bottom: 20, right: 20 }} ref={anchorRef}>
                <Badge badgeContent={unreadCount} color="error"
                    sx={{
                        '.MuiBadge-badge': {
                            top: '-10px', // Moves the badge up
                            right: '-7px', // Moves the badge to the right
                            height: '21px', // Increase the height of the badge
                            minWidth: '21px', // Increase the minimum width of the badge to make it round
                            fontSize: '0.8rem', // Increase the font size of the badge content
                        },
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
                        maxWidth: '300px', // Adjust the width as needed
                        overflow: 'auto',
                        mt: '-75px' // Adjust this based on the Fab button size to move the popover up
                    }
                }}
            >
                {/* Use the IconButton with CloseIcon for a closing button if needed */}
                {selectedUser == null ? (
                    <>
                        <DialogTitle id="user-select-title" sx={{ textAlign: 'right', mr: 2 }}>בחר עם מי תרצה לשוחח</DialogTitle>
                        <List sx={{ pt: 0, height: "50vh" }} dir="rtl">
                            {internsToTalk.map((intern, index, array) => (
                                <React.Fragment key={intern.Intern_id}>
                                    <ListItem button onClick={() => handleUserSelect(intern)}>
                                        <Avatar sx={{
                                            width: "4vh",
                                            height: "4vh",
                                            border: '1px solid #72bcd4',
                                            mr: 2,
                                            bgcolor: '#99cfe0'
                                        }}>
                                            {/* Using the first letter of the first name as the Avatar content */}
                                            {intern.First_name[0]}
                                        </Avatar>
                                        <ListItemText
                                            sx={{ textAlign: 'right', mr: 2 }}
                                            primary={`${intern.First_name} ${intern.Last_name}`} />
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