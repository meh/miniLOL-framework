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

miniLOL.Cookie = {
    get: function (key, options) {
        var options = miniLOL.Cookie.options(options);
        var matches = window.document.cookie.match(RegExp.escape(key.encodeURIComponent()) + '=([^;]*)', 'g');

        if (!matches) {
            return;
        }

        var result = [];

        $A(matches).each(function (cookie) {
            cookie = cookie.match(/^.*?=(.*)$/)[1].decodeURIComponent();

            result.push((options.raw) ? cookie : miniLOL.JSON.unserialize(cookie) || cookie);
        });

        if (result.length == 1) {
            result = result[0];
        }

        return result;
    },

    set: function (key, value, options) {
        var options = miniLOL.Cookie.options(options);

        if (!options.raw) {
            value = miniLOL.JSON.serialize(value) || value;
        }

        window.document.cookie = miniLOL.Cookie.encode(key, value, options);
    },

    remove: function (key, options) {
        window.document.cookie = miniLOL.Cookie.encode(key, '', Object.extend(miniLOL.Cookie.options(options), {
            expires: new Date(0)
        }));
    },

    clear: function () {
        miniLOL.Cookie.keys().each(function (cookie) {
            miniLOL.Cookie.remove(cookie);
        });
    },

    keys: function () {
        var result = [];

        $A(window.document.cookie.split(/; /)).each(function (cookie) {
            cookie = cookie.split(/=/);

            if (cookie[1]) {
                result.push(cookie[0]);
            }
        });

        return result.uniq();
    },

    encode: function (key, value, options) {
        return "#{key}=#{value}; #{maxAge}#{expires}#{path}#{domain}#{secure}".interpolate({
            key:   key.encodeURIComponent(),
            value: value.encodeURIComponent(),

            maxAge:  (!Object.isUndefined(options.maxAge))  ? 'max-age=#{0}; '.interpolate([options.maxAge]) : '',
            expires: (!Object.isUndefined(options.expires)) ? 'expires=#{0}; '.interpolate([options.expires.toUTCString()]) : '',
            path:    (!Object.isUndefined(options.path))    ? 'path=#{0}; '.interpolate([options.path]) : '',
            domain:  (!Object.isUndefined(options.domain))  ? 'domain=#{0}; '.interpolate([options.domain]) : '',
            
            secure: (options.secure) ? 'secure' : ''
        });
    },

    options: function (options) {
        return Object.extend({
            expires: new Date(new Date().getTime() + 3600 * 1000),
            path:    '',
            domain:  '',
            secure:  '',

            raw: false
        }, options || {});
    }
};
