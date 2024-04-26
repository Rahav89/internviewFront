
// קבלת פרטי המתמחה לפי האידי שלו מהשרת
const localHost="https://localhost:7220/api/"
const ruppinApi="https://proj.ruppin.ac.il/cgroup10/api..."
export const api = localHost
export const GetInternByID = (iternID) => {
    return fetch(`${api}Interns/GetInternByID/${iternID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in GetInternByID: ", error);
            throw error;
        });

}

// קבלת הסילבוס של המתמחה לפי האידי שלו מהשרת
export const getSyllabus = (internId) => {
    return fetch(`${api}Interns/GetSyllabusOfIntern?internId=${internId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in getSyllabus: ", error);
            throw error;
        });
};

// התחברות לאפליקציה 
export const LogInIntern = (internId, password) => {
    const internObjectLogIn = {
        Id: internId,
        Password_i: password,
        First_name: "",
        Last_name: "",
        Interns_year: "",
        Interns_rating: 0,
        isManager: false,
        Email_i: ""
    };
    return fetch(`${api}Interns/LogInIntern`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(internObjectLogIn)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => { throw error; });
};

//עדכון פרטים
export const updateIntern = (internID, formData) => {
    const internObjectUpdate = {
        Id: 0,
        Password_i: formData.password_i,
        First_name: formData.first_name,
        Last_name: formData.last_name,
        Interns_year: "",
        Interns_rating: 0,
        isManager: false,
        Email_I: formData.email_i
    };
    console.log(internObjectUpdate);
    return fetch(`${api}Interns/updateIntern/${internID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(internObjectUpdate)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in updateIntern: ", error);
            throw error;
        });
}




//קבלת כמות הפרוצדורות של המתמחים
export const GetCountProceduresByIntern = () => {
    return fetch(`${api}Interns/GetInternProcedureCounter`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in GetInternByID: ", error);
            throw error;
        });

}

export const getDetailedSyllabusOfIntern = (internId) => {
    return fetch(`${api}Interns/fullDetailedSyllabusOfIntern?internID=${internId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in getDetailedSyllabusOfIntern: ", error);
            throw error;
        });
};



export const GetInternSurgeriesByProcedure = (internId, procedure_Id) => {
    return fetch(`${api}Interns/GetInternSurgeriesByProcedure/${procedure_Id}/${internId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    })
        .then(response => {
            console.log("HTTP Status:", response.status); // Log the HTTP status
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Response Data:", data); // Log the actual data received
            return data;
        })
        .catch(error => {
            console.error("Error in GetInternSurgeriesByProcedure: ", error);
            throw error;
        });
};
