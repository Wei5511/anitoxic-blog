import path from 'path';

// Factory to get the DB client
let localDb = null;
let tursoClient = null;

// Determine mode
const isTurso = !!process.env.TURSO_DATABASE_URL;

async function getClient() {
  if (isTurso) {
    if (!tursoClient) {
      const { createClient } = await import('@libsql/client');
      tursoClient = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    }
    return { type: 'turso', db: tursoClient };
  } else {
    if (!localDb) {
      const Database = (await import('better-sqlite3')).default;
      localDb = new Database(path.join(process.cwd(), 'anime.db'));
      localDb.pragma('journal_mode = WAL');
      // Init local if needed (tables should exist in backup)
    }
    return { type: 'local', db: localDb };
  }
}

// ---------------------------------------------------------
// Unified Async API
// ---------------------------------------------------------

// Helper to normalize results
function normalize(res, type) {
  if (type === 'turso') return res.rows; // Turso returns { columns, rows, ... }
  return res; // better-sqlite3 returns array
}

function normalizeOne(res, type) {
  if (type === 'turso') return res.rows[0];
  return res;
}

// --- Anime Operations ---

export async function upsertAnime(animeData) {
  const { type, db } = await getClient();
  const sql = `
    INSERT INTO anime (
      mal_id, title, title_japanese, synopsis, image_url, trailer_url,
      score, status, season, year, episodes, aired_from, genres, studios, source, rating
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(mal_id) DO UPDATE SET
      title = ?, title_japanese = ?, synopsis = ?, image_url = ?, trailer_url = ?,
      score = ?, status = ?, season = ?, year = ?, episodes = ?, aired_from = ?,
      genres = ?, studios = ?, source = ?, rating = ?, updated_at = CURRENT_TIMESTAMP
  `;
  const params = [
    animeData.mal_id, animeData.title, animeData.title_japanese, animeData.synopsis, animeData.image_url, animeData.trailer_url,
    animeData.score, animeData.status, animeData.season, animeData.year, animeData.episodes, animeData.aired_from, animeData.genres, animeData.studios, animeData.source, animeData.rating,
    // Update params
    animeData.title, animeData.title_japanese, animeData.synopsis, animeData.image_url, animeData.trailer_url,
    animeData.score, animeData.status, animeData.season, animeData.year, animeData.episodes, animeData.aired_from,
    animeData.genres, animeData.studios, animeData.source, animeData.rating
  ];

  if (type === 'turso') return await db.execute({ sql, args: params });
  // SQLite uses @mapped params usually, but simpler to use ? for compatibility here if we rewrite query.
  // However, existing query uses @names. better-sqlite3 supports @names. Turso supports :names or ?.
  // To be safe and unified, I rewrote the SQL to use `?` above.
  return db.prepare(sql).run(...params);
}

export async function getSeasonAnime(year, season) {
  const { type, db } = await getClient();
  const sql = `
    SELECT * FROM anime 
    WHERE year = ? AND season = ?
    ORDER BY score DESC NULLS LAST
  `;
  if (type === 'turso') return normalize(await db.execute({ sql, args: [year, season] }), 'turso');
  return db.prepare(sql).all(year, season);
}

export async function getAnimeById(malId) {
  const { type, db } = await getClient();
  const sql = 'SELECT * FROM anime WHERE mal_id = ?';
  if (type === 'turso') return normalizeOne(await db.execute({ sql, args: [malId] }), 'turso');
  return db.prepare(sql).get(malId);
}

export async function getAllAnime() {
  const { type, db } = await getClient();
  const sql = 'SELECT * FROM anime ORDER BY score DESC NULLS LAST LIMIT 50';
  if (type === 'turso') return normalize(await db.execute(sql), 'turso');
  return db.prepare(sql).all();
}

export async function getRecentUpdates(limit = 10) {
  const { type, db } = await getClient();
  const sql = 'SELECT * FROM anime ORDER BY updated_at DESC LIMIT ?';
  if (type === 'turso') return normalize(await db.execute({ sql, args: [limit] }), 'turso');
  return db.prepare(sql).all(limit);
}

export async function searchAnime(query) {
  const { type, db } = await getClient();
  const sql = `
    SELECT * FROM anime 
    WHERE title LIKE ? OR title_japanese LIKE ?
    ORDER BY score DESC NULLS LAST
    LIMIT 20
  `;
  const q = `%${query}%`;
  if (type === 'turso') return normalize(await db.execute({ sql, args: [q, q] }), 'turso');
  return db.prepare(sql).all(q, q);
}

// --- Post/Article Operations ---

export async function createPost(animeId, title, content, type = 'update') {
  const { type: dbType, db } = await getClient();
  const sql = 'INSERT INTO posts (anime_id, title, content, type) VALUES (?, ?, ?, ?)';
  if (dbType === 'turso') return await db.execute({ sql, args: [animeId, title, content, type] });
  return db.prepare(sql).run(animeId, title, content, type);
}

export async function getAnimePosts(animeId) {
  const { type, db } = await getClient();
  const sql = 'SELECT * FROM posts WHERE anime_id = ? ORDER BY published_at DESC';
  if (type === 'turso') return normalize(await db.execute({ sql, args: [animeId] }), 'turso');
  return db.prepare(sql).all(animeId);
}

// --- Season List ---
export async function getAvailableSeasons() {
  const { type, db } = await getClient();
  const sql = `
    SELECT DISTINCT year, season 
    FROM anime 
    WHERE year IS NOT NULL AND season IS NOT NULL
    ORDER BY year DESC, 
      CASE season 
        WHEN 'winter' THEN 1 
        WHEN 'spring' THEN 2 
        WHEN 'summer' THEN 3 
        WHEN 'fall' THEN 4 
      END DESC
  `;
  if (type === 'turso') return normalize(await db.execute(sql), 'turso');
  return db.prepare(sql).all();
}


// --- New Admin Operations (Articles) ---

// Get all articles (posts + articles merged logic? No, assuming 'articles' table from recent implementation)
// Note: User previous code used 'articles' table, but better-sqlite3 existing code in database.js showed 'posts'.
// The previous sessions created 'articles' table. I must support checking 'articles' table.
// Wait, the previous `init_admin_db` check `articles`.
// Let's implement generic query executor for Admin parts to keep it flexible.

export async function executeQuery(sql, params = []) {
  const { type, db } = await getClient();
  if (type === 'turso') {
    const res = await db.execute({ sql, args: params });
    // Turso execute returns { rows, rowsAffected ... }
    // If it sends back rows, return them. If purely mutation, return metadata.
    // For compatibility with .run() which returns { changes, lastInsertRowid }, we mock it.
    // For .all(), we return rows.
    // Since we don't know intent, we return a hybrid object.
    const result = {
      rows: res.rows,
      changes: res.rowsAffected,
      lastInsertRowid: Number(res.lastInsertRowid),
      // helper for getting one
      get: () => res.rows[0],
      all: () => res.rows
    };
    // Normalize for array access
    if (Array.isArray(res.rows)) {
      Object.assign(result, res.rows); // Allow direct array access
    }
    return result;
  }

  // Better-sqlite3
  const stmt = db.prepare(sql);
  if (sql.trim().toUpperCase().startsWith('SELECT')) {
    const rows = stmt.all(...params);
    return {
      rows: rows,
      get: () => rows[0],
      all: () => rows,
      [Symbol.iterator]: function* () { yield* rows; }
    };
  } else {
    const info = stmt.run(...params);
    return {
      changes: info.changes,
      lastInsertRowid: info.lastInsertRowid,
      rows: []
    };
  }
}

// Special function just to get the raw DB object for specialized operations? 
// No, better to expose high level functions.
// But the Admin pages were written using `db.prepare(...).all()`.
// I should allow them to pass SQL.

export async function getDatabase() {
  // This is the tricky part. The existing code expects a synchronous `db` object with `.prepare()`.
  // I CANNOT support `.prepare().all()` synchronously if using Turso.
  // I MUST return a proxy or throw error, forcing refactor.
  // I will return an object that mocks the API but throws if used synchronously, asking dev to use `await executeQuery`.

  // HOWEVER, I am actively refactoring the files.
  // So `getDatabase` will now return the Async Client Wrapper, and I will update the callsites.

  throw new Error("getDatabase() is deprecated. Import specific async functions or use executeQuery(sql, params).");
}
