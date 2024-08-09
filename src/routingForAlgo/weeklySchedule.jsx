import React, { useState } from "react";

const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const hours = ["7:00 AM", "9:00 AM", "11:00 AM", "12:00 PM", "15:00 PM", "17:00 PM", "19:00 PM"];

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

  const weekDates = getWeekDates();

  return (
    <div style={styles.weeklySchedule}>
      <div style={styles.weekNavigation}>
        <button style={styles.button} onClick={previousWeek}>שבוע קודם</button>
        <button style={styles.button} onClick={nextWeek}>שבוע הבא</button>
      </div>
      <div style={styles.gridContainer}>
        <div style={styles.hourColumn}>
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
                  {/* כאן תוכל להוסיף פעילויות מתוזמנות */}
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
    fontFamily: "Arial, sans-serif",
  },
  weekNavigation: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    outline: "none",
    transition: "background-color 0.3s ease",
  },
  gridContainer: {
    display: "flex",
    overflowX: "auto", // Allows horizontal scrolling
  },
  hourColumn: {
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ccc",
    marginTop: "62px", // התאמה כדי שהשעות יתחילו מתחת לכותרת הימים
  },
  hourCell: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    minHeight: "50px",
    minWidth: "80px", // Ensure a minimum width for small screens
  },
  daysColumn: {
    display: "flex",
    flex: 1,
  },
  dayColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderLeft: "1px solid #ccc",
    minWidth: "100px", // Ensure a minimum width for each day column
  },
  dayHeader: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  dayCell: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    minHeight: "50px",
    textAlign: "center",
  },
  dayName: {
    fontWeight: "bold",
  },
  date: {
    fontSize: "14px",
    color: "#555",
  },
};

export default WeeklySchedule;
