import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2"; // Import SweetAlert2 for displaying pop-up alerts
import { GetAllIntern } from "../FFCompos/Server"; // Ensure this import points to your data-fetching logic
import { useTheme } from "@mui/material/styles";

export default function InternScheduling() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small

  // State to store the list of interns
  const [interns, setInterns] = useState([]);
  // State to manage assignments of interns to shifts (morning and afternoon) for each day
  const [assignments, setAssignments] = useState({
    Sunday: { morning: [], afternoon: [] },
    Monday: { morning: [], afternoon: [] },
    Tuesday: { morning: [], afternoon: [] },
    Wednesday: { morning: [], afternoon: [] },
    Thursday: { morning: [], afternoon: [] },
    Friday: { morning: [], afternoon: [] },
    Saturday: { morning: [], afternoon: [] },
  });

  // State to store confirmed assignments after user confirmation
  const [confirmedAssignments, setConfirmedAssignments] = useState(null);

  // State to manage selected dates for each day
  const [weekDates, setWeekDates] = useState({
    Sunday: "",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
  });

  // State to manage the current week index for dynamic navigation
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // State to track the visibility of the schedule table
  const [showSchedule, setShowSchedule] = useState(false);

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

  useEffect(() => {
    // Fetch all interns using the GetAllIntern function
    GetAllIntern()
      .then((data) => {
        setInterns(data); // Store the data in the interns state
      })
      .catch((error) => {
        console.error("Error in GetAllIntern: ", error); // Log error if fetching fails
      });
  }, []);

  // Calculate the week dates starting from the selected date
  const calculateWeekDates = (selectedDate) => {
    const startOfWeek = new Date(selectedDate);
    // Adjust to Sunday
    startOfWeek.setDate(
      selectedDate.getDate() - selectedDate.getDay() // Move to Sunday
    );
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

  // Handle changes in selection of interns for a specific day and shift
  const handleSelectChange = (day, period, event) => {
    const selectedInterns = event.target.value.slice(0, 2); // Allow a maximum of 2 interns

    // Check for invalid assignments (any shift on the previous day)
    const dayIndex = Object.keys(assignments).indexOf(day);
    if (dayIndex > 0) {
      const previousDay = Object.keys(assignments)[dayIndex - 1];
      const previousDayInterns = [
        ...assignments[previousDay].morning,
        ...assignments[previousDay].afternoon,
      ];

      // Filter out interns who are selected for any shift the day before
      const validInterns = selectedInterns.filter(
        (internId) => !previousDayInterns.includes(internId)
      );

      if (validInterns.length !== selectedInterns.length) {
        Swal.fire(
          "הגבלה",
          "מתמחה שהיה בתורנות יום לפני לא יכול לעבוד למחרת.",
          "error"
        );
        return; // Prevent state update if validation fails
      }
    }

    // Special check for Sunday following Saturday
    if (day === "Sunday") {
      const saturdayInterns = [
        ...assignments["Saturday"].morning,
        ...assignments["Saturday"].afternoon,
      ];

      const validInterns = selectedInterns.filter(
        (internId) => !saturdayInterns.includes(internId)
      );

      if (validInterns.length !== selectedInterns.length) {
        Swal.fire(
          "הגבלה",
          "מתמחה שעבד בשבת לא יכול לעבוד ביום ראשון.",
          "error"
        );
        return; // Prevent state update if validation fails
      }
    }

    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [day]: {
        ...prevAssignments[day],
        [period]: selectedInterns,
      },
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
        setConfirmedAssignments(assignments); // Save the confirmed assignments
        Swal.fire("!אושר", ".השיבוץ אושר בהצלחה", "success"); // Show success message
      }
    });
  };

  // Clear all assignments and optionally clear confirmed assignments
  const clearAssignments = () => {
    setAssignments({
      Sunday: { morning: [], afternoon: [] },
      Monday: { morning: [], afternoon: [] },
      Tuesday: { morning: [], afternoon: [] },
      Wednesday: { morning: [], afternoon: [] },
      Thursday: { morning: [], afternoon: [] },
      Friday: { morning: [], afternoon: [] },
      Saturday: { morning: [], afternoon: [] },
    });
    setWeekDates({
      Sunday: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
    });
    setConfirmedAssignments(null); // Optionally clear confirmed assignments as well
  };

  // Navigate to the next week
  const nextWeek = () => {
    setCurrentWeekOffset((prevOffset) => prevOffset + 1);
  };

  // Navigate to the previous week
  const prevWeek = () => {
    setCurrentWeekOffset((prevOffset) => prevOffset - 1);
  };

  // Toggle the visibility of the schedule table
  const toggleScheduleVisibility = () => {
    setShowSchedule((prev) => !prev);
  };

  // Generate the dynamic weekly schedule
  const generateWeeklySchedule = (weekOffset) => {
    const schedule = {};
    const currentWeek = new Date(weekDates.Sunday);
    currentWeek.setDate(currentWeek.getDate() + weekOffset * 7);

    Object.keys(daysInHebrew).forEach((day, index) => {
      const date = new Date(currentWeek);
      date.setDate(currentWeek.getDate() + index);
      schedule[day] = {
        date: date.toLocaleDateString("he-IL"),
        morning: confirmedAssignments?.[day]?.morning || [], // Show confirmed assignments
        afternoon: confirmedAssignments?.[day]?.afternoon || [],
      };
    });
    return schedule;
  };

  // Function to check if the current week is the confirmed week
  const isCurrentWeekConfirmed = () => {
    if (!confirmedAssignments || !weekDates.Sunday) return false;
    const currentConfirmedWeek = new Date(weekDates.Sunday);
    currentConfirmedWeek.setDate(
      currentConfirmedWeek.getDate() + currentWeekOffset * 7
    );
    const confirmedWeekStartDate = new Date(
      Object.values(weekDates)[0]
    ).toLocaleDateString("he-IL");

    return (
      confirmedWeekStartDate === currentConfirmedWeek.toLocaleDateString("he-IL")
    );
  };

  return (
    <Box sx={{ mt: 4, direction: "rtl", px: isMobile ? 1 : 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        שיבוץ מתמחים
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
                <TableCell
                  sx={{ width: "14%", textAlign: "center", fontSize: 16 }}
                >
                  זמן/יום
                </TableCell>
                {Object.keys(assignments).map((day) => (
                  <TableCell
                    key={day}
                    sx={{ width: "14%", textAlign: "center", fontSize: 16 }}
                  >
                    {daysInHebrew[day]}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {weekDates[day]
                        ? weekDates[day].toLocaleDateString("he-IL")
                        : ""}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {["morning", "afternoon"].map((period) => (
                <TableRow key={period}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center", fontSize: 16 }}
                  >
                    {period === "morning" ? "בוקר" : 'אחה"צ'}
                  </TableCell>
                  {Object.keys(assignments).map((day) => (
                    <TableCell
                      key={`${day}-${period}`}
                      sx={{ textAlign: "center", fontSize: 16 }}
                    >
                      <Select
                        multiple
                        value={assignments[day][period]}
                        onChange={(event) =>
                          handleSelectChange(day, period, event)
                        }
                        renderValue={(selected) =>
                          selected
                            .map(
                              (id) =>
                                interns.find((intern) => intern.id === id)
                                  ?.first_name
                            )
                            .join(", ")
                        }
                        fullWidth
                        displayEmpty
                        sx={{
                          textAlign: "right",
                          fontSize: 16,
                          backgroundColor:
                            period === "morning" ? "#e3f2fd" : "#ffe3bf ",
                        }}
                        MenuProps={{
                          PaperProps: {
                            // Remove aria-hidden if it's being added dynamically
                            "aria-hidden": false, // ensure this is properly managed
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Card layout for mobile screens
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.keys(assignments).map((day) => (
            <Card key={day} sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {daysInHebrew[day]}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {weekDates[day]
                      ? weekDates[day].toLocaleDateString("he-IL")
                      : ""}
                  </Typography>
                </Typography>
                {["morning", "afternoon"].map((period) => (
                  <Box key={`${day}-${period}`} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {period === "morning" ? "בוקר" : 'אחה"צ'}
                    </Typography>
                    <Select
                      multiple
                      value={assignments[day][period]}
                      onChange={(event) =>
                        handleSelectChange(day, period, event)
                      }
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) =>
                              interns.find((intern) => intern.id === id)
                                ?.first_name
                          )
                          .join(", ")
                      }
                      fullWidth
                      displayEmpty
                      sx={{
                        textAlign: "right",
                        fontSize: 16,
                        backgroundColor:
                          period === "morning" ? "#e3f2fd" : "#ffe3bf ", // Background color
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
                ))}
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
        <Box sx={{ mt: 2, direction: "rtl" }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            לוח תורנויות לשבוע
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button variant="outlined" onClick={prevWeek}>
              שבוע קודם
            </Button>
            <Button variant="outlined" onClick={nextWeek}>
              שבוע הבא
            </Button>
          </Box>
          <Box sx={{ mb: 4 }}>
            <TableContainer component={Paper} sx={{ direction: "rtl" }}>
              <Table
                sx={{
                  tableLayout: "auto", // Switch to auto for mobile responsiveness
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
                      זמן/יום
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
                          {generateWeeklySchedule(currentWeekOffset)[day].date}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {["morning", "afternoon"].map((period) => (
                    <TableRow key={period}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          textAlign: "center",
                          fontSize: 16,
                          whiteSpace: isMobile ? "nowrap" : "normal",
                        }}
                      >
                        {period === "morning" ? "בוקר" : 'אחה"צ'}
                      </TableCell>
                      {Object.keys(daysInHebrew).map((day) => (
                        <TableCell
                          key={`${day}-${period}`}
                          sx={{
                            textAlign: "center",
                            fontSize: 16,
                            whiteSpace: isMobile ? "nowrap" : "normal",
                          }}
                        >
                          {isCurrentWeekConfirmed() &&
                            generateWeeklySchedule(currentWeekOffset)[day][
                              period
                            ].map((internId) => {
                              const intern = interns.find(
                                (intern) => intern.id === internId
                              );
                              return (
                                <Typography
                                  key={internId}
                                  variant="body2"
                                  sx={{ mb: 1 }}
                                >
                                  {intern?.first_name} {intern?.last_name}
                                </Typography>
                              );
                            })}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Box>
  );
}
