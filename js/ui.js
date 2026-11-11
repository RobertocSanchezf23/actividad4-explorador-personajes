// Módulo de interfaz: todo lo que crea o cambia elementos en el DOM
const elementos = {
  buscar: document.getElementById('buscar'),
  filtroEstado: document.getElementById('filtro-estado'),
  filtroGenero: document.getElementById('filtro-genero'),
  resumen: document.getElementById('resumen'),
  mensaje: document.getElementById('mensaje'),
  tarjetas: document.getElementById('tarjetas'),
  paginacion: document.getElementById('paginacion'),
  anterior: document.getElementById('anterior'),
  siguiente: document.getElementById('siguiente'),
  paginaActual: document.getElementById('pagina-actual'),
  detalle: document.getElementById('detalle'),
  detalleContenido: document.getElementById('detalle-contenido')
};

// Pequeña ayuda para crear un elemento con clase y texto en una sola línea
function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

// Coloca los textos fijos de la página y llena los <select> de filtros
function aplicarTextos() {
  document.querySelectorAll('[data-texto]').forEach((el) => {
    el.textContent = TEXTOS[el.dataset.texto];
  });
  document.title = TEXTOS.titulo;
  elementos.buscar.placeholder = TEXTOS.placeholderBuscar;
  llenarSelect(elementos.filtroEstado, TEXTOS.estados);
  llenarSelect(elementos.filtroGenero, TEXTOS.generos);
}

function llenarSelect(select, opciones) {
  select.replaceChildren(new Option(TEXTOS.todos, ''));
  Object.entries(opciones).forEach(([valor, texto]) => {
    select.append(new Option(texto, valor));
  });
}

// ---------- Estados de la interfaz ----------

function mostrarCargando() {
  elementos.tarjetas.replaceChildren();
  elementos.paginacion.hidden = true;
  elementos.resumen.textContent = '';
  elementos.mensaje.replaceChildren(
    crear('div', 'spinner'),
    crear('p', null, TEXTOS.cargando)
  );
  elementos.mensaje.className = 'mensaje mensaje-cargando';
  elementos.mensaje.hidden = false;
}

function mostrarVacio() {
  elementos.tarjetas.replaceChildren();
  elementos.paginacion.hidden = true;
  elementos.resumen.textContent = formatear(TEXTOS.resumen, { total: 0 });
  elementos.mensaje.replaceChildren(
    crear('p', 'mensaje-icono', '🔍'),
    crear('h2', null, TEXTOS.vacioTitulo),
    crear('p', null, TEXTOS.vacioDetalle)
  );
  elementos.mensaje.className = 'mensaje mensaje-vacio';
  elementos.mensaje.hidden = false;
}

function mostrarError(error, alReintentar) {
  elementos.tarjetas.replaceChildren();
  elementos.paginacion.hidden = true;
  elementos.resumen.textContent = '';

  const detalle = error.tipo === 'servidor'
    ? formatear(TEXTOS.errorServidor, { codigo: error.codigo })
    : TEXTOS.errorRed;

  const boton = crear('button', 'boton', TEXTOS.reintentar);
  boton.type = 'button';
  boton.addEventListener('click', alReintentar);

  elementos.mensaje.replaceChildren(
    crear('p', 'mensaje-icono', '⚠️'),
    crear('h2', null, TEXTOS.errorTitulo),
    crear('p', null, detalle),
    boton
  );
  elementos.mensaje.className = 'mensaje mensaje-error';
  elementos.mensaje.hidden = false;
}

// ---------- Resultados ----------

function mostrarPersonajes(personajes, info, alSeleccionar) {
  elementos.mensaje.hidden = true;
  elementos.resumen.textContent = formatear(TEXTOS.resumen, { total: info.count });

  // Creamos una tarjeta por cada personaje del JSON
  const tarjetas = personajes.map((p) => crearTarjeta(p, alSeleccionar));
  elementos.tarjetas.replaceChildren(...tarjetas);
}

function crearTarjeta(personaje, alSeleccionar) {
  const tarjeta = crear('article', 'tarjeta');

  const boton = crear('button', 'tarjeta-boton');
  boton.type = 'button';
  boton.setAttribute('aria-label', `${TEXTOS.verDetalle} ${personaje.name}`);
  boton.addEventListener('click', () => alSeleccionar(personaje));

  const imagen = crear('img', 'tarjeta-imagen');
  imagen.src = personaje.image;
  imagen.alt = personaje.name;
  imagen.loading = 'lazy';

  const cuerpo = crear('div', 'tarjeta-cuerpo');
  cuerpo.append(
    crear('h3', 'tarjeta-nombre', personaje.name),
    crearEtiquetaEstado(personaje.status),
    crear('p', 'tarjeta-dato', `${TEXTOS.especie}: ${traducir(TEXTOS.especies, personaje.species)}`)
  );

  boton.append(imagen, cuerpo);
  tarjeta.append(boton);
  return tarjeta;
}

function crearEtiquetaEstado(estadoApi) {
  const clave = estadoApi.toLowerCase(); // la API manda "Alive", "Dead" o "unknown"
  return crear('span', `estado estado-${clave}`, traducir(TEXTOS.estados, estadoApi));
}

// Origen y ubicación son nombres propios (se quedan igual), salvo "unknown"
function traducirLugar(nombre) {
  return nombre === 'unknown' ? TEXTOS.desconocido : nombre;
}

function actualizarPaginacion(info, pagina) {
  if (info.pages <= 1) {
    elementos.paginacion.hidden = true;
    return;
  }
  elementos.paginaActual.textContent = formatear(TEXTOS.pagina, { actual: pagina, total: info.pages });
  elementos.anterior.disabled = !info.prev;
  elementos.siguiente.disabled = !info.next;
  elementos.paginacion.hidden = false;
}

// ---------- Ventana de detalle ----------

function abrirDetalle(p) {
  const imagen = crear('img', 'detalle-imagen');
  imagen.src = p.image;
  imagen.alt = p.name;

  const datos = crear('dl', 'detalle-datos');
  const especie = traducir(TEXTOS.especies, p.species);
  const filas = [
    [TEXTOS.especie, p.type ? `${especie} (${p.type})` : especie],
    [TEXTOS.etiquetaGenero, traducir(TEXTOS.generos, p.gender)],
    [TEXTOS.origen, traducirLugar(p.origin.name)],
    [TEXTOS.ubicacion, traducirLugar(p.location.name)],
    [TEXTOS.episodios, `${p.episode.length} ${p.episode.length === 1 ? TEXTOS.episodioUnidad : TEXTOS.episodiosUnidad}`]
  ];
  filas.forEach(([titulo, valor]) => datos.append(crear('dt', null, titulo), crear('dd', null, valor)));

  elementos.detalleContenido.replaceChildren(
    imagen,
    crear('h2', null, p.name),
    crearEtiquetaEstado(p.status),
    datos
  );
  elementos.detalle.showModal();
}
