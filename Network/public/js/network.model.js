/*  Tom Wilkins 04/10/2014

 Network model module

 */

network.model = (function () {
    'use strict';
    var
        configMap = { },
        stateMap  = {
            cid_serial     : 0,
            is_connected   : false,
            people_cid_map : {},
            people_db      : TAFFY(),
            user           : null
        },

        isFakeData = true,

        personProto, makeCid, clearPeopleDb, completeLogin,
        makePerson, removePerson, people, chat, initModule;

    // The people object API
    // ---------------------
    // The people object is available at network.model.people.
    // The people object provides methods and events to manage
    // a collection of person objects. Its public methods include:
    //   * get_user() - return the current user person object.
    //     If the current user is not signed-in, null is returned.
    //   * get_db() - return the TaffyDB database of all the person
    //     objects - including the current user - presorted.
    //   * get_by_cid( <client_id> ) - return a person object with
    //     provided unique id.
    //   * login( <user_name>, <password> ) - login as the user with the provided
    //     user name and password. The current user object is changed to reflect
    //     the new identity. Successful completion of login
    //     publishes a 'network-login' global custom event.
    //   * logout()- revert the current user object to anonymous.
    //     This method publishes a 'network-logout' global custom event.
    //
    // jQuery global custom events published by the object include:
    //   * network-login - This is published when a user login process
    //     completes. The updated user object is provided as data.
    //   * network-logout - This is published when a logout completes.
    //     The former user object is provided as data.
    //
    // Each person is represented by a person object.
    // Person objects provide the following methods:
    //   * get_is_user() - return true if object is the current user
    //
    // The attributes for a person object include:
    //   * cid - string client id. This is always defined, and
    //     is only different from the id attribute
    //     if the client data is not synced with the backend.
    //   * id - the unique id. This may be undefined if the
    //     object is not synced with the backend.
    //   * name - the string name of the user.
    //   * password - the string password of a user.
    //   * css_map - a map of attributes used for avatar
    //     presentation.
    //
    personProto = {
        get_is_user : function () {
            return this.cid === stateMap.user.cid;
        }
    };

    // makes a client ID using the client serial int defined when the module is initiated
    makeCid = function () {
        return 'c' + String( stateMap.cid_serial++ );
    };

    // clears the people in the taffy DB
    clearPeopleDb = function () {
        var user = stateMap.user;
        stateMap.people_db      = TAFFY();
        stateMap.people_cid_map = {};
        if ( user ) {
            stateMap.people_db.insert( user );
            stateMap.people_cid_map[ user.cid ] = user;
        }
    };

    // completes a user login
    completeLogin = function ( user_list ) {
        var user_map = user_list[ 0 ];
        delete stateMap.people_cid_map[ user_map.cid ];
        stateMap.user.cid     = user_map._id;
        stateMap.user.id      = user_map._id;
        stateMap.user.css_map = user_map.css_map;
        stateMap.people_cid_map[ user_map._id ] = stateMap.user;
        //chat.join();
        $.gevent.publish( 'network-login', [ stateMap.user ] );
    };

    // person factory
    makePerson = function ( person_map ) {
        var person,
            cid     = person_map.cid,
            css_map = person_map.css_map,
            id      = person_map.id,
            name    = person_map.name,
            password = person_map.password;

        if ( cid === undefined || ! name || ! password) {
            throw 'client id and name required';
        }

        person         = Object.create( personProto );
        person.cid     = cid;
        person.name    = name;
        person.password = password;
        person.css_map = css_map;

        if ( id ) { person.id = id; }

        stateMap.people_cid_map[ cid ] = person;

        stateMap.people_db.insert( person );
        return person;
    };

    // removes a person from the db
    removePerson = function ( person ) {
        if ( ! person ) { return false; }

        stateMap.people_db({ cid : person.cid }).remove();
        if ( person.cid ) {
            delete stateMap.people_cid_map[ person.cid ];
        }
        return true;
    };

    // API
    people = (function () {
        var get_by_cid, get_db, get_user, login, logout;

        get_by_cid = function ( cid ) {
            return stateMap.people_cid_map[ cid ];
        };

        get_db = function () { return stateMap.people_db; };

        get_user = function () { return stateMap.user; };

        // logs a user in
        login = function ( name, password ) {
            var sio = isFakeData ? network.fake.mockSio : network.data.getSio();

            stateMap.user = makePerson({
                cid     : makeCid(),
                css_map : {top : 25, left : 25, 'background-color':'#8f8'},
                name    : name,
                password : password
            });

            sio.on( 'userupdate', completeLogin );

            sio.emit( 'adduser', {
                cid     : stateMap.user.cid,
                css_map : stateMap.user.css_map,
                name    : stateMap.user.name,
                password : stateMap.user.password
            });
        };

        logout = function () {
            var user = stateMap.user;

            //chat._leave();
            stateMap.user = null;
            clearPeopleDb();

            $.gevent.publish( 'network-logout', [ user ] );
        };

        return {
            get_by_cid : get_by_cid,
            get_db     : get_db,
            get_user   : get_user,
            login      : login,
            logout     : logout
        };
    }());


    var initModule = function ( ) {
        stateMap.user = null;
    };

    return { initModule : initModule,
            people     : people };
}());