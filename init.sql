

-- This is a first pass at a schema for the thing database.  It is not complete, and will
-- likely change as the project progresses.


create table thing_type (
    key serial primary key,
    name text not null,
    description text, -- can be null
    max_contents integer, -- if not null, the maximum number of things this type can contain
    max_locations integer, -- if not null, the maximum number of locations this type can inhabit
    parent_types integer array[] references thing_type on delete cascade,
);
-- indexes on name, parent_types
create index thing_type_name_idx on thing_type using GIN (to_tsvector('english', name));
create index thing_type_parent_types on thing_type(parent_types);

create table thing (
    key serial primary key,
    name text not null,
    description text, -- can be null
    type_key integer not null references location_type(key) on delete cascade,
    location_paths jsonb,
    -- location_paths will be updated via trigger whenever the thing location changes
    -- format is [ [thing_key, ...], ...]
    attributes jsonb,
    -- attributes are formalized by attr_type records,

    created timestamp not null default now(),
    updated timestamp not null default now(),
);

-- things that don't have a location are considered to be in the root thing
create table thing_location (
    thing_key integer not null references thing(key) on delete cascade,
    location_key integer not null references thing(key) on delete cascade,
    -- needs a constraint to ensure that thing_key != location_key, and that only one record exists
    -- for a given thing_key and location_key
    constraint thing_location_pk primary key (thing_key, location_key)
);


-- recursive query to get all locations of a thing
with recursive get_parents(thing_key, location_key) as (
    select thing_key, location_key from thing_location
    union all
    select get_parents.thing_key, thing_location.location_key
        from get_parents
        join thing_location on get_parents.location_key = thing_location.thing_key
)

create function updatefnc() returns trigger as
$update_fnc$
    begin
        -- recurse through thing_location and build an array of parents
        select array_agg(location_key) into loc_paths
            from get_parents where thing_key = NEW.thing_key and location_key = NEW.location_key;
        update thing set location_paths=json_build_object(loc_paths) where thing_key = NEW.thing_key;

        -- insert into audit(target, changed_by, old, new)
        --         values (TG_TABLE_NAME::regclass::text, NEW.changed_by,
        --                 json_build_object(OLD),
        --                 json_build_object(NEW));

        -- create a new record in audit and event_queue
        return NEW;
    end;
$update_fnc$
    language plpgsql;

--  trigger for thing_location on insert or delete, rebuild thing(location_paths)

create table attr_type (
    key serial primary key,
    name text not null,
    type_key not null references thing_type(key) on delete cascade,
    short_name text not null, -- the name used for this attribute as a hash key
    style enum ('thing', 'boolean', 'number', 'text', 'longtext', 'single_select', 'multi_select') not null,
    props jsonb -- would contain other optional properties, depending on the style
);

