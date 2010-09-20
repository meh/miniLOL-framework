/****************************************************************************
 * Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]          *
 *                                                                          *
 * This file is part of miniLOL.                                            *
 *                                                                          *
 * miniLOL is free software: you can redistribute it and/or modify          *
 * it under the terms of the GNU Affero General Public License as           *
 * published by the Free Software Foundation, either version 3 of the       *
 * License, or (at your option) any later version.                          *
 *                                                                          *
 * miniLOL is distributed in the hope that it will be useful,               *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of           *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            *
 * GNU Affero General Public License for more details.                      *
 *                                                                          *
 * You should have received a copy of the GNU Affero General Public License *
 * along with miniLOL.  If not, see <http://www.gnu.org/licenses/>.         *
 ****************************************************************************/

miniLOL.utils = {
    exists: function (path) {
        var result = false;

        new Ajax.Request(path, {
            method: 'head',
            asynchronous: false,

            onSuccess: function () {
                result = true;
            }
        });

        return result;
    },

    includeCSS: function (path) {
        var style;

        if (style = miniLOL.theme.style.list[path]) {
            return style;
        }
        else if (style = $$('link').find(function (css) { return css.getAttribute('href') == path })) {
            miniLOL.theme.style.list[path] = style;

            return style;
        }
        else if (style = miniLOL.utils.exists(path)) {
            style = new Element('link', {
                rel: 'stylesheet',
                href: path,
                type: 'text/css'
            });

            $$('head')[0].insert(style);

            Event.fire(document, ':css.included', style);

            return style;
        }
        else {
            return false;
        }
    },

    css: function (style, id) {
        var css = new Element('style', { type: 'text/css' }).update(style);

        if (id) {
            css.setAttribute('id', id);
        }

        $$('head').first().appendChild(css);

        Event.fire(document, ':css.created', css);

        return css;
    },

    execute: function (path) {
        var result;
        var error;

        new Ajax.Request(path, {
            method: 'get',
            asynchronous: false,
            evalJS: false,

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
        });

        if (error) {
            throw error;
        }

        return result;
    },

    include: function (path) {
        var result = false;

        new Ajax.Request(path, {
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
        });

        return result;
    },

    require: function (path) {
        var error = false;

        new Ajax.Request(path, {
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
        });

        if (error) {
            throw error;
        }

        return true;
    }
};
