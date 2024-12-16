// Constantes y configuración
const tagOptions = [
    "p", "h1", "h2", "h3", "h4", 
    "h5", "h6", "span", "div"
];

const palabras = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", 
    "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", 
    "incididunt", "ut", "labore", "et", "dolore", "magna", 
    "aliqua", "enim", "minim", "veniam", "quis", "nostrud", 
    "exercitation", "ullamco", "laboris", "nisi", "aliquip",
    "ex", "ea", "commodo", "consequat", "duis", "aute", 
    "irure", "dolor", "reprehenderit", "voluptate", "velit",
    "esse", "cillum", "dolore", "fugiat", "nulla", "pariatur"
];

// Elementos del DOM
const elements = {
    paragraphsSlider: document.getElementById('paragraphs'),
    wordsSlider: document.getElementById('words'),
    paragraphsValue: document.getElementById('paragraphsValue'),
    wordsValue: document.getElementById('wordsValue'),
    tagsSelect: document.getElementById('tags'),
    generateBtn: document.getElementById('generate'),
    copyBtn: document.getElementById('copy'),
    outputContent: document.getElementById('output-content')
};

// Inicialización de la interfaz
function inicializarUI() {
    // Poblar selector de etiquetas
    tagOptions.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = `<${tag}>`;
        elements.tagsSelect.appendChild(option);
    });

    // Event listeners
    elements.paragraphsSlider.addEventListener('input', 
        () => actualizarValor('paragraphs'));
    elements.wordsSlider.addEventListener('input', 
        () => actualizarValor('words'));
    elements.generateBtn.addEventListener('click', generarTexto);
    elements.copyBtn.addEventListener('click', copiarAlPortapapeles);

    // Generar texto inicial
    generarTexto();
}

// Actualizar valores mostrados
function actualizarValor(tipo) {
    elements[`${tipo}Value`].textContent = 
        elements[`${tipo}Slider`].value;
}

// Generar palabras aleatorias
function obtenerPalabrasAleatorias(cantidad) {
    let resultado = [];
    for (let i = 0; i < cantidad; i++) {
        const indice = Math.floor(Math.random() * palabras.length);
        resultado.push(palabras[indice]);
        // Capitalizar primera palabra de cada párrafo
        if (i === 0) {
            resultado[0] = resultado[0].charAt(0).toUpperCase() + 
                          resultado[0].slice(1);
        }
    }
    return resultado.join(' ') + '.';
}

// Generar texto Lorem Ipsum
function generarTexto() {
    const numParrafos = parseInt(elements.paragraphsSlider.value);
    const palabrasPorParrafo = parseInt(elements.wordsSlider.value);
    const tag = elements.tagsSelect.value;
    const incluirHtml = document.getElementById('include').value;
    
    let textoGenerado = [];
    
    for (let i = 0; i < numParrafos; i++) {
        let parrafo = obtenerPalabrasAleatorias(palabrasPorParrafo);
        
        if (incluirHtml === 'Yes') {
            parrafo = `<${tag}>${parrafo}</${tag}>`;
        }
        
        textoGenerado.push(parrafo);
    }
    
    elements.outputContent.textContent = textoGenerado.join('\n\n');
    mostrarNotificacion('¡Texto generado con éxito!');
}

// Copiar al portapapeles
async function copiarAlPortapapeles() {
    try {
        await navigator.clipboard.writeText(
            elements.outputContent.textContent
        );
        mostrarNotificacion('¡Texto copiado al portapapeles!');
    } catch (err) {
        mostrarNotificacion('Error al copiar el texto', true);
    }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, esError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${esError ? 'error' : 'success'}`;
    notification.textContent = mensaje;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', inicializarUI);