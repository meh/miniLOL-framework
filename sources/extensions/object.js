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

/** section: Extensions
 *  class Object
 *
 *  Extensions to the built-in [[Object]] object.
 *
 *  Some stuff is just an enhancement of Prototype's functions.
**/

Object.extend(Object, (function () {
    function is (klass, val) {
        return val && (val.constructor == klass || val == klass);
    }

    function isObject (val) {
        return typeof val == 'object' && val.constructor === Object;
    }

    function isBoolean (val) {
        return typeof val == 'boolean' || val.constructor === Boolean;
    }

    function isRegExp (val) {
        return !Object.isUndefined(val) && val.constructor == window.RegExp;
    }

    function isClass (val) {
        return Boolean(val['__miniLOL.Class__']);
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

    var buggy = (function () {
        for (var property in { toString: 1 }) {
            if (property === 'toString') {
                return false;
            }
        }

        return true;
    })();

    var keys;
    var values;

    if (buggy) {
        var _keys   = Object.keys;
        var _values = Object.values;

        var fix = ['toString', 'valueOf'];

        keys = function (object) {
            var result = _keys(object);

            fix.each(function (fix) {
                if (object[fix] != Object.prototype[fix]) {
                    result.push(fix);
                }
            });

            return result;
        }

        values = function (object) {
            var result = _values(object);

            fix.each(function (fix) {
                if (object[fix] != Object.prototype[fix]) {
                    result.push(object[fix]);
                }
            });

            return result;
        }
    }
    else {
        keys   = Object.keys;
        values = Object.values;
    }

    /**
     *  Object.extend(destination, source[, overwrite]) -> Object
     *  - destination (Object): The object to receive the new properties.
     *  - source (Object): The object whose properties will be duplicated.
     *  - overwrite (Boolean): Wether overwriting the value in destination or not. Defaults to true.
     *
     *  Copies all properties from the source to the destination object. Used by Prototype
     *  to simulate inheritance (rather statically) by copying to prototypes.
     *  
     *  Documentation should soon become available that describes how Prototype implements
     *  OOP, where you will find further details on how Prototype uses [[Object.extend]] and
     *  [[Class.create]] (something that may well change in version 2.0). It will be linked
     *  from here.
     *  
     *  Do not mistake this method with its quasi-namesake [[Element.extend]],
     *  which implements Prototype's (much more complex) DOM extension mechanism.
    **/
    function extend (destination, source, overwrite) {
        var overwrite  = (Object.isUndefined(overwrite)) ? true : Boolean(overwrite);
        var properties = Object.keys(source);

        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i];

            if (!overwrite && !Object.isUndefined(destionation[property])) {
                continue;
            }

            destination[property] = source[property];
        }

        return destination;
    }

    /**
     *  Object.extendAttributes(destination, source[, overwrite]) -> Object
     *  - destination (Object): The object to receive the new properties.
     *  - source (Object): The object with the attribute definitions.
     *  - overwrite (Boolean): Wether overwriting the value in destination or not. Defaults to true.
     *
     *  Extends an object with some emulated attributes.
     *
     *  ##### Examples
     *
     *      var lol = {};
     *      
     *      Object.extendAttributes(lol, {
     *          omg: {
     *              get: function (value) {
     *                  return value * 2;
     *              }
     *          }
     *      });
     *      
     *      lol.omg(2); // This sets the omg attribute to 2
     *      lol.omg();  // This gets the omg attribute
     *      // -> 4
     *
    **/
    function extendAttributes (destination, source, overwrite) {
        overwrite = (Object.isUndefined(overwrite)) ? true : Boolean(overwrite);

        for (var property in source) {
            if (!overwrite && !Object.isUndefined(destionation[property])) {
                continue;
            }

            (function () {
                var _saved;

                destination[property] = function (value, force) {
                    if (Object.isUndefined(value) && !force) {
                        if (Object.isFunction(source[property].get)) {
                            return source[property].get(_saved);
                        }
                        else {
                            return _saved;
                        }
                    }
                    else {
                        if (Object.isFunction(source[property].set)) {
                            return _saved = source[property].set(_saved, value);
                        }
                        else {
                            return _saved = value;
                        }
                    }
                };
            })();
        }

        return destination;
    }

    /**
     *  Object.without(object, exceptions) -> Object
     *  - object (Object): The source object.
     *  - exceptions (Array | String): Properties to exclude from the returned object.
     *
     *  Creates a shallow copy of the given object without the excluded properties.
    **/
    function without (object, exceptions) {
        var result = Object.extend({}, object);

        if (Object.isArray(exceptions)) {
            exceptions.each(function (exception) {
                delete result[exception];
            });
        }
        else {
            delete result[exceptions];
        }

        return result;
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
        is:         is,
        isObject:   isObject,
        isBoolean:  isBoolean,
        isRegExp:   isRegExp,
        isClass:    isClass,
        isDocument: isDocument,
        isXML:      isXML,

        fromAttributes: fromAttributes,
        toQueryString:  toQueryString,

        keys:   keys,
        values: values,

        extend:           extend,
        extendAttributes: extendAttributes,
        without:          without,

        defineProperty:   defineProperty,
        defineProperties: defineProperties,
        create:           create
    };
})());

