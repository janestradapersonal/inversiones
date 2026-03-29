const BASE = '/api/forum';

export const forumApi = {
  posts: {
    list: async () => {
      const res = await fetch(`${BASE}/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create post');
      return res.json();
    },
    update: async (id, data) => {
      const res = await fetch(`${BASE}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update post');
      return res.json();
    },
  },
  replies: {
    list: async (postId) => {
      const res = await fetch(`${BASE}/posts/${postId}/replies`);
      if (!res.ok) throw new Error('Failed to fetch replies');
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${BASE}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create reply');
      return res.json();
    },
  },
};
