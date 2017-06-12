/**
 * @author mbenzenhoefer
 * thanks to DustinJackson for delivering a frame for this plugin
 * see https://github.com/DustinJackson/html-webpack-inline-source-plugin
 */
'use strict';
var assert = require('assert');
var path = require('path');
var slash = require('slash');

function HtmlWebpackDynamicLoaderPlugin (options) {
    this.options = options;
}

HtmlWebpackDynamicLoaderPlugin.prototype.apply = function (compiler) {
    var self = this;

    // Hook into the html-webpack-plugin processing
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
            if (!htmlPluginData.plugin.options.dynamicLoad) {
                return callback(null, htmlPluginData);
            }

            var regexStr = this.options.dynamicLoad;

            var result = self.processTags(compilation, regexStr, htmlPluginData);

            callback(null, result);
        });
    });
};

HtmlWebpackDynamicLoaderPlugin.prototype.processTags = function (compilation, regexStr, pluginData) {
    var self = this;

    var body = [];
    var head = [];

    var regex = new RegExp(regexStr);

    pluginData.head.forEach(function (tag) {
        head.push(self.processTag(compilation, regex, tag));
    });

    pluginData.body.forEach(function (tag) {
        body.push(self.processTag(compilation, regex, tag));
    });

    return { head: head, body: body, plugin: pluginData.plugin, chunks: pluginData.chunks, outputName: pluginData.outputName };
};

HtmlWebpackDynamicLoaderPlugin.prototype.processTag = function (compilation, regex, tag) {
    var deferrable = false;
    var originalTag;

    if (tag.tagName === 'script' && regex.test(tag.attributes.src)) {
        deferrable = true;
        originalTag = JSON.parse(JSON.stringify(tag));
        tag = {
            tagName: 'script',
            closeTag: true,
            attributes: {
                type: 'text/javascript'
            }
        };

    } else if (tag.tagName === 'link' && regex.test(tag.attributes.href)) {
        deferrable = true;
        originalTag = JSON.parse(JSON.stringify(tag));
        tag = {
            tagName: 'style',
            closeTag: true,
            attributes: {
                type: 'text/css'
            }
        };
    }

    if (deferrable) {
        // create the tag
        var tagAttributes = Object.keys(originalTag.attributes);
        var tagString = "document.write('<" + tag.tagName;
        for(var i = 0; i < tagAttributes.length; i++){
            tagString += " " + tagAttributes[i] + "=\"" + originalTag.attributes[tagAttributes[i]] + "\"";
        }
        tagString += "><\/" + originalTag.tagName + ">');";
        tag.innerHTML = (tag.tagName === 'script') ? tagString.replace(/(<)(\/script>)/g, '\\x3C$2') : tagString;
    }

    return tag;
};

module.exports = HtmlWebpackDynamicLoaderPlugin;