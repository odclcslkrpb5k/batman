# batman
You can put things inside of other things.


* `GET` returns status `200`
* `POST` returns status `201`
* `PUT` returns status `200`
* `DELETE` returns status `200`

Unless there's an error. Errors from rule violations will return status `400`. Queries referencing
invalid or non-existent keys will return status `404`.

## API routes

* `GET /thing` - gets the top-level thing (warehouse, universe, multiverse, Adam, whatever)
* `POST /thing` - creates a new thing, location is the top-level thing

* `GET /thing/<thing_key>` - gets a specified thing
* `PUT /thing/<thing_key>` - updates a thing with properties in the request body
* `POST /thing/<thing_key>` - creates a new thing with the specified $thing_key as the location
* `DELETE /thing/<thing_key>` - deletes a thing and ejects everything contained inside of it

### Thing delete behavior

* You can't delete the root-level thing.
* By default, deleting a thing will move its contents to the thing's location.
  This behavior can be controlled by specifying the `move_to` option, which expects a different
  thing_key to accept the orphaned things (subject to the `max_contents` limit for the target
  thing's type; any additional things after this limit will be moved to the root thing).
  Specifying a value of -1 will result in all contents of the thing being deleted recursively.
  eg; `DELETE /thing/123?move_to=-1`


## GET /thing query params

### listing contents

* `contents=<number>` - return contents, depth as indicated by `<number>`
* `type_is=$type_key`- return only contents with a type that is $type_key
* `type_of=$type_key`- return contents with a type that is or descends from $type_key
* `limit=<number>` - limit results to specified number, default is unlimited
* `offset=<number>` - skip `<number>` of results

### context
Include one or more `"context=<string>"` param to add more detail to the response.
By default only $thing_key with _no_ additional context is returned.
Note that this applies to the thing being queried _and_ things returned from `"contents=<number>"`

* `context=thing` - returns the `<thing>` info
* `context=attr` - return thing attributes
* `context=type` - return expanded info for types

* `GET /thing/1?contents=1&type_of=2&context=thing&context=attr&context=type`


# Managing thing locations

* `GET /thing/<thing_key>/location` - return all the locations of this thing
* `PUT /thing/<thing_key>/location/<location_key>` - adds/moves a thing to that location
* `DELETE /thing/<thing_key>/location/<location_key>` - removes a thing from a location

PUTting things in a location is subject to some rules:

* You can't put a thing in itself
* You can't put a thing in any of the locations that are inside of it
* You can't put the root thing in anything (`max_locations=0`!)
* A thing can inhabit one or more location, as determined by its type's
  `max_locations`
* If a thing's `max_locations` is 1, PUTting it to a new location will remove
  it any existing location
* If a thing's `max_locations` is >1 and it already is already at this max,
  more PUTs will error
* You can't put a thing inside of a location that has a type with `max_contents=0`
* You can't exceed a location type's `max_contents`

If you `DELETE` all of a thing's locations, it will be moved to within the root thing.

### Managing thing types

* `GET /type/<type_key>` - return the info for a given type
* `POST /type` - add a new type
* `PUT /type/<type_key>` - update an existing type
* `DELETE /type/<type_key>` - deletes a type, any types that descend from it, and any things that have
                          that type. Things within things deleted under this case will be moved to
                          the deleted things parents (default thing deletion behavior).

### Managing thing type attributes

* `GET /attr_type/<attr_type_key>` - return info for a given attr_type
* `POST /attr_type` - add a new attr_type
* `PUT /attr_type/<attr_type_key>` - update an existing attr_type
* `DELETE /attr_type/<attr_type_key>` - deletes an attribute type. Things with the relevant type will
                                    have their attributes scrubbed of the deleted attribute.


Remi contributed this to the specification:

```
    /lkmhtgfv .bbfrfd3wre4ft5gy6u7i8o9p0-=kohjuikolp;0-[=uhrftgyhujik8o9p0-[]jouyrryr54ty6uio90-ktyhujikop[hderftgyhujikolp;'[]\hxcdrvnftgynhjolp[]]
```
