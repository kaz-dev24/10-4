function evaluatePasswordStrength(password) {
    let strength = 0;

    if (password.length > 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
}

document.getElementById("new_password").addEventListener("input", function() {
    const password = this.value;
    const strength = evaluatePasswordStrength(password);
    const strengthText = document.getElementById("strength-text");
    const strengthBar = document.querySelector(".strength-bar");

    const levels = ["Vulnerable", "Weak", "Medium", "Strong", "Fortified"];
    const colors = ["#ff4d4d", "#ff9933", "#ffcc00", "#66cc66", "#009933"];
    const widths = ["10%", "25%", "50%", "75%", "100%"];

    strengthText.textContent = `Strength: ${levels[strength]}`;
    strengthBar.style.width = widths[strength];
    strengthBar.style.backgroundColor = colors[strength];
});

document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
