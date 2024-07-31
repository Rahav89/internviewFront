
const localHost = "https://localhost:7220/api/"
const ruppinApi = "https://proj.ruppin.ac.il/cgroup14/test2/tar1/api/"

// קבלת פרטי המתמחה לפי האידי שלו מהשרת
export const api = localHost
export const GetInternByID = (iternID) => {
    return fetch(`${api}Interns/GetInternByID/${iternID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
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
export const updateIntern = (internID, formData, newPass) => {
    const internObjectUpdate = {
        Id: 0,
        Password_i: newPass,
        First_name: formData.first_name,
        Last_name: formData.last_name,
        Interns_year: "",
        Interns_rating: 0,
        isManager: false,
        Email_I: formData.email_i
    };
    //console.log(internObjectUpdate);
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

export const updateInternPassword = (email, password) => {

    return fetch(`${api}Interns/UpdateInternPassword/${email}/${password}`, {
        method: 'PUT',
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

export const GetInternsForChat = (internId) => {
    return fetch(`${api}Interns/GetInternsForChat?id=${internId}`, {
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
        .catch(error => {
            console.error("Error in GetInternSurgeriesByProcedure: ", error);
            throw error;
        });
};

//לקבל את השמות הפרוצדורות
export const GetAllProcedure = () => {
    return fetch(`${api}Procedure/`, {
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
        .catch(error => {
            console.error("Error in GetAllNameProcedure: ", error);
            throw error;
        });
};

//לקבל את השמות הפרוצדורות
export const GetInternSurgeriesByProcedureName = (internId, procedure_Name) => {
    return fetch(`${api}Interns/GetInternSurgeriesByProcedureName/${procedure_Name}/${internId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    }).then(response => {
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
            console.error("Error in GetInternSurgeriesByProcedureName: ", error);
            throw error;
        });
};


export const GetInterns = () => {
    return fetch(`${api}Interns`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    }).then(response => {
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
            console.error("Error in GetFutureSurgeries: ", error);
            throw error;
        });
};



export const GetAllInternSurgeries = (internID) => {
    return fetch(`${api}Interns/AllInternSurgeries?internId=${internID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        }
    }).then(response => {
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
            console.error("Error in GetAllInternSurgeries: ", error);
            throw error;
        });
};

// התחברות לאפליקציה 
export const AddIntern = (intern) => {
    const internObjectToAdd = {
        Id: intern.internId,
        Password_i:  intern.password,
        First_name:  intern.first_name,
        Last_name:  intern.last_name,
        Interns_year:  intern.InternshipDate,
        Interns_rating:  intern.rating,
        isManager:  intern.isManager,
        Email_i:  intern.email_i
    };
    return fetch(`${api}Interns/AddIntern`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(internObjectToAdd)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => { throw error; });
};


//Update Algorithm Weights
export const Update_Algorithm_Weights = (weights) => {
    const weightObjectUpdate = {
        Skills: weights.Skills,
        YearWeight: weights.YearWeight,
        YearDifficulty: weights.YearDifficulty,
        SyllabusWeight: weights.SyllabusWeight
    };

    return fetch(`${api}Interns/updateAlgorithmWeights/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(weightObjectUpdate)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error("Error in Update_Algorithm_Weights: ", error);
        throw error;
    });
}
