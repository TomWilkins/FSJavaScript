/*  Tom Wilkins 04/10/2014

 Network shell module

 */

network.shell = (function () {
    'use strict';
     //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html : String()
                + '<header id="network-global-header">'
                +   '<div id="network-global-header-wrapper">'
                +        '<div id="network-global-header-logo">Network.</div>'
                +        '<nav id="network-global-header-nav">'
                +           '<button id="network-global-header-nav-register">Register</button>'
                +           '<button id="network-global-header-nav-login">Login</button>'
                +           '<div id="network-global-header-nav-profile"></div>'
                +           '<button id="network-global-header-nav-logout">Logout</button>'
                +        '</nav>'
                +    '</div>'
                +'</header>'
                +'<section id="network-global-section">'
                +    '<div id="network-global-section-wrapper">'
                +        '<article id="network-global-section-article">'
                +        '</article>'
                +    '</div>'
                +'</section>'
                +'<footer id="network-global-footer">'
                +   '<div id="network-global-footer-wrapper">&#64; Tom Wilkins '+ new Date().getFullYear() + '</div>'
                +'</footer>'
        },
        stateMap = {
            $container  : undefined,
            anchor_map  : {}
        },
        jqueryMap = {},

        setJqueryMap, setFakeNews, onLogin, onLogout, initModule, processLogin, processRegister;
    //----------------- END MODULE SCOPE VARIABLES --------------

    //------------------- BEGIN UTILITY METHODS ------------------
    //-------------------- END UTILITY METHODS -------------------

    //--------------------- BEGIN DOM METHODS --------------------

    setJqueryMap = function () {
        var $container = stateMap.$container;

        jqueryMap = {
            $container : $container,
            $header    : $container.find('#network-global-header'),
            $logo      : $container.find('#network-global-header-logo'),
            $nav       : $container.find('#network-global-header-nav'),
            $registerButton : $container.find('#network-global-header-nav-register'),
            $loginButton : $container.find('#network-global-header-nav-login'),
            $logoutButton : $container.find('#network-global-header-nav-logout'),
            $navProfile : $container.find('#network-global-header-nav-profile'),
            $section : $container.find('#network-global-section'),
            $sectionArticle : $container.find('#network-global-section-article'),
            $footer : $container.find('#network-global-footer')
        };

        console.log(jqueryMap.$loginButton);
    };

    setFakeNews = function() {

        jqueryMap.$sectionArticle.html(
              '<h1>Welcome.</h1>'
            + '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis ligula bibendum lacus imperdiet'
            + 'eleifend sit amet in orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur'
            + 'venenatis, nibh et cursus feugiat, lacus justo consectetur nibh, at venenatis velit felis ac mi.'
            + '</p>'
            + '<p>Fusce sodales auctor diam. Donec dignissim neque euismod massa tristique, quis vehicula erat'
            + 'dignissim. Vivamus augue neque, auctor id lectus vel, euismod consequat quam. Donec dolor urna,'
            + 'fringilla et metus ac, porta feugiat libero. Vestibulum luctus, lectus non pharetra laoreet, orci'
            + 'urna tincidunt nulla, eu posuere nibh libero non quam. Mauris odio dui, pretium a consectetur vel,'
            + 'tincidunt id est. Duis eget rhoncus enim. Donec ac nisl sit amet mi placerat posuere condimentum at'
            + 'ex. Ut nec commodo lectus, dictum fringilla ipsum. Integer aliquam augue in ex pretium viverra.'
            + '</p>'
        );

    };
    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    processLogin = function ( event ) {

        console.log("Login clicked");

        var user_name, password;

        user_name = prompt( 'Enter Username' );
        password = prompt( 'Enter Password' );

        if(!user_name || !password){
            alert("A username and password must be entered!");
            return false;
        }

        if (!network.model.people.login( user_name, password )){
            alert("Invalid login");
            return false;
        }

        jqueryMap.$loginButton.hide()
        jqueryMap.$registerButton.hide();
        jqueryMap.$navProfile.show();
        jqueryMap.$navProfile.text( '... processing ...' );

        return false;
    };

    processRegister = function ( event ) {

        console.log("Register clicked");

        var user_name, password;

        user_name = prompt( 'Enter Username' );
        password = prompt( 'Enter Password' );

        if(!network.model.people.register(user_name, password)){
            return false;
        }

        jqueryMap.$loginButton.hide()
        jqueryMap.$registerButton.hide();
        jqueryMap.$navProfile.show();
        jqueryMap.$navProfile.text( '... processing ...' );

        return false
    };

    onLogin = function ( event, login_user ) {

        // TODO :; find a better way to handle this
        jqueryMap.$logoutButton.show();
        jqueryMap.$navProfile.text(login_user.name);
    };

    onLogout = function ( event, logout_user ) {

        jqueryMap.$logoutButton.hide();
        jqueryMap.$navProfile.hide();
        jqueryMap.$loginButton.show()
        jqueryMap.$registerButton.show();
    };

    //-------------------- END EVENT HANDLERS --------------------

    //---------------------- BEGIN CALLBACKS ---------------------
    //----------------------- END CALLBACKS ----------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    initModule = function ( $container ) {
        // load HTML and map jQuery collections
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJqueryMap();

        // TODO :: add check to see if user is logged in on the session + remove nodes
        // set logged out nav menu
        jqueryMap.$logoutButton.hide();
        jqueryMap.$navProfile.hide();

        setFakeNews();

        // note : gevent is from plugin - https://github.com/mmikowski/jquery.event.gevent
        $.gevent.subscribe( $container, 'network-login',  onLogin  );
        $.gevent.subscribe( $container, 'network-logout', onLogout );

        // note : utap is from plugin - https://github.com/mmikowski/jquery.event.ue
        // ** utap not working - changed to click
        jqueryMap.$logoutButton
            .on("click", function(){network.model.people.logout()} );

        jqueryMap.$loginButton
            .on("click", processLogin);

        jqueryMap.$registerButton
            .on("click", processRegister );

    };
    // End PUBLIC method /initModule/

    return { initModule : initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());