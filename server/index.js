import express from 'express';
import pg from 'pg';
import cors from 'cors';

const { Pool } = pg;
const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://inversionesfacil.es' }));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
  const { likes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE forum_posts SET likes = $1 WHERE id = $2 RETURNING *',
      [likes, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
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
