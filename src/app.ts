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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432")
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};
connectToDB();

import { api } from './api';
api(fastify);

// Run the server!
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
