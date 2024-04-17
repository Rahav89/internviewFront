
export const GetInternByID = (iternID) => {
    return fetch(`https://localhost:7220/api/Interns/GetInternByID/${iternID}`, {
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

export const getSyllabus = (internId) => {
    return fetch(`https://localhost:7220/api/Interns/GetSyllabusOfIntern?internId=${internId}`, {
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


export const LogInIntern = (internId, password) => {
    const internObjectLogIn = {
        Id: internId,
        Password_i: password,
        First_name: "",
        Last_name: "",
        Interns_year: "",
        Interns_rating: 0,
        isManager:false,
    };
    return fetch('https://localhost:7220/api/Interns/LogInIntern', {
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

export const updateIntern = (internID , formData) => {
    const internObjectUpdate = {
        Id: 0,
        Password_i: formData.password_i,
        First_name: formData.first_name,
        Last_name: formData.last_name,
        Interns_year: "",
        Interns_rating: 0,
        isManager:false,
    };
    console.log(internObjectUpdate);
    return fetch(`https://localhost:7220/api/Interns/updateIntern/${internID}`, {
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
