// Cliente del foro. Usa Supabase (la web publicada es estática). La clave anon es pública por diseño:
// solo permite lo que dejan las políticas de supabase/foro.sql.
// Con VITE_FORO_LOCAL=1 (npm run dev) usa en su lugar la API local de server/index.js.
const SUPABASE_URL = 'https://ocyzergjotoobbtezxuw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1BT5wV69t3hyzJNuOWvkwA_bu2U42uq';
const LOCAL = '/api/forum';
const usarLocal = import.meta.env.VITE_FORO_LOCAL === '1';
const SUPA = usarLocal ? null : import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const CLAVE = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Identificador aleatorio de este navegador: sirve para que cada uno dé un solo "me gusta"
export function clienteId() {
  try {
    let id = window.localStorage.getItem('foro_cliente');
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem('foro_cliente', id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

async function pedir(url, opciones = {}) {
  const cabeceras = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  if (SUPA) Object.assign(cabeceras, { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` });
  const res = await fetch(url, { ...opciones, headers: cabeceras });
  if (!res.ok) {
    let msg = 'Error del foro';
    try {
      const j = await res.json();
      msg = j.error || j.message || msg;
    } catch {
      // sin cuerpo
    }
    throw new Error(msg);
  }
  return res.json();
}

// Aviso por correo de cada publicación o respuesta nueva (FormSubmit, sin cuenta).
// Vacío = desactivado. La primera vez, FormSubmit manda un correo para activar el aviso.
const CORREO_AVISOS = '';

function avisar(tipo, d) {
  if (!CORREO_AVISOS) return;
  fetch(`https://formsubmit.co/ajax/${CORREO_AVISOS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: tipo === 'post' ? `Foro: nueva publicación «${d.title}»` : 'Foro: nueva respuesta',
      _template: 'table',
      _captcha: 'false',
      Tipo: tipo === 'post' ? 'Publicación' : 'Respuesta',
      Autor: d.author_name || 'Anónimo',
      ...(d.title ? { Título: d.title } : {}),
      Mensaje: d.content,
      Enlace: 'https://inversionesfacil.es/foro',
    }),
  }).catch(() => {});
}

const rest = (ruta) => `${SUPA}/rest/v1/${ruta}`;
const devolver = { headers: { Prefer: 'return=representation' } };
const json = (metodo, cuerpo, extra = {}) => ({ method: metodo, body: JSON.stringify(cuerpo), ...extra });

const supabase = {
  posts: {
    list: () => pedir(rest('forum_posts_v?select=*&order=created_date.desc&limit=100')),
    create: async (d) => {
      const fila = (await pedir(rest('forum_posts'), json('POST', d, devolver)))[0];
      avisar('post', d);
      return { ...fila, likes: 0, replies: 0 };
    },
  },
  replies: {
    list: (postId) => pedir(rest(`forum_replies_v?select=*&post_id=eq.${Number(postId)}&order=created_date.asc`)),
    create: async (d) => {
      const fila = (await pedir(rest('forum_replies'), json('POST', d, devolver)))[0];
      avisar('respuesta', d);
      return { ...fila, likes: 0 };
    },
  },
  likes: {
    toggle: (target) => pedir(rest('rpc/alternar_like'), json('POST', { p_target: target, p_client: clienteId() })),
    mine: async () => (await pedir(rest('rpc/mis_likes'), json('POST', { p_client: clienteId() }))).map((f) => f.target ?? f),
  },
};

const local = {
  posts: {
    list: () => pedir(`${LOCAL}/posts`),
    create: (d) => pedir(`${LOCAL}/posts`, json('POST', d)),
  },
  replies: {
    list: (postId) => pedir(`${LOCAL}/posts/${postId}/replies`),
    create: (d) => pedir(`${LOCAL}/replies`, json('POST', d)),
  },
  likes: {
    toggle: (target) => pedir(`${LOCAL}/likes`, json('POST', { target, client_id: clienteId() })),
    mine: () => pedir(`${LOCAL}/likes?client_id=${encodeURIComponent(clienteId())}`),
  },
};

export const forumApi = SUPA && CLAVE ? supabase : local;
