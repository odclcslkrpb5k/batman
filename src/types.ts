import { FastifyRequest } from 'fastify';

// request params for tui.Grid readData
export interface tuiGridReadDataQueryStringType {
  page: number|null;
  perPage: number|null;
  sortColumn: string|null;
  sortAscending: boolean|null;
};
export type tuiGridReadDataRequest = FastifyRequest<{
  Querystring: tuiGridReadDataQueryStringType
}>;

export interface CreateThingBodyType {
  name: string;
  description: string;
  type: number;
  attributes: string;
};

export interface ThingRequestKeyType {
  key: number;
};

export type PostThingRequest = FastifyRequest<{
  Body: CreateThingBodyType,
  Params: ThingRequestKeyType
}>;

export interface ThingRequestQueryStringType {
  move_to: number|null;
  contents: number|null;
  type_is: number|null;
  type_of: number|null;
  limit: number|null;
  offset: number|null;
  context: string|null;
};
export type ThingRequest = FastifyRequest<{
  Params: ThingRequestKeyType,
  Querystring: ThingRequestQueryStringType
}>;


export interface ThingLocationPutKeyType {
  key: number;
  location_key: number;
};

export type PutThingLocationRequest = FastifyRequest<{
  Params: ThingLocationPutKeyType
}>;



export interface ThingType {
  key?: number;
  name?: string;
  description?: string;
  max_contents?: number;
  max_locations?: number;
  parent_type?: ThingType;
};


export interface ThingTypeRequestKeyType {
  key: number;
};
export type ThingTypeGetRequest = FastifyRequest<{
  Params: ThingTypeRequestKeyType
}>;

export type ThingTypePostRequest = FastifyRequest<{
  Body: ThingType
}>;
export type ThingTypePutRequest = FastifyRequest<{
  Params: ThingTypeRequestKeyType,
  Body: ThingType
}>;