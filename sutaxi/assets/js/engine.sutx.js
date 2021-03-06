var engine = {
    language: {},
    lang: {},
    mnu: undefined,
    appModule: undefined,
    rates: undefined,
    map: {
        coords: {}
    },
};

window.addEventListener( "load", function(){

    engine.appModule = _$( "#app-module" );
    engine.home = _$( "#app-header" );
    engine.headerTitle = _$( "#app-header > #title" );

    // obtenemos el lenguaje
    _$.ajax( "assets/modules/json/lang.json", function( data ) {
        engine.language = JSON.parse( data );
        if( !localStorage.getItem( "app-lang" ) || localStorage.getItem( "app-lang" ) == "es" ) {
            localStorage.setItem( "app-lang", "es" );
            engine.lang = engine.language.es;
        } else {
            engine.lang = engine.language.en;
        }

        // inicializamos
        get_location();
        set_mnu();
        mod_main();
        // mod_map();
    } );

    // obtenemos las tarifas
    _$.ajax( "assets/modules/json/rates.json", function( data ){
        engine.rates = JSON.parse( data );
    } );

    engine.home.child().event( "click", function(){
        this.parent().css( "visibility", "hidden" );
        mod_main();
    } );

    // obtenemos las configuraciones
    _$.ajax( "assets/modules/json/config.json", function( data ){
        engine.map.type = JSON.parse( data );
    } );

    // obtenemos las zonas

    _$.ajax( "assets/modules/json/zones.json", function( data ){
        engine.map.zones = JSON.parse( data );
    } );
} );

function set_mnu() {
    "use strict";
    engine.mnu = _$( ".mnu-box > .icon, .mnu-box > .title" );
    engine.lnk = _$( "a" );
    var icons = {
        length: 0,
        url: "assets/src/svg/",
        ext: ".svg",
        icon: [
            "info",
            "city",
            "hotel",
            "services",
            "config"
        ],
    };

    engine.mnu.each( function( index ) {
        if( this.className !== "title" ) {
            _$.ajax(icons.url + icons.icon[ icons.length ] + icons.ext, function(  data ) {
                index.html( data );
            } );
            icons.length++;
        } else {
            index.html( engine.lang.mnu[ icons.length - 1 ] );
        }
    } );

    engine.lnk.each( function( index ){
        index.event( "click", function( e ){
            e.preventDefault();
            for( var x = 0; x < engine.lnk.context.length; x++ ){
                _$( engine.lnk.context[ x ] ).child().child().child().child().css( "fill", "rgb( 80, 80, 80)");
            }
            this.child().child().child().child().css( "fill", "rgb(127, 196, 191)" );
            var item = this.attr( "data-n" );
            engine.home.css( "visibility", "visible" );
            engine.headerTitle.html( engine.lang.mnu[ this.attr( "data-n" ) ] );
            _$.ajax( this.attr( "href" ), function( data ){
                engine.appModule.html( data );
                set_module( item );
            } );
        } );
    } );
};

function mod_main(){
    "use strict";
    _$.ajax( "assets/modules/static/main.html", function( data ) {
        engine.appModule.html( data );
        _$( "#wrap-main" ).data( {
            wrapMain: engine.lang.main.title,
            call: engine.lang.main.btnCall
        } );
    } );
};

// function mod_map(){

// };

function set_module( item ){
    switch( item ){
        case "0":
            mod_info();
        break;
        case "1":
            mod_map();
        break;
        case "2":
            mod_hotel();
        break;
        case "3":
            mod_services();
        break;
        case "4":
            mod_config();
        break;
    }
};

function mod_info(){
    "use strict";
    var wrap_info = _$( "#wrap-info" );
    var box,
        span,
        div_num,
        div_des;

    for( var i = 0; i < 36; i++ ){
        box = document.createElement( "div" );
        span = document.createElement( "span" );
        div_num = document.createElement( "div" );
        div_num.className = "centerX centerY";
        div_des = document.createElement( "div" );
        div_des.className = "centerY";
        box.id = "box";
        div_num.innerHTML = ( i + 1 );
        div_des.innerHTML = engine.rates.city[ i + 1 ].description;
        box.appendChild( span );
        box.appendChild( div_num );
        box.appendChild( div_des );

        wrap_info.context.appendChild( box );
    }
};

function get_location(){
    // engine.map.coords = {};
    // si el navegador soporta la geolocalizaci??n
    if ( navigator.geolocation ) {
        // obtenemos la ubicaci??n del usuario
        navigator.geolocation.getCurrentPosition( function( location ){
            engine.map.coords = {
                "lat": location.coords.latitude,
                "long": location.coords.longitude
            };
            console.log("coords ready!!");
        }, function( err ){
            switch( err.code ) {
                // El usuario deneg?? el permiso para la Geolocalizaci??n.
                case err.PERMISSION_DENIED:
                    // establecemos una ubicaci??n predeterminada
                    engine.map.coords = {
                        "lat": 20.629939,
                        "long": -87.0753903
                    }
                break;
                case err.POSITION_UNAVAILABLE:
                    // La ubicaci??n no est?? disponible.
                break;
                case err.TIMEOUT:
                    // Se ha excedido el tiempo para obtener la ubicaci??n.
                break;
                case err.UNKNOWN_ERROR:
                    // Un error desconocido.
                break;
            }
        })
    }
};

function mod_map(){
    var select_origin = _$( "#origin" ),
        select_destiny = _$( "#destiny" ),
        btn_origin = _$( "#btn-origin" ),
        wrap_map = _$( "#wrap-map"),
        option;

    wrap_map.data( {
        origin: engine.lang.map[ 0 ],
        select: engine.lang.map[ 2 ],
        destination: engine.lang.map[ 1 ]
    } );

    for( var i = 0; i < 36; i++ ){
        option = document.createElement( "option" );
        option.setAttribute( "value", ( i + 1 ) );
        option.innerHTML = ( i + 1 ) + ": " + engine.rates.city[ i + 1 ].title;
        select_origin.context.appendChild( option );
    }
    select_destiny.context.innerHTML = select_origin.context.innerHTML;

    select_origin.event( "change", function(){
        if( select_destiny.attr( "value" ) !== "0" ) {
            btn_origin.html(
                "$ " +
                engine.rates.city[ select_origin.attr( "value" ) ].tari[
                    Number( select_destiny.attr( "value" ) ) - 1
                ] +
                ".00 Mxn."
            );
        }
    } );

    select_destiny.event( "change", function(){
        if( select_origin.attr( "value" ) !== "0" ) {
            btn_origin.html(
                "$ " +
                engine.rates.city[ select_destiny.attr( "value" ) ].tari[
                    Number( select_origin.attr( "value" ) ) - 1
                ] +
                ".00 Mxn."
            );
        }
    } );

    btn_origin.html( "$ 0.00 Mxn" ).event( "click", function(){

    } );

    // obtenemos el mapa
    engine.map.container =  L.map( 'map', {
        preferCanvas: true,
        renderer: L.canvas(),
        center: [ engine.map.coords.lat, engine.map.coords.long ],
        zoom: 18,
        // minZoom: 12,
        // maxZoom: 18,
        zoomControl: false,
        attributionControl: true,
        rotate: true,
        touchRotate: true,
        rotateControl: {
            closeOnZeroBearing: false
        },
        bearing: 0,
    } );

    _$( ".leaflet-control-rotate" ).css( "display", "none" );
    
    // add tile layers carto light
    L.tileLayer( engine.map.type.light, {} ).addTo( engine.map.container );
    // add scale control
    // L.control.scale().addTo( engine.map );

    // Inyect DriverMe Copyright
    _$( '.leaflet-control-attribution' )
    .html( "" )
    .addClass( 'unselectable' ) 
    .css( "font-size", "10px" )
    .html( '&copy; 2022<a href="" class="attribution-dm"> DriverMe</a>' );
    
    var coords = [],
        polygon;

        var zones = L.polygon([
            engine.map.zones
        ], {
            // color: "#73d3cb",
            // fillColor: "transparent",
            weight: 0.3
            // opacity: 0,
        }).addTo(engine.map.container);
    
    engine.map.container.on( "click", function( e ){
        var pos = e.latlng;
        coords.push([pos.lat, pos.lng]);

        try{
            engine.map.container.removeLayer(polygon);
        } catch(e){}
        polygon = L.polygon([
            coords
        ], {
            // color: "#73d3cb",
            // fillColor: "red",
            weight: 0.3
        }).addTo(engine.map.container);

    })

    engine.map.container.on( "contextmenu", function( e ){
        try{
            engine.map.container.removeLayer(polygon);
        }catch(e){}
        coords.pop();
        polygon = L.polygon([
            coords
        ], { weight: 0.3}, ).addTo(engine.map.container);
    });

    _$("#btn-origin").event("click", function(){
        var coordinates = "";
        for(var i = 0; i < coords.length; i++){
            coordinates += "[" + coords[i] + "],"
        }

        console.log(coordinates);
    });
};

function mod_hotel(){
    var wrap_hotel = _$( "#wrap-hotel" ),
        origin = _$( "#origin-h" ),
        destiny = _$( "#destiny-h"),
        money = _$( "#money" ),
        zone,
        options;

    wrap_hotel.data( {
        origin: engine.lang.hotel[ 0 ],
        destination: engine.lang.hotel[ 1 ],
        select: engine.lang.hotel[ 2 ],
        center: engine.lang.hotel[ 3 ],
        south: engine.lang.hotel[ 4 ],
        north: engine.lang.hotel[ 5 ],
        options: engine.lang.hotel[ 6 ]
    } );

    origin.event( "change", function(){
        if( this.attr( "value" ) !== "0" ) {
            zone = engine.rates.hotel[ this.attr( "value" ) ];
            destiny.html( "<option value = '0'>" + engine.lang.hotel[ 2 ] + "</option>")
            for( var hotels in zone ){
                options = document.createElement( "option" );
                options.value = hotels;
                options.innerText = zone[ hotels ][ 0 ]
                destiny.context.appendChild( options );
            }
        } else {
            destiny.html( "<option value = '0'>" + engine.lang.hotel[ 2 ] + "</option>")
        }
    } );

    destiny.event( "change", function() {
        money.html(
            "$ " +
            engine.rates.hotel[ origin.attr( "value" ) ][ this.attr( "value" ) ][ 1 ] +
            ".00"
        );
    } );
}

function mod_services(){
    var cards = _$( ".card" ),
        item = 1;

    cards.each( function( index ){
        index.data( {
            title: engine.lang.services[ item ].title,
            trip: engine.lang.services[ item ].trip,
            time: engine.lang.services[ item ].time,
            people: engine.lang.services[ item ].people,
            price: engine.lang.services[ item ].price
        } );
        item++;
    } );
};

function mod_config(){
    var idx = 0;
    _$( ".check-container > .check-control > .check-caption").each( function( index ){
        index.data({cfg: engine.lang.config[ idx ]});
        idx++;
    } );
};