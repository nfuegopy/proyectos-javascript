// Configuración de la API
const API_URL = 'https://api.github.com/users/';

// Elementos del DOM
const main = document.getElementById('main');
const form = document.getElementById('userInput');
const search = document.getElementById('inputBox');

// Función principal de búsqueda
async function buscarUsuario(usuario) {
    try {
        const { data } = await axios(API_URL + usuario);
        crearTarjetaUsuario(data);
        buscarRepositorios(usuario);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            mostrarError('No se encontró ningún usuario con ese nombre');
        } else {
            mostrarError('Ocurrió un error al buscar el usuario');
        }
    }
}

// Buscar repositorios del usuario
async function buscarRepositorios(usuario) {
    try {
        const { data } = await axios(`${API_URL}${usuario}/repos?sort=created&per_page=5`);
        agregarRepositorios(data);
    } catch (error) {
        mostrarError('Error al cargar los repositorios');
    }
}

// Crear tarjeta de usuario
function crearTarjetaUsuario(usuario) {
    const nombre = usuario.name || usuario.login;
    const bio = usuario.bio ? `<p>${usuario.bio}</p>` : '';
    
    const tarjeta = `
    <div class="card">
        <div class="profile-image">
            <img src="${usuario.avatar_url}" alt="${nombre}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${nombre}</h2>
            ${bio}
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value">${usuario.followers}</div>
                    <div class="stat-label">Seguidores</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${usuario.following}</div>
                    <div class="stat-label">Siguiendo</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${usuario.public_repos}</div>
                    <div class="stat-label">Repositorios</div>
                </div>
            </div>
            <div class="repos" id="repos"></div>
        </div>
    </div>
    `;
    
    main.innerHTML = tarjeta;
}

// Agregar repositorios a la tarjeta
function agregarRepositorios(repos) {
    const reposElement = document.getElementById('repos');
    
    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoElement = document.createElement('a');
            repoElement.classList.add('repo');
            repoElement.href = repo.html_url;
            repoElement.target = '_blank';
            repoElement.rel = 'noopener noreferrer';
            
            const repoName = document.createTextNode(repo.name);
            repoElement.appendChild(repoName);
            
            reposElement.appendChild(repoElement);
        });
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const errorCard = `
    <div class="error-card">
        <h2><i class="fas fa-exclamation-circle"></i></h2>
        <p>${mensaje}</p>
    </div>
    `;
    
    main.innerHTML = errorCard;
}

// Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = search.value.trim();
    
    if (usuario) {
        buscarUsuario(usuario);
        search.value = '';
        search.blur();
    }
});

// Animaciones de carga
function mostrarCargando() {
    main.innerHTML = `
    <div class="card">
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando...</p>
        </div>
    </div>
    `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    search.focus();
});