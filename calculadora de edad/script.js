// Configuración inicial cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    inicializarFechas();
    configurarEventos();
});

/**
 * Inicializa los campos de fecha con valores predeterminados
 */
function inicializarFechas() {
    // Establecer fecha de nacimiento predeterminada (1 de enero de 2000)
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    fechaNacimientoInput.value = '2000-01-01';
    
    // Establecer fecha actual
    const fechaActualInput = document.getElementById('fechaActual');
    const hoy = new Date();
    fechaActualInput.value = formatearFecha(hoy);
    
    // Establecer fecha máxima permitida (hoy)
    fechaActualInput.max = formatearFecha(hoy);
}

/**
 * Configura los eventos de los elementos interactivos
 */
function configurarEventos() {
    const fechaNacimientoInput = document.getElementById('fechaNacimiento');
    const fechaActualInput = document.getElementById('fechaActual');
    
    // Validar que la fecha de nacimiento no sea posterior a la fecha actual
    fechaNacimientoInput.addEventListener('change', validarFechas);
    fechaActualInput.addEventListener('change', validarFechas);
}

/**
 * Calcula la edad entre dos fechas y muestra el resultado
 */
function calcularEdad() {
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const fechaActual = new Date(document.getElementById('fechaActual').value);
    const resultadoElement = document.getElementById('resultado');

    // Validar que ambas fechas estén presentes
    if (!validarFechas()) {
        return;
    }

    // Calcular la diferencia de años
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();

    // Ajustar la edad si aún no ha cumplido años este año
    if (mesActual < mesNacimiento || 
        (mesActual === mesNacimiento && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }

    // Mostrar el resultado con animación
    mostrarResultado(edad);
}

/**
 * Valida que las fechas ingresadas sean coherentes
 * @returns {boolean} true si las fechas son válidas
 */
function validarFechas() {
    const fechaNacimiento = new Date(document.getElementById('fechaNacimiento').value);
    const fechaActual = new Date(document.getElementById('fechaActual').value);
    
    if (fechaActual < fechaNacimiento) {
        mostrarError('La fecha de cálculo no puede ser anterior a la fecha de nacimiento');
        return false;
    }

    return true;
}

/**
 * Muestra el resultado de la edad calculada con una animación
 * @param {number} edad - La edad calculada
 */
function mostrarResultado(edad) {
    const resultadoElement = document.getElementById('resultado');
    
    // Remover clase de animación existente
    resultadoElement.classList.remove('mostrar');
    
    // Forzar reflow para reiniciar la animación
    void resultadoElement.offsetWidth;
    
    // Establecer el nuevo contenido y mostrar con animación
    resultadoElement.textContent = `Tienes ${edad} años`;
    resultadoElement.classList.add('mostrar');
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - El mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = mensaje;
    resultadoElement.style.color = '#dc2626';
    
    // Restablecer el color después de 3 segundos
    setTimeout(() => {
        resultadoElement.style.color = '';
        resultadoElement.textContent = '';
    }, 3000);
}

/**
 * Formatea una fecha en el formato YYYY-MM-DD requerido por el input type="date"
 * @param {Date} fecha - La fecha a formatear
 * @returns {string} La fecha formateada
 */
function formatearFecha(fecha) {
    return fecha.toISOString().split('T')[0];
}