Dynamic Loader Plugin for [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin)
========================================

An extension for the [webpack](http://webpack.github.io) plugin [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin).

What does the plugin do?
------------
The plugin converts plain JS/CSS resources in HTML to be dynamically loaded by JS. Example:
```html
<script type="text/javascript" src="anyfile.js"></script>
```

becomes
```js
<script type="text/javascript">
    document.write('<script type="text/javascript" src="anyfile.js"></script>');
</script>
```

Why?
------------
In my case I needed to run JS <b>before</b> any of these files was loaded to get the correct base href for my angular
application due to the fact that I need to deploy the same artifact on any stage. So this helps me to execute some JS
logic to determine the base href before loading the scripts.

Installation
------------
You must be running webpack >= 2 on node 4 or higher

Install the plugin with npm:
```shell
$ npm install --save-dev html-webpack-dynamic-loader-plugin
```

Basic Usage
-----------
Require the plugin in your webpack config:

```javascript
var HtmlWebpackDynamicLoaderPlugin = require('html-webpack-dynamic-loader-plugin');
```

Add the plugin to your webpack config as below:

```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackDynamicLoaderPlugin()
]
```
If the configuration is left empty, nothing will be done. You need to set the parameter <i>dynamicLoad</i> as regEx-Pattern to select the files to be loaded dynamically.

```javascript
plugins: [
  new HtmlWebpackPlugin({
    // any further config
    dynamicLoadResources: '.js$'
  }),
  new HtmlWebpackDynamicLoaderPlugin()
]
```

