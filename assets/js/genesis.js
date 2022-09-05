/*---------------------------------------------------------------------------------------------------------------------
* LEGAL NOTICE 			   	: This library or document was created for the Acces and Control to web pages.
* AUTHOR					: Hugo Efrain Euan Catzin
* DATE		  			   	: 14 / 11 / 2021
* JAVA SCRIPT DOCUMENT NAME : genesis.js
* BUILD				   	   	: v 1.2.3
* NOTES					   	: LAST VERSION DON'T REQUIRED JQUERY LIBRARY
						   	  ORIGINAL SOURCE
							 
							   			"Universe Design | Yearning For Perfection"
----------------------------------------------------------------------------------------------------------------------*/

( function( window, undefined ){
	var document = window.document; // uso correcto de document
	var _root = {};
    var genesis = ( function(){   
        
        var genesis = function( selector ){
			// creamos un nuevo objeto genesis
            return new genesis.fn.init( selector );
        },
		requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
								window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		// igualamos el contexto requestAnimationFrame
		window.requestAnimationFrame = requestAnimationFrame;
		
		genesis.fn = genesis.prototype = {
			init: function( selector ) {
				// verificamos si existe un selector
				if( ( selector !== undefined ) && ( selector !== null ) ) {
					// validamos si el tipo de selector es un string
					if ( typeof selector == "string" ) {
						// verificamos que el selector sea válido
						// _root.validateSelector = selector.substring( 0, selector.length - 1 );
						_root.validateSelector = selector.substring( 0, selector.length );
						if ( _root.validateSelector.length > 0 ) {
							this.context = document.querySelectorAll(selector);
							if ( this.context.length > 0 ) {
								if ( this.context.length === 1 ) {
									this.context = this.context[0];
								}
							}
						} else {
							genesisExeption( 002 ); // el selector no es valido para _$()
						}
					} else if ( selector.nodeType ) { // si el selector es nodeType
						this.context = selector;
					}
				} else {
					genesisExeption( 001 ); // no existe un selector para _$();
				}

				// return genesis.fn.clone(genesis);
				return this;
			}
		};

		genesis.fn.init.prototype = genesis.fn;

		genesis.extend = genesis.fn.extend = function(){
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

				// console.log(target)

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;
				target = arguments[ 1 ] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !genesis.isFunction( target ) ) {
				target = {};
			}

			// extend genesis itself if only one argument is passed
			if ( length === i ) {
				target = this;
				--i;
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) != null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( genesis.isPlainObject( copy ) || ( copyIsArray = genesis.isArray( copy ) ) ) ) {
							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && genesis.isArray( src ) ? src : [];

							} else {
								clone = src && genesis.isPlainObject( src ) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = genesis.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		}

		return genesis;
	} )();

	// genesis credentials
	genesis.build = {
		title: '..:: G E N E S I S ::..',
		name: 'genesis.js',
		version: '1.2.3',
		author: 'Universe Design'
	}

	// 
	genesis.extend( {
		screen: function() {
			var screen;
			if( typeof window.innerWidth != 'undefined' ) {
				sizeWindow = [ window.innerWidth, window.innerHeight ];
			} else if ( typeof document.documentElement != 'undefined' && 
						typeof document.documentElement.clientWidth != 'undefined' && 
						document.documentElement.clientWidth != 0 ) {

				sizeWindow = [ document.documentElement.clientWidth, document.documentElement.clientHeight ];

			} else {
				sizeWindow = [ document.getElementsByTagName( 'body' ) [ 0 ].clientWidth, document.getElementsByTagName( 'body' ) [ 0 ].clientHeight ];
			}
			screen = {
				width: sizeWindow[ 0 ],
				height: sizeWindow[ 1 ]
			}
			return screen;
		},

		device: function( device ) {
			var agent = navigator.userAgent;
			var iOS = (/iPad|iPhone|iPod/.test( agent ) && !window.MSStream );
			var android = (/android/i.test( agent ) );
			var webOS = (/webOS/i.test( agent ) );

			if( !device ) {
				device = 'device';
			}

			switch( device.toLowerCase() ) {
				case 'ios':
					if(iOS){
						return true;
					}else{
						return false;
					}
				break;
				case 'android':
					if( android ) {
						return true;
					} else {
						return false;
					}
				break;
				case 'webos':
					if( webOS ) {
						return true;
					} else {
						return false;
					}
				break;
				default:
					if( iOS || android || webOS ) {
						return true;
					} else {
						return false;
					}
				break;
			}
		},

		b64: {
			enc: function( str ) {
				return window.btoa( unescape( encodeURIComponent( str ) ) );
			},

			dec: function( str ) {
				return decodeURIComponent( escape( window.atob( str ) ) );
			}
		},

		cssArgs: function( args, val ) {
			var _private = {};
			_private.values = [];
			
			if( _root.cssArgs == undefined ) {
				_root.cssArgs = document.querySelector( ':root' );
			}

			if( ( typeof( args ) !== 'object' ) && ( val !== undefined ) ) {
				_root.cssArgs.style.setProperty( args, val );
			} else if( typeof( args ) == 'object' ) {
				// obtenemos la cadena JSON
				_private.json = JSON.stringify( args );
				// eliminamos los corchetes de la cadena JSON
				_private.strJson = _private.json.substring( 1, _private.json.length - 1 );
				// separamos los grupos -> "attr:value" 
				_private.jsonHash = _private.strJson.split( ',' );
				// iteramos para separar la propiedad del valor 
				for( var i = 0; i < _private.jsonHash.length; i++ ){
					_private.values = _private.jsonHash[ i ].split( ':' );
					// el resultado obtenido es -> "propiedad" "valor", utilizamos substring para eliminar las comillas
					_root.cssArgs.style.setProperty( _private.values[ 0 ].substring( 1, _private.values[ 0 ].length - 1 ), _private.values[ 1 ].substring( 1, _private.values[ 1 ].length - 1 ) )
				}
			} else {
				var cssComputed = getComputedStyle( _root.cssArgs );
				return cssComputed.getPropertyValue( args );
			}
		},
	} );

	// módulos para trabajar con pripiedades HTML
	genesis.fn.extend( {
		html: function( str ) {
			if( ( str !== undefined ) && ( str !== null ) ) {
				this.context.innerHTML = str;
			} else {
				return this.context.innerHTML;	
			}
			return this;
		},

		before: function( el ) {
			if( typeof el == "string" ){
				var elPar = document.createElement("div");
				elPar.innerHTML = el;
				for( var i = 0; i < elPar.childNodes.length; i++ ) {
					if( elPar.childNodes[ i ].tagName ) {
						this.context.appendChild( elPar.childNodes[ i ] );
					}
				}
			} else if ( typeof el == "object" ) {
				this.context.appendChild( el );
			}
		},

		css: function( options, ref ) {
			var _private = {};
			_private.values = [];

			if( ( typeof( options ) !== 'object' ) && ( ( ref !== undefined ) && ( ref !== null ) ) ) {
				this.context.style[options] = ref;
			} else if ( ( typeof( options ) === 'object' ) ) {
				// obtenemos la cadena JSON
				_private.json = JSON.stringify( options );
				// eliminamos los corchetes de la cadena JSON
				_private.strJson = _private.json.substring( 1, _private.json.length - 1 );
				// separamos los grupos -> "attr:value" 
				_private.jsonHash = _private.strJson.split( ',' );
				// iteramos para separar la propiedad del valor 
				for( var i = 0; i < _private.jsonHash.length; i++ ){
					_private.values = _private.jsonHash[ i ].split( ':' );
					// el resultado obtenido es -> "propiedad" "valor", utilizamos substring para eliminar las comillas
					this.context.style[ _private.values[ 0 ].substring( 1, _private.values[ 0 ].length - 1 ) ] = _private.values[ 1 ].substring( 1, _private.values[ 1 ].length - 1 );
				}
			}else{
				return this.context.style[options];
			}
			return this;
		},

		attr: function( attr, value ) {
			if( value !== undefined ) {
				if( attr == 'value' ) {
					this.context.value = value;
				} else {
					this.context.setAttribute( attr, value );
				}
			} else {
				if( attr == 'value' ) {
					return this.context.value;
				} else {
					return this.context.getAttribute( attr );
				}
			}
		},

		removeAttr: function(attr){
			this.context.removeAttribute(attr);
			return this;
		},

		addClass: function( className, callback ) {
			if( this.context.className.indexOf(className) === -1 ){
				if( !this.context.className ) {
					this.context.className = className;
				} else {
					this.context.className += ' ' + className;
				}
			}
			if( ( callback !== undefined ) && ( callback !== null ) && ( genesis.isFunction( callback ) ) ) {
				callback();	
			}
			return this;
		},

		removeClass: function( className, callback ) {
			var _private = {};
			if( this.context.className.indexOf( className ) > -1 ) {
			// 	_private.expression = new RegExp('(\\s|^)' + className + '(\\s|$)');
			// 	this.context.className = this.context.className.replace( _private.expression, "" );
				this.context.classList.remove( className );
			}
			if( ( callback !== undefined ) && ( callback !== null ) &&  ( genesis.isFunction( callback ) ) ) {
				callback();	
			}
			return this;
		},

		data: function( options ) {
			for( var element in options) {
				genesis.searchFor( this.context, element, options[ element ] );
			}
			return this;
		}

	});

	genesis.extend( {
		searchFor: function( element, search, replace ) {
			if( element ) {
				// verificamos si el nodo padre contiene hijos
				if ( element.childElementCount > 0 && !element.getAttribute( 'g-name' ) ) {
					// iteramos sobre el numero de hijos
					for( var i = 0; i < element.childNodes.length; i++ ) {
						// verificamos que es un hijo válido y que no es input
						if( ( element.childNodes[ i ].tagName ) && ( element.childNodes[ i ].tagName !== 'INPUT' ) ) {
							// validamos si el nodo tiene hijos
							if( element.childNodes[ i ].childElementCount > 0 ) {
								// si tiene hijos buscamos dentro del nodo
								genesis.searchFor( element.childNodes[ i ], search, replace );
							} else { // si no tiene hijos
								// verificamos si contiene el atributo g-name
								if( element.childNodes[ i ].getAttribute( 'g-name' ) ) {
									// verificamos si el atributo g-name es igual a la busqueda
									if ( element.childNodes[ i ].getAttribute( 'g-name' ).replace( / /g, "" ) == '{{' + search + '}}' ) {
										// insertamos el valor
										element.childNodes[ i ].innerHTML = replace;
									}
									// si no contiene el atributo g-name buscamos por el contenido
								} else if ( ( element.childNodes[ i ].textContent.replace( / /g, "" ) == '{{' + search + '}}' ) ) {
									// si el contenido fue igual a la busqueda agregamos el valor
									element.childNodes[ i ].innerHTML = replace;
									element.childNodes[ i ].setAttribute( 'g-name', '{{ ' + search + ' }}' );
								}
							}
						} else { // si es input
							// validamos que es un hijo válido
							if( element.childNodes[ i ].tagName && element.childNodes[ i ].getAttribute( 'g-name' ) ) {
								// obtenemos el atributo g-name y si este es acorde a la busqueda
								if( ( element.childNodes[ i ].getAttribute( 'g-name' ).replace( / /g, "" ) == '{{' + search + '}}' ) ) {
									// añadimos el valor
									element.childNodes[ i ].value = replace;
								}
							}
						}
					}
				} else { // si el nodo padre no contiene hijos
					// verificamos que es un hijo válido y que no es input
					if ( ( element.tagName ) && ( element.tagName !== 'INPUT' ) ) {
						// validamos si el elemento contiene el atributo g-name
						if( element.getAttribute( 'g-name' ) ) {
							// si el elemento contiene la busqueda, la reemplazamos
							if ( element.getAttribute( 'g-name' ).replace( / /g, "" ) == '{{' + search + '}}' ) {
								element.innerHTML = replace;
							}
							// si no contiene g-name buscamos sobre el contenido
						} else if ( element.textContent.replace(/ /g, "") == '{{' + search + '}}' ) {
							element.innerHTML = replace;
							element.setAttribute( 'g-name', '{{ ' + search + ' }}' );
						}
					} else { // si es input
						if( element.tagName && element.getAttribute( 'g-name' ) ) {
							if ( ( element.getAttribute( 'g-name' ).replace( / /g, "" ) == '{{' + search + '}}') ) {
								element.value = replace;
							}
						}
					}
				}
			} else {
				genesisExeption( 005 );
			}
		}
	} )

	// módulo de eventos
	genesis.fn.extend( {

		event: function( listener, fn, options ) {
			var ctx = this,
				listeners;

				if( !options ) {
					options = false;
				}

			if( ( typeof listener === 'string' ) && ( genesis.isFunction( fn ) ) ){
				if( listener.indexOf( ',' ) != -1 ) {
					listeners = listener.split( ',' );
					for( var i = 0; i < listeners.length; i++ ) {
						this.context.addEventListener( listeners[ i ].replace( / /g, "" ), function( e ) {
							fn.call( ctx, e );
						}, options );
					}
				} else {
					this.context.addEventListener( listener, function( e ) {
						fn.call( ctx, e );
					}, options );
				}
			} else {
				genesisExeption( 004 );
			}
			return this;
		},

		// live: function()

	} );

	// módulo para trabajar con los elementos del DOM

	genesis.fn.extend( {
		drag: function( options ) {
			if( !options ) {
				options = {};
			}
			var _private = {
				element: this.context,
				pointer: {
					x: undefined,
					y: undefined,
					_x: undefined,
					_y: undefined
				},
				options: {
					cursor: options.cursor || 'default',
					orientation: options.orientation || '',
					index: options.index,
					selectable: options.selectable,
					click: options.click || undefined,
					onDrag: options.onDrag || undefined,
					callback: options.callback || undefined
				},
				listeners: {},
				isdevice: false,
				deep: genesis( this.context )
			};
			if( !_root.drag ) {
				_root.drag = {
					index: 100	
				};
			};

			_private.element.style.cursor = _private.options.cursor;
			_private.element.style.position = 'absolute';
			_private.element.style.margin = '0px';

			// validamos si es un dispositivo movil o un pc para habilitar los listeners según sea el caso
			if( genesis.device() ) {
				_private.isdevice = true;
				_private.listeners = {
					mousedown: 'touchstart',
					mouseup: 'touchend',
					mousemove: 'touchmove'
				}
			} else {
				_private.listeners = {
					mousedown: 'mousedown',
					mouseup: 'mouseup',
					mousemove: 'mousemove'
				}
			}

			_private.element.addEventListener(_private.listeners.mousedown, function(e) {
				e = e || window.event;
				if( _private.isdevice || _private.options.selectable == false ) {
					e.preventDefault();
				}
				if( genesis.isFunction( _private.options.click ) ){
					_private.options.click.call( _private.deep );
				}
				if( _private.options.index ){
					_root.drag.index++;
					_private.element.style.zIndex = _root.drag.index;
				}
				/*obtiene la posición del cursor al inicio*/
				if( _private.isdevice ) {
					_private.pointer = {
						_x: e.touches[ 0 ].clientX,
						_y: e.touches[ 0 ].clientY
					}
				} else {
					_private.pointer = {
						_x: e.clientX,
						_y: e.clientY
					}
				}

				/*detenemos el drag al soltar el elemento*/
				document.addEventListener( _private.listeners.mouseup, stopDrag );
				/*ejecuta el procedimiento startDrag al mover el cursor*/
				document.addEventListener( _private.listeners.mousemove, startDrag );
			} );

			function startDrag(e) {
				e = e || window.event;
				/*calcula la nueva posición del cursor*/
				if( _private.isdevice ) {
					_private.pointer.x = _private.pointer._x - e.touches[ 0 ].clientX;
					_private.pointer.y = _private.pointer._y - e.touches[ 0 ].clientY;
					_private.pointer._x = e.touches[ 0 ].clientX;
					_private.pointer._y = e.touches[ 0 ].clientY;
				} else {
					_private.pointer.x = _private.pointer._x - e.clientX;
					_private.pointer.y = _private.pointer._y - e.clientY;
					_private.pointer._x = e.clientX;
					_private.pointer._y = e.clientY;
				}

				/*establece la nueva posición del elemento*/
				switch( _private.options.orientation.toLowerCase() ){
					case 'vertical':
							_private.element.style.top = ( _private.element.offsetTop - _private.pointer.y ) + "px";
					break;
					case 'horizontal':
							_private.element.style.left = ( _private.element.offsetLeft - _private.pointer.x ) + "px";
					break;
					default:
						_private.element.style.top = (_private.element.offsetTop - _private.pointer.y ) + "px";
						_private.element.style.left = ( _private.element.offsetLeft - _private.pointer.x ) + "px";
					break;
				}
				/*ejecuta función del usuario al realizar el drag*/
				if( genesis.isFunction( _private.options.onDrag ) ){
					_private.options.onDrag.call( _private.deep );
				}
			}

			function stopDrag(){
				  /*detiene el drag cuando el botón del mouse es suelto*/
				document.removeEventListener( _private.listeners.mouseup, stopDrag );
				document.removeEventListener( _private.listeners.mousemove, startDrag );
				// ejecutamos el callback
				if( genesis.isFunction( _private.options.callback ) ) {
					_private.options.callback.call( _private.deep );
			 	}
			};

			return this;

		}
	} );

	
	genesis.extend( {
		isFunction: function( obj ) {
			return typeof( obj ) === "function";
		},
	
		isArray: Array.isArray || function( obj ) {
			return genesis.type( obj ) === "array";
		},
	
		// A crude way of determining if an object is a window
		isWindow: function( obj ) {
			return obj && typeof obj === "object" && "setInterval" in obj;
		},
	
		isNaN: function( obj ) {
			return obj == null || !rdigit.test( obj ) || isNaN( obj );
		},
	
		type: function( obj ) {
			return obj == null ?
				String( obj ) :
				class2type[ toString.call(obj) ] || "object";
		},
	
		isPlainObject: function( obj ) {
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || genesis.type( obj ) !== "object" || obj.nodeType || genesis.isWindow( obj ) ) {
				return false;
			}
	
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call( obj, "constructor" ) &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
	
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
	
			var key;
			for ( key in obj ) {}
	
			return key === undefined || hasOwn.call( obj, key );
		}
	});

	genesis.fn.extend( {
		each: function( index ){
			if( this.context.length > 1 ) {
				for( var i = 0; i < this.context.length; i++ ) {
					index.call( this.context[ i ], genesis( this.context[ i ] ) );
				}
			} else {
				index.call( this.context, genesis( this.context ) );
			}
			return this;
		}
	} );

	/*sndPlaySound*/
	genesis.sndPlaySound = function( options ){
		if( !_root.sound ){
			_root.sound = []; /*contiene los id (tracks) */
			_root.sound.easy = false;
		}
		
		var _private = {}; /*contiene las propiedades que se utilizan en sndPlaySound*/
		
		
		/*Verificamos si options no es tipo objeto*/
		if( typeof options !== 'object' ){/*configuramos propiedades predeterminadas*/
			_private.sound = {
				'src':options, 'streaming':false, 'volume':0.5, 'stopMixers':true, 'loop':undefined, 'startIn':0, 
				'onLoad':undefined, 'onLoading': undefined, 'onPlay':undefined, 'onWaiting':undefined, 'afterWaiting':undefined, 
				'onError':undefined, 'timeUpdate':undefined, 'seek':undefined, 'soundWave':undefined, 
				'soundComplete':undefined, 'enabledHTML':true
			}; 
		} else {/* si options es tipo objeto configuramos las propiedades establecidas por el usuario*/
			/*validamos si alguna propiedad no está establecida y configurar el valor predeterminado.*/
			if( ( options.volume === undefined ) || ( options.volume === null ) || ( options.volume < 0 ) || ( options.volume > 1 ) ) {
				options.volume = 0.5;
			}
			if( ( options.stopMixers === undefined ) || ( options.stopMixers === null ) ) {
				options.stopMixers = false;
			}
			if( (options.startIn === undefined ) || ( options.startIn === null ) ) {
				options.startIn = 0;
			}
			if( ( options.enabledHTML === undefined) || ( options.enabledHTML === null ) ) {
				options.enabledHTML = true;
			}

			_private.sound = {
				'src':options.src, 'streaming':options.streaming, 'volume':options.volume, 'stopMixers':options.stopMixers, 'loop':options.loop, 
				'startIn':options.startIn, 'onLoad':options.onLoad, 'onLoading':options.onLoading, 'onPlay':options.onPlay, 
				'onWaiting':options.onWaiting, 'afterWaiting':options.afterWaiting, 'onError':options.onError, 
				'timeUpdate':options.timeUpdate, 'seek':options.seek, 'soundWave':options.soundWave, 'soundComplete':options.soundComplete,
				   'enabledHTML':options.enabledHTML
			};
		}

		/*Inizializamos el player a utilizar Flash o HTML5*/
		if( _private.sound.enabledHTML ){
			_private.fn = { /*creación y asignación de métodos */
				main: function() {
					/* verificamos si stopMixers es true */
					if( _private.sound.stopMixers ) {
						/*invocamos al método stopMixers*/
						if( genesis.sndPlaySound.stopMixers() ) {
							/*si stopMixers devuelve true*/
							this.init();
						}else{
							this.error();
						}
					} else {/*si el usuario no asigno stopMixers true*/
						this.init();
					}
				},
				init: function() {
					_private.sound.exist = false;
					/*verificamos que _root.sound contenga por lo menos un valor*/
					if( _root.sound.length > 0 ){
						/*iteramos en busca de la existencia del sonido*/
						for( var i = 0; i < _root.sound.length; i++ ) {
							if( _root.sound[ i ] === _private.sound.src ) {/*si el sonido existe */
								if( !_root.sound[ _root.sound [ i ] ].isPlay ) {
									/*habilitamos el procesamiento de soundWave si la función está definida*/
									if( typeof _private.sound.soundWave === 'function' ) {
										this.soundWave();
									}
									this.play( _private.sound.src, _private.sound.volume );
									_private.sound.exist = true;
									break;
								}
							}
						}
					/*}else{si _root.sound.length es 0 añadimos el primer elemento 
						this.addItem();*/
					}
					if( !_private.sound.exist ) {
						this.addItem();
					}
				},
				addItem: function() {
					//try{
						/*añadimos el elemento al array*/
						_root.sound.push( _private.sound.src );
						/*creamos el nuevo contexto de audio*/
						_root.sound[ _private.sound.src ] = new Audio();
						
						/*configuramos los parametros para la reproduccion*/
						_root.sound[ _private.sound.src ].isPlay = false;
						_root.sound[ _private.sound.src ].startIn = _private.sound.startIn;
						/*asignamos el source */
						_root.sound[ _private.sound.src ].src = _private.sound.src;
						if( navigator.appName == 'Netscape' ) {
							_root.sound[ _private.sound.src ].current = _private.sound.startIn;
						} else {
							_root.sound[ _private.sound.src ].currentTime = _private.sound.startIn;
						}
						_root.sound[ _private.sound.src ].volume = _private.sound.volume;

						/*Listeners...*/

						/*onLoad: al iniciar la carga del medio*/
						if( typeof _private.sound.onLoad === 'function' ){
							_root.sound[ _private.sound.src ].addEventListener( 'loadstart', function() {
								_private.sound.onLoad();
							} );
						}

						/*play: al iniciar la reproduccion del medio*/
						if( typeof _private.sound.onPlay === 'function' ){
							_root.sound[ _private.sound.src ].addEventListener( 'play', function() {
								_private.sound.onPlay();
							} );
						}

						/*progress: carga del buffer del medio*/
						_root.sound[ _private.sound.src ].addEventListener( 'progress', function() {
							if( _root.sound[ _private.sound.src ].buffered.length > 0 ) {
								_private.end = _root.sound[ _private.sound.src ].buffered.end( 0 );
								_private.duration = _root.sound[ _private.sound.src ].duration;
								_private.percent = Math.round( ( ( _private.end / _private.duration ) * 100 ) );
								try {
									_private.sound.onLoading.call( _private.percent, _private.percent );
								} catch ( e ) { }
							}
							
						} );

						/*timeUpdate: al actualizar el currentTime del medio*/
						if( typeof _private.sound.timeUpdate === 'function' ) {
							_private.sound.time = {};
							_private.sound.time.duration = {};
							_private.sound.durationReady = false;
							_root.sound[ _private.sound.src ].addEventListener( 'timeupdate', function() {
								/*obtenemos la duración total del medio*/
								_private.fn.timeUpdate (_private.sound.src );
							} );
						}

						/*onWaiting: al detenerse el medio por falta de datos*/
						if( typeof _private.sound.onWaiting === 'function' ) {
							_root.sound[ _private.sound.src ].addEventListener( 'waiting', function() {
								_private.sound.onWaiting();
							} );
						}

						/*afterWaiting: cuando el reproductor esta listo despues de una falta de datos*/
						if( typeof _private.sound.afterWaiting === 'function' ){
							_root.sound[ _private.sound.src ].addEventListener( 'playing', function() {
								_private.sound.afterWaiting();
							} );
						}

						/*soundComplete: al finalizar el medio*/
						_root.sound[ _private.sound.src ].addEventListener( 'ended', function() {
							_root.sound[ _private.sound.src ].isPlay = false;
							if( ( typeof _private.sound.soundComplete === 'function' ) && ( _private.sound.loop == undefined ) ) {
								_private.sound.soundComplete();
							}
							if( _private.sound.loop !== undefined ){
								_root.sound[ _private.sound.src ].currentTime = _private.sound.loop;
								_private.fn.play( _private.sound.src, _private.sound.volume );
							}
						} );

						/*error: cuando existe un error en el procesamiento del medio*/
						if( typeof _private.sound.onError === 'function' ) {
							_root.sound[ _private.sound.src ].addEventListener( 'error', function() {
								_private.sound.onError();
							} );
						}
						
						/*definimos los listeners para el seek*/
							
						if( _private.sound.seek !== undefined ) {
							
							_private.sound.seek.hold = false;
							_private.sound.seek = {
								'parent': document.querySelector( _private.sound.seek[ 0 ] ),
								'fn': _private.sound.seek[ 1 ]
							}
							
							window.addEventListener( 'mouseup', function( e ) {
								//e.preventDefault();
								_private.sound.seek.hold = false;
							});

							_private.sound.seek.parent.addEventListener( 'mousedown', function( e ) {
								//e.preventDefault();
								_private.sound.seek.hold = true;
								_private.fn.seek( e, _private.sound.seek.parent, _private.sound.seek.fn );
							} );

							window.addEventListener( 'mousemove', function( e ) {
								//e.preventDefault();
								if( _private.sound.seek.hold ) {
									_private.fn.seek( e, _private.sound.seek.parent, _private.sound.seek.fn );
								}
							} );
						}

						/*Creamos el analizador de audio si la función soundWave está definida*/
						if( typeof _private.sound.soundWave === 'function' ) {
							this.createAnalyser();
						}

						/*canplaythrough: inicia la reproduccion cuando se estima que esta no se detendrá por falta de tados
						esta acción se ejecuta si streaming esta definido en false o no esta definido*/
						if( ( !_private.sound.streaming ) || ( _private.sound.streaming == undefined ) ) {
							_root.sound[ _private.sound.src ].addEventListener( 'canplaythrough', function() {
								/*invocamos al metodo play */
								_private.fn.play( _private.sound.src );
							} );
						} else {
							/*invocamos al metodo play */
							_private.fn.play( _private.sound.src );
						}
						
					//}catch(e){}
				},
				play: function( context, params ){ /*reproducimos el sonido*/
					_root.sound[ context ].play();
					if( _root.sound[ context ].status == 'stop') {
						_root.sound[ context ].currentTime = _private.sound.startIn;
						_root.sound[ context ].status = ''
					}
					if( params !== undefined ) {
						_root.sound[ context ].volume = params;
					}
					_root.sound[ context ].isPlay = true;
				},
				error: function() {
					if( typeof _private.sound.onError === 'function' ) {
						_private.sound.onError();
					}
				},
				seek: function( e, parent, fn ) {
					/*obtenemos la posición del cursor dentro del contenedor seek*/
					//var tmpVolume = _root.sound[_private.sound.src].volume;
					_private.sound.seek.xPos = ( e.pageX - parent.offsetLeft );
					if( _root.sound[ _private.sound.src ].isPlay ) {
						/*obtenemos el porcentaje de click dentro del seek*/
						_private.sound.seek.percent = Math.round( ( _private.sound.seek.xPos * 100 ) / parent.offsetWidth );
						if( _private.sound.seek.percent > 100 ) {
							_private.sound.seek.percent = 100;
						}
						if( _private.sound.seek.percent < 0 ) {
							_private.sound.seek.percent = 0;
						}
						/*establecemos el nuevo tiempo*/
						_root.sound [_private.sound.src ].currentTime = ( ( _private.sound.seek.percent * _root.sound[ _private.sound.src ].duration ) / 100 );
						//_root.sound[_private.sound.src].volume = tmpVolume;
						fn.call( _private.sound.seek.percent, _private.sound.seek.percent );
					}
				},
				timeUpdate:function( context ) {
					if( !_private.sound.durationReady ){
						_private.sound.time.duration = function( format ){
							_private.sound.time.duration.ss = parseInt( _root.sound[ context ].duration % 60 ); /*segundos*/
							_private.sound.time.duration.mm = parseInt( _root.sound[ context ].duration / 60 ); /*minutos*/
							_private.sound.time.duration.hh = parseInt( _private.sound.time.duration.mm / 60 ); /*horas*/
							if( _private.sound.time.duration.ss < 10 ) { /*si los segundos son menor a 10*/
								_private.sound.time.duration.ss = '0' + _private.sound.time.duration.ss;
							}
							if( _private.sound.time.duration.mm < 10 ) { /*si los minutos son menor a 10*/
								_private.sound.time.duration.mm = '0' + _private.sound.time.duration.mm;
							}
							if( _private.sound.time.duration.mm > 59 ) { /*si los minutos son menor a 59*/
								_private.sound.time.duration.mm =+ ( _private.sound.time.duration.mm - ( _private.sound.time.duration.hh * 59 ) - _private.sound.time.duration.hh );
								if( _private.sound.time.duration.mm < 10 ){ /*si los minutos son menor a 10*/
									_private.sound.time.duration.mm = '0' + _private.sound.time.duration.mm;
								}
							}
							if( _private.sound.time.duration.hh < 10 ) { /*si las horas son menor a 10*/
								_private.sound.time.duration.hh = '0' + _private.sound.time.duration.hh;
							}
							isNaN( _private.sound.time.duration.ss ) ? _private.sound.time.duration.ss = '00' : '';
							isNaN( _private.sound.time.duration.mm ) ? _private.sound.time.duration.mm = '00' : '';
							isNaN( _private.sound.time.duration.hh ) ? _private.sound.time.duration.hh = '00' : '';
							switch( format.toLowerCase() ) {
								case 'ss':
									return _private.sound.time.duration.ss;
								break;
								case 'mm':
									return _private.sound.time.duration.mm;
								break;
								case 'hh':
									return _private.sound.time.duration.hh;
								break;
								case 'mm:ss':
									return _private.sound.time.duration.mm + ':' + _private.sound.time.duration.ss;
								break;
								case 'hh:mm:ss':
									return _private.sound.time.duration.hh + ':' + _private.sound.time.duration.mm + ':' + _private.sound.time.duration.ss;
								break;
								default:
									return '-:-:-';
								break;
							}
						}
					}
					_private.sound.durationReady = true;

					/*Obtenemos el progreso de tiempo del medio*/
					_private.sound.time.progress = function( format ){
						_private.sound.time.progress.ss = parseInt( _root.sound[ context ].currentTime % 60 ); /*segundos*/
						_private.sound.time.progress.mm = parseInt( _root.sound[ context ].currentTime / 60 ); /*minutos*/
						_private.sound.time.progress.hh = parseInt( _private.sound.time.progress.mm / 60 ); /*horas*/
						if( _private.sound.time.progress.ss < 10 ) { /*si los segundos son menor a 10*/
							_private.sound.time.progress.ss = '0' + _private.sound.time.progress.ss;
						}
						if( _private.sound.time.progress.mm < 10 ) { /*si los minutos son menor a 10*/
							_private.sound.time.progress.mm = '0' + _private.sound.time.progress.mm;
						}
						if( _private.sound.time.progress.mm > 59 ) { /*si los minutos son mayor a 59*/
							_private.sound.time.progress.mm =+ ( _private.sound.time.progress.mm - ( _private.sound.time.progress.hh * 59 ) - _private.sound.time.progress.hh );
							if(_private.sound.time.progress.mm < 10 ) { /*si los minutos son menor a 10*/
								_private.sound.time.progress.mm = '0' + _private.sound.time.progress.mm;
							}
						}
						if( _private.sound.time.progress.hh < 10 ) { /*si las horas son menor a 10*/
							_private.sound.time.progress.hh = '0' + _private.sound.time.progress.hh;
						}
						isNaN( _private.sound.time.progress.ss ) ? _private.sound.time.progress.ss = '00' : '';
						isNaN( _private.sound.time.progress.mm ) ? _private.sound.time.progress.mm = '00' : '';
						isNaN( _private.sound.time.progress.hh ) ? _private.sound.time.progress.hh = '00' : '';
						switch( format.toLowerCase() ) {
							case 'ss':
								return _private.sound.time.progress.ss;
							break;
							case 'mm':
								return _private.sound.time.progress.mm;
							break;
							case 'hh':
								return _private.sound.time.progress.hh;
							break;
							case 'mm:ss':
								return _private.sound.time.progress.mm + ':' + _private.sound.time.progress.ss;
							break;
							case 'hh:mm:ss':
								return _private.sound.time.progress.hh + ':' + _private.sound.time.progress.mm + ':' + _private.sound.time.progress.ss;
							break;
							default:
								return '-:-:-';
							break;
						}
					}
					/*obtenemos el porcentaje de progreso del medio*/
					_private.sound.time.current = _root.sound[ context ].currentTime;
					_private.sound.time.percent = ( ( _root.sound[ context ].currentTime * 100 ) /
												  ( _root.sound[ context ].duration ) );

					
					if( _root.sound[ context ].isPlay ) {
						_private.sound.timeUpdate.call( _private.sound.time, _private.sound.time );
					}
				},
				createAnalyser:function() {
					/*Preparamos el contexto para la pista de audio actual*/
					_root.sound[ _private.sound.src ].audioContext = {};
					/*Igualamos los contextos para los diferentes navegadores*/
					window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || 
					window.oAudioContext || window.msAudioContext;
					/*creamos un nuevo contexto*/
					_root.sound[ _private.sound.src ].audioContext.context = new AudioContext();
					/*creamos el analizador de frecuencia*/
					_root.sound[ _private.sound.src ].audioContext.analyser = _root.sound[ _private.sound.src ].audioContext.context.createAnalyser();
					_root.sound[ _private.sound.src ].audioContext.created = true;
					/*creamos el media element*/
					_root.sound[ _private.sound.src ].audioContext.source = 
					_root.sound[ _private.sound.src ].audioContext.context.createMediaElementSource( _root.sound[ _private.sound.src ] );
					/*conectamos con el analizador de frecuencia*/
					_root.sound[ _private.sound.src ].audioContext.source.connect( _root.sound[ _private.sound.src ].audioContext.analyser );
					/*conectamos con el destion*/
					_root.sound[ _private.sound.src ].audioContext.analyser.connect( _root.sound[ _private.sound.src ].audioContext.context.destination );
					this.soundWave();
				},
				soundWave:function() {
					_root.sound[ _private.sound.src ].audioContext.bitArray = new Uint8Array( _root.sound[ _private.sound.src ].audioContext.analyser.frequencyBinCount );
					_root.sound[ _private.sound.src ].audioContext.analyser.getByteFrequencyData( _root.sound[ _private.sound.src ].audioContext.bitArray );
					_private.sound.soundWave.apply(this, [ _root.sound[ _private.sound.src ].audioContext.bitArray ]);
					_root.sound.requestAnimationFrame = window.requestAnimationFrame( _private.fn.soundWave );
				}		
			}
			_private.fn.main();
		} else {
			/*Flash Player*/
			console.warn( 'Shockwave flash is deprecated, please enabled HTML API or remove property -> enabledHTML: true, ' );	
		}
	};
	
	/*detiene una o todas las pistas de audio */
	genesis.sndPlaySound.stopMixers = genesis.sndPlaySound.prototype = function( id ){
		try {
			/*provamos detener el o los sonidos segun se especifíque en la función*/
			if( ( id !== undefined ) && ( id !== null ) ) {
				if( _root.sound[ id ].isPlay ) {
					// _root.sound[id].currentTime = _root.sound[id].startIn;
					_root.sound[ id ].pause();
					_root.sound[ id ].isPlay = false;
					_root.sound[ id ].status = 'stop';
					cancelAnimationFrame( _root.sound.requestAnimationFrame );
				}
			} else { /*iteramos sobre todos los sonidos para detenerlos*/
				if( _root.sound.length > 0 ) { /*verificamos que _root.sound contenga por lo menos un valor*/
					for( var i = 0; i < _root.sound.length; i++ ) {
						if( _root.sound[ _root.sound[ i ] ].isPlay ) {
							// _root.sound[_root.sound[i]].currentTime =_root.sound[_root.sound[i]].startIn;
							_root.sound[ _root.sound[ i ] ].pause();
							_root.sound[ _root.sound[ i ] ].isPlay = false;
							_root.sound[ _root.sound[ i ] ].status = 'stop';
							cancelAnimationFrame( _root.sound.requestAnimationFrame );
						}
					}
				}
			}
			return true;
		} catch( e ) {
			return false;	
		}
	};

	genesis.sndPlaySound.pause = genesis.sndPlaySound.prototype = function( id ){
		if( ( id !== undefined ) && ( id !== null ) ) {
			_root.sound[ id ].pause();
			_root.sound[ id ].isPlay = false;
			_root.sound[ id ].status = 'pause';
		} else {
			for( var i = 0; i < _root.sound.length; i++ ){
				if( _root.sound[ _root.sound[ i ] ].isPlay ) {
					_root.sound[ _root.sound[ i ] ].pause();
					_root.sound[ _root.sound[ i ] ].isPlay = false;
					_root.sound[ _root.sound[ i ] ].status = 'pause';
				}
			}
		}
	};

	/*manipula el volume de una o todas las pistas de audio */
	genesis.sndPlaySound.volume = genesis.sndPlaySound.prototype = function( value, ref ) {
		try {
			/*validamos que value este definido y que el valor este en el rango */
			if( ( value !== undefined ) && ( value > 0 ) && ( value < 1 ) ) {
				/* validamos si existe una referencia*/
				if( ref !== undefined ) {
					/*aplicamos el valor sobre la referencia si está en reproduccion*/
					if( _root.sound[ ref ].isPlay ) {
						_root.sound[ ref ].volume = value;
					}
				} else {
					/*iteramos y aplicamos el valor a cada elemento que este en reproduccion */
					for( var i = 0; i < _root.sound.length; i++ ) {
						if( _root.sound[ _root.sound[ i ] ].isPlay ) {
							_root.sound[ _root.sound[ i ] ].volume = value;
						}
					}
				}
				
			}
		} catch( e ) {}
	};

	genesis.ajax = function( options, callback ){
		var _local = {
			options: {},
			xhr: undefined,
			ieXMLHTTP: [ 'MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp', 'Microsoft.XMLHttp' ],
			fn: {
				createXHR: function(){ /*función que crea el objeto xhr*/
					if ( window.XMLHttpRequest ) {
						_local.xhr = new XMLHttpRequest();
					} else if ( window.ActiveXObject ) {
						/*recorremos el array para encontrar la version válida en internet explorer*/
						for( var i = 0; i < this.ieXMLHTTP.length; i++ ) {
							try {
								_local.xhr = new ActiveXObject( this.ieXMLHTTP[ i ] );
								break;
							} catch( e ) {}
						}
					}
				},
				noCache: function(){ /*Método que devuelve una cadena Date para evitar la caché*/
					var cache = new Date();
					return cache.getMonth() 
					+ cache.getDate() 
					+ cache.getHours() 
					+ cache.getMinutes() 
					+ cache.getSeconds() 
					+ cache.getMilliseconds();
				}
			}
		};
		
		if( typeof options === 'string' ){
			_local.options = {
				'async': true,
				'method': 'get',
				'location': options,
				'args': '',
				'onError': undefined,
				'dataArrival': undefined,
			}
		} else {
			_local.options = {
				'async': options.async || true,
				'method': options.method.toLowerCase(),
				'location': options.location,
				'args': options.args || '',
				'onError': options.onError,
				'dataArrival': options.dataArrival,
				'callback': options.callback
			}
		}

		_local.fn.createXHR();/*creando el objeto xhr*/
		/*declaramos las variables para las cadena de variables a enviar según el método utlizado*/
		_local.options.get = '';
		_local.options.post = '';
		/*armamos una cadena de variables dependiendo del método a utilizar*/
		if( _local.options.method === 'get' ) {
			_local.options.get = '';
			/*iteramos sobre el contenido de _local.options.args*/
			for( var keyName in _local.options.args ) {
				_local.options.get+= keyName + '=' + _local.options.args[ keyName ] + '&';
			}
			_local.options.get;
		} else {
			for( var keyNamePost in _local.options.args ) {
				_local.options.post+= keyNamePost + '=' + _local.options.args[ keyNamePost ] + '&';
			}
			_local.options.post+= 'noCache=' + _local.fn.noCache();
		}
		/*si el objeto xhr se creó satisfactoriamente*/
		if( _local.xhr ) {
			/*configuramos la petición*/
			_local.xhr.open( _local.options.method, _local.options.location + _local.options.get, _local.options.async );
			/*preparamos la conexión*/
			_local.xhr.onreadystatechange = function(){
				/*Datos completos*/
				if( _local.xhr.readyState === 4 ) {
					/*la petición se procesó correctamente*/
					if( _local.xhr.status === 200 ) {
						if( typeof options === 'string' ) {
							if( typeof callback === 'function' ) {
								callback.call( _local.xhr.responseText, _local.xhr.responseText );
							}
						} else {
							if( typeof _local.options.dataArrival === 'function' ) {
								_local.options.dataArrival.call(_local.xhr.responseText, _local.xhr.responseText);
							}
						}
					} else { /*si la petición no se procesó correctamente*/
						_local.options.errNumber = _local.xhr.status;
						if( typeof _local.options.onError === 'function' ) {
							_local.options.onError.call( _local.options.errNumber, _local.options.errNumber );
						}
					}
					/*si existe un callback*/
					if( typeof _local.options.callback === 'function' ) {
						_local.options.callback();
					}
				}
			}

			_local.xhr.setRequestHeader( "Content-Type","application/x-www-form-urlencoded" );
			_local.xhr.send( _local.options.post );
		}
	};

	genesis.ajax.history = genesis.ajax.prototype = function( history, fn ) {
		var _private = {
			init: function(){
				window.addEventListener( 'hashchange', function() {
					_private.history( window.location.hash );
				} );
			},
			
			history: function( hash ) {
				var fileNofound = true;
				if( ( ( !hash ) || ( hash === '#/' ) ) && ( typeof( history.default ) === 'function' ) ) {
					history.default();
					if( genesis.isFunction( fn ) ) {
						fn();
					}
				} else {
					var index = hash.substring( 2, hash.length );
					for( var key in history ) {
						if( key == index ) {
							fileNofound = false;
							if( !_private[ key ] ) {
								_private[ key ] = _root.hvars;
								_root.vars = undefined;
							}
							history[ key ].call(this[key], _private[ key ] );
							if( genesis.isFunction( fn ) ) {
								fn();
							}
							break;
						}
					}
					if( ( fileNofound )  && ( genesis.isFunction( history.fileNoFound ) ) ) {
						history.fileNoFound();
					}
				}
			}
		}
		if( _root.history === undefined ) {
			_root.history = true;
			_private.init();
			_private.history( window.location.hash );
		}
	}

	genesis.ajax.history.go = genesis.ajax.history.prototype = function( hash, options ) {
		if( options ) {
			_root.hvars = options;
		}
		if( !hash ) {
			window.location.hash = '/';
		} else {
			window.location.hash = '/' + hash;
		}
	}
	
	genesis.ajax.history.remove = genesis.ajax.history.prototype = function( hash ) {
		window.location.hash = '';
	}

	genesis.ajax.history.replace = genesis.ajax.history.prototype = function( hash ) {
		if( hash.indexOf( '#' ) !== -1 ) {
			window.location.replace( hash );
		} else {
			window.location.replace( '#/' + hash );
		}
	}

	genesis.tracking = function( el, fn ) {
		for( var x in el ) {
			el.genesisWatcher( x, function(id, old, nw ) {
				if( genesis.isFunction( fn ) ){
					fn();
				}
				return nw;
			})
		}
		if( genesis.isFunction( fn ) ) {
			fn();
		}
		return el;
	}

	genesis.fn.extend( {
		parent: function() {
			return genesis( this.context.parentNode );
		},
		prevSibling: function() {
			var prevSibling = genesis.prevSibling( this.context );
			var nxt;
			while( !prevSibling.tagName ) {
				nxt = genesis.prevSibling( prevSibling );
				prevSibling = nxt;
			}
			return genesis( prevSibling );
		},

		nextSibling: function() {
			var nextSibling = genesis.nextSibling( this.context );
			var nxt;
			while( !nextSibling.tagName ) {
				nxt = genesis.nextSibling( nextSibling );
				nextSibling = nxt;
			}
			return genesis( nextSibling );
		},

		child: function() {
			var child = genesis.child( this.context );
			var nxt;
			while( !child.tagName ) {
				nxt = genesis.nextSibling( child );
				child = nxt;
			}
			return genesis( child );
		}
	} );

	genesis.extend( { 
		prevSibling: function( element ) {
			return element.previousSibling;
		},

		nextSibling: function( element ) {
			return element.nextSibling;
		},

		child: function( element ) {
			return element.childNodes[0];
		}
	} )

	function genesisExeption( err ) {
		var error;
		switch( err ){
			case 001:
				error = "genesis requiere un selector -> genesis(selector) || _$(selector)";
			break;
			case 002:
				error = "genesis requiere un selector válido -> genesis(selector) || _$(selector)";
			break;
			case 003:
				error = "no se especificó comodín para el selector -> # || .";
			break;
			case 004:
				error = 'event requiere 2 argumentos -> genesis.event(handler, function())';
			break;
			case 005:
				error = 'el selector se estableció de forma incorrecta para ejecutar el método -> _$(?) || genesis(?)'
			break;
		}
		throw( 'Error: ' + error );
	}

	window._$ = window.genesis = genesis;

} )( window );

(function(){
	if(!Object.prototype.genesisWatcher){
		Object.defineProperty(Object.prototype,
		 "genesisWatcher", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function(prop, handler){
				var nw = this[prop];
				var old = nw;

				var getter = function(){
					return nw;
				};

				var setter = function(val){
					nw = val;
					cur = handler.call(this, prop, old, nw);
					return cur;
				};

				if(delete this[prop]){
					Object.defineProperty(this, prop, {
						get: getter,
						set: setter, 
						enumerable: true,
						configurable: true
					});
				}
			}
		});
	}
})();