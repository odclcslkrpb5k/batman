import { FastifyInstance } from 'fastify';
import { Pool } from "pg";
import { PostThingRequest, ThingRequest } from '../types';


export const get_thing = async(pool: Pool, key: number) => {
  const res = await pool.query('select * from thing where key = $1', [key]);
  return res.rows[0];
};

export const get_things_by_type = async(pool: Pool, type: number) => {
  const res = await pool.query('select * from thing where type_key = $1', [type]);
  return res.rows;
};

export const get_root_thing = async(pool: Pool) => {
  const res = await pool.query('select * from thing join thing_type on (thing.type_key=thing_type.key) where max_locations = 0');
  return res.rows[0];
};

export const create_thing = async(pool: Pool, name: string, description: string, type: number, attributes: string, location_key: number) => {
  const res = await pool.query('insert into thing (name, description, type_key, attributes) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, type, attributes]);
  const newThing = res.rows[0];
  const res2 = await pool.query('insert into thing_location (thing_key, location_key) VALUES ($1, $2) RETURNING *', [newThing.key, location_key]);
  return newThing;
};

const thing_api = (fastify: FastifyInstance, pool: Pool) => {
  fastify.get('/thing', async(request: ThingRequest, reply) => {
    const qs = request.query;
    // reply.send({ qs });
    // perform GET-THING(root)
    const root = await get_root_thing(pool);
    reply.send(root);
  });

  fastify.post('/thing', async (request: PostThingRequest, reply) => {
    const body = request.body;
    const { name, description, type, attributes } = body;
    // get the root thing first
    const root = await get_root_thing(pool);
    // create a new thing with body params with the root thing as the location
    const newThing = await create_thing(pool, name, description, type, attributes, root.key);
    reply.status(201).send(newThing);
  });

  fastify.get('/thing/:key', async(request: ThingRequest, reply) => {
    const key = request.params.key;
    const { limit } = request.query;
    // reply.send({ key });
    // perform GET-THING(key)
    const thing = await get_thing(pool, key);
    // return 404 if thing was not found
    if (!thing) {
      reply.status(404).send({ error: 'Thing not found'});
      return;
    }
    reply.send(thing);
  });
  fastify.post('/thing/:key', async (request: PostThingRequest, reply) => {
    const key = request.params.key;
    // reply.send({ key });
    // get the new thing params from the body
    const body = request.body;
    const { name, description, type, attributes } = body;
    // create a new thing with body params with this thing as the location
    const newThing = await create_thing(pool, name, description, type, attributes, key);
    reply.status(201).send(newThing);
  });
  fastify.put('/thing/:key', (request: ThingRequest, reply) => {
    const key = request.params.key;
    reply.send({ key });
    // update a thing with body params
  });
  fastify.delete('/thing/:key', async (request: ThingRequest, reply) => {
    const key = request.params.key;
    // reply.send({ key });
    // perform DELETE-THING(key)
    const thing = await get_thing(pool, key);
    if (!thing) {
      reply.status(404).send({ error: 'Thing not found'});
      return;
    }
    // delete the thing in the database
    const res = await pool.query('delete from thing where key = $1', [thing.key]).catch((err) => {
          reply.status(500).send({ error: 'Error deleting thing', message: err});
      return;
    });
    reply.status(200).send(thing);
  });

};

export default thing_api;
