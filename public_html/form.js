
function validateForm() {
    // Get input values
    let nameObject = document.getElementById("nameInput").value.trim();
    let emailObject = document.getElementById("emailInput").value.trim();
    let phoneObject = document.getElementById("phoneInput").value.trim();
    let inquiryObject = document.getElementById("inquiryInput").value.trim();
    let messageObject = document.getElementById("messageInput").value.trim();

    // Track validity
    let isValid = true;

    // Clear all previous feedback messages
    document.getElementById("nameSpan").innerHTML = "";
    document.getElementById("emailSpan").innerHTML = "";
    document.getElementById("phoneSpan").innerHTML = "";
    document.getElementById("inquirySpan").innerHTML = "";
    document.getElementById("messageSpan").innerHTML = "";

    // Check Name validity
    if (nameObject === "") {
        document.getElementById("nameSpan").innerHTML = 
            "<p class='text-danger'>Name field has been left empty.</p>";
        isValid = false;
    } else {
        document.getElementById("nameSpan").innerHTML = 
            "<p class='text-success'>Name field validated successfully!</p>";
    }


    // Check Email validity
    if (emailObject === "") {
        document.getElementById("emailSpan").innerHTML = 
            "<p class='text-danger'>Email field has been left empty.</p>";
        isValid = false;
    }  else {
        document.getElementById("emailSpan").innerHTML = 
            "<p class='text-success'>Email validated successfully!</p>";
    }

    // Check ID validity
    if (phoneObject.length !== 10 || isNaN(phoneObject)) {
        document.getElementById("phoneSpan").innerHTML = 
            "<p class='text-danger'>Mobile must be a 10-digit number.</p>";
        isValid = false;
    } else {
        document.getElementById("phoneSpan").innerHTML = 
            "<p class='text-success'> Mobile validated successfully!</p>";
    }

    // Check Unit validity
    if (inquiryObject == "") {
        document.getElementById("inquirySpan").innerHTML = 
            "<p class='text-danger'> Please select an category.</p>";
        isValid = false;
    }  else {
        document.getElementById("inquirySpan").innerHTML = 
            "<p class='text-success'> Validated successfully!</p>";
    }

    // Check CAP validity
    let capPattern = /^[A-Za-z]{3}-[A-Za-z]{3}-[0-9]{2}$/;
    if (messageObject == "") {
        document.getElementById("capSpan").innerHTML = 
            "<p class='text-danger'> Please enter a message..</p>";
        isValid = false;
    } else {
        document.getElementById("capSpan").innerHTML = 
            "<p class='text-success'> Message validated successfully!</p>";
    }

    // If invalid, stop execution
    if (!isValid) {
        return false;
    }

    // If valid, success message
    alert("Form validated successfully!");
    return true; // Allow form submission if needed
}

function resetForm() {
    // Clear all feedback messages
    document.getElementById("nameSpan").innerHTML = "";
    document.getElementById("idSpan").innerHTML = "";
    document.getElementById("emailSpan").innerHTML = "";
    document.getElementById("unitSpan").innerHTML = "";
    document.getElementById("capSpan").innerHTML = "";
}




function readLastTime() {    
    let now = new Date();
    let userPrintString = "";

    userPrintString = "Last updated " + now.toLocaleDateString("en-US", { weekday: "short" }) + " " + now.getDate() + " " + now.toLocaleDateString("en-US", { month: "long" }) + " " + now.getFullYear().toString().slice(-2) + ".";
    document.getElementById("timeUpdate").innerHTML = userPrintString;

}

//An attempt to have a persistent update date saved locally, not currently functioning using URL calls without frustrating visible download, investigating blob usage.
