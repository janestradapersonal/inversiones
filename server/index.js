// API local del foro (para probar en el ordenador). En la web publicada el foro usa Supabase (ver supabase/foro.sql).
// Guarda todo en server/foro.db (SQLite integrado en Node, sin instalar nada).
import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://inversionesfacil.es' }));

const db = new DatabaseSync(fileURLToPath(new URL('./foro.db', import.meta.url)));
db.exec(`
  CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'otro',
    author_name TEXT NOT NULL DEFAULT 'Anónimo',
    created_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE TABLE IF NOT EXISTS forum_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL DEFAULT 'Anónimo',
    created_date TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE TABLE IF NOT EXISTS forum_likes (
    target TEXT NOT NULL,      -- 'p:<id>' (publicación) o 'r:<id>' (respuesta)
    client_id TEXT NOT NULL,   -- identificador aleatorio del navegador
    PRIMARY KEY (target, client_id)
  );
`);

const CATEGORIAS = ['pregunta', 'experiencia', 'duda', 'consejo', 'otro'];
const LIKES = (prefijo, tabla) =>
  `(SELECT COUNT(*) FROM forum_likes l WHERE l.target = '${prefijo}:' || ${tabla}.id) AS likes`;

// Mismos límites que las restricciones de Supabase
function texto(v, min, max) {
  const t = typeof v === 'string' ? v.trim() : '';
  return t.length >= min && t.length <= max ? t : null;
}
const nombre = (v) => texto(v, 1, 40) || 'Anónimo';

app.get('/api/forum/posts', (req, res) => {
  res.json(db.prepare(
    `SELECT p.*, ${LIKES('p', 'p')}, (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) AS replies
     FROM forum_posts p ORDER BY p.created_date DESC LIMIT 100`
  ).all());
});

app.post('/api/forum/posts', (req, res) => {
  const { title, content, category, author_name } = req.body || {};
  const t = texto(title, 3, 120);
  const c = texto(content, 1, 3000);
  if (!t || !c) return res.status(400).json({ error: 'Título (3-120) y mensaje (1-3000) obligatorios' });
  const cat = CATEGORIAS.includes(category) ? category : 'otro';
  const fila = db.prepare(
    'INSERT INTO forum_posts (title, content, category, author_name) VALUES (?, ?, ?, ?) RETURNING *'
  ).get(t, c, cat, nombre(author_name));
  res.json({ ...fila, likes: 0, replies: 0 });
});

app.get('/api/forum/posts/:id/replies', (req, res) => {
  res.json(db.prepare(
    `SELECT r.*, ${LIKES('r', 'r')} FROM forum_replies r WHERE r.post_id = ? ORDER BY r.created_date ASC`
  ).all(Number(req.params.id)));
});

app.post('/api/forum/replies', (req, res) => {
  const { post_id, content, author_name } = req.body || {};
  const c = texto(content, 1, 2000);
  if (!c) return res.status(400).json({ error: 'Respuesta vacía o demasiado larga' });
  if (!db.prepare('SELECT 1 FROM forum_posts WHERE id = ?').get(Number(post_id))) {
    return res.status(404).json({ error: 'La publicación no existe' });
  }
  const fila = db.prepare(
    'INSERT INTO forum_replies (post_id, content, author_name) VALUES (?, ?, ?) RETURNING *'
  ).get(Number(post_id), c, nombre(author_name));
  res.json({ ...fila, likes: 0 });
});

// Me gusta / quitar me gusta (uno por navegador)
app.post('/api/forum/likes', (req, res) => {
  const { target, client_id } = req.body || {};
  if (!/^[pr]:\d+$/.test(target || '') || !texto(client_id, 8, 64)) {
    return res.status(400).json({ error: 'Datos no válidos' });
  }
  const borrado = db.prepare('DELETE FROM forum_likes WHERE target = ? AND client_id = ?').run(target, client_id);
  if (!borrado.changes) db.prepare('INSERT INTO forum_likes (target, client_id) VALUES (?, ?)').run(target, client_id);
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM forum_likes WHERE target = ?').get(target);
  res.json({ liked: !borrado.changes, likes: n });
});

app.get('/api/forum/likes', (req, res) => {
  const id = texto(req.query.client_id, 8, 64);
  if (!id) return res.json([]);
  res.json(db.prepare('SELECT target FROM forum_likes WHERE client_id = ?').all(id).map((f) => f.target));
});

const requestedPort = Number(process.env.API_PORT || process.env.PORT || 3001);

function listen(port, retriesLeft) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`API server running on port ${port}`);
  });

  server.on('error', (err) => {
    const envPortProvided = Boolean(process.env.API_PORT || process.env.PORT);
    if (!envPortProvided && err?.code === 'EADDRINUSE' && retriesLeft > 0) {
      console.warn(`Port ${port} in use. Trying ${port + 1}...`);
      listen(port + 1, retriesLeft - 1);
      return;
    }

    console.error(err);
    process.exit(1);
  });
}

listen(Number.isFinite(requestedPort) ? requestedPort : 3001, 10);
