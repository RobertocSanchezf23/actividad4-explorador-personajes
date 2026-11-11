// Todos los textos que ve el usuario están aquí.
// Así, para hacer la versión en inglés solo hay que traducir este archivo.
const TEXTOS = {
  titulo: 'Explorador de Personajes',
  subtitulo: 'Busca y filtra personajes de Rick and Morty en tiempo real',
  etiquetaBuscar: 'Buscar por nombre',
  placeholderBuscar: 'Ej. Rick, Morty, Summer...',
  etiquetaEstado: 'Estado',
  etiquetaGenero: 'Género',
  todos: 'Todos',
  limpiar: 'Limpiar filtros',

  estados: {
    alive: 'Vivo',
    dead: 'Muerto',
    unknown: 'Desconocido'
  },
  generos: {
    female: 'Femenino',
    male: 'Masculino',
    genderless: 'Sin género',
    unknown: 'Desconocido'
  },
  // La API manda las especies en inglés; aquí traducimos las que usa
  especies: {
    'human': 'Humano',
    'alien': 'Alienígena',
    'humanoid': 'Humanoide',
    'robot': 'Robot',
    'animal': 'Animal',
    'mythological creature': 'Criatura mitológica',
    'disease': 'Enfermedad',
    'cronenberg': 'Cronenberg',
    'poopybutthole': 'Poopybutthole',
    'unknown': 'Desconocida'
  },
  desconocido: 'Desconocido',

  cargando: 'Cargando personajes...',
  vacioTitulo: 'No se encontraron personajes',
  vacioDetalle: 'Prueba con otro nombre o quita algunos filtros.',
  errorTitulo: 'No se pudo cargar la información',
  errorRed: 'Parece que no hay conexión a internet. Revísala e inténtalo de nuevo.',
  errorServidor: 'El servicio respondió con un error (código {codigo}). Inténtalo más tarde.',
  reintentar: 'Reintentar',

  resumen: '{total} personajes encontrados',
  anterior: '← Anterior',
  siguiente: 'Siguiente →',
  pagina: 'Página {actual} de {total}',

  especie: 'Especie',
  origen: 'Origen',
  ubicacion: 'Última ubicación conocida',
  episodios: 'Aparece en',
  episodioUnidad: 'episodio',
  episodiosUnidad: 'episodios',
  verDetalle: 'Ver detalle de',
  cerrar: 'Cerrar',
  fuente: 'Datos obtenidos de The Rick and Morty API (rickandmortyapi.com)'
};

// Reemplaza marcadores como {total} dentro de un texto
function formatear(texto, valores) {
  return texto.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? '');
}

// Traduce un valor que viene de la API; si no está en la lista, lo deja como viene
function traducir(lista, valor) {
  return lista[valor.toLowerCase()] ?? valor;
}
