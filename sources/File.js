/* Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org]
 *
 * This file is part of miniLOL.
 *
 * miniLOL is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * miniLOL is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with miniLOL. If not, see <http://www.gnu.org/licenses/>.
 ****************************************************************************/

/**
 *  class miniLOL.File
 *
 *  A simple way to get files
**/
miniLOL.File = Class.create({
    /**
     *  new miniLOL.File(path[, options])
     *  - path (String): The path of the file.
     *  - options (Object): Options to pass to Ajax.Request.
     *
     *  Creates a File object and downloads the content.
     *
     *  It defaults to downloading it synchronously, so when you create a File
     *  object the code waits for it to download, if you pass asynchronous: true it will be
     *  downloaded asynchronously and the onLoaded function will be called. The onLoaded function
     *  has to be put in the options parameter.
    **/
    initialize: function (path, options) {
        this.options = Object.extend({
            method:       'get',
            asynchronous: false,
            evalJS:       false,
            minified:     false,
            cached:       true,

            onSuccess: function (http) {
                this.content = http.responseText;
                this.special = http.responseXML;
                this.loaded  = true;

                if (Object.isFunction(this.options.onLoaded)) {
                    this.options.onLoaded(this);
                }
            }.bind(this),

            onFailure: function (http) {
                this.error = Object.clone(http);
            }.bind(this)
        }, options || {});

        this.loaded = false;

        this.path      = path;
        this.extension = miniLOL.File.extension(path);

        new Ajax.Request(this.path, this.options);
    },

    reload: function () {
        this.loaded = false;

        new Ajax.Request(this.path, this.options);
    },

    interpolate: function (data, engine) {
        if (engine) {
            return this.content.interpolate(data, engine);
        }
        else {
            return new miniLOL.Template(this).evaluate(data);
        }
    },

    Static: {
        extension: function (path) {
            var matches = path.match(/\.([^.]+)$/)

            if (matches) {
                return matches[1];
            }
            else {
                return '';
            }
        }
    }
});
