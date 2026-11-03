import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Plus, Send, User, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { forumApi } from "@/api/forumClient";

const CATEGORIAS = ["duda", "consejo", "otro"];
const NOMBRE = { duda: "Dudas", consejo: "Consejos y experiencias", otro: "Otros" };
const SECCION = { pregunta: "duda", duda: "duda", experiencia: "consejo", consejo: "consejo", otro: "otro" };
const campo =
  "w-full px-4 py-2.5 rounded-xl border border-white/15 bg-brand-onyx/60 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 text-sm disabled:opacity-50";

const hace = (fecha) => formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
const autor = (nombre) => nombre.trim().slice(0, 40) || "Anónimo";

function BotonLike({ target, likes, liked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(target)}
      title={liked ? "Quitar me gusta" : "Me gusta"}
      className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-[#FF5C7A]" : "text-white/60 hover:text-[#FF5C7A]"}`}
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
      <span className="tabular-nums">{likes}</span>
    </button>
  );
}

function AvisoError({ texto }) {
  return texto ? <p className="text-sm text-[#FF5C7A]">{texto}</p> : null;
}

function NuevaPublicacion({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: "", content: "", category: "duda", author_name: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const post = await forumApi.posts.create({
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        author_name: autor(form.author_name),
      });
      onCreated(post);
      onClose();
    } catch {
      setError("No se ha podido publicar. Inténtalo de nuevo en un momento.");
    }
    setEnviando(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-brand-surface text-white rounded-3xl w-full max-w-xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-display uppercase text-2xl">Nueva publicación</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={enviar} className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, category: c })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${form.category === c ? "bg-brand-mint text-brand-onyx" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
              >
                {NOMBRE[c]}
              </button>
            ))}
          </div>
          <input
            required
            minLength={3}
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Título: ¿cuál es tu pregunta o tema?"
            className={campo}
          />
          <textarea
            required
            maxLength={3000}
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Escribe tu mensaje…"
            className={`${campo} resize-none`}
          />
          <input
            maxLength={40}
            value={form.author_name}
            onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            placeholder="Tu nombre (opcional; si lo dejas vacío, saldrás como Anónimo)"
            className={campo}
          />
          <AvisoError texto={error} />
          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 rounded-2xl bg-brand-mint text-brand-onyx font-bold hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {enviando ? "Publicando…" : "Publicar"}
          </button>
          <p className="text-[11px] text-white/45 text-center">
            Sé respetuoso. No compartas datos personales ni pidas ni des contraseñas. Lo que publiques es visible para todos.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function FormRespuesta({ postId, onRespondido }) {
  const [texto, setTexto] = useState("");
  const [nombre, setNombre] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    try {
      const r = await forumApi.replies.create({ post_id: postId, content: texto.trim(), author_name: autor(nombre) });
      setTexto("");
      onRespondido(r);
    } catch {
      setError("No se ha podido enviar la respuesta.");
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={enviar} className="mt-4 pt-4 border-t border-white/10 space-y-3">
      <textarea
        required
        maxLength={2000}
        rows={2}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe tu respuesta…"
        className={`${campo} resize-none`}
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          maxLength={40}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className={`${campo} sm:flex-1`}
        />
        <button
          type="submit"
          disabled={enviando}
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-mint text-brand-onyx font-bold text-sm hover:scale-105 transition-transform disabled:opacity-60"
        >
          <Send className="w-4 h-4" /> {enviando ? "Enviando…" : "Responder"}
        </button>
      </div>
      <AvisoError texto={error} />
    </form>
  );
}

function Publicacion({ post, misLikes, onLike, onRespuesta }) {
  const [abierta, setAbierta] = useState(false);
  const [respuestas, setRespuestas] = useState(null);

  const alternar = async () => {
    if (!abierta && respuestas === null) {
      try {
        setRespuestas(await forumApi.replies.list(post.id));
      } catch {
        setRespuestas([]);
      }
    }
    setAbierta(!abierta);
  };

  const likeRespuesta = async (target) => {
    const r = await onLike(target);
    if (r) setRespuestas((prev) => prev.map((x) => (`r:${x.id}` === target ? { ...x, likes: r.likes } : x)));
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-surface rounded-3xl border border-white/10 p-6"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-brand-indigo flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">{post.author_name || "Anónimo"}</p>
            <p className="text-xs text-white/50">{hace(post.created_date)}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
          {NOMBRE[SECCION[post.category]] || "Otros"}
        </span>
      </div>

      <h3 className="font-sora font-bold text-lg mb-2">{post.title}</h3>
      <p className="text-white/85 mb-4 text-sm leading-relaxed whitespace-pre-line break-words">{post.content}</p>

      <div className="flex items-center gap-5">
        <BotonLike target={`p:${post.id}`} likes={Number(post.likes)} liked={misLikes.has(`p:${post.id}`)} onToggle={onLike} />
        <button onClick={alternar} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-brand-mint transition-colors">
          <MessageCircle className="w-4 h-4" />
          {Number(post.replies)} {Number(post.replies) === 1 ? "respuesta" : "respuestas"}
          {abierta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {abierta && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {respuestas?.length > 0 && (
              <div className="mt-4 space-y-3">
                {respuestas.map((r) => (
                  <div key={r.id} className="flex gap-3 bg-brand-onyx/50 rounded-2xl p-4">
                    <div className="bg-white/10 rounded-xl w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-brand-mint" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-1">
                        <span className="font-semibold">{r.author_name || "Anónimo"}</span>
                        <span className="text-white/45"> · {hace(r.created_date)}</span>
                      </p>
                      <p className="text-white/85 text-sm whitespace-pre-line break-words">{r.content}</p>
                      <div className="mt-2">
                        <BotonLike target={`r:${r.id}`} likes={Number(r.likes)} liked={misLikes.has(`r:${r.id}`)} onToggle={likeRespuesta} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <FormRespuesta
              postId={post.id}
              onRespondido={(r) => {
                setRespuestas((prev) => [...(prev || []), r]);
                onRespuesta(post.id);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Foro() {
  const [posts, setPosts] = useState([]);
  const [misLikes, setMisLikes] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [categoria, setCategoria] = useState("todas");
  const [orden, setOrden] = useState("recientes");

  useEffect(() => {
    (async () => {
      try {
        const [lista, mios] = await Promise.all([forumApi.posts.list(), forumApi.likes.mine().catch(() => [])]);
        setPosts(lista);
        setMisLikes(new Set(mios));
      } catch {
        setError("No se ha podido cargar el foro. Prueba a recargar la página.");
      }
      setCargando(false);
    })();
  }, []);

  // Devuelve {liked, likes} para que cada tarjeta actualice su contador
  const like = async (target) => {
    try {
      const r = await forumApi.likes.toggle(target);
      setMisLikes((prev) => {
        const s = new Set(prev);
        r.liked ? s.add(target) : s.delete(target);
        return s;
      });
      if (target.startsWith("p:")) {
        setPosts((prev) => prev.map((p) => (`p:${p.id}` === target ? { ...p, likes: r.likes } : p)));
      }
      return r;
    } catch {
      return null;
    }
  };

  const sumarRespuesta = (id) => setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, replies: Number(p.replies) + 1 } : p)));

  const visibles = posts
    .filter((p) => categoria === "todas" || (SECCION[p.category] || "otro") === categoria)
    .sort((a, b) => (orden === "votados" ? Number(b.likes) - Number(a.likes) : 0) || new Date(b.created_date) - new Date(a.created_date));

  const pastilla = (activa) =>
    `px-4 py-2 text-sm font-medium rounded-full transition-colors ${activa ? "bg-brand-mint text-brand-onyx" : "bg-brand-surface text-white/70 hover:text-white border border-white/10"}`;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-surface text-brand-mint font-semibold text-sm mb-5">Comunidad</span>
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.92] tracking-tight mb-6">
            El <span className="font-serif italic normal-case text-brand-mint">foro</span>
          </h1>
          <p className="text-white/85 mx-auto text-xl max-w-xl">
            Pregunta, comparte tu experiencia y ayuda a otros. No hay preguntas tontas: todos empezamos desde cero.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategoria("todas")} className={pastilla(categoria === "todas")}>Todas</button>
            {CATEGORIAS.map((c) => (
              <button key={c} onClick={() => setCategoria(c)} className={pastilla(categoria === c)}>
                {NOMBRE[c]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-mint text-brand-onyx font-bold text-sm hover:scale-105 transition-transform shrink-0"
          >
            <Plus className="w-4 h-4" /> Nueva publicación
          </button>
        </div>
        <div className="flex gap-4 text-sm mb-8">
          {[["recientes", "Más recientes"], ["votados", "Más votadas"]].map(([k, t]) => (
            <button key={k} onClick={() => setOrden(k)} className={orden === k ? "text-brand-mint font-semibold" : "text-white/55 hover:text-white"}>
              {t}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-brand-surface rounded-3xl border border-white/10 p-6 animate-pulse">
                <div className="h-4 w-1/3 bg-white/10 rounded mb-4" />
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-3 w-full bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center py-20 text-[#FF5C7A]">{error}</p>
        ) : visibles.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="font-sora text-xl font-bold mb-2">¡Sé el primero!</h3>
            <p className="text-white/60">Aún no hay publicaciones aquí. Empieza la conversación.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibles.map((p) => (
              <Publicacion key={p.id} post={p} misLikes={misLikes} onLike={like} onRespuesta={sumarRespuesta} />
            ))}
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {modal && <NuevaPublicacion onClose={() => setModal(false)} onCreated={(p) => setPosts((prev) => [p, ...prev])} />}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
