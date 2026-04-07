# 🚀 Guía de Deploy — ENARMAGIC en Railway

## Antes de empezar: un cambio crítico en server.js

Railway asigna el puerto dinámicamente. Busca esta línea en `server.js`:

```js
const PORT = 3000;
```

Y cámbiala por:

```js
const PORT = process.env.PORT || 3000;
```

Sin este cambio, la app no arrancará en Railway.

---

## Paso 1 — Subir el proyecto a GitHub

1. Ve a [github.com](https://github.com) y crea un repositorio nuevo (privado recomendado)
2. En tu carpeta del proyecto, abre una terminal y ejecuta:

```bash
git init
git add .
git commit -m "Primer commit ENARMAGIC"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/enarmagic.git
git push -u origin main
```

> ⚠️ Verifica que el archivo `.gitignore` esté presente ANTES de hacer `git add .`
> para que el archivo `.env` y `enarmagic.db` NO se suban.

---

## Paso 2 — Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión con GitHub
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige el repositorio de ENARMAGIC
5. Railway detectará automáticamente que es Node.js y comenzará el build

---

## Paso 3 — Configurar variables de entorno en Railway

En el panel de Railway, ve a tu proyecto → pestaña **"Variables"** y agrega:

| Variable | Valor |
|---|---|
| `PORT` | Railway lo pone automáticamente, no lo agregues |
| `BASE_URL` | `https://TU-APP.up.railway.app` (lo sabes después del deploy) |
| `GOOGLE_CLIENT_ID` | Tu Client ID de Google |
| `GOOGLE_CLIENT_SECRET` | Tu Client Secret de Google |
| `STRIPE_SECRET_KEY` | `sk_live_...` (producción) o `sk_test_...` (pruebas) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (producción) o `pk_test_...` (pruebas) |
| `SESSION_SECRET` | Un string largo y aleatorio (mínimo 32 caracteres) |

---

## Paso 4 — Volumen persistente para la base de datos SQLite

Railway reinicia los contenedores y perdería tu base de datos sin un volumen.

1. En tu proyecto de Railway, ve a **"Add a service"** → **"Volume"**
2. Monta el volumen en la ruta: `/app`
3. Esto asegura que `enarmagic.db` persista entre reinicios

---

## Paso 5 — Actualizar Google OAuth

En [Google Cloud Console](https://console.cloud.google.com):

1. Ve a **APIs & Services → Credentials**
2. Edita tu OAuth 2.0 Client ID
3. En **"Authorized redirect URIs"** agrega:
   ```
   https://TU-APP.up.railway.app/auth/google/callback
   ```

---

## Paso 6 — Dominio personalizado (opcional)

Si tienes un dominio como `enarmagic.com`:

1. En Railway → Settings → Domains → **"Add Custom Domain"**
2. Agrega el registro CNAME en tu proveedor de DNS apuntando a Railway
3. Railway genera el certificado SSL automáticamente

---

## ✅ Checklist final antes de lanzar

- [ ] `const PORT = process.env.PORT || 3000;` en server.js
- [ ] `.gitignore` incluye `.env` y `enarmagic.db`
- [ ] Todas las variables de entorno configuradas en Railway
- [ ] Volumen persistente montado en `/app`
- [ ] Google OAuth redirect URI actualizado
- [ ] Usando claves `sk_live_` de Stripe (no las de prueba)
- [ ] `BASE_URL` actualizado con la URL real de Railway

---

## 🆘 Si algo falla

Revisa los logs en Railway → tu proyecto → pestaña **"Logs"**.
Los errores más comunes son:
- Puerto no configurado (falta `process.env.PORT`)
- Variable de entorno faltante
- Error de Google OAuth redirect URI
