/* Copyleft meh. [http://meh.doesntexist.org | meh.ffff@gmail.com]
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

Object.extend(Object, (function () {
    function isBoolean (val) {
        return typeof val == 'boolean' || val.constructor === Boolean;
    }

    function isObject (val) {
        return typeof val == 'object';
    }

    function isDocument (val) {
        return val.toString().include('Document');
    }

    function isXML (val) {
        if (typeof val !== 'object') {
            return false;
        }

        val = val.ownerDocument || val;

        if (!val.documentElement) {
            return false;
        }

        return val.documentElement.nodeName != "HTML";
    }

    function fromAttributes (attributes) {
        var result = {};

        for (var i = 0; i < attributes.length; i++) {
            result[attributes.item(i).nodeName] = attributes.item(i).nodeName;
        }

        return result;
    }

    function toQueryString (query) {
        var result = '';

        for (var name in query) {
            result += '#{name}=#{value}&'.interpolate({
                name: name,
                value: query[name]
            });
        }

        return result.substr(0, result.length - 1);
    }

    if (!Object.isFunction(Object.defineProperty)) {
        // Descriptor has 5 possible variables: value, get, set, writable, configurable, enumerable
        function defineProperty (object, property, descriptor) {
            if (Object.isFunction(descriptor.get) && Object.isFunction(object.__defineGetter__)) {
                object.__defineGetter__(property, descriptor.get);
            }
    
            if (Object.isFunction(descriptor.set) && Object.isFunction(object.__defineSetter__)) {
                object.__defineSetter__(property, descriptor.set);
            }
        }
    }
    else {
        var defineProperty = Object.defineProperty;
    }
    
    if (!Object.isFunction(Object.defineProperties)) {
        Object.defineProperties = function (object, properties) {
            for (var property in properties) {
                Object.defineProperty(object, property, properties[property]);
            }
        };
    }
    else {
        var defineProperties = Object.defineProperties;
    }
    
    if (!Object.isFunction(Object.create)) {
        Object.create = function (proto, properties) {
            var obj = new Object(proto);
    
            Object.defineProperties(obj, properties);
    
            return obj;
        };
    }
    else {
        var create = Object.create;
    }

    return {
        isBoolean:  isBoolean,
        isObject:   isObject,
        isDocument: isDocument,
        isXML:      isXML,

        fromAttributes: fromAttributes,
        toQueryString:  toQueryString,

        defineProperty:   defineProperty,
        defineProperties: defineProperties,
        create:           create
    };
})());

