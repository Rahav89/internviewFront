import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import TodayIcon from "@mui/icons-material/Today";
import { GetAllSurgeries } from "../FFCompos/Server.jsx";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const generateCalendar = (month) => {
  const startOfTheMonth = month.startOf("month").startOf("week");
  const endOfTheMonth = month.endOf("month").endOf("week");
  const days = [];
  let day = startOfTheMonth;

  while (day.isSameOrBefore(endOfTheMonth)) {
    days.push(day);
    day = day.add(1, "day");
  }

  return days;
};

export default function SurgerySchedule() {
  const [events, setEvents] = useState({});
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  useEffect(() => {
    GetAllSurgeries()
      .then((data) => {
        console.log("Fetched surgeries data:", data); // Debugging log
        let allEvents = {};
        data.forEach((surgery) => {
          if (surgery.Surgery_date) {
            const dateKey = surgery.Surgery_date.slice(0, 10); // Extract date part
            if (!allEvents[dateKey]) {
              allEvents[dateKey] = [];
            }
            allEvents[dateKey].push({
              ...surgery,
              displayText: `ניתוח ב${surgery.Hospital_name}`, // Correct casing
              isNewMatch: surgery.newMatch === 1,
            });
          } else {
            console.warn("Surgery_date is missing for surgery:", surgery);
          }
        });
        setEvents(allEvents);
      })
      .catch((error) => {
        console.error("Error in GetAllSurgeries: ", error);
      });
  }, []);

  const handleDayClick = (day) => {
    const formattedDay = day.format("YYYY-MM-DD");
    setSelectedDayEvents(events[formattedDay] || []);
    setOpenDialog(true);
  };

  const handleMouseDown = (day) => {
    setIsDragging(true);
    setDragStart(day);
    setSelectedDates([day]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (selectedDates.length > 0) {
      console.log(
        "Selected dates:",
        selectedDates.map((date) => date.format("YYYY-MM-DD"))
      );
    }
  };

  const handleMouseEnter = (day) => {
    if (isDragging && dragStart) {
      const start = dragStart.isBefore(day) ? dragStart : day;
      const end = dragStart.isAfter(day) ? dragStart : day;
      const newSelectedDates = [];
      let date = start;
      while (date.isSameOrBefore(end)) {
        newSelectedDates.push(date);
        date = date.add(1, "day");
      }
      setSelectedDates(newSelectedDates);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (day) => {
    handleMouseDown(day);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.dataset && element.dataset.date) {
      handleMouseEnter(dayjs(element.dataset.date));
    }
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const days = generateCalendar(currentMonth);

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const handleToday = () => setCurrentMonth(dayjs());

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            direction: "ltr",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "left", flexGrow: 1 }}>
            {currentMonth.format("MMMM YYYY")}
          </Typography>
          <Button onClick={handleNextMonth}>
            <KeyboardArrowLeftIcon />
          </Button>
          <Button onClick={handleToday}>
            <TodayIcon />
          </Button>
          <Button onClick={handlePrevMonth}>
            <KeyboardArrowRightIcon />
          </Button>
        </Box>
        <Grid
          container
          spacing={1}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDragging(false)}
          onTouchEnd={handleTouchEnd}
        >
          {["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"].map(
            (day) => (
              <Grid
                item
                xs={1.714}
                key={day}
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                {day}
              </Grid>
            )
          )}
          {days.map((day, index) => (
            <Grid
              item
              xs={1.714}
              key={index}
              sx={{
                height: 90,
                border: "0.1px solid #ccc",
                "&::-webkit-scrollbar": { display: "none" },
                "&:hover": { overflowY: "auto" },
                scrollBehavior: "smooth",
                overflowY: "auto",
                whiteSpace: "nowrap",
                backgroundColor: selectedDates.some((selectedDate) =>
                  selectedDate.isSame(day, "day")
                )
                  ? "#85c1e9"
                  : "transparent",
              }}
              onMouseDown={() => handleMouseDown(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              onTouchStart={() => handleTouchStart(day)}
              onTouchMove={handleTouchMove}
              data-date={day.format("YYYY-MM-DD")} // Add this for touch handling
            >
              <Button
                dir="rtl"
                sx={{
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                onClick={() => handleDayClick(day)}
                tabIndex={0} // Ensure the button is focusable
                aria-label={`Select date ${day.format("D MMMM YYYY")}`} // Add aria-label for better accessibility
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    color: currentMonth.isSame(day, "month")
                      ? "text.primary"
                      : "grey.500",
                    position: "sticky",
                    top: 0,
                    // backgroundColor: "white",
                    zIndex: 1,
                    mr: 2,
                  }}
                >
                  {day.format("D")}
                </Typography>

                {day &&
                  events[day.format("YYYY-MM-DD")] &&
                  events[day.format("YYYY-MM-DD")].map((event, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{
                        color: "DarkBlue",
                        mt: 0.2,
                        whiteSpace: "scroll",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        backgroundColor: event.isNewMatch
                          ? "Azure"
                          : "transparent",
                        fontSize: "11px",
                        mr: "2px",
                      }}
                    >
                      {event.displayText}
                    </Typography>
                  ))}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Dialog
          dir="rtl"
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>ניתוחים</DialogTitle>
          <DialogContent>
            <List>
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#85c1e9" }}>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ textAlign: "right" }}
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {`תאריך: ${dayjs(event.Surgery_date).format(
                                "DD/MM/YYYY"
                              )}, שעה: ${dayjs(event.Surgery_date).format(
                                "HH:mm"
                              )}, מיקום: ${event.Hospital_name}`}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            גיל המטופל: {event.Patient_age}
                            <br />
                            מספר תיק: {event.Case_number}
                            <br />
                            רמת קושי: {event.Difficulty_level}
                            <br />
                            פרוצדורות:{" "}
                            {Array.isArray(event.procedureName)
                              ? event.procedureName.join(", ")
                              : "אין פרוצדורות"}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Typography>אין ניתוחים</Typography>
              )}
            </List>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
