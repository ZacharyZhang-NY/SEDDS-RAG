import pg from 'pg'

const { Pool } = pg

export const client = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  database: process.env.DB_NAME ?? "api",
  user: process.env.DB_USER ?? "myuser",
  password: process.env.DB_PASSWORD ?? "ChangeMe"
})