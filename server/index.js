import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;
const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cors({ origin: 'https://inversionesfacil.es' }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const LIKE_COOLDOWN_MS = Number(process.env.LIKE_COOLDOWN_MS || 2 * 60 * 1000);
const likeCooldownByIpAndPost = new Map();

function cleanupLikeCooldowns(now) {
  // Limpieza simple para que el Map no crezca infinito.
  // Elimina claves viejas (más de 2 ventanas de cooldown).
  const maxAge = LIKE_COOLDOWN_MS * 2;
  for (const [key, ts] of likeCooldownByIpAndPost.entries()) {
    if (typeof ts !== 'number' || now - ts > maxAge) likeCooldownByIpAndPost.delete(key);
  }
}

function getClientIp(req) {
  // Con trust proxy=true, req.ip respeta X-Forwarded-For.
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

app.get('/api/forum/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM forum_posts ORDER BY created_date DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/forum/posts', async (req, res) => {
  const { title, content, category, author_name, is_anonymous } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO forum_posts (title, content, category, author_name, is_anonymous)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, content, category || 'otro', author_name || 'Anónimo', is_anonymous || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.patch('/api/forum/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Este endpoint ya no permite modificar likes desde el cliente.
    // Usa POST /api/forum/posts/:id/like.
    if (Object.prototype.hasOwnProperty.call(req.body || {}, 'likes')) {
      return res.status(400).json({ error: 'No se puede modificar likes directamente. Usa /api/forum/posts/:id/like.' });
    }

    return res.status(400).json({ error: 'Endpoint no soportado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.post('/api/forum/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  const now = Date.now();

  const ip = getClientIp(req);
  const key = `${ip}|${id}`;
  const last = likeCooldownByIpAndPost.get(key) || 0;
  const elapsed = now - last;
  const remaining = LIKE_COOLDOWN_MS - elapsed;

  if (likeCooldownByIpAndPost.size > 5000) cleanupLikeCooldowns(now);

  if (remaining > 0) {
    res.set('Retry-After', String(Math.ceil(remaining / 1000)));
    return res.status(429).json({
      error: 'Cooldown: espera antes de volver a dar like',
      retryAfterMs: remaining,
    });
  }

  likeCooldownByIpAndPost.set(key, now);

  try {
    const result = await pool.query(
      'UPDATE forum_posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (!result.rows?.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json({
      ...result.rows[0],
      likeCooldownMs: LIKE_COOLDOWN_MS,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to like post' });
  }
});

app.get('/api/forum/posts/:id/replies', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM forum_replies WHERE post_id = $1 ORDER BY created_date DESC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

app.post('/api/forum/replies', async (req, res) => {
  const { post_id, content, author_name, is_anonymous } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO forum_replies (post_id, content, author_name, is_anonymous)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [post_id, content, author_name || 'Anónimo', is_anonymous || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reply' });
  }
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
