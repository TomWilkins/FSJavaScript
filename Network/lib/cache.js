/*
 * cache.js - Redis cache implementation
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
    redisDriver = require( 'redis' ),
    redisClient = redisDriver.createClient(),
    makeString, deleteKey, getValue, setValue;
// ------------- END MODULE SCOPE VARIABLES ---------------

// --------------- BEGIN UTILITY METHODS ------------------

// formats a string to json string
makeString = function ( key_data ) {
    return (typeof key_data === 'string' )
        ? key_data
        : JSON.stringify( key_data );
};
// ---------------- END UTILITY METHODS -------------------

// ---------------- BEGIN PUBLIC METHODS ------------------

// deletes object in redis cache
deleteKey = function ( key ) {
    redisClient.del( makeString( key ) );
};

// gets object from cache
getValue = function ( key, hit_callback, miss_callback ) {
    redisClient.get(
        makeString( key ),
        function( err, reply ) {
            if ( reply ) {
                console.log( 'HIT' );
                hit_callback( reply );
            }
            else {
                console.log( 'MISS' );
                miss_callback();
            }
        }
    );
};

setValue = function ( key, value ) {
    redisClient.set(
        makeString( key ), makeString( value )
    );
};

module.exports = {
    deleteKey : deleteKey,
    getValue  : getValue,
    setValue  : setValue
};
// ----------------- END PUBLIC METHODS -------------------
