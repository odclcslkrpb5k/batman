// ESM
import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';
dotenv.config();
const path = require('node:path');

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

import thing_api from './api/thing';
import thing_type_api from './api/thing_type';
import thing_location_api from './api/thing_location';
thing_api(fastify, pool);
thing_type_api(fastify, pool);
thing_location_api(fastify, pool);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../src/app'),
  prefix: '/app/', // optional: default '/'
  // constraints: { host: 'example.com' } // optional: default {}
  wildcard: true
});

// /usr/src/app/dist ???
fastify.get('/app', function (req, reply) {
  console.log(__dirname);
  reply.sendFile('index.html', path.join(__dirname, '../src/app'));
});

// Run the server!
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
