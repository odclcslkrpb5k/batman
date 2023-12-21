import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { ThingTypeGetRequest, ThingTypePostRequest, ThingTypePutRequest } from '../types';

const thing_type_api = (fastify: FastifyInstance, pool: Pool) => {

  // REST API handlers for thing types
  fastify.get('/thing_type', async (request, reply) => {
    // get all thing types
    const res = await pool.query('select * from thing_type');
    reply.send(res.rows);
  });

  fastify.get('/thing_type/:key', async (request: ThingTypeGetRequest, reply) => {
    const key = request.params.key;
    // get this thing type
    const res = await pool.query('select * from thing_type where key = $1', [key]);
    // return 404 if the type does not exist
    if (res.rows.length === 0) {
      reply.status(404).send({ error: 'Thing type not found'});
      return;
    }
    reply.send(res.rows[0]);
  });

  fastify.post('/thing_type', async (request: ThingTypePostRequest, reply) => {
    // create a new thing type from properties specified in the post body
    const res = await pool.query('insert into thing_type (name, description, max_contents, max_locations, parent_type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [request.body.name, request.body.description, request.body.max_contents, request.body.max_locations, request.body.parent_type]);
    reply.status(201).send(res.rows[0]);
  });
  
  fastify.put('/thing_type/:key', async (request: ThingTypePutRequest, reply) => {
    const key = request.params.key;
    // get this thing type first
    const res1 = await pool.query('select * from thing_type where key = $1', [key]);
    // return 404 if the type does not exist
    if (res1.rows.length === 0) {
      reply.status(404).send({ error: 'Thing type not found' });
      return;
    }
    // update this thing type with properties from the put body
    const { name, description, max_contents, max_locations, parent_type } = request.body;
    const res = await pool.query(
      `update thing_type 
      set name = COALESCE($1, name), 
          description = COALESCE($2, description), 
          max_contents = COALESCE($3, max_contents), 
          max_locations = COALESCE($4, max_locations), 
          parent_type = COALESCE($5, parent_type) 
      where key = $6 
      RETURNING *`,
      [name, description, max_contents, max_locations, parent_type, key]
    );
    reply.status(200).send(res.rows[0]);
  });
  fastify.delete('/thing_type/:key', async (request: ThingTypeGetRequest, reply) => {
    const key = request.params.key;
    // get this thing type first
    const res1 = await pool.query('select * from thing_type where key = $1', [key]);
    // return 404 if the type does not exist
    if (res1.rows.length === 0) {
      reply.status(404).send({ error: 'Thing type not found'});
      return;
    }
    // delete this thing type
    const res = await pool.query('delete from thing_type where key = $1', [key]);
    reply.status(204);
  });
};
export default thing_type_api;
