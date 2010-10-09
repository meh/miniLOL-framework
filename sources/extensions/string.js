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
 * class String
 *
 *  Extensions to the built-in [[String]] object.
**/
Object.extend(String, (function () {
    function fromAttributes (attributes) {
        var result = '';

        for (var i = 0; i < attributes.length; i++) {
            result += '#{name}="#{value}" '.interpolate({
                name: attributes.item(i).nodeName,
                value: attributes.item(i).nodeValue
            });
        }

        return result;
    }
    
    function fromXML (node) {
        if (!Object.isXML(node)) {
            return false;
        }

        return new XMLSerializer().serializeToString(node);
    }

    return {
        fromAttributes: fromAttributes,
        fromXML:        fromXML
    };
})());

Object.extend(String.prototype, (function () {
    /**
     *  String#parseQuery([separator = /&/]) -> Object
    **/
  
    /** alias of: String#parseQuery, related to: Hash#toQueryString
     *  String#toQueryParams([separator = /&/]) -> Object
     *
     *  Parses a URI-like query string and returns an object composed of
     *  parameter/value pairs.
     *  
     *  This method is realy targeted at parsing query strings (hence the default 
     *  value of`'&'` for the `separator` argument).
     *  
     *  For this reason, it does _not_ consider anything that is either before a 
     *  question  mark (which signals the beginning of a query string) or beyond 
     *  the hash symbol (`'#'`), and runs `decodeURIComponent()` on each 
     *  parameter/value pair.
     *  
     *  [[String#toQueryParams]] also aggregates the values of identical keys into 
     *  an array of values.
     *  
     *  Note that parameters which do not have a specified value will be set to 
     *  `true`.
     *  
     *  ##### Examples
     *  
     *      'section=blog&id=45'.toQueryParams();
     *      // -> { section: 'blog', id: '45' }
     *      
     *      'section=blog;id=45'.toQueryParams();
     *      // -> { section: 'blog', id: '45' }
     *      
     *      'http://www.example.com?section=blog&id=45#comments'.toQueryParams();
     *      // -> { section: 'blog', id: '45' }
     *      
     *      'section=blog&tag=javascript&tag=prototype&tag=doc'.toQueryParams();
     *      // -> { section: 'blog', tag: ['javascript', 'prototype', 'doc'] }
     *      
     *      'tag=ruby%20on%20rails'.toQueryParams();
     *      // -> { tag: 'ruby on rails' }
     *      
     *      'id=45&raw'.toQueryParams();
     *      // -> { id: '45', raw: true }
    **/
    function toQueryParams (separator) {
        if (!Object.isRegExp(separator)) {
            separator = /&/;
        }

        var result  = {};
        var matches = this.match(/[?#](.*?)([#?]|$)/);

        if (!matches) {
            return result;
        }

        var blocks = matches[1].split(separator);
        for (var i = 0; i < blocks.length; i++) {
            var parts = blocks[i].split(/=/);
            var name  = parts[0].decodeURIComponent();
            var value = parts[1]

            if (value) {
                if (!Object.isUndefined(result[name])) {
                    if (!Object.isArray(result[name])) {
                        result[name] = [result[name], value];
                    }
                    else {
                        result[name].push(value)
                    }
                }
                else {
                    result[name] = value.decodeURIComponent();
                }
            }
            else {
                result[name] = true;
            }
        }

        return result;
    }

    function toXML () {
        return new DOMParser().parseFromString(this, 'text/xml');
    }

    function isURL () {
        return /^(\w+):(\/\/.+?(:\d)?)(\/)?/.test(this) || /^mailto:([\w.%+-]+@[\w.]+\.[A-Za-z]{2,4})$/.test(this);
    }

    function parseURL () {
        var match;
        
        if (match = this.match(/^mailto:(([\w.%+-]+)@([\w.]+\.[A-Za-z]{2,4}))$/)) {
            return {
                protocol: 'mailto',
                uri:      match[1],
                user:     match[2],
                host:     match[3]
            };
        }

        if (match = this.match(/^((\w+):\/\/(((.+?)(:(\d+))?)(\/.*)?))$/)) {
            return {
                full:     match[1],
                protocol: match[2],
                uri:      match[3],
                host:     match[4],
                hostname: match[5],
                port:     match[7],
                path:     match[8]
            };
        }

        return false;
    }

    function blank () {
        return this == 0;
    }

    function getHashFragment () {
        var matches = this.match(/(#.*)$/);

        return (matches) ? matches[1] : '';
    }

    function splitEvery (num) {
        var result = new Array;

        for (var i = 0; i < this.length; i += num) {
            result.push(this.substr(i, num));
        }

        return result;
    }

    function test (pattern) {
        return pattern.test(this);
    }

    function commonChars (string) {
        return this.toArray().intersect(string.toArray());
    }

    function format (template) {
        var formatted = this;
        
        for (var i in template) {
            formatted = formatted.replace(new RegExp('\\{' + i + '\\}', 'g'), template[i].toString());
        }
    
        return formatted;
    }

    function reverse () {
        return this.toArray().reverse().join('');
    }

    function translate (table, second) {
        var result = this;

        if (second) {
            Object.keys(table).each(function (key) {
                if (!second[key]) {
                    throw new Error('The second table value is missing.');
                }
                
                if (table[key].is(RegExp)) {
                    result = result.replace(eval(table[key].global ? table[key].toString() : table[key].toString() + 'g'));
                }
                else {
                    result = result.replace(new RegExp(table[key], 'g'), second[key]);
                }
            });
        }
        else {
            Object.values(table).each(function (match) {
                if (match.length != 2) {
                    throw new Error('The array has to be [regex, translation].');
                }

                if (match[0].is(RegExp)) {
                    result = result.replace(eval(match[0].global ? match[0].toString() : match[0].toString() + 'g'), match[1]);
                }
                else {
                    result = result.replace(new RegExp(match[0], 'g'), match[1]);
                }
            });
        }

        return result;
    }

    function interpolate (object, pattern) {
        if (Object.isRegExp(pattern)) {
            return new Template(this, pattern).evaluate(object);
        }
        else {
            return new miniLOL.Template(this, pattern).evaluate(object)
        }
    }

    function toNumber (integer) {
        return (integer) ? parseInt(this) : parseFloat(this);
    }

    function toBase (base) {
        return this.toNumber().toBase(base);
    }

    function fromBase (base) {
        return parseInt(this, base);
    }

    function toCode () {
        return this.charCodeAt(0);
    }

    function toPaddedString (length, pad, pad2) {
        var pad = (Object.isUndefined(pad2 || pad)) ? '0' : (pad2 || pad).toString();

        return pad.times(length - this.length) + this;
    }

    function toInvertedCase () {
        var result = '';

        for (var i = 0, length = this.length; i < length; i++) {
            var chr  = this.charAt(i);
            var down = chr.toLowerCase();
            var up   = chr.toUpperCase();

            if (up == down) {
                result += down;
            }
            else {
                if (chr == down) {
                    result += up;
                }
                else {
                    result += down;
                }
            }
        }

        return result;
    }

    var _encodeURI          = window.encodeURI;
    var _decodeURI          = window.decodeURI;
    var _encodeURIComponent = window.encodeURIComponent;
    var _decodeURIComponent = window.decodeURIComponent;

    function encodeURI () {
        return _encodeURI(this);
    }

    function decodeURI () {
        return _decodeURI(this);
    }

    function encodeURIComponent () {
        return _encodeURIComponent(this);
    }

    function decodeURIComponent () {
        return _decodeURIComponent(this);
    }

    return {
        toQueryParams: toQueryParams,
        parseQuery:    toQueryParams,
        toXML:         toXML,

        isURL:    isURL,
        parseURL: parseURL,

        blank: blank,

        getHashFragment: getHashFragment,

        splitEvery:  splitEvery,
        test:        test,
        commonChars: commonChars,
        format:      format,
        reverse:     reverse,
        translate:   translate,
        interpolate: interpolate,

        toNumber:       toNumber,
        toBase:         toBase,
        fromBase:       fromBase,
        toCode:         toCode,
        toPaddedString: toPaddedString,
        toInvertedCase: toInvertedCase,

        encodeURI:          encodeURI,
        decodeURI:          decodeURI,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent
    };
})());
