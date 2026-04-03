import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forumApi } from "@/api/forumClient";
import { MessageCircle, Plus, ThumbsUp, ChevronDown, ChevronUp, Send, X, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES = ["pregunta", "experiencia", "duda", "consejo", "otro"];
const CAT_COLORS = {
  pregunta: "bg-blue-100 text-blue-700",
  experiencia: "bg-green-100 text-green-700",
  duda: "bg-blue-100 text-blue-700",
  consejo: "bg-purple-100 text-purple-700",
  otro: "bg-gray-100 text-gray-600"
};
const CAT_EMOJI = { pregunta: "❓", experiencia: "💪", duda: "🤔", consejo: "💡", otro: "💬" };

function NewPostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", content: "", category: "pregunta", author_name: "", is_anonymous: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await forumApi.posts.create({
      ...form,
      author_name: form.is_anonymous ? "Anónimo" : form.author_name || "Anónimo"
    });
    setLoading(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-sora text-xl font-bold">Nueva publicación</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) =>
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, category: c })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.category === c ? CAT_COLORS[c] + " ring-2 ring-offset-1 ring-current" : "bg-muted text-muted-foreground"}`}>
                
                  {CAT_EMOJI[c]} {c}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Título *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="¿Cuál es tu pregunta o tema?"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm" />
            
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Mensaje *</label>
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm resize-none" />
            
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1.5">Tu nombre</label>
              <input
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder="Opcional"
                disabled={form.is_anonymous}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm disabled:opacity-50" />
              
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="anon"
                checked={form.is_anonymous}
                onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
                className="w-4 h-4 accent-brand-orange" />
              
              <label htmlFor="anon" className="text-sm text-muted-foreground">Anónimo</label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold hover:scale-105 transition-all disabled:opacity-60">
            
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </motion.div>
    </div>);

}

function ReplyForm({ postId, onReplied }) {
  const [form, setForm] = useState({ content: "", author_name: "", is_anonymous: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await forumApi.replies.create({
      post_id: postId,
      content: form.content,
      author_name: form.is_anonymous ? "Anónimo" : form.author_name || "Anónimo",
      is_anonymous: form.is_anonymous
    });
    setForm({ content: "", author_name: "", is_anonymous: false });
    setLoading(false);
    onReplied();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border space-y-3">
      <textarea
        required
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Escribe tu respuesta..."
        rows={2}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm resize-none" />
      
      <div className="flex items-center gap-3">
        <input
          value={form.author_name}
          onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          placeholder="Tu nombre (opcional)"
          disabled={form.is_anonymous}
          className="flex-1 px-4 py-2 rounded-xl border border-border bg-muted/30 focus:outline-none text-sm disabled:opacity-50" />
        
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_anonymous}
            onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
            className="accent-brand-orange" />
          
          Anónimo
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white font-medium text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">
          
          <Send className="w-4 h-4" /> Responder
        </button>
      </div>
    </form>);

}

function PostCard({ post, onLike }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(0);

  useEffect(() => {
    const fetchReplyCount = async () => {
      const r = await forumApi.replies.list(post.id);
      setReplyCount(r.length);
    };
    fetchReplyCount();
  }, [post.id]);

  const loadReplies = async () => {
    const r = await forumApi.replies.list(post.id);
    setReplies(r);
    setReplyCount(r.length);
  };

  const handleExpand = async () => {
    if (!expanded) await loadReplies();
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-border p-6 hover:shadow-md transition-shadow">
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">{post.author_name || "Anónimo"}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.created_date), "d MMM yyyy, HH:mm", { locale: es })}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CAT_COLORS[post.category]}`}>
          {CAT_EMOJI[post.category]} {post.category}
        </span>
      </div>

      <h3 className="font-sora font-bold text-base mb-2">{post.title}</h3>
      <p className="text-slate-950 mb-4 text-sm leading-relaxed">{post.content}</p>

      <div className="text-slate-600 flex items-center gap-4">
        <button
          onClick={() => onLike(post)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-orange transition-colors">
          
          <ThumbsUp className="text-slate-950 lucide lucide-thumbs-up w-4 h-4" />
          <span className="text-[#ff0000]">{post.likes || 0}</span>
        </button>
        <button
          onClick={handleExpand}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-purple transition-colors">

          <MessageCircle className="text-slate-950 lucide lucide-message-circle w-4 h-4" />
          <span className="text-slate-950">{replyCount} {replyCount === 1 ? 'respuesta' : 'respuestas'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden">
          
            {replies.length > 0 &&
          <div className="mt-4 space-y-3">
                {replies.map((reply) =>
            <div key={reply.id} className="flex gap-3 bg-muted/40 rounded-2xl p-4">
                    <div className="bg-brand-purple/20 text-slate-950 rounded-xl w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-brand-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs mb-1">{reply.author_name || "Anónimo"}</p>
                      <p className="text-slate-950 text-sm">{reply.content}</p>
                    </div>
                  </div>
            )}
              </div>
          }
            <ReplyForm postId={post.id} onReplied={loadReplies} />
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

}

export default function Foro() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const loadPosts = async () => {
    setLoading(true);
    const data = await forumApi.posts.list();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const handleLike = async (post) => {
    const newLikes = (post.likes || 0) + 1;
    await forumApi.posts.update(post.id, { likes: newLikes });
    setPosts(posts.map((p) => p.id === post.id ? { ...p, likes: newLikes } : p));
  };

  const filtered = activeCategory === "all" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-[#7dd0e3] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink font-semibold text-sm mb-5">
            💬 Comunidad
          </span>
          <h1 className="font-sora text-4xl md:text-5xl font-extrabold mb-4">
            El{" "}
            <span className="bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
              foro
            </span>{" "}
            de la comunidad
          </h1>
          <p className="text-slate-950 mx-auto text-xl max-w-xl">Pregunta, comparte tu experiencia, ayuda a otros. No hay preguntas tontas, todos empezamos desde cero.

          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")} className="bg-blue-950 text-slate-50 px-4 py-2 text-sm font-medium rounded-full transition-all">
              
              🌐 Todos
            </button>
            {CATEGORIES.map((c) =>
            <button
              key={c}
              onClick={() => setActiveCategory(c)} className="bg-blue-950 text-muted-foreground px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-muted/80">
              
                {CAT_EMOJI[c]} {c}
              </button>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-orange to-brand-purple text-white font-bold text-sm hover:scale-105 hover:shadow-lg transition-all">
            
            <Plus className="w-4 h-4" /> Nueva publicación
          </button>
        </div>

        {loading ?
        <div className="space-y-4">
            {[1, 2, 3].map((i) =>
          <div key={i} className="bg-white rounded-3xl border border-border p-6 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-9 h-9 rounded-2xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-muted rounded" />
                    <div className="h-2 w-16 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-full bg-muted rounded mb-1" />
                <div className="h-3 w-2/3 bg-muted rounded" />
              </div>
          )}
          </div> :
        filtered.length === 0 ?
        <div className="text-center py-20">
            <p className="text-5xl mb-4">🌱</p>
            <h3 className="font-sora text-xl font-bold mb-2">¡Sé el primero!</h3>
            <p className="text-muted-foreground">Aún no hay publicaciones en esta categoría. Empieza la conversación.</p>
          </div> :

        <div className="space-y-4">
            {filtered.map((post) =>
          <PostCard key={post.id} post={post} onLike={handleLike} />
          )}
          </div>
        }
      </div>

      <AnimatePresence>
        {showModal &&
        <NewPostModal onClose={() => setShowModal(false)} onCreated={loadPosts} />
        }
      </AnimatePresence>
    </div>);

}
