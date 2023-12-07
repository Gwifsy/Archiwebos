document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;

        const requestData = {
            email: email,
            password: password
        };

        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId)
            location.href = "http://127.0.0.1:5500/index.html";
        } else {
            errorMessage.textContent = "Erreur : informations de connexion invalides.";
        }

    });
});


