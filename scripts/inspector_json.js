var JSONViewer = function( params ){
	
	if( !params )
		var params = {};
	
	var defaults = {
		element: 'body',
		debug: false,
		collapsed: true
	};
	
	_( params ).defaults( defaults );
	
	this.$el = $( params.element );
	this.$el.addClass('viewer');
	
	// Delegate the click event for collapse/uncollapse of JSON levels
	this.$el.on( 'click.json', 'a.object, a.array', function( e ){
		
		e.preventDefault();
		
		var $this = $(this);
		
		$this.toggleClass('collapsed');
		
	});
	
	// Create the JSON Viewer on the specified element
	this.view = function( json ){
		
		if( params.debug )
			var start = new Date().getTime();
		
		var processString = function( string ){
			
			return unescape( string ).replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
			
		};
		
		var processItem = function( item, key ){
			
			var type = _.type( item );
			var markup = '';
			
			if( type === 'object' ){
				if( key ){
					( params.collapsed )
						? markup += '<a class="object collapsed" href="#toggle"><strong>'+ key + '</strong></a>'
						: markup += '<a class="object" href="#toggle"><strong>'+ key + '</strong></a>';
				}
				markup += '<ul>';
				for( key in item ){
					markup += '<li>';
					markup += processItem( item[key], key );
					markup += '</li>';
				};
				markup += '</ul>';
			}
			else if( type === 'array' ){
				if( key ){
					( params.collapsed )
						? markup += '<a class="array collapsed" href="#toggle"><strong>'+ key +'</strong></a>Array('+ item.length +')'
						: markup += '<a class="array" href="#toggle"><strong>'+ key +'</strong></a>Array('+ item.length +')';
				}
				markup += '<ol>';
				for( i in item ){
					markup += '<li>';
					markup += processItem( item[i], i );
					markup += '</li>';
				};
				markup += '</ol>';
			}
			else if( type === 'string' )
				markup += '<strong>'+ key + '</strong><span>"'+ processString( item ) +'"</span>';
			else if( type === 'number' )
				markup += '<strong>'+ key + '</strong><var>'+ item.toString() +'</var>';
			else if( type === 'boolean' )
				markup += '<strong>'+ key + '</strong><em>'+ item.toString() + '</em>';
			else if( type === 'null' )
				markup += '<strong>'+ key + '</strong><i>null</i>';
			
			return markup;
		
		};
		
		if( _.isString( json ) )
			json = JSON.parse( json );
		
		var root = processItem( json );
		var $root = $( root );
		
		this.$el.html( $root );
		
		if( params.debug ){
			var end = new Date().getTime();
			console.log('Rendered in '+ ( end - start ) +'ms');
		}
				
	};
	
	// LEAVE NO EVIDENCE!!!
	this.destroy = function(){
		
		this.$el
			.off('.json')
			.empty();
		
	};
	
};