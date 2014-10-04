/*  Tom Wilkins 04/10/2014

    Network root module
    - used to initialise other modules.

 */

var network = (function () {

    'use strict';
    var initModule = function ( $container ) {
        network.data.initModule();
        network.model.initModule();
        network.shell.initModule( $container );
    };

    return { initModule: initModule };
}());