// Elementos del DOM
const addBtn = document.querySelector("#addBtn");
const main = document.querySelector("#main");

// Configuración de la aplicación
const CONFIG = {
    defaultTitle: '',
    defaultContent: '',
    saveDelay: 1000, // Tiempo de espera para autoguardar
    maxNotes: 50 // Máximo número de notas permitidas
};

// Event Listeners
addBtn.addEventListener("click", () => {
    if (document.querySelectorAll('.note').length >= CONFIG.maxNotes) {
        mostrarNotificacion('Has alcanzado el límite máximo de notas', 'error');
        return;
    }
    agregarNota();
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Función para guardar las notas
const guardarNotas = () => {
    const notas = document.querySelectorAll(".note");
    const datos = Array.from(notas).map(nota => ({
        titulo: nota.querySelector(".title").value.trim(),
        contenido: nota.querySelector(".content").value.trim()
    })).filter(nota => nota.titulo || nota.contenido);

    localStorage.setItem('notas', JSON.stringify(datos));
    mostrarNotificacion('Notas guardadas correctamente');
};

// Función para agregar una nueva nota
const agregarNota = (contenido = CONFIG.defaultContent, titulo = CONFIG.defaultTitle) => {
    const nota = document.createElement("div");
    nota.classList.add("note");
    
    nota.innerHTML = `
        <div class="note-header">
            <i class="fas fa-save" title="Guardar nota"></i>
            <i class="fas fa-trash" title="Eliminar nota"></i>
        </div>
        <textarea class="title" placeholder="Título de la nota...">${titulo}</textarea>
        <textarea class="content" placeholder="Escribe tu nota aquí...">${contenido}</textarea>
    `;

    // Event listeners para la nota
    const btnEliminar = nota.querySelector(".fa-trash");
    const btnGuardar = nota.querySelector(".fa-save");
    const textareas = nota.querySelectorAll("textarea");

    // Eliminar nota
    btnEliminar.addEventListener("click", () => {
        if (confirm('¿Estás seguro de querer eliminar esta nota?')) {
            nota.remove();
            guardarNotas();
            mostrarNotificacion('Nota eliminada');
        }
    });

    // Guardar nota
    btnGuardar.addEventListener("click", () => {
        guardarNotas();
    });

    // Autoguardado al escribir
    let timeoutId;
    textareas.forEach(textarea => {
        textarea.addEventListener("input", () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(guardarNotas, CONFIG.saveDelay);
        });
    });

    main.appendChild(nota);
};

// Función para cargar las notas guardadas
function cargarNotas() {
    const notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    
    if (notasGuardadas.length > 0) {
        notasGuardadas.forEach(nota => {
            agregarNota(nota.contenido, nota.titulo);
        });
        mostrarNotificacion('Notas cargadas correctamente');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarNotas();
});