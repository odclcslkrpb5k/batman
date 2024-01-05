import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { PutThingLocationRequest, ThingRequest } from '../types';
import { get_thing } from './thing';


const thing_location_api = (fastify: FastifyInstance, pool: Pool) => {

  fastify.get('/thing/:key/location', async (request: ThingRequest, reply) => {
    const key = request.params.key;
    // reply.send({ key });
    // perform GET-LOCATION(key)
    const thing = await get_thing(pool, key);
    if (!thing) {
      reply.status(404).send({ error: 'Thing not found'});
      return;
    }
    const res = await pool.query('select location_key from thing_location where thing_key = $1', [thing.key]);
    reply.status(200).send(res.rows.reduce((acc, row) => { acc.push(row.location_key); return acc; }, []));
  });
  
  fastify.put('/thing/:key/location/:location_key', async (request: PutThingLocationRequest, reply) => {
    const key = request.params.key;
    const location_key = request.params.location_key;
    // reply.send({ key });
    // perform POST-LOCATION(key)
    const thing = await get_thing(pool, key);
    if (!thing) {
      reply.status(404).send({ error: 'Thing not found'});
      return;
    }

    const res = await pool.query('insert into thing_location (thing_key, location_key) VALUES ($1, $2) RETURNING *', [thing.key, location_key]);
    reply.status(204);
  });
  // handle thing location deletion
  fastify.delete('/thing/:key/location/:location_key', async (request: PutThingLocationRequest, reply) => {
    const key = request.params.key;
    const location_key = request.params.location_key;
    // reply.send({ key });
    // perform DELETE-LOCATION(key)
    const thing = await get_thing(pool, key);
    if (!thing) {
      reply.status(404).send({ error: 'Thing not found'});
      return;
    }
    const res = await pool.query('delete from thing_location where thing_key = $1 and location_key = $2', [thing.key, location_key]);
    reply.status(204);
  });
};
export default thing_location_api;