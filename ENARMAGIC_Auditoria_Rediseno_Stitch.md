# ENARMAGIC — Auditoría UX/UI + Estrategia de Rediseño + Prompts Google Stitch
### Lead Product Designer Report · Nivel Corporativo Médico Premium · ENARM 2026

---

# FASE 1 — AUDITORÍA CRÍTICA DE DISEÑO

## 1.1 Problemas de Jerarquía Visual

### Dashboard principal
- **Focal point nulo:** Las 4 stat cards superiores (119 temas, días de racha, temas explorados, promedio quizzes) tienen el mismo peso visual. No existe una métrica "héroe" que oriente al usuario de inmediato.
- **Cards de especialidad vacías:** Los 4 cards de acceso rápido (Cirugía, Pediatría, Gineco, Medicina Interna) aparecen completamente oscuros/negros sin imagen ni gradiente visible → pérdida total de identidad visual por especialidad.
- **Sección "Progreso por especialidad" fantasma:** El bloque existe pero está vacío, generando ruido visual sin valor. Un estado vacío no diseñado transmite error o fallo.
- **Tipografía sin jerarquía H1–H4:** "Dr. Estudiante" en el hero usa un rojo que compite con los números de las stats. No hay peso tipográfico dominante claro.
- **Sidebar sin diferenciación de estado activo suficiente:** El item activo apenas tiene un tono ligeramente más brillante; no hay indicador lateral (pill, barra) que comunique ubicación clara.

### Vistas de especialidad (Cirugía, Pediatría, etc.)
- **Grid de topics sin respiración:** Las cards de tema están muy próximas; el spacing entre ellas no respeta un ritmo de 8px consistente.
- **Botones "Contenido" y "Lección aprendida" con mismo peso:** Ambos son pills casi idénticos en tamaño/color, cuando deberían tener jerarquía primaria/secundaria clara (CTA principal vs. acción de estado).
- **Thumbnails con ratio inconsistente:** Algunas imágenes se ven recortadas o con distinto aspecto ratio entre cards.
- **Badge numérico del sidebar** (36, 28, 20, 35) sin contexto: ¿es número de temas? ¿de pendientes? No hay label ni tooltip.

### Módulos de contenido
- **Viewer PPTX:** Pantalla completa sin contexto de navegación; el usuario pierde orientación de dónde está en el flujo.
- **Videoclase:** Dos cards de video (Exprés / Completa) bien diferenciadas → este es el módulo mejor resuelto visualmente.
- **Kahoot:** Fondo oscuro sin jerarquía de pregunta/respuestas; las opciones no tienen suficiente contraste entre estado normal y hover.
- **Simulador:** Opciones A/B/C/D en bloque sólido oscuro sin diferenciación visual al seleccionar; falta estado "selected" visible.
- **Anki:** La tarjeta está centrada y funcional, pero el hint "Toca para ver la respuesta →" compite en tamaño con el texto de pregunta.

---

## 1.2 Deficiencias de UX

| Problema | Módulo | Impacto |
|---|---|---|
| No hay breadcrumb visible en vistas internas | Todos | Usuario no sabe cómo volver |
| El modal de selección (PPTX/PDF) es un paso extra innecesario | Resúmenes | Fricción en el flujo principal |
| "Lección aprendida" no tiene feedback visual inmediato de confetti/animación | Todos | No refuerza el logro cognitivo |
| El progreso por especialidad está vacío en dashboard | Dashboard | Desmotiva al usuario nuevo |
| No hay indicador de tiempo estimado por sesión | Kahoot/Simulador/Anki | Genera ansiedad de tiempo |
| La barra de progreso del Anki es apenas visible (4px, color sutil) | Anki | El estudiante no percibe avance |
| Falta estado "empty" diseñado para días de racha y temas explorados | Dashboard | Percepción de plataforma rota |
| El viewer de PPTX ocupa toda la pantalla sin overlay de controles intuitivo | Resúmenes | El botón "Volver" es pequeño y arriba a la izquierda |
| No hay micro-confirmación al cambiar de tab (Resúmenes→Videoclase→etc.) | Navegación | Transiciones sin feedback |

---

## 1.3 Problemas de UI

- **Inconsistencia de border-radius:** Pills de botones tienen ~6px, cards tienen ~12px, modal tiene ~16px → sin sistema unificado.
- **Paleta de colores por especialidad sin sistema:** Cada especialidad tiene un color de acento (rojo cirugía, amarillo pediatría, rosa gineco, verde medicina), pero los fondos de los cards de acceso rápido no expresan esos colores.
- **Iconografía mezclada:** Material Symbols + emojis + iconos SVG custom sin unificación → percepción amateur.
- **Background con grid de puntos apenas visible:** El patrón decorativo del fondo podría ser más intencional o eliminarse.
- **Falta de sombras con intención:** Los componentes flotantes (modal, cards) no tienen box-shadow con depth system definido (elevation 1, 2, 3).
- **Color de texto body casi idéntico al de labels de stat:** Dificulta la lectura en sesiones de estudio prolongado.

---

## 1.4 Errores en Diseño Orientado a Aprendizaje Médico

- **No existe un "daily learning path":** El dashboard no guía al usuario en qué estudiar hoy → el estudiante de ENARM necesita dirección diaria.
- **Ausencia de spaced repetition visible:** El sistema Anki existe pero no hay un indicador de "tarjetas por repasar hoy" en el dashboard.
- **Falta de "recall triggers":** Los resúmenes son pasivos (PPTX/PDF estáticos); no hay mecanismo de recall integrado (preguntas flash al terminar un resumen).
- **No hay tracking de tiempo de estudio:** Una métrica crítica para ENARM es saber cuántas horas llevas esta semana/mes.
- **Módulos desconectados entre sí:** No hay flujo sugerido Resumen → Kahoot → Simulador → Anki. El estudiante debe navegar manualmente entre tabs.
- **Falta de gamificación médica:** Badges por especialidad dominada, streaks con consecuencias, rankings o metas semanales.

---

# FASE 2 — ESTRATEGIA DE REDISEÑO

## 2.1 Design System Propuesto

### Tipografía
```
Display:  Inter Display / Plus Jakarta Sans — 600–800 weight
H1:       36px / 700 / line-height 1.2
H2:       28px / 700 / line-height 1.25
H3:       22px / 600 / line-height 1.3
H4:       18px / 600 / line-height 1.4
Body LG:  16px / 400–500 / line-height 1.6
Body SM:  14px / 400 / line-height 1.55
Caption:  12px / 500 / letter-spacing 0.04em / uppercase para labels
Mono:     JetBrains Mono — para contadores, stats numéricas
```

### Paleta de Colores
```
─── Base ────────────────────────────────
Background:     #070D1A   (deep navy black)
Surface-1:      #0D1526   (card base)
Surface-2:      #111E35   (card elevated)
Surface-3:      #162444   (hover / selected)
Border:         #1E2E4A   (subtle borders)
Border-strong:  #2A3F60   (visible borders)

─── Texto ───────────────────────────────
Text-primary:   #E8F0FF   (headings)
Text-secondary: #8BA3C7   (body text)
Text-muted:     #4A6080   (captions, disabled)

─── Brand ───────────────────────────────
Brand-primary:  #3B6FE8   (ENARMAGIC blue)
Brand-glow:     rgba(59,111,232,0.15)

─── Especialidades ──────────────────────
Cirugía:        #FF4D6D   / glow: rgba(255,77,109,0.12)
Pediatría:      #F5A623   / glow: rgba(245,166,35,0.12)
Gineco:         #D946EF   / glow: rgba(217,70,239,0.12)
Medicina:       #06D6A0   / glow: rgba(6,214,160,0.12)

─── Funcional ───────────────────────────
Success:        #10B981
Warning:        #F59E0B
Error:          #EF4444
Info:           #3B82F6

─── Puntos ENARMAGIC ────────────────────
Highlight-bg:   #1A1060
Highlight-border:#4F46E5
Highlight-text: #A5B4FC
```

### Grid System
```
Layout: 12 columnas
Gutter: 24px (desktop) / 16px (tablet) / 12px (mobile)
Margin: 32px (desktop) / 20px (tablet)
Breakpoints:
  xs: 0–639px
  sm: 640–767px
  md: 768–1023px
  lg: 1024–1279px
  xl: 1280–1535px
  2xl: 1536px+
```

### Espaciado (8px base)
```
4px   — micro (separación entre icon + label)
8px   — xs (padding interno chips)
12px  — sm (gap entre elementos relacionados)
16px  — md (padding de cards compactas)
24px  — lg (gap de grid)
32px  — xl (separación entre secciones)
48px  — 2xl (padding de secciones hero)
64px  — 3xl (separación entre bloques mayores)
```

### Elevation System (box-shadow)
```
E0: none (elementos base)
E1: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.24)
E2: 0 4px 12px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)
E3: 0 8px 24px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)
E4: 0 20px 48px rgba(0,0,0,0.5) — modals, drawers
```

### Border Radius
```
r-xs:  4px   — chips, badges
r-sm:  8px   — botones secundarios
r-md:  12px  — cards compactas
r-lg:  16px  — cards principales
r-xl:  20px  — modals, panels
r-2xl: 28px  — hero cards, featured
r-full: 9999px — pills, avatars
```

---

## 2.2 Arquitectura de Información Optimizada

### Flujo de navegación rediseñado
```
Dashboard (Home)
├── Resumen del día (daily path sugerido)
├── Progreso por especialidad (con % real)
├── Tarjetas Anki pendientes (spaced repetition)
├── Simuladores sin completar
└── Acceso rápido por especialidad

Especialidad (ej: Cirugía)
├── Overview de especialidad (% completado, stats)
├── Tema seleccionado
│   ├── [TAB 1] Resumen — PDF viewer + PPTX inline
│   ├── [TAB 2] Videoclase — Exprés + Completa
│   ├── [TAB 3] Kahoot — Quiz rápido (10 preguntas)
│   ├── [TAB 4] Simulador — Caso clínico (30 preguntas)
│   └── [TAB 5] Anki — Flashcards con spaced repetition
└── Flujo guiado: Resumen → Kahoot → Simulador → Anki → ✓

Mi Progreso
├── Horas de estudio (semanal/mensual)
├── Racha de días
├── Temas dominados por especialidad
├── Errores frecuentes (banco de preguntas fallidas)
└── Predictor de puntaje ENARM
```

---

# FASE 3 — PROMPTS PARA GOOGLE STITCH

> Todos los prompts están optimizados para Google Stitch. Copiar y pegar directamente.

---

## PROMPT 1 — DASHBOARD PRINCIPAL

```
Design a premium medical education SaaS dashboard for ENARMAGIC, a top-tier ENARM (Mexican medical board exam) preparation platform. Dark theme, corporate medical aesthetic inspired by AMBOSS and Linear.app.

LAYOUT:
- Fixed left sidebar (240px width) with ENARMAGIC logo at top, navigation items grouped by section (Principal / Especialidades / Mi Cuenta), and a "Contenido Total" progress card pinned at bottom
- Top bar: breadcrumb title left-aligned, global search button (⌘K shortcut), notification bell, user avatar with name right-aligned
- Main content area: 12-column grid, 32px margins, 24px gutters

HERO SECTION (top of main content):
- Full-width welcome card with gradient background using brand blue (#3B6FE8) mesh gradient
- Left side: "Bienvenido, Dr. [Nombre]" — H1 white bold, subtitle "Preparación ENARM 2026 · Tu camino comienza aquí" in muted blue
- Right side: animated 3D medical icon (stethoscope or brain)

STATS ROW (4 cards, equal width):
- Card 1: "119 Temas Totales" with subtitle "4 especialidades" — accent color blue, large monospace number
- Card 2: "Días de Racha" with fire emoji, counter, and micro progress ring — accent orange
- Card 3: "Temas Explorados" with percentage ring (0% to 100%) — accent green
- Card 4: "Promedio Quizzes" with sparkline mini-chart — accent purple
- Each card: dark surface background (#0D1526), 16px radius, 24px padding, E2 elevation, colored icon top-left

SPECIALTY PROGRESS SECTION:
- Section title "Progreso por Especialidad" H3 white, "Ver todas →" link right
- 4 horizontal progress bars with specialty color, specialty name, percentage, and topic count
- Cirugía: red (#FF4D6D) | Pediatría: amber (#F5A623) | Ginecobstetricia: purple (#D946EF) | Medicina Interna: teal (#06D6A0)

QUICK ACCESS CARDS (2x2 grid):
- Each card 280px min-height, 16px radius, specialty gradient overlay
- Background: specialty-themed medical illustration (full bleed, dark overlay 60%)
- Specialty icon top-right (colored), name bottom-left H3 white bold
- Topic count badge, completion percentage ring, "Continuar →" CTA button bottom
- Hover state: lift animation (translateY -4px), glow border with specialty color

DAILY LEARNING PATH (new section):
- Horizontal scroll row of 3 suggested topics
- Each chip: specialty color border, topic name, estimated time (15 min), module type icon (book/play/cards)
- "Ruta de Hoy" label with calendar icon

PENDING SIMULATORS SECTION:
- Compact list, 3 items max, each with topic name, specialty badge, questions count
- "Ver Historial" link button right-aligned

SIDEBAR DESIGN:
- Background: #070D1A with subtle left border #1E2E4A
- Active nav item: left indicator bar (3px, specialty or brand color), surface-2 background, white text
- Inactive: muted text #4A6080, no background
- Specialty items show topic count badge (pill, right-aligned, specialty color bg 15% opacity)
- Bottom card: gradient border, "CONTENIDO TOTAL: 119 temas · 4 especialidades", animated progress bar

STYLE: Dark navy, corporate medical premium, clean typography, intentional whitespace, no decorative noise. All text in Spanish.
```

---

## PROMPT 2 — VISTA DE ESPECIALIDAD (GRID DE TEMAS)

```
Design a specialty overview page for a medical education platform (ENARMAGIC). This is the topic selection screen for "Cirugía" (Surgery specialty).

HEADER SECTION:
- Full-width banner (180px height) with subtle red gradient (#FF4D6D at 8% opacity) and anatomical line-art illustration (right-aligned, low opacity)
- Left content: specialty badge "ESPECIALIDAD QUIRÚRGICA" (small caps, red text), H1 "Cirugía" white bold, subtitle "36 temas — Preparación completa ENARM"
- Right content: circular progress ring (large, 80px diameter) showing completion %, specialty color (#FF4D6D), percentage number inside
- "Tu progreso" stat block with hours studied this week and streak days

SECTION TABS (sticky below header):
- 5 tabs: Resúmenes | Videoclase | Kahoot | Simulador | Anki
- Active tab: bottom border 2px specialty color, white text bold, subtle background
- Inactive: muted text, no border
- Each tab has a relevant icon left: book / play / trophy / microscope / cards
- Tab bar has sticky behavior on scroll

TOPIC GRID (main content):
- 4 columns desktop, 2 tablet, 1 mobile
- Each topic card (topic-card):
  * Height: 280px
  * Background: surface-1 (#0D1526)
  * Top image area (160px): full-bleed medical illustration with dark gradient overlay bottom
  * Bottom info area (120px): "TEMA X" label (12px, muted, uppercase monospace), topic name H4 white bold, specialty badge pill
  * Two action buttons: primary "Ver Contenido" (filled, specialty color), secondary "Lección aprendida" (outlined, green when done)
  * Top-right: completion status icon (checkmark circle green if done, empty circle if not)
  * Border-radius: 16px
  * Hover: E3 elevation, specialty color glow border (1px), image slightly zooms (scale 1.03)
  * Transition: all 250ms ease

FILTER/SORT BAR above grid:
- Left: "Mostrando 36 temas"
- Right: filter pills "Todos | Completados | Pendientes | En Progreso" and sort dropdown

STYLE: Dark navy corporate medical premium, specialty red accent throughout, crisp grid layout. Spanish text.
```

---

## PROMPT 3 — MODAL DE SELECCIÓN DE CONTENIDO

```
Design a content selection bottom sheet / modal for a medical education platform. Appears when a user clicks on a topic card.

MODAL SPECS:
- Centered overlay with backdrop blur (12px) and dark scrim (rgba 0,0,0, 0.75)
- Modal card: 480px width, auto height, 20px border-radius, surface-2 background (#111E35), E4 elevation
- Close button: top-right X icon, 32px touch target

HEADER:
- Small label "TEMA 1" in specialty color (uppercase, 11px, monospace)
- H2 topic name "INTRODUCCION A CIRUGIA" white bold
- Subtitle "Elige cómo explorar este tema" muted text

CONTENT OPTIONS (2 cards, side by side):
Card A — Presentación:
  - Icon: presentation screen icon in specialty red
  - Title: "Presentación" bold
  - Badge: "PPTX" pill (red background 15%, red border, red text)
  - Subtitle: "Diapositivas interactivas"
  - Hover: specialty color border glow, slight lift

Card B — Resumen PDF:
  - Icon: document icon in red
  - Title: "Resumen PDF"
  - Badge: "PDF" pill (red)
  - Subtitle: "Documento descargable"

BOTTOM SECTION (if applicable):
- "¿Ya lo estudias?" prompt with "Marcar como aprendido" button (outlined green)

MICROINTERACTIONS:
- Modal entrance: scale from 0.95 + fade in (200ms)
- Card hover: border color transition 150ms
- On selection: card scales down 0.97, loading spinner appears

STYLE: Dark, premium, minimal. Spanish text throughout.
```

---

## PROMPT 4 — MÓDULO VIDEOCLASE

```
Design a video learning module for ENARMAGIC medical education platform. Topic: "Introducción a Cirugía". Specialty color: red (#FF4D6D).

LAYOUT:
- Full main content area, no sidebar overlap
- Breadcrumb top: "← Todas las clases / TEMA 1 · CIRUGÍA / INTRODUCCION A CIRUGIA"
- Section title H2 "INTRODUCCION A CIRUGIA" white

VIDEO CARDS (2-column layout):

LEFT CARD — "Clase Exprés":
- Header bar with lightning bolt icon ⚡ and "Clase Exprés" label
- Subtitle: "Versión resumida · 5:46 min"
- Video thumbnail (16:9 ratio): animated-style illustration thumbnail with play overlay
- Duration badge top-right: "5:46" pill
- Progress bar below video (if started): thin 3px bar specialty color
- Below: topic summary bullet "Lo que verás: definición, clasificación, manejo"

RIGHT CARD — "Clase Completa":
- Header bar with video camera icon and "Clase Completa" label
- Subtitle: "Versión extendida · 30:12 min"
- Medical-style thumbnail with ENARMAGIC branding
- Duration badge: "30:12"
- "RECOMENDADO" badge top-left (green pill)

BELOW BOTH CARDS:
- "Lección aprendida" CTA button centered, outlined green with checkmark icon
- Completion state: green filled button with "✓ Completado" text

METADATA STRIP:
- Icons row: 👁 "2.4k vistas" · ⏱ "Actualizado Feb 2026" · ⭐ "4.9 / 5"

STYLE: Corporate dark medical, clean 2-column layout, Spanish text, minimal decoration.
```

---

## PROMPT 5 — MÓDULO KAHOOT (QUIZ RÁPIDO)

```
Design a Kahoot-style quiz module for ENARMAGIC medical education platform. Dark premium medical aesthetic.

LAYOUT (single column, max 680px centered):

TOP BAR:
- "← Volver" text button left
- Center: topic name "INTRODUCCION A CIRUGIA" H3 white, specialty badge "🎯 KAHOOT" (amber pill)
- Right: score counter "0 PTS" in large monospace, "1/10" progress below

PROGRESS BAR:
- Full width, 6px height, specialty amber color (#F59E0B)
- Smooth animated fill as questions progress
- Timer indicator (countdown): circular mini-clock right side, turns red at 10 seconds

QUESTION CARD (main):
- Surface-2 background, 16px radius, 32px padding
- "PREGUNTA 1" label top (small caps, amber, 11px)
- Question text H3 white, left-aligned, 18px, max 3 lines
- Subtle bottom border specialty color

ANSWER OPTIONS (2x2 grid):
- Each option: surface-3 background, 12px radius, 20px padding
- Left icon: geometric shape in option color (▲ red | ● blue | ■ green | ◆ yellow) — Kahoot style
- Answer text: white, 15px, medium weight
- Hover: border 1px specialty color, slight background lighten
- Selected: border 2px specialty color, background specialty glow
- Correct answer reveal: green background + ✓ checkmark animation
- Wrong answer reveal: red background + ✗ + shake animation

POST-ANSWER STATE:
- Correct answer highlighted green with explanation tooltip below
- "Siguiente pregunta →" button appears (filled amber)

MICROINTERACTIONS:
- Question transition: slide in from right (300ms)
- Correct: confetti particle burst (5 particles, green/gold)
- Timer urgency: progress bar pulses red at last 5 seconds

RESULTS SCREEN (end):
- Score ring (SVG circle), percentage, "X/10 correctas"
- Performance message based on score
- Two buttons: "Reintentar" (outlined) | "Siguiente: Simulador →" (filled amber)

STYLE: Dark premium, amber accent for Kahoot module, gamified but professional medical aesthetic. Spanish text.
```

---

## PROMPT 6 — MÓDULO SIMULADOR (CASO CLÍNICO)

```
Design a clinical case simulator module for ENARMAGIC. ENARM-style question bank interface. Specialty: Cirugía. Color: red (#FF4D6D).

LAYOUT (max 760px centered, scrollable):

SESSION HEADER (sticky):
- "← Volver" | Topic: "INTRODUCCION A CIRUGIA" | Badge "🔬 SIMULADOR" (blue pill)
- Right: score "0 PTS" monospace large, progress "1/30"
- Progress bar: thin 4px, fills blue as questions answered
- Estimated time remaining: "~45 min restantes" with clock icon

QUESTION BLOCK:
- Surface-1 card, 16px radius, 28px padding
- Top meta: "PREGUNTA 1" small label + difficulty dot (● Fácil green / ● Medio amber / ● Difícil red)
- Clinical case text: body text 15px, line-height 1.7, white
  * Patient data highlighted: age, sex, chief complaint in subtle blue pill inline
  * Vital signs / lab values in monospace table if present
- Separator line before actual question
- Actual question in H4 white bold: "¿Qué tipo de herida quirúrgica...?"

ANSWER OPTIONS (vertical stack, A–D):
- Each option: full-width card, surface-2 bg, 12px radius, 16px padding
- Left: letter badge circle (A/B/C/D) in muted color
- Option text: 14px white medium weight
- Hover: border 1px brand blue, letter badge fills blue
- Selected (pre-submit): border 2px brand blue, background blue glow, letter fills blue
- Post-submit correct: entire card goes green, ✓ icon right, explanation unlocks below
- Post-submit wrong: card goes red, selected; correct card goes green simultaneously

EXPLANATION PANEL (revealed after answering):
- Collapsible accordion below options
- Header: "💡 Explicación ENARMAGIC" in blue
- Body: explanation text + "Puntos ENARMAGIC" highlighted box (purple bg, indigo border)
- Source citation: "ATLS 11ª ed. · Cirugía Schwartz" in muted caption

NAVIGATION FOOTER (sticky bottom):
- Left: "← Anterior" ghost button
- Center: question dots navigator (5 dots visible, scrollable)
- Right: "Siguiente →" filled blue button

FINAL RESULTS SCREEN:
- Score percentage ring (large, brand blue)
- Stats: Correctas / Incorrectas / Sin responder
- Time taken
- Topic performance breakdown by subtopic
- Buttons: "Revisar errores" | "Siguiente: Anki →" | "🏠 Dashboard"

STYLE: Clinical, serious, USMLE/ENARM aesthetic. Dark navy, blue accent for simulator. Dense but breathable layout. Spanish text.
```

---

## PROMPT 7 — MÓDULO ANKI (FLASHCARDS)

```
Design a spaced repetition flashcard module for ENARMAGIC medical education platform. Dark premium aesthetic with 3D card flip animation.

LAYOUT (max 640px centered):

SESSION HEADER:
- "← Volver" text button left
- Center: topic name H4 white, "🃏 ANKI" badge (violet pill #7C3AED)
- Right: counter "55 📋 pendientes | 0 ✓ dominadas"

PROGRESS BAR:
- Thin 4px bar, gradient green (#10B981 → #34D399)
- Shows ratio done/total
- Label: "0/55 dominadas" right-aligned, 12px muted

FLASHCARD (main component — 3D flip):
- Container: 600px width, 320px height, perspective 1200px
- Card front face:
  * Background: dark surface with subtle radial gradient from brand violet
  * Top label: "PREGUNTA" — 10px uppercase letter-spacing, violet pill
  * Question text: H3 white bold, centered, max 3 lines
  * Bottom hint: "Toca para ver la respuesta ↓" — 12px muted italic, animated pulse
  * Border: 1px rgba violet 0.25
- Card back face (revealed on click/tap):
  * Background: subtle teal-to-violet gradient (medical answer = teal #06D6A0)
  * Top label: "RESPUESTA" — teal pill
  * Answer text: 16px white medium, centered
  * Below answer: "Puntos ENARMAGIC" box if applicable (violet bordered, highlighted)
  * Two large action buttons:
    - "😓 Difícil — Repetir al final" (left): red outlined button, 48px height
    - "😊 Fácil — Siguiente" (right): teal filled button, 48px height

FLIP ANIMATION:
- On click: rotateY 180deg, 550ms cubic-bezier(0.16, 1, 0.3, 1)
- Back face initially: rotateY 180deg (backface-visibility hidden)
- Sound feedback: subtle click on flip (optional)

DIFFICULTY BUTTONS (visible only on back face):
- Difícil: border 1px #FF4D6D, background rgba(255,77,109,0.12), text red — on click: card shuffles to end of deck with swipe animation left
- Fácil: background #10B981, white text — on click: card exits with swipe right animation, progress bar fills +1

COMPLETION SCREEN:
- Emoji celebración (🏆 / 🎯 / 💪 based on score)
- "Sesión completada" H2
- Topic name subtitle (specialty color)
- Score ring: SVG circle showing % dominadas, animated stroke-dashoffset
- Stats row: 3 cards — Fácil count (green) | Difícil count (amber) | Total (purple)
- Performance message
- Action buttons:
  * "🔄 Estudiar de nuevo" (outlined specialty color)
  * "← Elegir otro tema" (ghost)
  * "🏠 Ir al Dashboard" (dark subtle button)
- "Lección aprendida" button below (outlined green)

HINT BAR (below card):
- "Haz clic en la tarjeta para voltearla • Difícil = repetir al final • Fácil = siguiente"
- 12px, centered, muted text

STYLE: Dark navy, violet accent for Anki, smooth 3D animations, gamified but medically professional. Spanish text throughout.
```

---

## PROMPT 8 — SIDEBAR DE NAVEGACIÓN

```
Design a premium fixed left sidebar navigation for ENARMAGIC medical education platform. Width: 240px. Dark corporate medical style.

HEADER:
- Logo: "ENARMAGIC" wordmark bold white 16px + "The Clinical Luminary" caption 11px muted
- Logo icon: abstract medical cross or DNA helix in brand blue, 32px

NAVIGATION GROUPS:

Group "PRINCIPAL":
- Label: 10px uppercase letter-spacing 0.12em muted #4A6080
- Item: Dashboard (grid icon) — active state: left border 3px brand blue, surface-2 bg, white text bold
- Item: Mi Progreso (chart icon) — inactive: muted text, no bg

Group "ESPECIALIDADES":
- Item: Cirugía (scalpel/cross icon) — accent #FF4D6D — badge right: "36" pill (red bg 15%, red text)
- Item: Pediatría (baby icon) — accent #F5A623 — badge: "28" amber
- Item: Ginecobstetricia (symbol icon) — accent #D946EF — badge: "20" purple
- Item: Medicina Interna (stethoscope icon) — accent #06D6A0 — badge: "35" teal

Active specialty item:
- Left indicator bar 3px specialty color
- Background: specialty color at 8% opacity
- Text: white bold
- Icon: specialty color

Hover state (inactive):
- Background: surface-2 (#111E35)
- Text transitions to white
- Transition: 150ms ease

Group "MI CUENTA":
- Configuración (settings icon) — muted
- Cerrar Sesión (logout icon) — red text on hover

BOTTOM PINNED CARD:
- Gradient border (brand blue to violet)
- "CONTENIDO TOTAL" small caps label muted
- "119 temas · 4 especialidades" white bold
- Progress bar: thin 4px, animated gradient fill (brand blue)
- "0% completado" caption right

COLLAPSED STATE (mobile / narrow):
- Width: 64px
- Only icons visible, tooltips on hover
- Logo becomes icon only

STYLE: #070D1A background, ultra-clean, minimal, premium SaaS sidebar. Spanish labels.
```

---

## PROMPT 9 — VIEWER DE PRESENTACIÓN (PPTX)

```
Design a full-screen presentation viewer for a medical education platform (ENARMAGIC). Clean, distraction-free reading experience.

LAYOUT:
- Full viewport, dark background #070D1A
- No sidebar visible (immersive mode)

TOP BAR (fixed, 56px height):
- Left: "← Volver" text button with chevron icon (ghost style, white)
- Center: breadcrumb "1 INTRODUCCION A CIRUGIA" — monospace, muted white, 13px
- Right: "Descargar" button (outlined, download icon) + "✕" close button

SLIDE DISPLAY AREA:
- Centered, max width 1100px, 16:9 ratio enforced
- Slide rendered at full quality
- Subtle border 1px rgba(255,255,255,0.06) around slide
- Drop shadow E3 elevation on slide card

NAVIGATION CONTROLS (bottom, fixed):
- Left arrow "‹" ghost icon button (40px circle, surface-2 bg)
- Center: "1 / 11" slide counter (14px, monospace, white)
- Right arrow "›" ghost icon button
- Keyboard shortcuts: ← → arrows, Space to advance

THUMBNAIL STRIP (optional, collapsible):
- Bottom panel: horizontal scroll of slide thumbnails
- Active slide: highlighted border specialty color
- Toggle button to show/hide

FULLSCREEN BUTTON:
- Bottom-right corner, expand icon

PROGRESS INDICATOR:
- Thin top bar (3px) showing progress through presentation
- Specialty red color fill

STYLE: Cinematic dark, minimal chrome, focus on content. Clean typography for controls. Spanish UI text.
```

---

## PROMPT 10 — PANTALLA DE RESULTADOS FINAL (UNIVERSAL)

```
Design a session completion / results screen for a medical education platform (ENARMAGIC). Used after completing Kahoot, Simulador, or Anki sessions.

LAYOUT (centered card, max 520px, surface-1 bg, 20px radius):

HEADER:
- Large emoji based on performance: 🏆 (≥90%) | 🎯 (≥75%) | 💪 (≥50%) | 🌱 (<50%)
- H2 "Sesión completada" white bold
- Topic name subtitle in specialty color

SCORE RING (SVG, animated):
- Outer circle: rgba white 0.06, 10px stroke width, 50px radius
- Progress arc: specialty color, animated stroke-dashoffset on mount (1.2s ease)
- Center text: percentage (H1 monospace large, white) + "dominadas" caption

PERFORMANCE MESSAGE:
- Contextual text based on score range
- Muted body text, centered

STATS ROW (3 horizontal cards):
- Card 1: count number (26px bold green) + "😊 Fácil" label (12px muted)
- Card 2: count (amber bold) + "😓 Difícil" label
- Card 3: total (purple bold) + "📋 Total" label
- Each: rounded 12px, colored background at 10% opacity

ACTION BUTTONS (vertical stack):
1. Primary: "🔄 Estudiar de nuevo" — outlined specialty color, specialty color border 1.5px
2. Secondary: "← Elegir otro tema" — ghost, muted border
3. Tertiary: "🏠 Ir al Dashboard" — very subtle, dark bg, muted text

LESSON LEARNED:
- Below buttons: "Lección aprendida" green outlined button with school icon
- If already marked: green filled "✓ Completado"

MICROINTERACTIONS:
- Card entrance: staggered fade-in from bottom (50ms delay each)
- Score ring draws on mount
- Numbers count up from 0 to final value (800ms)
- Confetti burst on ≥75% score

STYLE: Dark navy, celebratory but professional, clean. Spanish text.
```

---

## PROMPT 11 — SEARCH OVERLAY

```
Design a command palette / search overlay for ENARMAGIC medical education platform. Inspired by Linear, Raycast, and Spotlight.

OVERLAY:
- Backdrop: rgba(0,0,0,0.75) with backdrop-filter blur(16px)
- Center modal: 560px width, auto height, 16px radius, surface-2 background, E4 elevation
- Border: 1px rgba(59,111,232,0.3) (subtle brand blue)

SEARCH INPUT ROW:
- Left: search icon (magnifier, brand blue, 18px)
- Input: "Buscar temas, patologías, keywords..." placeholder, 17px, white, no border
- Right: "✕" clear button (appears when typing)

RESULTS LIST (appears as user types):
- Each result row: topic name bold left, specialty badge right, topic number muted
- Specialty icon left (colored 16px)
- Hover: surface-3 background, brand blue left border 2px
- Active (keyboard navigation): same as hover

RESULT CATEGORIES (if multiple types):
- Section headers: "Temas" / "Especialidades" — 11px uppercase muted, separator line

KEYBOARD SHORTCUTS FOOTER:
- "↑↓ navegar · Enter seleccionar · Esc cerrar" — 12px muted, horizontally spread

EMPTY STATE:
- Centered illustration (search with question mark, line-art style)
- "Escribe para buscar temas..." — H4 muted

RECENT SEARCHES (before typing):
- "Búsquedas recientes" label
- 3–4 recent items as chips, ✕ to remove each

STYLE: Ultra-minimal, fast, sharp. No decorative elements. Dark, functional. Spanish text.
```

---

## PROMPT 12 — ESTADO VACÍO / ONBOARDING (NUEVO USUARIO)

```
Design an empty state / onboarding welcome screen for a new user on ENARMAGIC. Shown when user has 0 progress.

DASHBOARD EMPTY STATE:
- Hero card with animated gradient (brand blue mesh, subtle motion)
- Large illustration: doctor studying with floating medical icons (minimal line-art style)
- H2: "Bienvenido a ENARMAGIC, Dr. [Nombre]" white bold
- Body: "Tu camino hacia el ENARM 2026 comienza aquí. Elige una especialidad para empezar."
- CTA button: "Comenzar con Cirugía" (large, filled brand blue, arrow icon)
- OR: "Explorar todas las especialidades" ghost button below

PROGRESS CARDS EMPTY STATE:
- Instead of blank cards: show ghost/skeleton with "Completa tu primer tema" tooltip
- Days of streak: "¡Empieza hoy!" with fire icon animated

SPECIALTY CARDS IN GRID:
- Show as fully designed even with 0 progress (not dark/black)
- "0% completado" shown clearly
- "Comenzar" CTA instead of "Continuar"

STYLE: Motivating, medical professional, dark with brand blue accents. Spanish text. Not generic — specific to medical students preparing for ENARM.
```

---

*Documento generado por: Lead Product Designer Report · ENARMAGIC Platform Redesign · Abril 2026*
