# Inspector JSON

Explore JSON in style.

[![browser support](https://ci.testling.com/SparkartGroupInc/Inspector-JSON.png)](https://ci.testling.com/SparkartGroupInc/Inspector-JSON)

Inspector JSON is a javascript library for creating "inspectable" representations of JSON, much like the inspection features in web browsers like Google Chrome, Firefox, and Opera. It allows you to collapse/expand arrays and objects, and can even remember the state of the inspector between pageloads.

### Usage

Inspector JSON presently has the following dependencies:

* [jQuery](http://jquery.com/)
* [underscore.js](http://underscorejs.org/)
* [store.js](https://github.com/marcuswestin/store.js)

You must also include `inspector_json.css` for the inspector to be properly styled.

The inspector is created by initializing a new InspectorJSON, and the JSON is viewed by passing a JSON string to the `view` method:

```javascript
var inspector = new InspectorJSON({
	element: '#json'
});

inspector.view('{"hello":"world"}');
```

You'll need an element for the inspector to be drawn in, too:

```html
<div id="json"></div>
```

### Configuration

Inspector JSON has a few configuration options, all of which are set in a configuration object passed when the inspector is instantiated. The options are as follows:

* **element** ( required ) - A selector for the element which will become the viewer. May also be a jQuery selection. _ex:_ `#json`, `$('#json')`
* **collapsed** ( default `true` ) - Boolean determining whether the inspector should start with everything collapsed or uncollapsed.
* **url** ( default _current url_ ) - The url to be used for remembering the state of the inspector. Usually does not need to be set.

```javascript
var inspector = new InspectorJSON({
	element: '#AwesomeElement',
	collapsed: false,
	url: '/very/custom/url'
});
```

### Methods

Inspector JSON only makes two methods available at the moment:

#### view ( _string_ )
Views the JSON string passed.

```javascript
inspector.view('{"string":"Hello World!","number":5,"boolean":true,"array":["one","two","three"],"object":{"key":"value","key2":"value2"}}');
```

#### destroy ()
Destroys the viewer.

```javascript
inspector.destroy();
```

### License

Inspector JSON is available under the MIT License.