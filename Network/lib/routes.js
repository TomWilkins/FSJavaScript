/*
 * routes.js - module to provide routing
 */

// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
    configRoutes,
    crud        = require( './crud' ),
    chat        = require( './chat' ),

    makeMongoId = crud.makeMongoId;
// ------------- END MODULE SCOPE VARIABLES ---------------

// ---------------- BEGIN PUBLIC METHODS ------------------
configRoutes = function ( app, server ) {

    // all get requests to "/" will go to /network.html
    app.get( '/', function ( request, response ) {
        response.redirect( '/network.html' );
    });

    // all requests to /<obj_type>/ need to be json
    app.all( '/:obj_type/*?', function ( request, response, next ) {
        response.contentType( 'json' );
        next();
    });

    // get requests for /<obj_type>/list will return a list of all of those object types
    app.get( '/:obj_type/list', function ( request, response ) {
        crud.read(
            request.params.obj_type,
            {}, {},
            function ( map_list ) { response.send( map_list ); }
        );
    });

    // post request at /<obj_type>/create will create a new object
    app.post( '/:obj_type/create', function ( request, response ) {
        crud.construct(
            request.params.obj_type,
            request.body,
            function ( result_map ) { response.send( result_map ); }
        );
    });

    // gets the object for given id
    app.get( '/:obj_type/read/:id', function ( request, response ) {
        crud.read(
            request.params.obj_type,
            { _id: makeMongoId( request.params.id ) },
            {},
            function ( map_list ) { response.send( map_list ); }
        );
    });

    // post update request for object with id
    app.post( '/:obj_type/update/:id', function ( request, response ) {
        crud.update(
            request.params.obj_type,
            { _id: makeMongoId( request.params.id ) },
            request.body,
            function ( result_map ) { response.send( result_map ); }
        );
    });

    // get request to delete an object with id
    app.get( '/:obj_type/delete/:id', function ( request, response ) {
        crud.destroy(
            request.params.obj_type,
            { _id: makeMongoId( request.params.id ) },
            function ( result_map ) { response.send( result_map ); }
        );
    });

    chat.connect( server );
};

module.exports = { configRoutes : configRoutes };
// ----------------- END PUBLIC METHODS -------------------
