var $ = require('./assets/jquery.js');
var InspectorJSON = require('../lib/index.js');
var test = require('tape');

var TEST_MARKUP = ['<div id="json"></div><div id="json2"></div>'];

// add a test container element
$('html').append('<div id="test"></div>');

test( 'Inspector JSON initializes and destroys itself', function( t ){
	t.plan(6);
	$('#test').html( TEST_MARKUP[0] );
	var inspector = new InspectorJSON({
		element: 'json'
	});
	t.ok( $('#json').is('.inspector-json'), 'Adds inspector-json class' );
	t.ok( $('#json').is('.viewer'), 'Adds viewer class' );
	inspector.destroy();
	t.ok( $('#json').is(':empty'), 'Empties out element' );
	var inspector2 = new InspectorJSON({
		element: $('#json2')[0]
	});
	t.ok( $('#json2').is('.inspector-json'), 'Adds inspector-json class, second div' );
	t.ok( $('#json2').is('.viewer'), 'Adds viewer class, second div' );
	inspector2.destroy();
	t.ok( $('#json2').is(':empty'), 'Empties out element, second div' );
	$('#test').html('');
});