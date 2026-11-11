// Módulo de comunicación con la API REST
// Documentación: https://rickandmortyapi.com/documentation
const URL_BASE = 'https://rickandmortyapi.com/api/character';

// Error propio para distinguir un problema de red de un error del servidor
class ErrorApi extends Error {
  constructor(tipo, codigo = null) {
    super(`Error de API: ${tipo} ${codigo ?? ''}`);
    this.tipo = tipo;     // 'red' o 'servidor'
    this.codigo = codigo; // código HTTP, si lo hay
  }
}

/**
 * Consulta personajes con filtros y paginación.
 * @param {Object} filtros - { nombre, estado, genero, pagina }
 * @param {AbortSignal} senal - permite cancelar la petición si el usuario hace otra búsqueda
 * @returns {Promise<{info: Object, results: Array}>}
 */
async function obtenerPersonajes({ nombre, estado, genero, pagina }, senal) {
  // Construimos los parámetros de la URL solo con los filtros que tienen valor
  const parametros = new URLSearchParams({ page: pagina });
  if (nombre) parametros.set('name', nombre);
  if (estado) parametros.set('status', estado);
  if (genero) parametros.set('gender', genero);

  const url = `${URL_BASE}/?${parametros}`;

  let respuesta;
  try {
    respuesta = await fetch(url, { signal: senal });
  } catch (error) {
    // Si la cancelamos nosotros, la dejamos pasar tal cual
    if (error.name === 'AbortError') throw error;
    // Cualquier otro fallo aquí significa que no hubo respuesta (sin internet, DNS, etc.)
    throw new ErrorApi('red');
  }

  // La API responde 404 cuando ningún personaje coincide con los filtros:
  // no es un error real, es un resultado vacío
  if (respuesta.status === 404) {
    return { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
  }

  // Cualquier otro código fuera de 200-299 sí es un error (500, 429, etc.)
  if (!respuesta.ok) {
    throw new ErrorApi('servidor', respuesta.status);
  }

  // Convertimos el cuerpo de la respuesta de JSON a objeto de JavaScript
  return await respuesta.json();
}
