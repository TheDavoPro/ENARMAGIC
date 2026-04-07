# ENARMAGIC — Prompts para Google Stitch
## Rediseño UI Premium · ENARM 2026 · Todo el texto en español

---

## 🎨 Sistema de Diseño Base (referencia global)

> Cada prompt ya incluye la paleta completa. Este bloque es solo referencia rápida.

| Elemento | Color | Descripción |
|---|---|---|
| Fondo principal | `#060B18` | Azul noche profundo |
| Superficies/cards | `#0D1528` | Glassmorphism oscuro |
| Acento UI global | `#00E5FF` | Cian brillante |
| Cirugía | `#FF4D6D` | Coral rojo |
| Pediatría | `#FFD166` | Ámbar cálido |
| Ginecobstetricia | `#FF6FD8` | Magenta rosa |
| Medicina Interna | `#06D6A0` | Esmeralda |
| Racha/Logros | `#FFB800` | Dorado |
| Texto principal | `#FFFFFF` | Blanco |
| Texto secundario | `#94A3B8` | Gris azulado |

**Tipografía:** `Sora` o `Plus Jakarta Sans` — negrita para títulos, regular/medium para cuerpo.
**Todo el texto de la interfaz debe estar en español.**

---

## Pantalla 1 — Dashboard Principal

**Prompt para Google Stitch:**

```
Rediseña el dashboard principal de "ENARMAGIC", una plataforma premium de preparación para el examen ENARM 2026 dirigida a médicos mexicanos. Todo el texto de la interfaz debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18 (azul noche profundo)
- Cards/superficies: #0D1528 con glassmorphism (blur + borde rgba(255,255,255,0.06))
- Acento principal UI: #00E5FF (cian brillante)
- Cirugía: #FF4D6D (coral)
- Pediatría: #FFD166 (ámbar)
- Ginecobstetricia: #FF6FD8 (magenta)
- Medicina Interna: #06D6A0 (esmeralda)
- Racha/logros: #FFB800 (dorado)
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

LAYOUT:
Barra lateral izquierda (200px): logo "ENARMAGIC" arriba en cian (#00E5FF) con subtítulo "Plataforma Médica". Sección "PRINCIPAL" con ítem "Dashboard" activo (fondo cian suave, texto blanco). Sección "ESPECIALIDADES" con cuatro ítems: Cirugía (36, ícono bisturí, coral #FF4D6D), Pediatría (28, ícono bebé, ámbar #FFD166), Ginecobstetricia (20, ícono flor de cerezo, magenta #FF6FD8), Medicina Interna (35, ícono estetoscopio, esmeralda #06D6A0) — cada uno con badge de número. Card "CONTENIDO TOTAL" al fondo de la barra con borde degradado cian, texto "119 temas · 4 especialidades".

Barra superior: fondo #060B18, botón ícono mute a la izquierda, botón píldora "Buscar ⌘K" con borde cian al centro, botón avatar "Dr. Estudiante" a la derecha.

Contenido principal:
1. Card de saludo (ancho completo): degradado sutil #0D1528, texto grande "Buenas noches, Dr. Estudiante" en blanco negrita, subtítulo "Preparación ENAR 2026 · Continúa tu camino" en #94A3B8, hora y fecha alineados a la derecha.

2. Fila de 4 tarjetas de estadísticas glassmorphism:
   - "119 / Temas totales / 4 especialidades" — borde sutil blanco
   - "1 / Días de racha / ¡Primer día!" — acento dorado #FFB800, ícono llama
   - "119 / Temas explorados / 100% del total" — acento cian #00E5FF
   - "— / Promedio quizzes / sin actividad aún" — borde punteado cian (estado inactivo)

3. Dos columnas: izquierda "Progreso por especialidad" con 4 barras de progreso coloreadas (coral, ámbar, magenta, esmeralda) cada una con badge circular "100%". Derecha "Próximas sesiones" con estado vacío: emoji celebración y texto "¡Has revisado todos los temas!".

4. Card "Simuladores pendientes" con ícono trofeo y texto "¡Completaste todos los simuladores disponibles!".

5. Fila "ACCESO RÁPIDO A ESPECIALIDADES" con 4 cards degradados, uno por especialidad.

Estética: premium, oscura, alta densidad de información pero legible. Sin degradados en texto salvo el logo.
```

---

## Pantalla 2 — Cirugía: Resúmenes (grid de infografías)

**Prompt para Google Stitch:**

```
Rediseña la página de especialidad "Cirugía" de la plataforma médica "ENARMAGIC", mostrando la pestaña "Resúmenes" activa. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards/superficies: #0D1528 glassmorphism (borde rgba(255,255,255,0.08))
- Acento de especialidad (Cirugía): #FF4D6D (coral rojo)
- Acento UI global: #00E5FF (cian)
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Badge DOCX/PPTX: fondo #1A0A10, texto #FF4D6D
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO DE ESPECIALIDAD:
Banner con ícono bisturí en coral (#FF4D6D), título "Cirugía" en blanco bold grande, subtítulo "36 temas — Preparación completa ENAR" en #94A3B8. El borde izquierdo del banner tiene una línea vertical gruesa en coral. Fondo con degradado sutil coral (#FF4D6D al 6%) hacia la izquierda que se desvanece en #0D1528.

BARRA DE PESTAÑAS:
5 pestañas: "Resúmenes" activa (subrayado coral #FF4D6D, texto blanco), Videoclase, Kahoot, Simulador, Anki (inactivas en #94A3B8). Cada pestaña tiene un ícono pequeño.

CUADRÍCULA DE CONTENIDO:
Grid responsivo de 5 columnas con tarjetas glassmorphism. Cada tarjeta tiene:
- Zona de miniatura: imagen de infografía médica con overlay degradado oscuro en la parte inferior
- Badge superior derecho: "8 img" en píldora oscura
- Número de tema en cian pequeño (#00E5FF)
- Título del tema en blanco negrita (ej. "Introduccion A Cirugia", "Patologia Esofagica")
- Badges de recursos: "Infografías (8)" en cian, "PPTX" en cian-azul, "DOCX" en coral oscuro

Hover: borde luminoso coral (#FF4D6D), escala leve 1.02. Gaps de 16px entre tarjetas.
```

---

## Pantalla 3 — Cirugía: Videoclases (lista)

**Prompt para Google Stitch:**

```
Rediseña la página de videoclases de la especialidad "Cirugía" en "ENARMAGIC". Muestra la pestaña "Videoclase" activa. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards/filas: #0D1528 glassmorphism (borde rgba(255,255,255,0.06))
- Acento Cirugía: #FF4D6D (coral)
- Acento UI activo: #00E5FF (cian)
- Badge "Exprés": fondo #2A1F00, texto #FFB800 (dorado)
- Badge "Completa": fondo #001A20, texto #00E5FF (cian)
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Ícono de reproducción: #00E5FF
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO: Mismo banner de Cirugía con ícono bisturí y acento coral. Pestaña "Videoclase" activa con subrayado cian (#00E5FF) y texto blanco.

ENCABEZADO DE SECCIÓN:
Título "Selecciona una clase para reproducir" en blanco, subtítulo "36 clases disponibles" en #94A3B8.

LISTA DE CLASES:
Filas verticales de altura 64px, glassmorphism, rounded-xl. Cada fila contiene:
- Badge numerado izquierdo con fondo coral (#FF4D6D): número de clase en blanco
- Título de la clase en blanco medium (ej. "Introduccion A Cirugia", "Patologia Esofagica")
- Badges de duración: "Exprés · 5:46 min" en dorado (#FFB800) y/o "Completa · 30:12 min" en cian (#00E5FF)
- Ícono ▶ a la derecha en cian (#00E5FF)

Hover: borde izquierdo luminoso coral (4px), fondo con tinte coral sutil. Scroll suave. Sensación de plataforma de cursos premium tipo Platzi pero más oscuro y médico.
```

---

## Pantalla 4 — Cirugía: Reproductor de videoclase individual

**Prompt para Google Stitch:**

```
Rediseña la pantalla de reproducción individual de videoclase para "ENARMAGIC", mostrando el tema "Introduccion A Cirugia" de la especialidad Cirugía, con dos opciones de clase. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards reproductores: #0D1528 glassmorphism
- Acento Cirugía: #FF4D6D (coral)
- Acento UI: #00E5FF (cian)
- Clase Exprés (borde superior): #FFB800 (dorado)
- Clase Completa (borde superior): #00E5FF (cian)
- Barra de progreso de video: degradado coral-rojo
- Controles del reproductor: #FFFFFF y #00E5FF
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO: Banner Cirugía con acento coral. Pestaña "Videoclase" activa.

MIGAS DE PAN:
Fila "← Todas las clases" en cian (#00E5FF), luego ícono bisturí y "Tema 1 · Introduccion A Cirugia" en blanco.

DOS COLUMNAS DE REPRODUCTORES:

Tarjeta izquierda — "Clase Exprés":
- Header: ícono rayo ⚡ en dorado, título "Clase Exprés" blanco bold, subtítulo "Versión resumida · 5:46 min" en #94A3B8
- Borde superior de 3px en dorado (#FFB800)
- Reproductor: miniatura oscura con imagen de la clase, barra de controles inferior (botón ▶ cian, barra de progreso degradado coral, tiempo, volumen, pantalla completa)

Tarjeta derecha — "Clase Completa":
- Header: ícono monitor 📺, título "Clase Completa" blanco bold, subtítulo "Versión extendida · 30:12 min" en #94A3B8
- Borde superior de 3px en cian (#00E5FF)
- Mismo estilo de reproductor

Ambas tarjetas glassmorphism con esquinas redondeadas consistentes. Layout balanceado en dos columnas iguales.
```

---

## Pantalla 5 — Cirugía: Kahoot (selección de tema)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de selección de quiz "Kahoot" para la especialidad "Cirugía" de la plataforma "ENARMAGIC". Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18 con textura de grano sutil al 3% de opacidad
- Cards: #0D1528 glassmorphism (borde rgba(255,255,255,0.07))
- Acento Cirugía: #FF4D6D (coral)
- Pestaña Kahoot activa: #FF6B35 (naranja vibrante) o coral oscuro
- Badge número: fondo #3D0010, texto #FF4D6D
- Botón "Iniciar quiz": degradado coral #FF4D6D a rojo-naranja #FF6B35
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO: Banner Cirugía con acento coral. Pestaña "Kahoot" activa con acento naranja-coral.

ENCABEZADO DE SECCIÓN:
Emoji 🎯, título "Selecciona un tema para iniciar el quiz" en blanco bold, subtítulo "36 temas disponibles · 360 preguntas en total" en #94A3B8.

CUADRÍCULA DE TEMAS (6 columnas en escritorio):
Cada tarjeta glassmorphism contiene:
- Badge superior izquierdo con número de tema en coral (#FF4D6D)
- Título del tema en blanco medium (ej. "Introduccion A Cirugia", "Patologia Esofagica", "Patologia Gastrica", "Patologia Biliar", "Pancreatitis", "Apendicitis")
- "10 preguntas" en #94A3B8 pequeño
- Botón "▶ Iniciar quiz" degradado coral a naranja, texto blanco, ancho completo, rounded-lg

Hover: escala 1.02, borde luminoso coral, botón más brillante. Sensación de lobby de juego pero médico y premium.
```

---

## Pantalla 6 — Cirugía: Kahoot (pregunta activa)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de pregunta activa del quiz Kahoot para "ENARMAGIC", especialidad Cirugía. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Header sesión: #0D1528 glassmorphism
- Acento Cirugía: #FF4D6D (coral)
- Badge "Kahoot": fondo #3D0010, texto #FF4D6D
- Barra de progreso: #00E5FF (cian)
- Puntuación: #FFB800 (dorado)
- Opción A: degradado #FF4D6D a #C0392B (coral-rojo)
- Opción B: degradado #0EA5E9 a #00E5FF (azul-cian)
- Opción C: degradado #06D6A0 a #059669 (esmeralda)
- Opción D: degradado #FFB800 a #FF8C00 (dorado-naranja)
- Texto de opciones: #FFFFFF
- Texto pregunta: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

BARRA DE SESIÓN (glassmorphism):
"← Volver" en cian, título "Introduccion A Cirugia" en blanco, badge "Kahoot" en coral, puntuación "0 pts" en píldora dorada a la derecha. Debajo: barra de progreso cian delgada mostrando pregunta 1 de 10.

TARJETA DE PREGUNTA (glassmorphism, grande, centrada):
Etiqueta "PREGUNTA 1" en cian pequeño mayúsculas con letter-spacing. Texto de pregunta en blanco grande: "¿Cómo se define el abdomen agudo no traumático?"

OPCIONES (cuadrícula 2×2, tarjetas grandes redondeadas):
- A (coral-rojo): ícono triángulo ▲ + "Dolor abdominal crónico de más de 30 días"
- B (azul-cian): ícono círculo ● + "Dolor abdominal de instauración reciente (menos de 48 horas o hasta 6 días) con repercusión del estado general"
- C (esmeralda): ícono cuadrado ■ + "Cualquier dolor abdominal que requiera analgésicos"
- D (dorado-naranja): ícono rombo ◆ + "Dolor abdominal que solo se presenta en adultos mayores"

Hover: escala y brillo. Seleccionado: borde blanco luminoso. Atmósfera gamificada pero premium y médica.
```

---

## Pantalla 7 — Cirugía: Simulador ENARM (selección de casos)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de selección de casos clínicos del Simulador ENARM para la especialidad "Cirugía" en "ENARMAGIC". Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards: #0D1528 glassmorphism (borde rgba(255,255,255,0.07))
- Acento Cirugía: #FF4D6D (coral)
- Pestaña Simulador activa: #0EA5E9 (azul eléctrico)
- Badge número: fondo #001A2E, texto #0EA5E9
- Botón "Iniciar simulacro": degradado #0EA5E9 a #00E5FF (azul-cian)
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Hover borde: #00E5FF (cian)
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO: Banner Cirugía con acento coral. Pestaña "Simulador" activa con subrayado azul eléctrico (#0EA5E9).

ENCABEZADO DE SECCIÓN:
Emoji 📋, título "Simulador ENARM — Casos Clínicos" en blanco bold, subtítulo "36 temas · 720 casos clínicos en total" en #94A3B8.

CUADRÍCULA (6 columnas en escritorio):
Cada tarjeta glassmorphism contiene:
- Badge número superior izquierdo en azul eléctrico (#0EA5E9)
- Título del tema en blanco medium (ej. "Introduccion A Cirugia", "Patologia Esofagica", "Patologia Gastrica", "Apendicitis", "Hernias", "Patologia Hepatica")
- "20 casos clínicos" en #94A3B8 pequeño
- Botón "▶ Iniciar simulacro" degradado azul-cian, ancho completo, rounded-lg

Estética más seria que Kahoot: menos saturada, más clínica. Hover: borde luminoso cian (#00E5FF). Atmósfera de sala de simulación médica — inmersiva, enfocada, premium.
```

---

## Pantalla 8 — Cirugía: Simulador (caso clínico activo)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de caso clínico activo del Simulador ENARM para "ENARMAGIC", especialidad Cirugía. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Header sesión: #0D1528 glassmorphism
- Acento Cirugía: #FF4D6D (coral)
- Badge "Simulador": fondo #001A2E, texto #0EA5E9 (azul eléctrico)
- Barra progreso: #0EA5E9 (azul)
- Puntuación: #FFB800 (dorado)
- Tarjeta de pregunta: #0D1528 glassmorphism, rounded-2xl
- Etiqueta pregunta: #0EA5E9 (azul)
- Opciones (reposo): #131E3A glassmorphism, borde rgba(255,255,255,0.08)
- Badge letra opción: fondo #0EA5E9, texto #FFFFFF
- Opción seleccionada: borde izquierdo cian + tinte #0EA5E9 al 8%
- Opción correcta: borde esmeralda #06D6A0
- Opción incorrecta: borde coral #FF4D6D
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

BARRA DE SESIÓN: "← Volver" en cian, "Introduccion A Cirugia" en blanco, badge "Simulador" en azul, "0 pts" en dorado. Barra de progreso azul delgada, "1 / 20".

TARJETA DE CASO CLÍNICO (grande, glassmorphism):
Etiqueta "PREGUNTA 1" en azul (#0EA5E9) mayúsculas. Texto largo de caso clínico en blanco legible: "Masculino de 35 años acude a urgencias con dolor abdominal de 18 horas de evolución, difuso, que se localiza en fosa ilíaca derecha, con fiebre de 38.5°C y leucocitosis de 14,000. Se realiza laparoscopía diagnóstica que confirma apendicitis. ¿Qué tipo de herida quirúrgica se considera esta intervención?"

OPCIONES (4 filas apiladas, ancho completo):
- Badge "A" cuadrado azul + texto "Limpia"
- Badge "B" cuadrado azul + texto "Limpia-contaminada"
- Badge "C" cuadrado azul + texto "Contaminada"
- Badge "D" cuadrado azul + texto "Sucia"

Look clínico y uniforme — sin colores distintos por opción (a diferencia del Kahoot), simulando un examen real.
```

---

## Pantalla 9 — Cirugía: Anki (selección de mazo)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de selección de mazo de tarjetas Anki para la especialidad "Cirugía" en "ENARMAGIC". Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards: #0D1528 glassmorphism (borde rgba(255,255,255,0.07))
- Acento Cirugía: #FF4D6D (coral)
- Pestaña Anki activa: #7C3AED (violeta/índigo)
- Badge número: fondo #1E0A4A, texto #818CF8 (índigo claro)
- Botón "Estudiar": degradado #4F46E5 a #7C3AED (índigo-violeta)
- Efecto mazo de cartas: sombras offset detrás de cada tarjeta en #1A0D35
- Hover borde: #7C3AED (violeta)
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

ENCABEZADO: Banner Cirugía con acento coral. Pestaña "Anki" activa con subrayado violeta (#7C3AED).

ENCABEZADO DE SECCIÓN:
Emoji 🃏, título "Tarjetas de Memoria — Estilo Anki" en blanco bold, subtítulo "36 temas · 2283 tarjetas en total" en #94A3B8.

CUADRÍCULA (6 columnas en escritorio):
Cada tarjeta tiene efecto visual de mazo (dos líneas de tarjeta offset atrás a 45°, sugiriendo una pila). Contenido:
- Badge número índigo superior izquierdo
- Título del tema en blanco (ej. "Introduccion A Cirugia" 55 tarjetas, "Patologia Esofagica" 65, "Patologia Gastrica" 67, "Patologia Biliar" 60, "Pancreatitis" 60, "Apendicitis" 63)
- Conteo en #94A3B8 pequeño
- Botón "📖 Estudiar" degradado índigo-violeta, ancho completo

Hover: escala 1.02, borde violeta luminoso. Atmósfera: estudio enfocado, calmo pero premium. Evoca Anki + Duolingo pero oscuro y médico.
```

---

## Pantalla 10 — Cirugía: Anki (tarjeta en modo pregunta)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de estudio Anki mostrando una tarjeta de memoria en estado de PREGUNTA para "ENARMAGIC", especialidad Cirugía, Tema 1. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Header sesión: #0D1528 glassmorphism
- Acento Cirugía: #FF4D6D (coral)
- Badge "Anki": fondo #1E0A4A, texto #818CF8 (índigo)
- Barra de progreso: #7C3AED (violeta)
- Contador tarjetas pendientes: fondo #1A1A2E, texto #FFFFFF
- Contador tarjetas dominadas: fondo #0A2E1E, texto #06D6A0 (esmeralda)
- Tarjeta principal: #131E3A glassmorphism, borde degradado violeta #7C3AED a índigo #4F46E5 (shimmer animado)
- Etiqueta "PREGUNTA": #818CF8 (índigo claro)
- Texto pregunta: #FFFFFF
- Texto hint inferior: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

BARRA DE SESIÓN: "← Volver" en cian (#00E5FF), "Introduccion A Cirugia" en blanco, badge "Anki" en índigo. Contadores: "55 🃏" en píldora oscura, "0 ✓" en píldora esmeralda. Debajo: "0/55 dominadas" en #94A3B8 y barra de progreso violeta al 0%.

TARJETA PRINCIPAL (hero de la pantalla, glassmorphism premium):
- Borde con degradado animado violeta-índigo (shimmer)
- Fondo interno: #131E3A
- Etiqueta "PREGUNTA" en índigo claro (#818CF8), mayúsculas, letter-spacing amplio
- Texto grande centrado en blanco negrita: "¿Cuál es el tiempo máximo de evolución que suele definir a un abdomen agudo no traumático?"
- Hint inferior: "Toca para ver la respuesta ↓" en #94A3B8 itálica pequeña

PIE DE PÁGINA: "Haz clic en la tarjeta para voltearla · Difícil = repetir al final · Fácil = siguiente" en #94A3B8 muy pequeño centrado.

Estado de pantalla: sin botones de acción visibles todavía (aparecen solo tras voltear la tarjeta). Enfocado, minimalista, premium.
```

---

## Pantalla 11 — Cirugía: Anki (tarjeta volteada — respuesta revelada)

**Prompt para Google Stitch:**

```
Rediseña la pantalla de estudio Anki mostrando una tarjeta de memoria en estado de RESPUESTA REVELADA para "ENARMAGIC", especialidad Cirugía. Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Header sesión: #0D1528 glassmorphism
- Badge "Anki": fondo #1E0A4A, texto #818CF8
- Barra de progreso: #7C3AED (violeta)
- Contador tarjetas: fondo #1A1A2E, texto #FFFFFF
- Contador dominadas: fondo #0A2E1E, texto #06D6A0 (esmeralda)
- Tarjeta principal (estado respuesta): borde degradado violeta #7C3AED a esmeralda #06D6A0, fondo interno tinte verde sutil rgba(6,214,160,0.05)
- Etiqueta "RESPUESTA": #06D6A0 (esmeralda)
- Texto respuesta: #FFFFFF
- Línea divisora: rgba(255,255,255,0.12)
- Botón "Difícil": degradado #FF4D6D a #C0392B (coral-rojo), texto blanco
- Botón "Fácil": degradado #06D6A0 a #059669 (esmeralda-verde), texto blanco
- Texto secundario: #94A3B8
- Tipografía: Sora o Plus Jakarta Sans

BARRA DE SESIÓN: igual que Pantalla 10 — "← Volver", "Introduccion A Cirugia", badge "Anki", contadores "55 🃏" y "0 ✓". Barra de progreso violeta.

TARJETA PRINCIPAL (estado volteado):
- Borde degradado transicionado de violeta a esmeralda (indica respuesta revelada)
- Fondo interno con tinte verde muy sutil
- Etiqueta "RESPUESTA" en esmeralda (#06D6A0) mayúsculas con letter-spacing
- Línea divisora sutil
- Texto de respuesta grande centrado en blanco negrita: "Generalmente menos de 48 horas, pudiendo extenderse hasta 6 días."

DOS BOTONES DE ACCIÓN (debajo de la tarjeta, lado a lado, rounded-xl grandes):
- "😤 Difícil" con subtexto "Repetir al final" — degradado coral a rojo
- "😊 Fácil" con subtexto "Siguiente tarjeta" — degradado esmeralda a verde

PIE DE PÁGINA: mismo texto sutil en #94A3B8.

Transmite logro y claridad. La transición visual de violeta (pregunta) → esmeralda (respuesta) refuerza el flujo de aprendizaje espaciado.
```

---

## Pantalla 12 — Ginecobstetricia: Resúmenes (grid de temas)

**Prompt para Google Stitch:**

```
Rediseña la página de especialidad "Ginecobstetricia" para la plataforma médica premium "ENARMAGIC", mostrando la pestaña activa "Resúmenes". Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards/superficies: #0D1528 glassmorphism (borde rgba(255,255,255,0.08))
- Acento especialidad Ginecobstetricia: #FF6FD8 (magenta rosa)
- Borde izquierdo banner: #FF6FD8
- Degradado banner: #FF6FD8 al 8% hacia la izquierda
- Badge DOCX: fondo #4A1040, texto #FF6FD8
- Hover borde: #FF6FD8
- Zona thumbnail (placeholder): fondo #131E3A, ícono flor cerezo en #FF6FD8 al 30%
- Pestaña activa "Resúmenes": subrayado blanco, texto blanco
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Número de tema: #00E5FF (cian)
- Tipografía: Sora o Plus Jakarta Sans

BARRA LATERAL: misma barra de diseño global. "Ginecobstetricia" activo con ícono 🌸 y acento magenta, badge "20".

ENCABEZADO DE ESPECIALIDAD:
Ícono flor de cerezo 🌸 en magenta (#FF6FD8), línea vertical izquierda gruesa magenta, título "Ginecobstetricia" en blanco bold grande, subtítulo "20 temas — Preparación completa ENAR" en #94A3B8. Degradado sutil magenta en fondo.

BARRA DE PESTAÑAS: "Resúmenes" activa (subrayado blanco), Videoclase, Kahoot, Simulador, Anki inactivas en #94A3B8.

CUADRÍCULA (5 columnas):
Cada tarjeta glassmorphism contiene:
- Zona thumbnail: fondo #131E3A con ícono 🌸 grande centrado en magenta semitransparente (placeholder elegante, sin imagen real)
- Número en cian pequeño (#00E5FF)
- Título en blanco negrita (ej. "Introduccion A Ginecologia", "Amenorreas Primarias Y Secundarias", "Sangrados Uterinos Anormales", "Sangrado Uterino De Origen Anatomico", "Patologia De Menopausia Y Climaterio", "Oncologia Ginecologica", "Lesiones Precursoras Y Cacu", "Patologia Mamaria Benigna", "Cancer De Mama", "Patologia Infecciosa Cervical")
- Solo un badge: "📄 DOCX" en magenta oscuro

Hover: borde luminoso magenta, escala 1.02. Esta especialidad no tiene infografías ni PPTX, solo DOCX.
```

---

## Pantalla 13 — Medicina Interna: Resúmenes (grid de temas)

**Prompt para Google Stitch:**

```
Rediseña la página de especialidad "Medicina Interna" para la plataforma médica premium "ENARMAGIC", mostrando la pestaña activa "Resúmenes". Todo el texto debe estar en español.

PALETA DE COLORES A USAR:
- Fondo: #060B18
- Cards/superficies: #0D1528 glassmorphism (borde rgba(255,255,255,0.08))
- Acento especialidad Medicina Interna: #06D6A0 (esmeralda)
- Borde izquierdo banner: #06D6A0
- Degradado banner: #06D6A0 al 8% hacia la izquierda
- Badge DOCX: fondo #0A3028, texto #06D6A0
- Hover borde: #06D6A0
- Zona thumbnail (placeholder): fondo #131E3A, ícono estetoscopio en #06D6A0 al 30%
- Pestaña activa "Resúmenes": subrayado blanco, texto blanco
- Texto primario: #FFFFFF
- Texto secundario: #94A3B8
- Número de tema: #00E5FF (cian)
- Tipografía: Sora o Plus Jakarta Sans

BARRA LATERAL: misma barra de diseño global. "Medicina Interna" activo con ícono de estetoscopio y acento esmeralda, badge "35".

ENCABEZADO DE ESPECIALIDAD:
Ícono estetoscopio en esmeralda (#06D6A0), línea vertical izquierda gruesa esmeralda, título "Medicina Interna" en blanco bold grande, subtítulo "35 temas — Preparación completa ENAR" en #94A3B8. Degradado sutil esmeralda en fondo.

BARRA DE PESTAÑAS: "Resúmenes" activa (subrayado blanco), Videoclase, Kahoot, Simulador, Anki inactivas en #94A3B8.

CUADRÍCULA (5 columnas):
Cada tarjeta glassmorphism contiene:
- Zona thumbnail: fondo #131E3A con ícono de estetoscopio grande centrado en esmeralda semitransparente (placeholder elegante, sin imagen real)
- Número en cian pequeño (#00E5FF)
- Título en blanco negrita (ej. "Introduccion A MI", "Tuberculosis", "Vih", "Enfermedades Transmitidas Por Vector", "Zoonosis Y Micosis", "Tetanos, Botulismo Y Rabia", "Epoc Y Cancer De Pulmon", "Neumonias Intersticiales Y Derrame Pleural", "Patologia Tiroidea", "Sindrome Metabolico", "Diabetes Mellitus", "Complicaciones De Diabetes", "Patologia Central Y Suprarrenal", "Perlas De Endocrinologia", "Introduccion A Hematologia")
- Solo un badge: "📄 DOCX" en esmeralda oscuro

Hover: borde luminoso esmeralda, escala 1.02. Esta especialidad no tiene infografías ni PPTX, solo DOCX. Estética sólida, clínica y confiable — la especialidad más amplia del curso. El esmeralda transmite rigor científico y dominio médico.
```

---

## 📌 Instrucción de coherencia global

Incluye siempre este bloque al inicio de cada sesión en Google Stitch para mantener la identidad visual:

> *"Estos diseños pertenecen al sistema de diseño de ENARMAGIC, una plataforma médica premium para la preparación del examen ENARM 2026. Mantén consistencia en: fondo #060B18, cards glassmorphism (#0D1528 con borde rgba(255,255,255,0.07)), tipografía Sora o Plus Jakarta Sans, barra superior con botón 'Buscar ⌘K' y avatar, barra lateral con codificación de colores por especialidad (Cirugía coral #FF4D6D, Pediatría ámbar #FFD166, Ginecobstetricia magenta #FF6FD8, Medicina Interna esmeralda #06D6A0). Cada especialidad hereda su color como acento primario en todos sus elementos interactivos. Todo el texto de la interfaz debe estar en español."*
