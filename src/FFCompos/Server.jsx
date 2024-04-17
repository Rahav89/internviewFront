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
    const userObject = {
        Id: internId,
        Password_i: password,
        First_name: "",
        Last_name: "",
        Interns_year: "",
        Interns_rating: 0
    };
    return fetch('https://localhost:7220/api/Interns/LogInIntern', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(userObject)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => { throw error; });
};

export const updateIntern = (formData) => {
    console.log(formData);
    return fetch(`https://localhost:7220/api/Interns/updateIntern/${formData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
