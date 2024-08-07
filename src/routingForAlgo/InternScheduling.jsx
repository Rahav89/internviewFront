import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Paper,
  Button,
  Card,
  CardContent,
  useMediaQuery,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import { GetAllIntern, GetAllInternsDutySchedule } from "../FFCompos/Server";
import { useTheme } from "@mui/material/styles";
import MenuLogo from "../FFCompos/MenuLogo";
import { useLocation } from "react-router-dom";
import { AddInternDutySchedule } from "../FFCompos/Server.jsx";

// Constants for initial state
const initialAssignments = {
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const initialWeekDates = {
  Sunday: "",
  Monday: "",
  Tuesday: "",
  Wednesday: "",
  Thursday: "",
  Friday: "",
  Saturday: "",
};

// Hebrew translation for days of the week
const daysInHebrew = {
  Sunday: "ראשון",
  Monday: "שני",
  Tuesday: "שלישי",
  Wednesday: "רביעי",
  Thursday: "חמישי",
  Friday: "שישי",
  Saturday: "שבת",
};

export default function InternScheduling() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const [interns, setInterns] = useState([]);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [confirmedAssignments, setConfirmedAssignments] = useState(null);
  const [weekDates, setWeekDates] = useState(initialWeekDates);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledData, setScheduledData] = useState([]);

  useEffect(() => {
    // Fetch all interns using the GetAllIntern function
    GetAllIntern()
      .then((data) => {
        setInterns(data);
      })
      .catch((error) => {
        console.error("Error in GetAllIntern: ", error);
      });

    // Fetch scheduled data using the GetAllInternsDutySchedule function
    GetAllInternsDutySchedule()
      .then((data) => {
        setScheduledData(data);
      })
      .catch((error) => {
        console.error("Error in GetAllInternsDutySchedule: ", error);
      });
  }, []);

  // Calculate the week dates starting from the selected date
  const calculateWeekDates = (selectedDate) => {
    if (isNaN(selectedDate)) return; // Guard clause for invalid date
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const newWeekDates = {};
    Object.keys(daysInHebrew).forEach((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      newWeekDates[day] = date;
    });
    setWeekDates(newWeekDates);
  };

  // Handle date change for the calendar
  const handleWeekStartDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    calculateWeekDates(selectedDate);
  };

  // Handle changes in selection of interns for a specific day
  const handleSelectChange = (day, event) => {
    const selectedInterns = event.target.value.slice(0, 2); // Allow a maximum of 2 interns
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [day]: selectedInterns,
    }));
  };

  // Confirm the assignments and show a confirmation dialog using SweetAlert2
  const confirmAssignments = () => {
    Swal.fire({
      title: "?אתה בטוח",
      text: "?האם אתה מאשר את השיבוץ",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ביטול",
      confirmButtonText: "כן, אשר",
    }).then((result) => {
      if (result.isConfirmed) {
        // Prepare and send assignments to the server
        const schedulingData = [];
        Object.keys(assignments).forEach((day) => {
          assignments[day].forEach((internId) => {
            if (weekDates[day]) {
              schedulingData.push({
                DutyDate: weekDates[day].toISOString().split('T')[0] + "T00:00", // Ensure date is valid
                Intern_id: internId,
              });
            }
          });
        });
        // Make API call for each scheduling entry
        Promise.all(schedulingData.map((schedule) => AddInternDutySchedule(schedule)))
          .then(() => {
            setConfirmedAssignments(assignments);
            Swal.fire("!אושר", ".השיבוץ אושר בהצלחה", "success");
          })
          .catch((error) => {
            console.error("Error in AddInternDutySchedule: ", error);
            Swal.fire("שגיאה", ".לא הצלחנו לאשר את השיבוץ", "error");
          });
      }
    });
  };

  // Clear all assignments and optionally clear confirmed assignments
  const clearAssignments = () => {
    setAssignments(initialAssignments);
    setWeekDates(initialWeekDates);
    setConfirmedAssignments(null);
  };

  // Navigate to the next or previous week
  const changeWeek = (offset) => {
    setCurrentWeekOffset((prevOffset) => prevOffset + offset);
  };

  // Toggle the visibility of the schedule table
  const toggleScheduleVisibility = () => {
    setShowSchedule((prev) => !prev);
  };

  // Generate the dynamic weekly schedule from server data
  const generateWeeklyScheduleFromServer = useMemo(() => {
    const schedule = {};
    const currentWeek = new Date(weekDates.Sunday);
    if (isNaN(currentWeek)) return schedule; // Guard against invalid dates
    currentWeek.setDate(currentWeek.getDate() + currentWeekOffset * 7);

    // Map intern IDs to intern details
    const internMap = interns.reduce((map, intern) => {
      map[intern.id] = `${intern.first_name} ${intern.last_name}`;
      return map;
    }, {});

    Object.keys(daysInHebrew).forEach((day, index) => {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + index);
      if (isNaN(date)) return; // Guard clause for invalid date
      const formattedDate = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'

      // Filter scheduled data for the current day
      const internsForDay = scheduledData
        .filter(schedule => schedule.dutyDate.startsWith(formattedDate))
        .map(schedule => internMap[schedule.intern_id] || "Unknown");

      schedule[day] = {
        date: date.toLocaleDateString("he-IL"),
        interns: internsForDay,
      };
    });
    return schedule;
  }, [scheduledData, interns, currentWeekOffset, weekDates]);

  // Check if a start date for the week is selected
  const isWeekDateSelected = Object.values(weekDates).every((date) => date);

  return (
    <>
      <MenuLogo />
      <Box sx={{ mt: 3 , mb: 2, direction: "rtl", px: isMobile ? 1 : 4 }}>
          <Typography variant="h6" fontWeight={"bold"} gutterBottom>
        שיבוץ תורנויות
      </Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            type="date"
            label="בחר שבוע לתורנויות"
            onChange={handleWeekStartDateChange}
            sx={{ width: "100%", textAlign: "center" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        {!isMobile ? (
          // Table layout for larger screens
          <TableContainer component={Paper} sx={{ mb: 2, direction: "rtl" }}>
            <Table sx={{ tableLayout: "fixed", width: "100%", direction: "rtl" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "9%", textAlign: "center", fontSize: 16 }}>
              
                  </TableCell>
                  {Object.keys(assignments).map((day) => (
                    <TableCell key={day} sx={{ width: "14%", textAlign: "center", fontSize: 16 }}>
                      {daysInHebrew[day]}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {weekDates[day] ? weekDates[day].toLocaleDateString("he-IL") : ""}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ textAlign: "center", fontSize: 16 }}>
                  תורנים
                  </TableCell>
                  {Object.keys(assignments).map((day) => (
                    <TableCell key={day} sx={{ textAlign: "center", fontSize: 16 }}>
                      <Select
                        multiple
                        value={assignments[day]}
                        onChange={(event) => handleSelectChange(day, event)}
                        renderValue={(selected) =>
                          selected
                            .map((id) => interns.find((intern) => intern.id === id)?.first_name)
                            .join(", ")
                        }
                        fullWidth
                        displayEmpty
                        sx={{
                          textAlign: "right",
                          fontSize: 16,
                          backgroundColor: "#e3f2fd",
                        }}
                        MenuProps={{
                          PaperProps: {
                            "aria-hidden": false,
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: "250px",
                            },
                          },
                        }}
                      >
                        {interns.map((intern) => (
                          <MenuItem key={intern.id} value={intern.id}>
                            {intern.first_name} {intern.last_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // Card layout for mobile screens
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Object.keys(assignments).map((day) => (
              <Card key={day} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    {daysInHebrew[day]}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {weekDates[day] ? weekDates[day].toLocaleDateString("he-IL") : ""}
                    </Typography>
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      תורנים
                    </Typography>
                    <Select
                      multiple
                      value={assignments[day]}
                      onChange={(event) => handleSelectChange(day, event)}
                      renderValue={(selected) =>
                        selected
                          .map((id) => interns.find((intern) => intern.id === id)?.first_name)
                          .join(", ")
                      }
                      fullWidth
                      displayEmpty
                      sx={{
                        textAlign: "right",
                        fontSize: 16,
                        backgroundColor: "#e3f2fd",
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                            width: "250px",
                          },
                        },
                      }}
                    >
                      {interns.map((intern) => (
                        <MenuItem key={intern.id} value={intern.id}>
                          {intern.first_name} {intern.last_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            flexDirection: isMobile ? "column" : "row", // Stack buttons on mobile
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={confirmAssignments}
            sx={{ fontSize: isMobile ? 12 : 14 }}
            disabled={!isWeekDateSelected} // Disable button if no date is selected
          >
            אישור שיבוץ
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={clearAssignments}
            sx={{ fontSize: isMobile ? 12 : 14 }}
          >
            ניקוי שיבוץ
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleScheduleVisibility}
            sx={{ fontSize: isMobile ? 12 : 14 }}
          >
            {showSchedule ? "הסתר לוח תורנויות" : "הצג לוח תורנויות"}
          </Button>
        </Box>

        {showSchedule && (
          <Box sx={{ direction: "rtl" }}>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
              לוח תורנויות לשבוע הנבחר
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Button variant="outlined" onClick={() => changeWeek(-1)}>
                שבוע קודם
              </Button>
              <Button variant="outlined" onClick={() => changeWeek(1)}>
                שבוע הבא
              </Button>
            </Box>
            <Box sx={{ mb: 4 }}>
              <TableContainer component={Paper} sx={{ direction: "rtl" }}>
                <Table
                  sx={{
                    tableLayout: "auto",
                    width: "100%",
                    minWidth: isMobile ? 300 : "100%",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          fontSize: 16,
                          whiteSpace: isMobile ? "nowrap" : "normal",
                        }}
                      >
                        
                      </TableCell>
                      {Object.keys(daysInHebrew).map((day) => (
                        <TableCell
                          key={day}
                          sx={{
                            textAlign: "center",
                            fontSize: 16,
                            whiteSpace: isMobile ? "nowrap" : "normal",
                          }}
                        >
                          {daysInHebrew[day]}
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {generateWeeklyScheduleFromServer[day]?.date || ""}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          textAlign: "center",
                          fontSize: 16,
                          whiteSpace: isMobile ? "nowrap" : "normal",
                        }}
                      >
                        תורנים
                      </TableCell>
                      {Object.keys(daysInHebrew).map((day) => (
                        <TableCell
                          key={day}
                          sx={{
                            textAlign: "center",
                            fontSize: 16,
                            whiteSpace: isMobile ? "nowrap" : "normal",
                          }}
                        >
                          {generateWeeklyScheduleFromServer[day]?.interns.map((internName, index) => (
                            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                              {internName}
                            </Typography>
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
