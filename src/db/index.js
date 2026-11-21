/**
 * Unified Database Adapter for A.Kitchen WMS
 * Dual-backend support: Cloudflare D1 (SQLite) and Supabase PostgreSQL (via Hyperdrive / pg)
 * Controlled via environment variable: DB_BACKEND ('d1' | 'supabase')
 */

import pg from 'pg';
const { Client } = pg;

export function getBackend(env) {
  return (env.DB_BACKEND || 'd1').toLowerCase();
}

export function isPg(env) {
  const b = getBackend(env);
  return b === 'supabase' || b === 'pg';
}

/**
 * Translate '?' positional placeholders to '$1, $2, ...' for Postgres
 */
export function translatePlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

/**
 * Resolve query string depending on backend
 * Supports passing a string or an object { d1: string, pg: string }
 */
export function resolveSql(sqlArg, isPostgres) {
  if (typeof sqlArg === 'object' && sqlArg !== null) {
    if (isPostgres && sqlArg.pg) return translatePlaceholders(sqlArg.pg);
    if (!isPostgres && sqlArg.d1) return sqlArg.d1;
    throw new Error('Missing SQL query dialect for active backend');
  }
  if (typeof sqlArg === 'string') {
    return isPostgres ? translatePlaceholders(sqlArg) : sqlArg;
  }
  throw new Error('Invalid SQL argument type');
}

/**
 * Create a new PostgreSQL client configured for Supabase / Hyperdrive
 */
export function createPgClient(env) {
  const connString =
    env.HYPERDRIVE?.connectionString ||
    env.SUPABASE_DB_URL ||
    env.DATABASE_URL;

  if (!connString) {
    throw new Error('Thiếu cấu hình chuỗi kết nối Supabase PostgreSQL (HYPERDRIVE hoặc DATABASE_URL)');
  }

  return new Client({
    connectionString: connString,
    options: '-c search_path=wms,public',
    connectionTimeoutMillis: 10000,
  });
}

/**
 * Run a query returning an array of rows
 * @param {object} env
 * @param {string|object} sql - SQL string or { d1, pg }
 * @param {Array} params - Query parameters
 * @returns {Promise<{ rows: Array }>}
 */
export async function query(env, sql, params = []) {
  if (isPg(env)) {
    const client = createPgClient(env);
    await client.connect();
    try {
      const targetSql = resolveSql(sql, true);
      const res = await client.query(targetSql, params);
      return { rows: res.rows || [] };
    } finally {
      await client.end().catch(() => {});
    }
  } else {
    // D1
    const targetSql = resolveSql(sql, false);
    const stmt = env.DB.prepare(targetSql).bind(...params);
    const res = await stmt.all();
    return { rows: res.results || [] };
  }
}

/**
 * Run a query returning a single row or null
 */
export async function queryOne(env, sql, params = []) {
  if (isPg(env)) {
    const res = await query(env, sql, params);
    return res.rows[0] || null;
  } else {
    // D1
    const targetSql = resolveSql(sql, false);
    const stmt = env.DB.prepare(targetSql).bind(...params);
    const res = await stmt.first();
    return res || null;
  }
}

/**
 * Execute an INSERT / UPDATE / DELETE statement
 * @returns {Promise<{ rowCount: number, rows: Array, lastRowId?: any }>}
 */
export async function exec(env, sql, params = []) {
  if (isPg(env)) {
    const client = createPgClient(env);
    await client.connect();
    try {
      const targetSql = resolveSql(sql, true);
      const res = await client.query(targetSql, params);
      return {
        rowCount: res.rowCount || 0,
        rows: res.rows || [],
        lastRowId: res.rows?.[0]?.id,
      };
    } finally {
      await client.end().catch(() => {});
    }
  } else {
    // D1
    const targetSql = resolveSql(sql, false);
    const stmt = env.DB.prepare(targetSql).bind(...params);
    const res = await stmt.run();
    return {
      rowCount: res.meta?.changes || 0,
      rows: res.results || [],
      lastRowId: res.meta?.last_row_id,
    };
  }
}

/**
 * Execute multiple statements within a single atomic transaction
 * @param {object} env
 * @param {Function} callback - fn(tx) where tx has query, queryOne, exec
 */
export async function withTransaction(env, callback) {
  if (isPg(env)) {
    const client = createPgClient(env);
    await client.connect();
    const tx = {
      query: async (sql, params = []) => {
        const targetSql = resolveSql(sql, true);
        const res = await client.query(targetSql, params);
        return { rows: res.rows || [] };
      },
      queryOne: async (sql, params = []) => {
        const targetSql = resolveSql(sql, true);
        const res = await client.query(targetSql, params);
        return res.rows[0] || null;
      },
      exec: async (sql, params = []) => {
        const targetSql = resolveSql(sql, true);
        const res = await client.query(targetSql, params);
        return {
          rowCount: res.rowCount || 0,
          rows: res.rows || [],
          lastRowId: res.rows?.[0]?.id,
        };
      },
    };

    try {
      await client.query('BEGIN');
      const result = await callback(tx);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      await client.end().catch(() => {});
    }
  } else {
    // D1
    const tx = {
      query: async (sql, params = []) => {
        const targetSql = resolveSql(sql, false);
        const res = await env.DB.prepare(targetSql).bind(...params).all();
        return { rows: res.results || [] };
      },
      queryOne: async (sql, params = []) => {
        const targetSql = resolveSql(sql, false);
        return await env.DB.prepare(targetSql).bind(...params).first();
      },
      exec: async (sql, params = []) => {
        const targetSql = resolveSql(sql, false);
        const res = await env.DB.prepare(targetSql).bind(...params).run();
        return {
          rowCount: res.meta?.changes || 0,
          rows: res.results || [],
          lastRowId: res.meta?.last_row_id,
        };
      },
      batch: async (statements) => {
        return await env.DB.batch(statements);
      },
    };

    return await callback(tx);
  }
}

export default {
  getBackend,
  isPg,
  translatePlaceholders,
  resolveSql,
  createPgClient,
  query,
  queryOne,
  exec,
  withTransaction,
};
