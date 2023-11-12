function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const ageInput = document.getElementById("age");
    const dobInput = document.getElementById("dob");
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerHTML = ""; // Clear previous error messages

    // Validate name
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        errorMessage.innerHTML += "Name can only contain alphabets and spaces. Please enter a valid name.<br>";
    }

    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        errorMessage.innerHTML += "Please enter a valid email address.<br>";
    }

    // Validate date of birth
    const dob = new Date(dobInput.value);
    const currentDate = new Date();

    if (dob >= currentDate) {
        errorMessage.innerHTML += "Date of Birth cannot be post the current date.<br>";
    }

    // Validate age
    const age = parseInt(ageInput.value);
    const calculatedAge = calculateAge(dob);

    if (isNaN(age) || age <= 0) {
        errorMessage.innerHTML += "Please enter a valid positive age.<br>";
    } else if (age !== calculatedAge) {
        errorMessage.innerHTML += `There is a mismatch between the provided age and the calculated age based on Date of Birth. Please ensure that your age is correct or check your Date of Birth.<br>`;
        errorMessage.innerHTML += `Calculated age based on Date of Birth: ${calculatedAge}.<br>`;
    }

    if (errorMessage.innerHTML !== "") {
        errorMessage.classList.remove("hidden");
        return false;
    }

    errorMessage.classList.add("hidden");

    // Serialize form data as JSON
    const formData = {
        name: name,
        email: email,
        age: ageInput.value,
        dob: dobInput.value
    };

    // Send form data as JSON in the POST request
    submitFormData(formData);

    return false; // Prevent the default form submission
}

function submitFormData(formData) {
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log('Server response:', data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
