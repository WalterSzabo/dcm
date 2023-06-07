( function()
{
	'use strict';


	// <script>dcm_enabled = true;</script>
	if ( typeof dcm_enabled === 'undefined' )
	{
		const dcm_enabled = true;
	}

	const
	dcm_version = '1.2', // Dimeda Cookie Manager Version
	cookie_name = '_dcm', // Cookiename
	cookie_ttl = 7; // Days

	const links = {
		'cookiepolicy': {
			'link': './cookiepolicy',
			'label': 'Cookie-Richtlinien'
		},
		'imprint': {
			'link': './imprint',
			'label': 'Impressum'
		},
	};

	const permissions = [
	{
		'label': 'Technisch notwendig',
		'id' : 'necessary',
		'checked': 'checked',
		'disabled': 'disabled'
	},
	{
		'label': 'Statistiken',
		'id' : 'statistics',
		'checked': null,
		'disabled': null
	},
	{
		'label': 'Soziale Medien',
		'id' : 'socialmedia',
		'checked': null,
		'disabled': null
	},
	{
		'label': 'Externe Inhalte',
		'id' : 'externalcontent',
		'checked': null,
		'disabled': null
	}
	];



	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// S T O P    E D I T I N G    H E R E !!
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	function set_cookie( cookie_name, cookie_value, cookie_days )
	{
		const d = new Date();
		d.setTime( d.getTime() + cookie_days * 86400000 );
		let expires = 'expires=' + d.toUTCString();
		let cookieOptions = 'path=/;SameSite=Strict;';
	  
		if ( location.protocol === 'https:' )
		{
			cookieOptions += 'Secure';
		}

		document.cookie = cookie_name + '=' + cookie_value + ';' + expires + ';' + cookieOptions;
	}

	function get_cookie ( cookie_name )
	{
		const
		name = cookie_name + '=',
		ca = document.cookie.split( ';' );

		for ( var i=0; i<ca.length; i++ )
		{
			var c = ca[i];
			while ( c.charAt(0) == ' ' )
			{
				c = c.substring(1);
			}

			if ( c.indexOf( name ) == 0 )
			{
				return c.substring( name.length, c.length );
			}
		}
		return '';
	}

	function reset_cookie ()
	{
		document.querySelector( '[name=_dcm_reset]' ).addEventListener( 'click', function ()
		{
			// Uncheck all Checkboxes by "Reset Cookies"
			var permission;

			for ( var i=0; i<permissions.length; i++ )
			{
				permission = permissions[i];

				if ( !permission.checked )
				{
					document.getElementById( permission.id ).checked = false;
				}
			}
			// Uncheck

			// Delete Cookie
			set_cookie ( cookie_name, '', -1 );
			disable_consent_elements ();
			enable_cookiebanner ();
		},
		false);
	}

	function create_cookiebanner ()
	{
		var
		permission,
		content = '<div class="cookiebanner hidden">' +
			'<form name="cookiebanner">' +
				'<h1>Datenschutz</h1>' +
				'<p class="links"><a href="' + links.cookiepolicy.link + '">' + links.cookiepolicy.label + '</a>&ensp;&middot;&ensp;<a href="' + links.imprint.link + '">' + links.imprint.label + '</a>' +
				'<p class="info">' +
					'Diese Webseite verwendet Cookies. Manche sind technisch erforderlich und andere verbessern die Nutzbarkeit.' +
				'</p>' +

				'<div class="checkboxes">';

					for ( var i=0; i<permissions.length; i++ )
					{
						permission = permissions[i];
						content += '<div class="checkbox">' +
							'<input type="checkbox" name="' + permission.id + '" id="' + permission.id + '" ' + permission.checked + ' ' + permission.disabled + '>' +
							'<label for="' + permission.id + '">' + permission.label + '</label>' +
						'</div>';
					}

				content += '</div>' +

				'<div class="buttons">' +
					'<button type="button" name="_dcm_consent_all" class="btn btn-active" title="Alle akzeptieren">Alle akzeptieren</button>' +
					'<button type="button" name="_dcm_consent_custom" class="btn" title="Speichern">Speichern</button>' +
				'</div>' +
			'</form>' +
		'</div>' +
		'<div class="cookiebanner-overlay hidden"></div>';

		return content;
	}

	function create_resetbutton ()
	{
		var content = '<button type="button" class="btn" name="_dcm_reset" title="Datenschutz Einstellungen"><span class="glyphicon glyphicon-cog"></span></button>';

		return content;
	}

	// Append Cookie-Banner to <body>
	function add_cookiebanner ()
	{
		document.getElementsByTagName( 'body' )[0].innerHTML += create_cookiebanner ();
	}

	// Append Reset-Button to <body>
	function add_resetbutton ()
	{
		document.getElementsByTagName( 'body' )[0].innerHTML += create_resetbutton ();
	}

	function enable_cookiebanner()
	{
		document.querySelector( '.cookiebanner' ).classList.toggle( 'hidden' );
		document.querySelector( '.cookiebanner-overlay' ).classList.toggle( 'hidden' );
	}

	function disable_cookiebanner()
	{
		document.querySelector( '.cookiebanner' ).classList.toggle( 'hidden' );
		document.querySelector( '.cookiebanner-overlay' ).classList.toggle( 'hidden' );
	}

	function enable_consent_elements ( cookie_content )
	{
		permissions.forEach( function ( permission )
		{
			if ( cookie_content.match( permission.id ) || cookie_content.match( /all/ ) )
			{
				var
				src,
				elements = document.querySelectorAll( '[data-cookieconsent="' + permission.id + '"]' );

				elements.forEach( function ( element )
				{
					src = element.getAttribute( 'data-src' );
					element.classList.remove( 'hidden' );
					element.setAttribute( 'src', src );
				});
			}
		});
	}

	// Hide all Cookie-HTML-Nodes
	function disable_consent_elements ()
	{
		var cookieconsentElements = document.querySelectorAll( '[data-cookieconsent]' );
		cookieconsentElements.forEach( function ( element )
		{
			element.classList.add( 'hidden' );
		});
	}

	// Enable all HTML-Nodes by Cookie-Settings.
	function set_all_consent_elements ()
	{
		document.getElementsByName( '_dcm_consent_all' )[0].addEventListener( 'click', function ()
		{
			set_cookie ( cookie_name, 'all', cookie_ttl );
			enable_consent_elements ( 'all' )
			disable_cookiebanner ();
		},
		false);
	}

	// Enable custom HTML-Nodes by Cookie-Settings.
	function set_custom_consent_elements ()
	{
		document.getElementsByName( '_dcm_consent_custom')[0].addEventListener( 'click', function ()
		{
			var
			checkboxInputs = document.querySelectorAll( 'form[name="cookiebanner"] input[type="checkbox"]' ),
			cookie_content = [];

			checkboxInputs.forEach( function ( input )
			{
				if ( input.checked )
				{
					cookie_content.push( input.name );

					console.info( 'Hier sollte ein Platzhalter für ausgeblendete Elemnte sein - mit Aufruf des Cookiebanners.' );
					console.log( input.name );
				}
			});

			cookie_content = cookie_content.join( ',' );
			set_cookie( cookie_name, cookie_content, cookie_ttl );
			enable_consent_elements( cookie_content );
			disable_cookiebanner();
	  });
	}





	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	if ( typeof dcm_enabled === 'undefined' )
	{

		// Append Cookie-Banner & Reset-Button to <body>
		add_cookiebanner ();
		add_resetbutton ();

		// Listener for [Allow all|Allow Custom|Reset Cookie]
		document.addEventListener( 'DOMContentLoaded', set_all_consent_elements, false );
		document.addEventListener( 'DOMContentLoaded', set_custom_consent_elements, false );
		document.addEventListener( 'DOMContentLoaded', reset_cookie, false );

		// If empty - Enable Banner
		if ( get_cookie( '_dcm' ) == '' )
		{
			disable_consent_elements ();
			enable_cookiebanner ();
		}
		else
		{
			enable_consent_elements ( get_cookie( '_dcm' ) );
		}
	}
})();