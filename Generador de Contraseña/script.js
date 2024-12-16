// Configuración inicial
const config = {
    minLength: 4,
    maxLength: 32,
    defaultLength: 8,
    characterSets: {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        digits: '0123456789',
        specials: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
};

// Elementos del DOM
const elements = {
    passwordInput: document.getElementById('passwordInput'),
    lengthRange: document.getElementById('lengthRange'),
    lengthDisplay: document.getElementById('lengthDisplay'),
    generateBtn: document.getElementById('generateBtn'),
    copyBtn: document.getElementById('copyBtn'),
    strengthBars: document.getElementById('strengthBars'),
    checkboxes: {
        lowercase: document.getElementById('lowercaseCb'),
        uppercase: document.getElementById('uppercaseCb'),
        digits: document.getElementById('digitsCb'),
        specials: document.getElementById('specialsCb')
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updatePasswordLength();
    generatePassword();
});

// Configurar event listeners
function setupEventListeners() {
    elements.generateBtn.addEventListener('click', generatePassword);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.lengthRange.addEventListener('input', updatePasswordLength);
    elements.lengthRange.addEventListener('change', generatePassword);

    // Event listeners para los checkboxes
    Object.values(elements.checkboxes).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            validateCheckboxes(checkbox);
            generatePassword();
        });
    });
}

// Actualizar la visualización de la longitud
function updatePasswordLength() {
    const length = elements.lengthRange.value;
    elements.lengthDisplay.textContent = length;
}

// Validar que al menos un checkbox esté seleccionado
function validateCheckboxes(changedCheckbox) {
    const anyChecked = Object.values(elements.checkboxes)
        .some(checkbox => checkbox.checked);
    
    if (!anyChecked) {
        changedCheckbox.checked = true;
        showNotification('Debe seleccionar al menos una opción', 'error');
    }
}

// Generar contraseña
function generatePassword() {
    let charset = '';
    
    // Construir conjunto de caracteres basado en las opciones seleccionadas
    if (elements.checkboxes.lowercase.checked) charset += config.characterSets.lowercase;
    if (elements.checkboxes.uppercase.checked) charset += config.characterSets.uppercase;
    if (elements.checkboxes.digits.checked) charset += config.characterSets.digits;
    if (elements.checkboxes.specials.checked) charset += config.characterSets.specials;

    const length = parseInt(elements.lengthRange.value);
    let password = '';

    // Generar contraseña
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    elements.passwordInput.value = password;
    updateStrengthMeter(password);
}

// Copiar al portapapeles
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(elements.passwordInput.value);
        showNotification('¡Contraseña copiada!', 'success');
        
        // Cambiar icono temporalmente
        const originalIcon = elements.copyBtn.innerHTML;
        elements.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            elements.copyBtn.innerHTML = originalIcon;
        }, 1500);
    } catch (err) {
        showNotification('Error al copiar la contraseña', 'error');
    }
}

// Calcular y mostrar la fortaleza de la contraseña
function updateStrengthMeter(password) {
    let strength = 0;
    
    // Criterios de fortaleza
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Actualizar barras de fortaleza
    const bars = elements.strengthBars.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (index < strength) {
            bar.className = 'bar active';
            if (strength === 5) bar.classList.add('strong');
            else if (strength >= 3) bar.classList.add('medium');
            else bar.classList.add('weak');
        } else {
            bar.className = 'bar';
        }
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}