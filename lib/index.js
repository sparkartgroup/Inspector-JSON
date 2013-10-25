var typeOf = require('type-of');
var extend = require('extend');

var InspectorJSON = function( params ){
	
	'use strict';

	params = params || {};
	var defaults = {
		element: 'body',
		debug: false,
		collapsed: true,
		url: location.pathname
	};
	
	params = extend( defaults, params );
	
	var collapse_states = store.get( params.url +':inspectorJSON/collapse_states' ) || {};
	this.$el = $( params.element );
	this.$el.addClass('inspector-json viewer');
	
	// Delegate the click event for collapse/uncollapse of JSON levels
	this.$el.on( 'click.json', 'li.object > a, li.array > a', function( e ){
		
		e.preventDefault();
		
		var $this = $(this);
		var $parent = $this.parent();
		var path = $parent.data('path');
				
		$parent.toggleClass('collapsed');
		
		var expanded = !$parent.is('.collapsed');
		
		if( expanded )
			collapse_states[path] = expanded;
		else
			delete collapse_states[path];
		
		store.set( params.url +':inspectorJSON/collapse_states', collapse_states );
		
	});
	
	// Create the JSON Viewer on the specified element
	this.view = function( json ){
		
		var start, end;

		if( params.debug ){
			start = new Date().getTime();
		}
		
		var processString = function( string ){
			
			return unescape( string ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
			
		};
		
		// Create markup from a value
		var processItem = function( item, parent, key, path ){
			
			var type = typeOf( item );
			var parent_type = typeOf( parent );
			var markup = '';
			
			// Create a string representation of the JSON path to this value
			if( parent_type === 'array' ){
				path += '['+ key +']';
			}
			else if( parent_type === 'object' ){
				path += '.'+ key;
			}
			else {
				path = key;
			}
			
			// Start the <li>
			if( parent ){
				markup += ( collapse_states[path] || !params.collapsed || ( type !== 'object' && type !== 'array' ) ) ?
					'<li class="'+ type +'" data-path="'+ path +'">' :
					'<li class="'+ type +' collapsed" data-path="'+ path +'">';
			}
			
			// Generate markup by value type. Recursion for arrays and objects.
			if( type === 'object' ){
				if( key )
					markup += '<a href="#toggle"><strong>'+ key + '</strong></a>';
				markup += '<ul>';
				for( key in item )
					markup += processItem( item[key], item, key, path );
				markup += '</ul>';
			}
			else if( type === 'array' ){
				if( key )
					markup += '<a href="#toggle"><strong>'+ key +'</strong></a>Array('+ item.length +')';
				markup += '<ol>';
				for( var i in item )
					markup += processItem( item[i], item, i, path );
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
			
			// End the </li>
			if( parent ){
				markup += '</li>';
			}
			
			return markup;
		
		};
		
		if( typeOf( json ) === 'string' ){
			json = JSON.parse( json );
		}
		
		var root = processItem( json );
		var $root = $( root );
		
		this.$el.html( $root );
		
		if( params.debug ){
			end = new Date().getTime();
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

module.exports = InspectorJSON;