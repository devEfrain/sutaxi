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
        set_lang();

        // inicializamos
        // get_location();
        set_mnu();
        mod_main();
        // mod_map();
    } );

    // obtenemos las tarifas
    _$.ajax( "assets/modules/json/rates.json", function( data ){
        engine.rates = JSON.parse( data );
    } );

    // obtenemos las configuraciones
    _$.ajax( "assets/modules/json/config.json", function( data ){
        engine.map.type = JSON.parse( data );
    } );

    // obtenemos el geojson de las zonas
    _$.ajax( "assets/modules/json/zones.json", function( data ){
        engine.map.zones = JSON.parse( data );
    } );

    // regresamos al modulo main
    engine.home.child().event( "click", function(){
        this.parent().css( "visibility", "hidden" );
        mod_main();
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

// modulo inicial
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

function set_module( item ){
    switch( item ){
        case "0":
            mod_info();
        break;
        case "1":
            get_location();
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

// modulo de informacion
function mod_info(){
    "use strict";
    var wrap_info = _$( "#wrap-info" );
    var box,
        span,
        div_num,
        div_des;

    // iteramos y creamos las zonas
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
    // si el navegador soporta la geolocalización
    if ( navigator.geolocation ) {
        // obtenemos la ubicación del usuario
        navigator.geolocation.getCurrentPosition( function( location ){
            engine.map.coords = {
                "lat": location.coords.latitude,
                "long": location.coords.longitude
            };
            engine.timerlocation = setInterval( function(){
                if( engine.map.coords.lat ){
                    clearInterval( engine.timerlocation );
                    mod_map();
                }
                // console.log( engine.map.coords )
            }, 500 )
        }, function( err ){
            switch( err.code ) {
                // El usuario denegó el permiso para la Geolocalización.
                case err.PERMISSION_DENIED:
                    // establecemos una ubicación predeterminada
                    engine.map.coords = {
                        "lat": 20.629939,
                        "long": -87.0753903
                    }
                break;
                case err.POSITION_UNAVAILABLE:
                    // La ubicación no está disponible.
                break;
                case err.TIMEOUT:
                    // Se ha excedido el tiempo para obtener la ubicación.
                break;
                case err.UNKNOWN_ERROR:
                    // Un error desconocido.
                break;
            }
        }, {
            enableHighAccuracy: true, // Alta precisión
		    maximumAge: 0, // No queremos caché
        })
    }
};

function watch_location( watch ){
    if( !watch ){
        if( navigator.geolocation ){
            navigator.geolocation.clearWatch( engine.coords );
        }
    } else {
        // si el navegador soporta la geolocalización
        if ( navigator.geolocation ) {
            // obtenemos la ubicación del usuario
            engine.coords = navigator.geolocation.watchPosition( function( location ){
                engine.map.coords = {
                    "lat": location.coords.latitude,
                    "long": location.coords.longitude
                };
                try{
                    engine.map.container.setView([engine.map.coords.lat, engine.map.coords.long])
                }catch(e){}
            }, function( err ){
                switch( err.code ) {
                    // El usuario denegó el permiso para la Geolocalización.
                    case err.PERMISSION_DENIED:
                        // establecemos una ubicación predeterminada
                        engine.map.coords = {
                            "lat": 20.629939,
                            "long": -87.0753903
                        }
                    break;
                    case err.POSITION_UNAVAILABLE:
                        // La ubicación no está disponible.
                    break;
                    case err.TIMEOUT:
                        // Se ha excedido el tiempo para obtener la ubicación.
                    break;
                    case err.UNKNOWN_ERROR:
                        // Un error desconocido.
                    break;
                }
            }, {
                enableHighAccuracy: true, // Alta precisión
                maximumAge: 0, // No queremos caché
            })
        }
    }
};

function mod_map(){
    var select_origin = _$( "#origin" ),
        select_destiny = _$( "#destiny" ),
        btn_origin = _$( "#btn-origin" ),
        wrap_map = _$( "#wrap-map"),
        controls = _$( "#selection, #buttons" ),
        option,
        cfg = {};

    // validamos si mostrar límite de zonas o no
    if( localStorage.getItem( "show_limits" ) ){
        cfg.showLimits = 1;
    } else {
        cfg.showLimits = 0;
    }
    // validamos si mostrar el área de las zonas o no
    if( localStorage.getItem( "show_area" ) ){
        cfg.showArea = "";
    } else {
        cfg.showArea = "transparent";
    }
    // validamos el mapa proporciona auto rate o no
    if( localStorage.getItem( "auto_rate" ) ){
        watch_location( true );
    }

    
    // establecemos el idioma seleccionado
    wrap_map.data( {
        origin: engine.lang.map[ 0 ],
        select: engine.lang.map[ 2 ],
        destination: engine.lang.map[ 1 ]
    } );

    // llenamos con informacion los select
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
        // verificamos si el picker se encuentra en alguna zona
        var layer = engine.map.container.getLayerAt(
            parseInt(engine.appModule.context.getBoundingClientRect().width / 2) , 
            parseInt(engine.appModule.context.getBoundingClientRect().height / 2) + 42
        );

        // si el picker se encuentra en alguna zona obtenemos el numero de zona
        // y pasamos el atributo al select origin
        if( layer !== undefined ) {
            select_origin.attr( "value", layer.options.index );
        }
    } );

    // obtenemos el mapa
    engine.map.container =  L.map( 'map', {
        // preferCanvas: true,
        // renderer: L.canvas(),
        renderer: L.svg(),
        center: [ engine.map.coords.lat, engine.map.coords.long ],
        zoom: 19,
        enableHighAccuracy: true,
        // minZoom: 12,
        // maxZoom: 18,
        zoomControl: false,
        attributionControl: true
        // rotate: true,
        // touchRotate: true,
        // rotateControl: {
        //     closeOnZeroBearing: false
        // },
        // bearing: 0,
    } );

    // _$( ".leaflet-control-rotate" ).css( "display", "none" );
    
    // add tile layers carto light
    L.tileLayer( engine.map.type.light, {} ).addTo( engine.map.container );
    // add scale control
    // L.control.scale().addTo( engine.map.container );

    // Inyect DriverMe Copyright
    _$( '.leaflet-control-attribution' )
    .addClass( 'unselectable' ) 
    .css( "font-size", "10px" )
    .html( '&copy; 2022<a href="" class="attribution-dm"> DriverMe</a>' );
    
    var coords = [],
        zones;

        for( var i = 0; i < engine.map.zones.length; i++ ){
                zones = new L.Polygon( [
                engine.map.zones[ i ].coordinates
            ], {
                // color: "#73d3cb",
                fillColor: cfg.showArea,
                weight: cfg.showLimits,
                index: engine.map.zones[ i ].index,
                name: engine.rates.city[ i + 1 ]
            } ).on("click", function( e ){
                try{
                    this.bindPopup( e.target.options.name.description ).openPopup();
                }catch(e){}
                console.log(this)
            }).addTo( engine.map.container );
        }


        // https://ajaxhispano.com/ask/como-puedo-determinar-si-un-punto-2d-esta-dentro-de-un-poligono-2320/
        // posible solucion para intersectar poligonos

        
    
    // engine.map.container.on( "click", function( e ){
    //     var pos = e.latlng;
    //     coords.push([pos.lat, pos.lng]);

    //     try{
    //         engine.map.container.removeLayer(polygon);
    //     } catch(e){}
    //     polygon = L.polygon([
    //         coords
    //     ], {
    //         // color: "#73d3cb",
    //         // fillColor: "red",
    //         weight: 0.3
    //     }).addTo(engine.map.container);

    // })

    engine.map.container.on( "mousedown", function(){
        engine.map_clicked = true;
    } );

    engine.map.container.on( "mouseup", function(){
        engine.map_clicked = false;
    } );

    engine.map.container.on( "move", function(){
        // validamos si los controles se ocultan o no al mover el mapa
        if( localStorage.getItem( "hide_controls" ) && engine.map_clicked ){
            controls.each( function( index ){
                index.css( "opacity", "0" )
            })
        }
    } );

    engine.map.container.on( "moveend", function(){

        var layer = this.getLayerAt(
            parseInt(engine.appModule.context.getBoundingClientRect().width / 2) , 
            parseInt(engine.appModule.context.getBoundingClientRect().height / 2) + 42
        );
        
        if( layer !== undefined ){
            select_destiny.attr( "value", layer.options.index );
            try{
                btn_origin.html(
                    "$ " +
                    engine.rates.city[ select_destiny.attr( "value" ) ].tari[
                        Number( select_origin.attr( "value" ) ) - 1
                    ] +
                    ".00 Mxn."
                );
            } catch ( e ) {}
        }

         // validamos si los controles se ocultan o no al mover el mapa
         if( localStorage.getItem( "hide_controls" ) ){
            controls.each( function( index ){
                index.css( "opacity", "1" )
            })
        }

    } )

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
    var chk_show_limits = _$( ".show-limits" ),
        chk_show_area = _$( ".show-area" ),
        chk_auto_rate = _$( ".auto-rate" )
        chk_hide_controls = _$( ".hide-controls" ),
        chk_change_lang = _$( ".change-lang" ),
        texts = _$( ".check-container > .check-control > .check-caption");

    var idx = 0;
    texts.each( function( index ){
        index.data({cfg: engine.lang.config[ idx ]});
        idx++;
    } );

    // obtenemos el status de show_limits para configurar el check
    if( localStorage.getItem( "show_limits") ){
        chk_show_limits.attr( "checked", localStorage.getItem( "show_limits") );
    }
    chk_show_limits.event( "click", function(){
        if( this.attr( "checked" ) ) {
            localStorage.removeItem( "show_limits" );
        } else {
            localStorage.setItem( "show_limits", true );
        }
        
    } );

    // obtenemos el status de show_area para configurar el check
    if( localStorage.getItem( "show_area") ){
        chk_show_area.attr( "checked", localStorage.getItem( "show_area") );
    }
    chk_show_area.event( "click", function(){
        if( this.attr( "checked" ) ) {
            localStorage.removeItem( "show_area" );
        } else {
            localStorage.setItem( "show_area", true );
        }
        
    } );

    // obtenemos el status de auto_rate para configurar el check
    if( localStorage.getItem( "auto_rate") ){
        chk_auto_rate.attr( "checked", localStorage.getItem( "auto_rate") );
    }
    chk_auto_rate.event( "click", function(){
        if( localStorage.getItem( "auto_rate" ) ) {
            watch_location( false );
            localStorage.removeItem( "auto_rate" );
        } else {
            localStorage.setItem( "auto_rate", true );
        }
    } );

    // obtenemos el status de hide_controls para configurar el check
    if( localStorage.getItem( "hide_controls") ){
        chk_hide_controls.attr( "checked", localStorage.getItem( "hide_controls") );
    }
    chk_hide_controls.event( "click", function(){
        if( this.attr( "checked" ) ) {
            localStorage.removeItem( "hide_controls" );
        } else {
            localStorage.setItem( "hide_controls", true );
        }
        
    } );

    // obtenemos el status de change_lang para configurar el check
    if( localStorage.getItem( "change_lang") ){
        chk_change_lang.attr( "checked", localStorage.getItem( "change_lang") );
    }
    chk_change_lang.event( "click", function(){
        
        if( this.context.checked ) {
            localStorage.setItem( "app-lang", "en" );
            localStorage.setItem( "change_lang", true );
        } else {
            localStorage.setItem( "app-lang", "es" );
            localStorage.removeItem( "change_lang" );
        }

        set_lang();
        
        idx = 0;
        texts.each( function( index ){
            index.data({cfg: engine.lang.config[ idx ]});
            idx++;
        } );

        set_mnu();
        
    } );
    
};

function set_lang(){
    if( !localStorage.getItem( "app-lang" ) ) {
        localStorage.setItem( "app-lang", "es" );
        engine.lang = engine.language.es;
    } else {
        if( localStorage.getItem( "app-lang" ) == "es" ){
            engine.lang = engine.language.es;
        } else if( localStorage.getItem( "app-lang" ) == "en" ){
            engine.lang = engine.language.en;
        }
    }
};