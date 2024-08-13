import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TodayIcon from '@mui/icons-material/Today';
import Tooltip from '@mui/material/Tooltip';
import { GetAllSurgeriesWithInterns } from "../FFCompos/Server.jsx";

const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function WeeklySchedule() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [surgeries, setSurgeries] = useState([]);

   
    useEffect(() => {
        // Fetch surgeries data on component mount
        GetAllSurgeriesWithInterns()
            .then((response) => {
                console.log("Surgeries response:", response);
                setSurgeries(response);
            })
            .catch(console.error);
    }, []);

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
    const weekDates = getWeekDates();

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

    const getSurgeriesForDate = (date) => {
        return surgeries
            .filter(surgery => {
                const surgeryDate = new Date(surgery.Surgery_date);
                return (
                    surgeryDate.getFullYear() === date.getFullYear() &&
                    surgeryDate.getMonth() === date.getMonth() &&
                    surgeryDate.getDate() === date.getDate()
                );
            })
            .sort((a, b) => new Date(a.Surgery_date) - new Date(b.Surgery_date)); // Sort surgeries by time
    };
    
    function formatName(fullName) {
        const [firstName, lastName] = fullName.split(' ');
        return `${firstName} .${lastName.charAt(0)}.`;
    }
    return (
        <div style={styles.weeklySchedule}>
            <div style={styles.header}>
                <div style={styles.weekNavigation}>
                    <Tooltip title="לתאריך הנוכחי" arrow>
                        <div style={styles.todayButton} onClick={goToToday}>
                            <TodayIcon style={styles.todayIcon} />
                        </div>
                    </Tooltip>
                    <FiChevronRight style={styles.navIcon} onClick={previousWeek} />

                    <div style={styles.dateDisplay}>
                        {currentDate.toLocaleDateString("he-IL", { month: "long", year: "numeric" })}
                    </div>
                    <FiChevronLeft style={styles.navIcon} onClick={nextWeek} />
                </div>
            </div>
            <div style={styles.gridContainer}>
                <div style={styles.daysColumn}>
                    {weekDates.map((date, dayIndex) => (
                        <div key={dayIndex} style={styles.dayColumn}>
                            <div style={styles.dayHeader}>
                                <div style={styles.dayName}>{daysOfWeek[dayIndex]}</div>
                                <div style={styles.date}>{date.toLocaleDateString("he-IL")}</div>
                            </div>
                            <div style={styles.dayCell}>
                                {getSurgeriesForDate(date).map(surgery => (
                                    <div key={surgery.Surgery_id} style={styles.surgeryItem}>
                                        <div style={styles.surgeryTime}>
                                            {new Date(surgery.Surgery_date).toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {/* <div>
                                            <strong>פרוצדורה:</strong> {surgery.procedureName.join(", ")}
                                        </div> */}
                                        <div>
                                            <strong>גיל מטופל:</strong> {surgery.Patient_age}
                                        </div>
                                        <div>
                                            <strong>מספר מקרה:</strong> {surgery.Case_number}
                                        </div>
                                        <div>
                                            <strong>מנתח מוביל:</strong> {surgery.Lead_Surgeon.Id === 0 ? "ללא שיבוץ" : formatName(surgery.Lead_Surgeon.Name)}
                                        </div>
                                        <div>
                                            <strong>עוזר ראשון:</strong> {surgery.First_Assistant.Id === 0 ? "ללא שיבוץ" : formatName(surgery.First_Assistant.Name)}
                                        </div>
                                        <div>
                                            <strong>עוזר שני:</strong> {surgery.Second_Assistant.Id === 0 ? "ללא שיבוץ" : formatName(surgery.Second_Assistant.Name)}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
        minWidth: "180px",
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
        // Remove borderBottom to avoid horizontal gray lines
        textAlign: "center",
        backgroundColor: "#fff",
        transition: "background-color 0.3s ease",
        cursor: "pointer",
        minHeight: "100px", // Maintain consistent height
    },
    todayButton: {
        cursor: "pointer",
        padding: "10px",
        backgroundColor: "#f1f1f1",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "10px",
    },
    todayIcon: {
        fontSize: "24px",
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
    surgeryItem: {
        backgroundColor: "#e0f7fa",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "30px",
        fontSize: "12px",
        textAlign: "right",
        position: "relative",
    },
    surgeryTime: {
        position: "absolute",
        top: "-35px",
        right: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333",
    },
};

export default WeeklySchedule;
