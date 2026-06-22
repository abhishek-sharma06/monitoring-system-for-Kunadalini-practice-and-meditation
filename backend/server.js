// Import core dependencies.
const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const mysql   = require('mysql2/promise');
const fs      = require('fs');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT    = process.env.PORT    || 3000;
const DB_NAME = process.env.DB_NAME || 'kundalini_db';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// ─── Step 1 — Ensure database exists (uses a bare connection, no DB selected) ─
const ensureDatabaseExists = async () => {
  // Connect WITHOUT specifying a database so we can CREATE it.
  const tempConn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  await tempConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`✓ Database "${DB_NAME}" is ready.`);
  await tempConn.end();
};

// ─── Step 2 — Run schema migrations using the named pool ─────────────────────
const runSchemaMigrations = async (pool) => {
  const schemaPath = path.join(__dirname, 'config', 'db_schema.sql');
  const sqlContent = fs.readFileSync(schemaPath, 'utf8');

  // Split on semicolons. Skip pure comment lines and blank entries.
  const queries = sqlContent
    .split(';')
    .map(q => q.trim())
    .filter(q => q.length > 0 && !q.match(/^--+\s*$/m));

  const conn = await pool.getConnection();
  let applied = 0;
  let skipped = 0;
  try {
    for (const query of queries) {
      try {
        await conn.query(query);
        applied++;
      } catch (qErr) {
        // INSERT IGNORE and duplicate key errors are expected on re-runs — skip.
        if (qErr.code === 'ER_DUP_ENTRY' || query.trimStart().toUpperCase().startsWith('INSERT IGNORE')) {
          skipped++;
        } else if (qErr.code === 'ER_DUP_COLUMNNAME') {
          // Column already exists — skip silently.
          skipped++;
        } else {
          // Real DDL / syntax error — rethrow to abort startup.
          throw qErr;
        }
      }
    }
    console.log(`✓ Schema applied — ${applied} statements executed, ${skipped} skipped.`);
  } finally {
    conn.release();
  }

  // Run additional migrations from sql/ folder
  const sqlDir = path.join(__dirname, 'sql');
  if (fs.existsSync(sqlDir)) {
    const migrationFiles = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql'));
    for (const file of migrationFiles) {
      const migPath = path.join(sqlDir, file);
      const migContent = fs.readFileSync(migPath, 'utf8');
      const migQueries = migContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.match(/^--+\s*$/m));

      const migConn = await pool.getConnection();
      try {
        for (const query of migQueries) {
          try {
            await migConn.query(query);
          } catch (qErr) {
            // Skip expected errors: duplicate column, duplicate entry, etc.
            if (qErr.code === 'ER_DUP_COLUMNNAME' || qErr.code === 'ER_DUP_ENTRY' ||
                qErr.message?.includes('Duplicate column')) {
              // already applied
            } else {
              console.warn(`Migration warning (${file}):`, qErr.message);
            }
          }
        }
      } finally {
        migConn.release();
      }
    }
    console.log(`✓ Migrations from sql/ folder applied.`);
  }
};

// ─── Step 3 — Register API routes ────────────────────────────────────────────
const bindRoutes = (pool) => {
  // Mount route modules (each has its own rate limiter where needed).
  app.use('/api/auth',      require('./routes/authRoutes'));
  app.use('/api/sessions',  require('./routes/sessionRoutes'));
  app.use('/api/programs',  require('./routes/programRoutes')); // Program/days/day-completion endpoints
  app.use('/api/analytics', require('./routes/analyticsRoutes'));
  app.use('/api/badges',    require('./routes/badgeRoutes'));
  app.use('/api/admin',     require('./routes/adminRoutes'));
  app.use('/api/level',     require('./routes/levelRoutes')); // Level system endpoints
  app.use('/api/chat',      require('./routes/chatRoutes'));

  // 404 handler.
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found.' });
  });

  // Global error handler.
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  });
};

// ─── Server startup sequence ──────────────────────────────────────────────────
const startServer = async () => {
  try {
    // 1. Create the DB if it doesn't exist.
    await ensureDatabaseExists();

    // 2. Now load the named pool (DB exists, so this is safe).
    const pool = require('./config/db');

    // 3. Verify the pool can connect.
    const testConn = await pool.getConnection();
    console.log('✓ Connected to MySQL pool.');
    testConn.release();

    // 4. Run CREATE TABLE IF NOT EXISTS + seed statements.
    await runSchemaMigrations(pool);

    // 5. Wire up all API routes.
    bindRoutes(pool);

    // 6. Start listening.
    app.listen(PORT, () => {
      console.log(`\n✓ Server → http://localhost:${PORT}  [${process.env.NODE_ENV || 'development'}]`);
      console.log(`  Admin login: admin@kundalini.com  /  Admin@123\n`);
    });
  } catch (err) {
    console.error('✗ Server startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
