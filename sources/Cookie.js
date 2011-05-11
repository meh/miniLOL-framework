/* Copyleft meh. [http://meh.paranoid.pk | meh@paranoici.org]
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

/** section: Language
 *  miniLOL.Cookie
 *
 *  A singleton to easily manage cookies.
**/
miniLOL.Cookie = (function () {
    function _options (options) {
        return Object.extend({
            expires: new Date(Date.now() + (1).day().ms()),
            path:    '',
            domain:  '',
            secure:  '',

            raw: false
        }, options || {});
    }

    /**
     *  miniLOL.Cookie.encode(key, value[, options = {}]) -> String
     *  - options (Object): Cookie options, maxAge, expires, path, domain.
     *
     *  Returns a string understandable by document.cookie with the given data.
     *
     *  ##### Example
     *
     *      miniLOL.Cookie.encode('cookie', 'I am a sweety :3', { maxAge: (2).days() });
     *      // -> "cookie=I%20am%20a%20sweety%20%3A3; max-age=172800; "
    **/
    function encode (key, value, options) {
        if (Object.isUndefined(options)) {
            options = {};
        }

        return "#{key}=#{value}; #{maxAge}#{expires}#{path}#{domain}#{secure}".interpolate({
            key:   key.encodeURIComponent(),
            value: value.encodeURIComponent(),

            maxAge:  (!Object.isUndefined(options.maxAge))  ? 'max-age=#{0}; '.interpolate([options.maxAge]) : '',
            expires: (!Object.isUndefined(options.expires)) ? 'expires=#{0}; '.interpolate([options.expires.toUTCString()]) : '',
            path:    (!Object.isUndefined(options.path))    ? 'path=#{0}; '.interpolate([options.path]) : '',
            domain:  (!Object.isUndefined(options.domain))  ? 'domain=#{0}; '.interpolate([options.domain]) : '',
            
            secure: (options.secure) ? 'secure' : ''
        });
    }

    /**
     *  miniLOL.Cookie.keys() -> Array
     *
     *  Returns an Array with all the cookie names available.
    **/
    function keys () {
        var result = [];

        window.document.cookie.split(/; /).each(function (cookie) {
            cookie = cookie.split(/=/);

            result.push(cookie[0]);
        });

        return result.uniq();
    }

    /**
     *  miniLOL.Cookie.get(key[, options = {}]) -> String | Object
     *  - options (Object): Options on retrieval.
     *
     *  Returns the content of the cookie as String or Object (if correct JSON).
     *
     *  ##### Example
     *
     *      // Assume we have a cookie called 'cookie' with '{"sugar":23}' as value
     *
     *      miniLOL.Cookie.get('cookie');
     *      // This will return an Object `{ sugar: 23 }`
     *
     *      miniLOL.Cookie.get('cookie', { raw: true });
     *      // This will return a String `'{"sugar":23}'`
    **/
    function get (key, options) {
        var options = _options(options);
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
    }

    /**
     *  miniLOL.Cookie.set(key, value[, options = {}]) -> null
     *  - options (Object): Options on setting.
     *
     *  Sets a cookie with the given name/value. If the object is JSONable it's JSONified.
     *
     *  ##### Example
     *
     *      miniLOL.Cookie.set('cookie', { sugar: 23 });
     *      // This sets a cookie named `cookie` with the value `'{"sugar":23}'`.
     *
     *      miniLOL.Cookie.set('cookie', 'sugar', { raw: true });
     *      // This sets a cookie named `cookie` with the value `sugar`.
    **/
    function set (key, value, options) {
        var options = _options(options);

        if (!options.raw) {
            value = miniLOL.JSON.serialize(value) || value;
        }

        window.document.cookie = encode(key, value, options);
    }

    /**
     *  miniLOL.Cookie.remove(key[, options = {}]) -> null
     *  - options (Object): Options to pass to miniLOL.Cookie.encode, be sure
     *  to use the same options you used when you set the cookie you want to delete.
     *
     *  Remove the cookie with the given name.
    **/
    function remove (key, options) {
        window.document.cookie = encode(key, '', Object.extend(_options(options), {
            expires: new Date(0)
        }));
    }

    /**
     *  miniLOL.Cookie.clear() -> null
     *
     *  Remove all cookies.
    **/
    function clear () {
        keys().each(function (cookie) {
            remove(cookie);
        });
    }

    // Enumerable implementation
    function _each (iterator) {
        keys().each(function (key) {
            var value = get(key);
            var pair  = [key, value];

            pair.name  = key;
            pair.key   = key;
            pair.value = value;

            iterator(pair);
        });
    }

    return Object.extend(Enumerable, {
        _each: _each,

        encode: encode,
        keys:   keys,
        get:    get,
        set:    set,
        remove: remove,
        unset:  remove,
        clear:  clear
    });
})();
