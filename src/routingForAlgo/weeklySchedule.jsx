import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import TodayIcon from '@mui/icons-material/Today';
import Tooltip from '@mui/material/Tooltip';  // ייבוא Tooltip

const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const hours = ["8:00 AM", "10:00 AM", "12:00 AM", "14:00 PM", "16:00 PM", "18:00 PM"];

function WeeklySchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = () => {
    const startOfWeek = currentDate.getDate() - currentDate.getDay();
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(startOfWeek + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const previousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const nextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDates = getWeekDates();

  return (
    <div style={styles.weeklySchedule}>
      <div style={styles.header}>
        <div style={styles.weekNavigation}>
          <FiChevronRight style={styles.navIcon} onClick={previousWeek} />
          <div style={styles.dateDisplay}>
            {currentDate.toLocaleDateString("he-IL", { month: "long", year: "numeric" })}
          </div>
          <FiChevronLeft style={styles.navIcon} onClick={nextWeek} />
        </div>
      </div>
      <div style={styles.gridContainer}>
        <div style={styles.hourColumn}>
          <Tooltip title="לתאריך הנוכחי" arrow>
            <div style={styles.topLeftCell} onClick={goToToday}>
              <TodayIcon style={styles.todayIcon} />
            </div>
          </Tooltip>
          {hours.map((hour, index) => (
            <div key={index} style={styles.hourCell}>{hour}</div>
          ))}
        </div>
        <div style={styles.daysColumn}>
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} style={styles.dayColumn}>
              <div style={styles.dayHeader}>
                <div style={styles.dayName}>{daysOfWeek[dayIndex]}</div>
                <div style={styles.date}>{date.toLocaleDateString("he-IL")}</div>
              </div>
              {hours.map((hour, hourIndex) => (
                <div key={hourIndex} style={styles.dayCell}>
                  {/* Add scheduled activities here */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  weeklySchedule: {
    direction: "rtl",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "0 20px",
    borderBottom: "2px solid #ddd",
  },
  dateDisplay: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#444",
    minWidth: "180px", // Set a minimum width to prevent shifting
  },
  weekNavigation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  navIcon: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#007bff",
    margin: "0 15px",
  },
  gridContainer: {
    display: "flex",
    overflowX: "auto",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  hourColumn: {
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    marginTop:-1,
  },
  hourCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f7f7f7",
    textAlign: "center",
    minHeight: "50px",
    minWidth: "80px",

  },
  daysColumn: {
    display: "flex",
    flex: 1,
  },
  dayColumn: {

    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderLeft: "1px solid #ddd",
    minWidth: "120px",
  },
  dayHeader: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f1f1f1",
    textAlign: "center",
  },
  dayCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    minHeight: "50px",
    textAlign: "center",
    backgroundColor: "#fff",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
  },
  topLeftCell: {
    height: "66px",  // Adjust height to match other header cells
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #ddd",
    borderRight: "1px solid #ddd",
    backgroundColor: "#ffffff",  // Ensure the background is white
  },
  todayIcon: {
    fontSize: "24px",
    cursor: "pointer",
    color: "#007bff",
  },
  dayName: {
    fontWeight: "bold",
    color: "#007bff",
  },
  date: {
    fontSize: "14px",
    color: "#888",
  },
};

export default WeeklySchedule;