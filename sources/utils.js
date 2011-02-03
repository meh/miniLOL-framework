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

miniLOL.utils = (function () {
    function exists (path) {
        var result = false;

        new Ajax.Request(path, {
            method:       'head',
            asynchronous: false,
            evalJS:       false,

            onSuccess: function () {
                result = true;
            }
        });

        return result;
    }

    function get (path, options) {
        options = Object.extend({
            raw: true
        }, options || {});

        var result;

        new Ajax.Request(path, Object.extend(options || {}, {
            method:       'get',
            asynchronous: false,
            evalJS:       false,

            onSuccess: function (http) {
                if (options.raw) {
                    result = http.responseText;
                }
                else {
                    try {
                        result = JSON.unserialize(http.responseText);
                    }
                    catch (e) {
                        result = http.responseXML || http.responseText;
                    }
                }
            }
        }));

        return result;
    }

    function execute (path, options) {
        var result;
        var error;

        new Ajax.Request(path, Object.extend(options || {}, {
            method:       'get',
            asynchronous: false,
            evalJS:       false,

            onSuccess: function (http) {
                try {
                    result = window.eval(http.responseText);
                }
                catch (e) {
                    error             = e;
                    error.fileName    = path;
                    error.lineNumber -= 5;
                }
            },

            onFailure: function (http) {
                error = new Error('Failed to retrieve `#{file}` (#{status} - #{statusText}).'.interpolate({
                    file:       path,
                    status:     http.status,
                    statusText: http.statusText
                }));

                error.fileName   = path;
                error.lineNumber = 0;
            }
        }));

        if (error) {
            throw error;
        }

        return result;
    }

    function include (path, options) {
        var result = false;

        new Ajax.Request(path, Object.extend(options || {}, {
            method: 'get',
            asynchronous: false,
            evalJS: false,

            onSuccess: function (http) {
                try {
                    window.eval(http.responseText);
                    result = true;
                } catch (e) {
                    result = false;
                }
            }
        }));

        return result;
    }

    function require (path, options) {
        var error = false;

        new Ajax.Request(path, Object.extend(options || {}, {
            method: 'get',
            asynchronous: false,
            evalJS: false,

            onSuccess: function (http) {
                try {
                    window.eval(http.responseText);
                } catch (e) {
                    error             = e;
                    error.fileName    = path;
                    error.lineNumber -= 5;
                }
            },

            onFailure: function (http) {
                error = new Error('Failed to retrieve `#{file}` (#{status} - #{statusText}).'.interpolate({
                    file:       path,
                    status:     http.status,
                    statusText: http.statusText
                }));

                error.fileName   = path;
                error.lineNumber = 0;

                error.http = {
                    status: http.status,
                    text:   http.statusText
                };
            }
        }));

        if (error) {
            throw error;
        }

        return true;
    }

    return {
        exists: exists,
        get:    get,

        execute: execute,
        include: include,
        require: require
    };
})();
