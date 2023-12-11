import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { Pool } from "pg";

interface CreateThingBodyType {
  name: string;
  description: string;
  type: number;
  attributes: string;
};

type PostThingRequest = FastifyRequest<{
  Body: CreateThingBodyType
}>;

interface ThingRequestQueryStringType {
  move_to: number|null;
  contents: number|null;
  type_is: number|null;
  type_of: number|null;
  limit: number|null;
  offset: number|null;
  context: string|null;
};
interface ThingRequestKeyType {
  key: string;
};
type ThingRequest = FastifyRequest<{
  Params: ThingRequestKeyType,
  Querystring: ThingRequestQueryStringType
}>

export const api = (fastify: FastifyInstance, pool: Pool) => {
  fastify.get('/thing', (request: ThingRequest, reply) => {
    const qs = request.query;
    reply.send({ qs });
    // perform GET-THING(root)
  });

  fastify.post('/thing', async (request: PostThingRequest, reply) => {
    const body = request.body;
    const { name, description, type, attributes } = body;
    // reply.send({ });
    // create a new thing with body params with this thing as the location
    await new Promise<void>((resolve,reject) => {
      pool.query('insert into thing (name, description, type_key, attributes) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, type, attributes], (err, res) => {
        if (err) {
          console.log(err.stack);
          reply.status(200).send({ message: 'Error creating thing (2)', error: err.message });
          reject(err);
        } else {
          // console.log(res.rows[0]);
          reply.status(201).send(res.rows[0]);
          resolve();
        }
      });
    });
  });

  fastify.get('/thing/:key', (request: ThingRequest, reply) => {
    const key = request.params.key;
    const { limit } = request.query;
    reply.send({ key });
    // perform GET-THING(key)
  });
  fastify.post('/thing/:key', (request: ThingRequest, reply) => {
    const key = request.params.key;
    reply.send({ key });
    // create a new thing with body params with this thing as the location
  });
  fastify.put('/thing/:key', (request: ThingRequest, reply) => {
    const key = request.params.key;
    reply.send({ key });
    // update a thing with body params
  });
  fastify.delete('/thing/:key', (request: ThingRequest, reply) => {
    const key = request.params.key;
    reply.send({ key });
    // perform DELETE-THING(key)
  });

  fastify.get('/thing/:key/location', (request: ThingRequest, reply) => {
    const key = request.params.key;
    reply.send({ key });
    // perform GET-LOCATION(key)
  });

};
