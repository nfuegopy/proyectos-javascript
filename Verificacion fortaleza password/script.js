// Elementos del DOM
const password = document.getElementById("password");
const powerPoint = document.getElementById("power-point");
const strengthText = document.getElementById("strength-text");
const togglePassword = document.getElementById("togglePassword");

// Configuración de niveles de fortaleza
const strengthLevels = {
    0: { width: "1%", color: "#D73F40", text: "Muy Débil" },
    1: { width: "25%", color: "#DC6551", text: "Débil" },
    2: { width: "50%", color: "#F2B84F", text: "Media" },
    3: { width: "75%", color: "#BDE952", text: "Fuerte" },
    4: { width: "100%", color: "#3ba62f", text: "Muy Fuerte" }
};

// Verificar fortaleza de la contraseña
password.addEventListener('input', function() {
    let points = 0;
    const value = this.value;

    // Solo evaluar si la contraseña tiene al menos 6 caracteres
    if (value.length >= 6) {
        // Criterios de fortaleza
        const criteria = [
            /[0-9]/,          // Números
            /[a-z]/,          // Letras minúsculas
            /[A-Z]/,          // Letras mayúsculas
            /[^0-9a-zA-Z]/    // Caracteres especiales
        ];

        // Verificar cada criterio
        criteria.forEach(regex => {
            if (regex.test(value)) {
                points += 1;
            }
        });
    }

    // Actualizar la visualización
    const strength = strengthLevels[points];
    powerPoint.style.width = strength.width;
    powerPoint.style.backgroundColor = strength.color;
    strengthText.textContent = strength.text;
});

// Mostrar/ocultar contraseña
togglePassword.addEventListener('click', function() {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    // Cambiar el ícono
    const icon = this.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
});