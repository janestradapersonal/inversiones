# DESIGN.md · inversionesfacil.es

Estilo «Noche y lima». Mezcla la base oscura de Revolut (lienzo negro, superficies planas sin sombras y botones en forma de píldora) con el único acento lima de Wise. Referencias: getdesign.md, `design-md/revolut` y `design-md/wise` en VoltAgent/awesome-design-md.
Lo debe seguir toda página o componente nuevo.

## Principios
- **Un solo color de marca: lima.** Va en los botones principales, las palabras resaltadas, los números de paso y la barra de lectura. Nunca se usa como texto sobre fondo claro.
- **Plano, sin brillos.** No se usan manchas de luz difuminadas, degradados morados ni sombras grandes. La profundidad sale de la diferencia de tono entre lienzo y tarjeta y de bordes muy finos.
- **Rojo = pérdida, oro = valor.** Son colores de significado, no de decoración. Solo aparecen en cifras y gráficos.
- **Tipografía con carácter.** Titulares en Anton en mayúsculas muy apretados, con una palabra en Instrument Serif cursiva de color lima. El texto va en Inter.
- **Bandas.** La portada abre con una banda lima a sangre y texto negro. El resto va sobre negro.

## Colores (tokens en `src/index.css`)
| Token | Hex | Uso |
|---|---|---|
| `--p-fondo` / `brand-onyx` | `#0A0B0A` | lienzo |
| `--p-sup` / `brand-surface` | `#151715` | tarjetas |
| `--p-fuerte` / `brand-indigo` | `#163300` | tarjeta destacada (verde bosque, texto blanco) |
| `--p-acento` / `brand-mint` | `#9FE870` | lima: botones, resaltados |
| `--p-claro` | `#CDFFAD` | lima pálido (hover) |
| `--p-borde` | `#262A26` | bordes finos |
| `--p-mutedfg` | `#A8B0A6` | texto secundario |
| pérdida | `#FF5C7A` | cifras negativas |
| valor | `#F5C542` | oro, cantidades |

## Tipografía
- Display: `font-display` (Anton), mayúsculas, `leading-[0.9]`, `tracking-tight`.
- Resaltado: `font-serif italic normal-case text-brand-mint`.
- Encabezados pequeños: Inter Tight 700, con tracking negativo.
- Texto: Inter 400, a 16–18 px, con interlineado 1.5. Las etiquetas superiores van en Inter 700, a 12 px, en mayúsculas y con `tracking-[0.25em]`.

## Componentes
- **Botón principal**: píldora lima, texto negro, 48 px de alto y `px-6`. Al pasar el ratón, `#CDFFAD`.
- **Botón secundario**: píldora con fondo `white/10` y texto blanco.
- **Tarjeta**: `rounded-3xl bg-brand-surface border border-white/[0.07]`, sin sombra y con relleno de 24–40 px.
- **Tarjeta destacada**: `bg-brand-indigo` (verde bosque), con el número en lima.
- **Barra de navegación**: siempre negra al 85 % con desenfoque y borde inferior muy fino. El enlace activo va en píldora lima.

## Bandas y texturas (las zonas oscuras no van lisas)
- **Cabecera de página**: `CabeceraPagina` (`src/components/layout/Banda.jsx`), con `fondo="bosque"` o `"lima"`. Es a sangre, con la esquina inferior redondeada, rejilla, grano y la palabra resaltada en hueco gigante de fondo. Hay que ir alternando los tonos entre páginas.
- **Sección importante**: banda `grano bg-brand-indigo` con `rejilla`, y encima las tarjetas en `bg-brand-onyx`.
- **Cinta de cifras**: `CintaCifras` muestra cifras reales de `mercados.json` desplazándose en horizontal. Nunca se inventan cifras.
- **Números grandes**: en hueco (`hueco text-brand-mint`), salvo el destacado, que va relleno.
- **Utilidades CSS**: `.grano`, `.rejilla`, `.rejilla-negra` (sobre lima), `.hueco` y `.cinta-anim`.

## No hacer
- No usar morado, índigo ni degradados de neón.
- No usar `blur-[80px+]` como decoración.
- No poner texto lima sobre lima ni sobre blanco.
- No usar más de un color de acento por sección.
