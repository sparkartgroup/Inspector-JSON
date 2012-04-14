var contents = $('body').text();

try {
	
	var json = JSON.parse( contents );
	
}

catch( err ){
	
	console.log( err );
	
}

finally {
	
	$('body').html('<div id="inspector" class="inspector-json" />');
	
	var viewer = new JSONViewer({
		element: '#inspector'
	});
	viewer.view( json );

}