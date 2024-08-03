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
  List,
  ListItem,
  Card,
  CardContent,
  useMediaQuery,
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
  });

  // State to store confirmed assignments after user confirmation
  const [confirmedAssignments, setConfirmedAssignments] = useState(null);

  // Hebrew translation for days of the week
  const daysInHebrew = {
    Sunday: "ראשון",
    Monday: "שני",
    Tuesday: "שלישי",
    Wednesday: "רביעי",
    Thursday: "חמישי",
  };

  useEffect(() => {
    // Fetch all interns using the GetAllIntern function
    GetAllIntern()
      .then((data) => {
        // console.log("Fetched interns:", data); // Debugging
        setInterns(data); // Store the data in the interns state
      })
      .catch((error) => {
        console.error("Error in GetAllIntern: ", error); // Log error if fetching fails
      });
  }, []);

  // Handle changes in selection of interns for a specific day and shift
  const handleSelectChange = (day, period, event) => {
    const selectedInterns = event.target.value; // Get selected intern IDs
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
    });
    setConfirmedAssignments(null); // Optionally clear confirmed assignments as well
  };

  return (
    <Box sx={{ mt: 4, direction: "rtl", px: isMobile ? 1 : 4 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        שיבוץ מתמחים
      </Typography>

      {!isMobile ? (
        // Table layout for larger screens
        <TableContainer component={Paper} sx={{ mb: 2, direction: "rtl" }}>
          <Table sx={{ tableLayout: "fixed", width: "100%", direction: "rtl" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ width: "16%", textAlign: "center", fontSize: 16 }}
                >
                  זמן/יום
                </TableCell>
                {Object.keys(assignments).map((day) => (
                  <TableCell
                    key={day}
                    sx={{ width: "16%", textAlign: "center", fontSize: 16 }}
                  >
                    {daysInHebrew[day]}
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
      </Box>

      {confirmedAssignments && (
        <Box sx={{ mt: 2, direction: "rtl" }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            שיבוצים מאושרים
          </Typography>
          <List sx={{ direction: "rtl" }}>
            {Object.entries(confirmedAssignments).map(([day, periods]) => (
              <ListItem
                key={day}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: 1,
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  {daysInHebrew[day]}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {Object.entries(periods).map(([period, internIds]) =>
                    internIds.map((id) => {
                      const intern = interns.find((intern) => intern.id === id);
                      return (
                        <Box
                          key={`${day}-${period}-${id}`}
                          sx={{
                            padding: 1,
                            backgroundColor:
                              period === "morning" ? "#e3f2fd" : "#ffe3bf ", // Different background colors for confirmed
                            borderRadius: 1,
                            textAlign: "right",
                          }}
                        >
                          <Typography variant="body2">
                            {intern?.first_name} {intern?.last_name}
                          </Typography>
                          <Typography variant="caption">
                            {period === "morning" ? "בוקר" : 'אחה"צ'}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
