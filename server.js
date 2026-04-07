const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// We'll use sql.js (pure JS SQLite)
let initSqlJs, SQL, db;

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables — Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '765631956556-a65mkv86fu4fqofim4mc5h78nf9mtkcb.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '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';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51TIjM374vai7HD1thxtimP3SYgiN9N43fNETlWSaDzQYDlDQf9uttUB83EhaIswRHT3v4XR8eeFJLVEbzWGyGRAJ00Ty4WG5gt';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51TIjM374vai7HD1tbfoAN3oJZSDjeM4veUFIEPKE8wrNFG0sbgttUeas0WVwsMQLqjOVygsnVUFfqTQzJ7RIlQUF00Zwfcmjh1';
const SESSION_SECRET = process.env.SESSION_SECRET || 'enarmagic_session_secret_2026';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Plan access configuration
const PLAN_ACCESS = {
  mip: {
    name: 'MIP (Gratuito)', price: 0, topics: 12,
    specialties: { cirugia: [1,2,3], pediatria: [1,2,3], gineco: [1,2,3], medicina: [1,2,3] }
  },
  r1: {
    name: 'R1', price: 1499, topics: 40,
    specialties: {
      cirugia: Array.from({length:10},(_,i)=>i+1),
      pediatria: Array.from({length:10},(_,i)=>i+1),
      gineco: Array.from({length:10},(_,i)=>i+1),
      medicina: Array.from({length:10},(_,i)=>i+1)
    }
  },
  r_plus: {
    name: 'R+', price: 2499, topics: 75,
    specialties: {
      cirugia: Array.from({length:19},(_,i)=>i+1),
      pediatria: Array.from({length:19},(_,i)=>i+1),
      gineco: Array.from({length:18},(_,i)=>i+1),
      medicina: Array.from({length:19},(_,i)=>i+1)
    }
  },
  adscrito: {
    name: 'Adscrito (Acceso Completo)', price: 3499, topics: 119,
    specialties: {
      cirugia: Array.from({length:36},(_,i)=>i+1),
      pediatria: Array.from({length:28},(_,i)=>i+1),
      gineco: Array.from({length:20},(_,i)=>i+1),
      medicina: Array.from({length:35},(_,i)=>i+1)
    }
  }
};

// ── Database helpers ──
const DB_PATH = path.join(__dirname, 'enarmagic.db');

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function dbRun(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function dbGet(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function dbAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function initializeDatabase() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    username TEXT,
    avatar TEXT,
    birthdate TEXT,
    age INTEGER,
    needs_profile INTEGER DEFAULT 0,
    plan TEXT DEFAULT 'mip',
    role TEXT DEFAULT 'user',
    password_hash TEXT,
    blocked INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add new columns if they don't exist yet (migration)
  try { db.run("ALTER TABLE users ADD COLUMN username TEXT"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN birthdate TEXT"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN age INTEGER"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN needs_profile INTEGER DEFAULT 0"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN blocked INTEGER DEFAULT 0"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN notes TEXT DEFAULT ''"); } catch(e) {}
  try { db.run("ALTER TABLE users ADD COLUMN last_login DATETIME"); } catch(e) {}

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stripe_session_id TEXT UNIQUE,
    plan TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    admin_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_user_id INTEGER,
    target_user_name TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Superuser Davo
  const existing = dbGet("SELECT id FROM users WHERE name = 'Davo' AND role = 'admin'");
  if (!existing) {
    const hash = bcrypt.hashSync('Mendoza_2709', 10);
    dbRun(
      "INSERT OR IGNORE INTO users (email, name, plan, role, password_hash) VALUES (?, ?, ?, ?, ?)",
      ['davo@enarmagic.com', 'Davo', 'adscrito', 'admin', hash]
    );
  }
  saveDb();
}

// ── Security: disable x-powered-by ──
app.disable('x-powered-by');

// ── Security headers with Helmet ──
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,   // use ONLY the directives below, no hidden defaults
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",   // inline scripts and onclick handlers
        "'unsafe-eval'",     // needed for sql.js wasm
        "https://cdn.tailwindcss.com",
        "https://js.stripe.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.tailwindcss.com"
      ],
      fontSrc:    ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      imgSrc:     ["'self'", "data:", "https:", "blob:"],
      mediaSrc:   ["'self'", "blob:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc:   ["'self'", "https://js.stripe.com"],
      objectSrc:  ["'none'"],
      workerSrc:  ["'self'", "blob:"]
      // upgradeInsecureRequests is intentionally omitted:
      // the app runs on HTTP (localhost/tunnel) — enabling it would
      // force the browser to upgrade all requests to HTTPS and break everything.
    }
  },
  crossOriginEmbedderPolicy: false  // needed for pdf.js and external assets
}));

// ── Additional security headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // HSTS — only in production (when running behind HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// ── Rate limiting ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' }
});

// Apply rate limiting to auth and API routes
app.use('/auth/login',       authLimiter);
app.use('/auth/register',    authLimiter);
app.use('/auth/admin-login', authLimiter);
app.use('/api/',             apiLimiter);

// ── Middleware ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,      // set to true in production behind HTTPS
    httpOnly: true,
    sameSite: 'lax',   // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  try {
    const user = dbGet('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user || false);
  } catch (err) {
    console.error('Error al deserializar usuario:', err);
    done(null, false);
  }
});

// Google OAuth Strategy
// callbackURL is intentionally left out here — each route constructs it
// dynamically from the incoming request so the app works both on localhost
// AND through any Cloudflare / ngrok tunnel without changing this file.
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/google/callback`,
  proxy: true   // trust X-Forwarded-Proto from Cloudflare
}, (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${googleId}@google.com`;
    const name = profile.displayName || email.split('@')[0];
    const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

    // Check if user exists by google_id
    let user = dbGet('SELECT * FROM users WHERE google_id = ?', [googleId]);

    if (!user) {
      // Check if email already exists (e.g., admin account)
      user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
      if (user) {
        // Link Google account to existing user
        dbRun('UPDATE users SET google_id = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [googleId, avatar, user.id]);
        user = dbGet('SELECT * FROM users WHERE id = ?', [user.id]);
      } else {
        // Create new user with MIP plan — needs profile completion
        dbRun("INSERT INTO users (google_id, email, name, avatar, plan, role, needs_profile) VALUES (?, ?, ?, ?, 'mip', 'user', 1)",
          [googleId, email, name, avatar]);
        user = dbGet('SELECT * FROM users WHERE google_id = ?', [googleId]);
      }
    } else {
      // Update avatar
      if (avatar) {
        dbRun('UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [avatar, user.id]);
        user.avatar = avatar;
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// ── Auth guard for static premium assets ──
// Returns 403 (not 401) so the browser doesn't pop up an auth dialog;
// the real gate is already the /curso server-side redirect.
function requireAuthStatic(req, res, next) {
  const isAuth = (req.isAuthenticated && req.isAuthenticated()) ||
                 (req.session && req.session.userId);
  if (isAuth) return next();
  return res.status(403).end();
}

// Protect quiz / anki data files — they contain all questions + answers
app.use('/quiz_data.js', requireAuthStatic);
app.use('/anki_data.js', requireAuthStatic);

// Protect all premium course content folders
app.use('/CIRUGIA',           requireAuthStatic);
app.use('/PEDIATRIA',         requireAuthStatic);
app.use('/GINECOOBSTETRICIA', requireAuthStatic);
// "MEDICINA INTERNA" has a space — Express matches the decoded path
app.use('/MEDICINA INTERNA',  requireAuthStatic);
app.use('/MEDICINA%20INTERNA',requireAuthStatic);

// Static files (public assets: index.html, login.html, styles.css, assets/, etc.)
app.use(express.static(__dirname, {
  index: false  // we handle / ourselves
}));

// Auth helpers
function requireAuth(req, res, next) {
  // Check passport auth OR session-based auth (for admin login)
  if (req.isAuthenticated && req.isAuthenticated()) {
    req.session.userId = req.user.id; // sync passport with session
    return next();
  }
  if (req.session && req.session.userId) return next();
  res.status(401).json({ error: 'Not authenticated' });
}
function requireAdmin(req, res, next) {
  const userId = (req.user && req.user.id) || (req.session && req.session.userId);
  if (userId) {
    const user = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    if (user && user.role === 'admin') return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

function sanitizeUser(u) {
  if (!u) return null;
  return {
    id: u.id, email: u.email, name: u.name, username: u.username,
    avatar: u.avatar, plan: u.plan, role: u.role,
    birthdate: u.birthdate, age: u.age,
    needsProfile: u.needs_profile === 1 || u.needs_profile === '1',
    blocked: u.blocked === 1 || u.blocked === '1',
    notes: u.notes || '',
    last_login: u.last_login || null,
    created_at: u.created_at, updated_at: u.updated_at
  };
}

// Helper: log admin action
function logAdminAction(adminId, adminName, action, targetUserId, targetUserName, details) {
  try {
    dbRun(
      'INSERT INTO admin_logs (admin_id, admin_name, action, target_user_id, target_user_name, details) VALUES (?,?,?,?,?,?)',
      [adminId, adminName, action, targetUserId || null, targetUserName || null, details || null]
    );
  } catch(e) { console.error('Log error:', e); }
}

// Helper: update last_login
function touchLastLogin(userId) {
  try { dbRun('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId]); } catch(e) {}
}

// ── Helper: no-cache headers for private pages ──
function setNoCache(res) {
  res.setHeader('Cache-Control', 'no-store, private, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

// ── Page routes ──
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/login', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/curso');
  // auth pages must not be cached publicly
  res.setHeader('Cache-Control', 'no-store, private, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.sendFile(path.join(__dirname, 'login.html'));
});

// /curso — protected: server-side auth check, redirect to login if not authenticated
app.get('/curso', (req, res) => {
  const isAuth = (req.isAuthenticated && req.isAuthenticated()) ||
                 (req.session && req.session.userId);
  if (!isAuth) return res.redirect('/login');
  setNoCache(res);
  res.sendFile(path.join(__dirname, 'curso.html'));
});

// /admin/login — separate admin login page (not linked from public UI)
app.get('/admin/login', (req, res) => {
  // If already admin, go to panel
  const userId = (req.user && req.user.id) || (req.session && req.session.userId);
  if (userId) {
    const user = dbGet('SELECT role FROM users WHERE id = ?', [userId]);
    if (user && user.role === 'admin') return res.redirect('/admin');
  }
  res.setHeader('Cache-Control', 'no-store, private, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Acceso Restringido</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background:#060e20; color:#dee5ff; font-family:sans-serif; }
    .input-field { width:100%; padding:.75rem 1rem; border-radius:10px; background:#141f38; border:1.5px solid #192540; color:#dee5ff; font-size:.95rem; outline:none; }
    .input-field:focus { border-color:#3bbffa; }
    .btn { width:100%; padding:.85rem; border-radius:12px; border:none; background:#3bbffa; color:#060e20; font-weight:700; cursor:pointer; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div style="width:100%;max-width:360px;background:#0f1930;border-radius:16px;padding:2rem;border:1px solid #192540">
    <h2 class="text-xl font-bold mb-6 text-center">Acceso restringido</h2>
    <div id="alert" style="display:none;padding:.75rem;border-radius:8px;margin-bottom:1rem;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);color:#fca5a5;font-size:.9rem"></div>
    <form id="adminForm" class="space-y-4">
      <input id="adminUsername" type="text" class="input-field" placeholder="Usuario" autocomplete="username" required>
      <input id="adminPassword" type="password" class="input-field" placeholder="Contraseña" autocomplete="current-password" required>
      <button type="submit" class="btn" id="adminBtn">Entrar</button>
    </form>
  </div>
  <script>
    document.getElementById('adminForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('adminBtn');
      const alert = document.getElementById('alert');
      btn.disabled = true; btn.textContent = '...';
      alert.style.display = 'none';
      try {
        const r = await fetch('/auth/admin-login', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ username: document.getElementById('adminUsername').value, password: document.getElementById('adminPassword').value })
        });
        const d = await r.json();
        if (d.success) { window.location.href = '/admin'; }
        else { alert.textContent = d.error || 'Error'; alert.style.display = 'block'; }
      } catch(err) { alert.textContent = 'Error de conexión'; alert.style.display = 'block'; }
      btn.disabled = false; btn.textContent = 'Entrar';
    });
  </script>
</body>
</html>`);
});

// /admin — protected: server-side admin check
app.get('/admin', (req, res) => {
  const userId = (req.user && req.user.id) || (req.session && req.session.userId);
  if (!userId) return res.redirect('/login');
  const user = dbGet('SELECT role FROM users WHERE id = ?', [userId]);
  if (!user || user.role !== 'admin') return res.status(403).redirect('/login');
  setNoCache(res);
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ── Auth routes ──

// Admin login (by username "Davo" or email)
app.post('/auth/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Credenciales requeridas' });

  // Find by name OR email
  let user = dbGet('SELECT * FROM users WHERE name = ? AND role = ?', [username, 'admin']);
  if (!user) user = dbGet('SELECT * FROM users WHERE email = ? AND role = ?', [username, 'admin']);
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Credenciales inválidas' });

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  req.session.userId = user.id;
  res.json({ success: true, user: sanitizeUser(user) });
});

// Helper: builds the full callback URL from the incoming request,
// supporting both plain localhost and any Cloudflare / ngrok tunnel.
function getCallbackURL(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host  = req.headers['x-forwarded-host']  || req.get('host');
  return `${proto}://${host}/auth/google/callback`;
}

// Google OAuth routes (REAL Passport flow)
app.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    callbackURL: getCallbackURL(req)
  })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/login?error=google_auth_failed',
    callbackURL: getCallbackURL(req)
  })(req, res, next);
}, (req, res) => {
  if (req.user) {
    if (req.user.blocked === 1 || req.user.blocked === '1') {
      req.logout(() => {});
      return res.redirect('/login?error=account_suspended');
    }
    req.session.userId = req.user.id;
    touchLastLogin(req.user.id);
  }
  res.redirect('/curso');
});

// ── Email / password login ──
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  const user = dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  if (user.blocked === 1 || user.blocked === '1') return res.status(403).json({ error: 'Tu cuenta ha sido suspendida. Contacta al soporte.' });
  req.session.userId = user.id;
  touchLastLogin(user.id);
  res.json({ success: true, user: sanitizeUser(user) });
});

// ── Register with email ──
app.post('/auth/register', (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });

  // Check duplicates
  const byEmail = dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (byEmail) return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
  const byUser = dbGet('SELECT id FROM users WHERE username = ?', [username.toLowerCase().trim()]);
  if (byUser) return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso' });

  const hash = bcrypt.hashSync(password, 10);
  dbRun(
    "INSERT INTO users (email, name, username, plan, role, password_hash, needs_profile) VALUES (?, ?, ?, 'mip', 'user', ?, 0)",
    [email.toLowerCase().trim(), fullName.trim(), username.toLowerCase().trim(), hash]
  );
  const user = dbGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  req.session.userId = user.id;
  res.json({ success: true, user: sanitizeUser(user) });
});

// ── Complete profile (post-Google) ──
app.post('/api/profile', requireAuth, (req, res) => {
  const { name, birthdate, age } = req.body;
  if (!name || !birthdate || !age)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  const userId = (req.user && req.user.id) || req.session.userId;
  dbRun(
    'UPDATE users SET name = ?, birthdate = ?, age = ?, needs_profile = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name.trim(), birthdate, parseInt(age), userId]
  );
  const updated = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  res.json({ success: true, user: sanitizeUser(updated) });
});

// ── Update profile (name, username, password) ──
app.post('/api/profile/update', requireAuth, (req, res) => {
  const { name, username, currentPassword, newPassword } = req.body;
  const userId = (req.user && req.user.id) || req.session.userId;
  const user = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  // Validate name
  if (!name || !name.trim()) return res.status(400).json({ error: 'El nombre es requerido' });

  // Validate username uniqueness if changed
  if (username && username.trim() !== (user.username || '')) {
    const existing = dbGet('SELECT id FROM users WHERE username = ? AND id != ?', [username.toLowerCase().trim(), userId]);
    if (existing) return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso' });
  }

  // Handle password change
  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: 'Debes ingresar tu contraseña actual para cambiarla' });
    if (!user.password_hash) return res.status(400).json({ error: 'Esta cuenta no tiene contraseña local (usa Google)' });
    if (!bcrypt.compareSync(currentPassword, user.password_hash))
      return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
    const newHash = bcrypt.hashSync(newPassword, 10);
    dbRun('UPDATE users SET name = ?, username = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), username ? username.toLowerCase().trim() : user.username, newHash, userId]);
  } else {
    dbRun('UPDATE users SET name = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name.trim(), username ? username.toLowerCase().trim() : user.username, userId]);
  }

  const updated = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  res.json({ success: true, user: sanitizeUser(updated) });
});

// ── API routes ──

// Current user
app.get('/api/user', requireAuth, (req, res) => {
  const userId = (req.user && req.user.id) || req.session.userId;
  const user = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return res.status(401).json({ error: 'User not found' });
  const planInfo = PLAN_ACCESS[user.plan] || PLAN_ACCESS.mip;
  res.json({ ...sanitizeUser(user), planInfo });
});

// Plan config
app.get('/api/plans', (req, res) => res.json(PLAN_ACCESS));

// Checkout
app.post('/api/checkout', requireAuth, async (req, res) => {
  const { plan } = req.body;
  if (!plan || !PLAN_ACCESS[plan]) return res.status(400).json({ error: 'Plan inválido' });
  if (plan === 'mip') {
    dbRun('UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['mip', req.session.userId]);
    return res.json({ success: true, plan: 'mip' });
  }
  if (STRIPE_SECRET_KEY === 'YOUR_STRIPE_SECRET_KEY') {
    return res.status(400).json({
      error: 'Stripe no configurado. Contacta al administrador para activar tu plan.',
      needsAdmin: true
    });
  }
  try {
    const stripeLib = require('stripe')(STRIPE_SECRET_KEY);
    const planInfo = PLAN_ACCESS[plan];
    const sess = await stripeLib.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: { name: `ENARMAGIC - ${planInfo.name}`, description: `Acceso a ${planInfo.topics} temas` },
          unit_amount: Math.round(planInfo.price * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${BASE_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${BASE_URL}/curso`,
      metadata: { user_id: String(req.session.userId), plan }
    });
    dbRun("INSERT INTO payments (user_id, stripe_session_id, plan, amount, status) VALUES (?,?,?,?,?)",
      [req.session.userId, sess.id, plan, planInfo.price, 'pending']);
    res.json({ sessionId: sess.id, publishableKey: STRIPE_PUBLISHABLE_KEY });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

app.get('/api/checkout/success', async (req, res) => {
  const { session_id, plan } = req.query;
  if (!session_id || !plan) return res.redirect('/curso?error=invalid');
  if (STRIPE_SECRET_KEY !== 'YOUR_STRIPE_SECRET_KEY') {
    try {
      const stripeLib = require('stripe')(STRIPE_SECRET_KEY);
      const sess = await stripeLib.checkout.sessions.retrieve(session_id);
      if (sess.payment_status === 'paid') {
        const payment = dbGet('SELECT * FROM payments WHERE stripe_session_id = ?', [session_id]);
        if (payment) {
          dbRun('UPDATE payments SET status = ? WHERE id = ?', ['completed', payment.id]);
          dbRun('UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [plan, payment.user_id]);
        }
      }
    } catch (e) { console.error(e); }
  }
  res.redirect(`/curso?success=true&plan=${plan}`);
});

// ── Admin API ──
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = dbAll('SELECT * FROM users ORDER BY created_at DESC');
  res.json(users.map(sanitizeUser));
});

// Comprehensive stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const users = dbAll('SELECT * FROM users');
  const payments = dbAll("SELECT * FROM payments WHERE status = 'completed'");

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const planCounts = { mip: 0, r1: 0, r_plus: 0, adscrito: 0 };
  let totalRevenue = 0;
  let newToday = 0, newWeek = 0, newMonth = 0;
  let activeUsers = 0, blockedUsers = 0;

  users.forEach(u => {
    const plan = u.plan || 'mip';
    planCounts[plan] = (planCounts[plan] || 0) + 1;
    if (u.created_at && u.created_at.slice(0,10) === today) newToday++;
    if (u.created_at && u.created_at.slice(0,10) >= weekAgo) newWeek++;
    if (u.created_at && u.created_at.slice(0,10) >= monthAgo) newMonth++;
    if (u.blocked === 1 || u.blocked === '1') blockedUsers++;
    else activeUsers++;
  });

  payments.forEach(p => { totalRevenue += Number(p.amount) || 0; });

  const revenueByPlan = { mip: 0, r1: 0, r_plus: 0, adscrito: 0 };
  Object.keys(planCounts).forEach(plan => {
    const price = (PLAN_ACCESS[plan] && PLAN_ACCESS[plan].price) || 0;
    revenueByPlan[plan] = planCounts[plan] * price;
  });

  // Monthly revenue from payments
  const monthRevenue = payments
    .filter(p => p.created_at && p.created_at.slice(0,10) >= monthAgo)
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  // Paying users (non-mip)
  const payingUsers = planCounts.r1 + planCounts.r_plus + planCounts.adscrito;
  const conversionRate = users.length > 0 ? Math.round((payingUsers / users.length) * 100) : 0;

  res.json({
    totalUsers: users.length,
    newToday, newWeek, newMonth,
    activeUsers, blockedUsers,
    planCounts,
    totalRevenue, monthRevenue,
    payingUsers, conversionRate,
    revenueByPlan,
    recentUsers: users
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 8)
      .map(sanitizeUser)
  });
});

// Payments list
app.get('/api/admin/payments', requireAdmin, (req, res) => {
  const rows = dbAll(`
    SELECT p.*, u.name as user_name, u.email as user_email
    FROM payments p
    LEFT JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 200
  `);
  res.json(rows);
});

// Toggle block/unblock user
app.post('/api/admin/users/:id/block', requireAdmin, (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.session.userId) return res.status(400).json({ error: 'No puedes bloquear tu propia cuenta' });
  const user = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const newBlocked = (user.blocked === 1 || user.blocked === '1') ? 0 : 1;
  dbRun('UPDATE users SET blocked = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newBlocked, Number(id)]);

  const adminId = req.session.userId;
  const admin = dbGet('SELECT name FROM users WHERE id = ?', [adminId]);
  logAdminAction(adminId, admin ? admin.name : 'Admin',
    newBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
    user.id, user.name, `Plan: ${user.plan}`);

  const updated = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  res.json(sanitizeUser(updated));
});

// Update user note
app.post('/api/admin/users/:id/note', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const user = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  dbRun('UPDATE users SET notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [note || '', Number(id)]);
  res.json({ success: true });
});

// Admin activity log
app.get('/api/admin/logs', requireAdmin, (req, res) => {
  const logs = dbAll('SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 200');
  res.json(logs);
});

app.post('/api/admin/users/:id/plan', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;
  if (!plan || !PLAN_ACCESS[plan]) return res.status(400).json({ error: 'Plan inválido' });
  const user = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const oldPlan = user.plan;
  dbRun('UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [plan, Number(id)]);

  const adminId = req.session.userId;
  const admin = dbGet('SELECT name FROM users WHERE id = ?', [adminId]);
  logAdminAction(adminId, admin ? admin.name : 'Admin',
    'CHANGE_PLAN', user.id, user.name, `${oldPlan} → ${plan}`);

  const updated = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  res.json(sanitizeUser(updated));
});

app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  if (Number(id) === req.session.userId) return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
  const user = dbGet('SELECT * FROM users WHERE id = ?', [Number(id)]);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const adminId = req.session.userId;
  const admin = dbGet('SELECT name FROM users WHERE id = ?', [adminId]);
  logAdminAction(adminId, admin ? admin.name : 'Admin',
    'DELETE_USER', user.id, user.name, `Email: ${user.email}, Plan: ${user.plan}`);

  dbRun('DELETE FROM payments WHERE user_id = ?', [Number(id)]);
  dbRun('DELETE FROM users WHERE id = ?', [Number(id)]);
  res.json({ success: true });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error en logout:', err);
    }
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Error destruyendo sesión:', destroyErr);
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// SECURE VIDEO STREAMING — Token-based protected video delivery
// ──────────────────────────────────────────────────────────────────────────────

/**
 * In-memory token store.
 * Each token is a 48-char hex string, valid for 4 hours, bound to a user+path.
 * Tokens are cleaned up on each new issuance.
 *
 * Structure: Map<token, { userId, path, expiresAt }>
 */
const videoTokens = new Map();
const VIDEO_TOKEN_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function pruneExpiredTokens() {
  const now = Date.now();
  for (const [tok, data] of videoTokens.entries()) {
    if (data.expiresAt < now) videoTokens.delete(tok);
  }
}

// Allowed base directories for streaming (prevents path traversal)
const ALLOWED_VIDEO_DIRS = [
  'CIRUGIA',
  'PEDIATRIA',
  'GINECOOBSTETRICIA',
  'MEDICINA INTERNA',
];

function isAllowedVideoPath(relPath) {
  // Reject any path with ".." segments
  if (relPath.includes('..')) return false;
  // Must start with one of the allowed directories
  const normalised = relPath.replace(/\\/g, '/');
  return ALLOWED_VIDEO_DIRS.some(dir => normalised.startsWith(dir + '/') || normalised.startsWith(dir + '%2F'));
}

/**
 * POST /api/video-token
 * Body: { path: "CIRUGIA/2 VIDEOCLASE/1 .../video.mp4" }
 * Returns: { token: "<hex>" }
 *
 * Requires: authenticated session
 */
app.post('/api/video-token', requireAuth, (req, res) => {
  const userId = (req.user && req.user.id) || (req.session && req.session.userId);
  const { path: videoPath } = req.body || {};

  if (!videoPath || typeof videoPath !== 'string') {
    return res.status(400).json({ error: 'path requerido' });
  }

  // Decode URI components in case frontend sent encoded path
  let relPath;
  try { relPath = decodeURIComponent(videoPath); } catch(e) { relPath = videoPath; }

  // Security: only allow paths inside approved directories
  if (!isAllowedVideoPath(relPath)) {
    return res.status(403).json({ error: 'Ruta no permitida' });
  }

  // Verify the file actually exists on disk
  const absPath = path.join(__dirname, relPath);
  if (!fs.existsSync(absPath)) {
    return res.status(404).json({ error: 'Video no encontrado' });
  }

  pruneExpiredTokens();

  // Generate cryptographically random token
  const token = require('crypto').randomBytes(24).toString('hex');
  videoTokens.set(token, {
    userId,
    path: absPath,
    expiresAt: Date.now() + VIDEO_TOKEN_TTL_MS,
  });

  res.json({ token });
});

/**
 * GET /api/video-stream?token=<hex>
 *
 * Streams the video with:
 *  - Range request support (needed for seeking)
 *  - Anti-download / anti-cache headers
 *  - Content-Disposition: inline (prevents browser download dialog)
 *  - No X-Content-Type-Options sniff block on video content
 */
app.get('/api/video-stream', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).end();

  pruneExpiredTokens();

  const data = videoTokens.get(token);
  if (!data) return res.status(401).json({ error: 'Token inválido o expirado' });
  if (data.expiresAt < Date.now()) {
    videoTokens.delete(token);
    return res.status(401).json({ error: 'Token expirado' });
  }

  // Optional: bind token to session user for extra security
  const userId = (req.user && req.user.id) || (req.session && req.session.userId);
  if (userId && data.userId && String(data.userId) !== String(userId)) {
    return res.status(403).end();
  }

  const absPath = data.path;
  if (!fs.existsSync(absPath)) return res.status(404).end();

  const stat     = fs.statSync(absPath);
  const fileSize = stat.size;
  const range    = req.headers.range;

  // Anti-download / anti-hotlink headers
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'no-store, private, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Accept-Ranges', 'bytes');

  if (range) {
    // Parse Range header: "bytes=start-end"
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end   = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`).end();
      return;
    }

    res.status(206);
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Content-Length', chunkSize);

    const stream = fs.createReadStream(absPath, { start, end });
    stream.pipe(res);
    stream.on('error', () => res.end());
  } else {
    res.setHeader('Content-Length', fileSize);
    const stream = fs.createReadStream(absPath);
    stream.pipe(res);
    stream.on('error', () => res.end());
  }
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ── Start ──
async function start() {
  try {
    initSqlJs = require('sql.js');
    SQL = await initSqlJs();

    // Load existing DB or create new
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    initializeDatabase();

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║     🏥 ENARMAGIC Server Running          ║
║     Puerto: ${PORT}                           ║
╚══════════════════════════════════════════╝

🌐 http://localhost:${PORT}
📦 Base de datos: ${DB_PATH}

👤 Superusuario:
   Usuario: Davo
   Contraseña: Mendoza_2709
   Plan: Adscrito (Acceso Completo)

🔑 Google OAuth: ${GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' ? '❌ NO CONFIGURADO (modo dev — login de prueba)' : '✅ CONFIGURADO'}
💳 Stripe: ${STRIPE_SECRET_KEY === 'YOUR_STRIPE_SECRET_KEY' ? '❌ NO CONFIGURADO (usa panel admin para planes)' : '✅ CONFIGURADO'}

Rutas:
  GET  /           → Landing page
  GET  /login      → Login
  GET  /curso      → Plataforma (requiere auth)
  GET  /admin      → Panel de administración
      `);
    });
  } catch (err) {
    console.error('Error al iniciar servidor:', err);
    process.exit(1);
  }
}

start();

// Manejadores globales para evitar que el servidor se detenga por errores inesperados
process.on('uncaughtException', (err) => {
  console.error('[ERROR NO CAPTURADO] El servidor continúa funcionando:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[PROMESA RECHAZADA SIN MANEJAR] El servidor continúa funcionando:', reason);
});

process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  if (db) { saveDb(); db.close(); }
  process.exit(0);
});