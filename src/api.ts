import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';

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

export const api = (fastify: FastifyInstance) => {
  fastify.get('/thing', (request: ThingRequest, reply) => {
    const qs = request.query;
    reply.send({ qs });
    // perform GET-THING(root)
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
