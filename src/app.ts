// ESM
import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});
import dotenv from 'dotenv';
dotenv.config();

const defaultPort = '5000';
const { PORT } = process.env;
const port: number = parseInt((PORT) ? PORT : defaultPort);

import { Pool } from "pg";
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.PGPORT || "5432")
});

const connectToDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to DB!');
  } catch (err) {
    console.log(err);
  }
};
connectToDB();

import { api } from './api';
api(fastify, pool);

// Run the server!
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
