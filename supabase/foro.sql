-- Base de datos del foro en Supabase (gratis). Se pega entera en Supabase → SQL Editor → Run.
-- Cualquiera puede leer y escribir (sin cuentas), con límites de longitud; los "me gusta" solo van por funciones.
-- Para borrar spam: Supabase → Table Editor → forum_posts / forum_replies → borrar la fila.

create table if not exists forum_posts (
  id bigint generated always as identity primary key,
  title text not null check (char_length(btrim(title)) between 3 and 120),
  content text not null check (char_length(btrim(content)) between 1 and 3000),
  category text not null default 'otro' check (category in ('pregunta', 'experiencia', 'duda', 'consejo', 'otro')),
  author_name text not null default 'Anónimo' check (char_length(author_name) between 1 and 40),
  created_date timestamptz not null default now()
);

create table if not exists forum_replies (
  id bigint generated always as identity primary key,
  post_id bigint not null references forum_posts(id) on delete cascade,
  content text not null check (char_length(btrim(content)) between 1 and 2000),
  author_name text not null default 'Anónimo' check (char_length(author_name) between 1 and 40),
  created_date timestamptz not null default now()
);
create index if not exists forum_replies_post on forum_replies(post_id);

create table if not exists forum_likes (
  target text not null check (target ~ '^[pr]:[0-9]+$'),  -- 'p:<id>' publicación, 'r:<id>' respuesta
  client_id uuid not null,                                 -- identificador aleatorio del navegador
  primary key (target, client_id)
);

alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table forum_likes enable row level security;

drop policy if exists "leer" on forum_posts;
drop policy if exists "publicar" on forum_posts;
drop policy if exists "leer" on forum_replies;
drop policy if exists "responder" on forum_replies;
create policy "leer" on forum_posts for select to anon using (true);
create policy "publicar" on forum_posts for insert to anon with check (true);
create policy "leer" on forum_replies for select to anon using (true);
create policy "responder" on forum_replies for insert to anon with check (true);
-- forum_likes: sin políticas → nadie la toca directamente, solo las funciones de abajo

grant select, insert on forum_posts, forum_replies to anon;

-- Listados con contadores (se calculan con permisos del propietario, sin exponer forum_likes)
create or replace view forum_posts_v as
  select p.*,
         (select count(*) from forum_likes l where l.target = 'p:' || p.id) as likes,
         (select count(*) from forum_replies r where r.post_id = p.id) as replies
  from forum_posts p;

create or replace view forum_replies_v as
  select r.*, (select count(*) from forum_likes l where l.target = 'r:' || r.id) as likes
  from forum_replies r;

grant select on forum_posts_v, forum_replies_v to anon;

-- Me gusta / quitar me gusta
create or replace function alternar_like(p_target text, p_client uuid)
returns json language plpgsql security definer set search_path = public as $$
declare
  ya boolean;
begin
  delete from forum_likes where target = p_target and client_id = p_client;
  if found then
    ya := false;
  else
    insert into forum_likes (target, client_id) values (p_target, p_client);
    ya := true;
  end if;
  return json_build_object('liked', ya, 'likes', (select count(*) from forum_likes where target = p_target));
end $$;

create or replace function mis_likes(p_client uuid)
returns table (target text) language sql security definer set search_path = public as $$
  select target from forum_likes where client_id = p_client;
$$;

revoke all on function alternar_like(text, uuid), mis_likes(uuid) from public;
grant execute on function alternar_like(text, uuid), mis_likes(uuid) to anon;
