// Lógica principal: une la API con la interfaz y responde a lo que hace el usuario

// Estado actual de la búsqueda
const filtros = {
  nombre: '',
  estado: '',
  genero: '',
  pagina: 1
};

let controlador = null;  // para cancelar la petición anterior
let temporizador = null; // para esperar a que el usuario deje de escribir

async function cargarPersonajes() {
  // Si había una petición en curso, la cancelamos para que no llegue tarde y pise la nueva
  if (controlador) controlador.abort();
  controlador = new AbortController();

  mostrarCargando();

  try {
    const datos = await obtenerPersonajes(filtros, controlador.signal);

    if (datos.results.length === 0) {
      mostrarVacio();
      return;
    }

    mostrarPersonajes(datos.results, datos.info, abrirDetalle);
    actualizarPaginacion(datos.info, filtros.pagina);
  } catch (error) {
    if (error.name === 'AbortError') return; // fue cancelada a propósito, no es un error
    console.error(error);
    mostrarError(error, cargarPersonajes);
  }
}

// Cada vez que cambia un filtro regresamos a la página 1
function cambiarFiltro(campo, valor) {
  filtros[campo] = valor;
  filtros.pagina = 1;
  cargarPersonajes();
}

// ---------- Eventos ----------

// Búsqueda por nombre: esperamos 400 ms después de la última tecla
// para no hacer una petición por cada letra
elementos.buscar.addEventListener('input', (e) => {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => cambiarFiltro('nombre', e.target.value.trim()), 400);
});

elementos.filtroEstado.addEventListener('change', (e) => cambiarFiltro('estado', e.target.value));
elementos.filtroGenero.addEventListener('change', (e) => cambiarFiltro('genero', e.target.value));

// Evita que Enter recargue la página
document.getElementById('formulario').addEventListener('submit', (e) => e.preventDefault());

// Botón "Limpiar filtros": el navegador vacía los campos y nosotros reiniciamos el estado
document.getElementById('formulario').addEventListener('reset', () => {
  clearTimeout(temporizador);
  Object.assign(filtros, { nombre: '', estado: '', genero: '', pagina: 1 });
  cargarPersonajes();
});

elementos.anterior.addEventListener('click', () => {
  filtros.pagina--;
  cargarPersonajes();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

elementos.siguiente.addEventListener('click', () => {
  filtros.pagina++;
  cargarPersonajes();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('cerrar-detalle').addEventListener('click', () => elementos.detalle.close());

// Cerrar el detalle al hacer clic fuera de la ventana
elementos.detalle.addEventListener('click', (e) => {
  if (e.target === elementos.detalle) elementos.detalle.close();
});

// ---------- Inicio ----------
aplicarTextos();
cargarPersonajes();
