var $ = require('./assets/jquery.js');
var InspectorJSON = require('../lib/index.js');
var test = require('tape');

var TEST_MARKUP = ['<div id="json"></div>','<div id="json2"></div>'];
var TEST_JSON = '{"string":"Hello World!","number":5,"boolean":true,"array":["one","two","three"],"object":{"key":"value","key2":"value2"}}';

// add a test container element
$('html').append('<div id="test"></div>');

test( 'Inspector JSON initializes and destroys itself', function( t ){
	t.plan(6);
	$('#test').html( TEST_MARKUP[0] + TEST_MARKUP[1] );
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

test( 'Inspector JSON displays JSON for viewing', function( t ){
	t.plan(7);
	$('#test').html( TEST_MARKUP[0] );
	var expected_markup = '<ul><li class="string" data-path="this.string"><strong>string</strong><span>"Hello World!"</span></li><li class="number" data-path="this.number"><strong>number</strong><var>5</var></li><li class="boolean" data-path="this.boolean"><strong>boolean</strong><em>true</em></li><li class="array collapsed" data-path="this.array"><a href="#toggle"><strong>array</strong></a>Array(3)<ol><li class="string" data-path="this.array[0]"><strong>0</strong><span>"one"</span></li><li class="string" data-path="this.array[1]"><strong>1</strong><span>"two"</span></li><li class="string" data-path="this.array[2]"><strong>2</strong><span>"three"</span></li></ol></li><li class="object collapsed" data-path="this.object"><a href="#toggle"><strong>object</strong></a><ul><li class="string" data-path="this.object.key"><strong>key</strong><span>"value"</span></li><li class="string" data-path="this.object.key2"><strong>key2</strong><span>"value2"</span></li></ul></li></ul>';
	var inspector = new InspectorJSON({
		element: 'json'
	});
	inspector.view( TEST_JSON );
	t.ok( $('#json').html() === expected_markup, 'Draws correct markup' );
	var $array = $('#test li[data-path="this.array"]');
	t.ok( $array.is('.collapsed'), 'this.array group is collapsed' );
	$array.children('a')[0].click();
	t.ok( !$array.is('.collapsed'), 'this.array group is uncollapsed' );
	$array.children('a')[0].click();
	t.ok( $array.is('.collapsed'), 'this.array group is collapsed again' );
	var $object = $('#test li[data-path="this.object"]');
	t.ok( $object.is('.collapsed'), 'this.object group is collapsed' );
	$object.children('a')[0].click();
	t.ok( !$object.is('.collapsed'), 'this.object group is uncollapsed' );
	$object.children('a')[0].click();
	t.ok( $object.is('.collapsed'), 'this.object group is collapsed again' );
	inspector.destroy();
	$('#test').html('');
});

test( 'InspectorJSON can start uncollapsed', function( t ){
	t.plan(2);
	$('#test').html( TEST_MARKUP[0] );
	var inspector = new InspectorJSON({
		element: 'json',
		collapsed: false
	});
	inspector.view( TEST_JSON );
	var $array = $('#test li[data-path="this.array"]');
	t.ok( !$array.is('.collapsed'), 'this.array group is not collapsed' );
	var $object = $('#test li[data-path="this.object"]');
	t.ok( !$object.is('.collapsed'), 'this.object group is not collapsed' );
	inspector.destroy();
	$('#test').html('');
});