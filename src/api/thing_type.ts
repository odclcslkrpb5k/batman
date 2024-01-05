import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { ThingTypeGetRequest, ThingTypePostRequest, ThingTypePutRequest, tuiGridReadDataRequest } from '../types';

const thing_type_api = (fastify: FastifyInstance, pool: Pool) => {

  // REST API handlers for thing types
  fastify.get('/thing_type', async (request: tuiGridReadDataRequest, reply) => {
    // TODO: this stuff should be generic
    const page = request.query.page || 1;
    const perPage = request.query.perPage || 10;
    const sortColumn = request.query.sortColumn || 'key';
    const sortAscending = request.query.sortAscending || true;

    // get all thing types
    // try
    // {
      const query = `select 
    thing_type.key as key,
    thing_type.name as name,
    thing_type.description as description,
    thing_type.max_contents as max_contents,
    thing_type.max_locations as max_locations,
    thing_type.parent_type as parent_type,
    parent_type.name as parent_type_name
from thing_type
left join thing_type as parent_type on (thing_type.parent_type = parent_type.key)
order by (case when $2 = 'ASC' then $1 end) ASC,
(case when $2 = 'DESC' then $1 end) DESC
limit $3 offset $4`;
      const values = [
        sortColumn,
        sortAscending ? 'asc' : 'desc',
        perPage,
        (page - 1) * perPage
      ];
      console.log(query, values);
      const res = await pool.query({
        text: query, //'select * from thing_type order by $1 $2 limit $3 offset $4',
        values: [
          sortColumn,
          sortAscending ? 'asc' : 'desc',
          perPage,
          (page - 1) * perPage
        ]
      });
      reply.send({
        result: true,
        data: {
          contents: res.rows,
          pagination: {
            page: 1,
            totalCount: res.rows.length,
          }
        }
      });
    // } catch(e) {
    //   reply.send({
    //     result: false,
    //     message: e,
    //   })
    // }
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
