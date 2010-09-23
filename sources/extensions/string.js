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
    function toQueryParams () {
        var result  = {};
        var matches = this.match(/[?#](.*)$/);

        if (!matches) {
            return result;
        }

        var blocks = matches[1].split(/&/);
        for (var i = 0; i < blocks.length; i++) {
            var parts = blocks[i].split(/=/);
            var name  = parts[0].decodeURIComponent();

            if (parts[1]) {
                result[name] = parts[1].decodeURIComponent();
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
        var match = this.match(/^mailto:([\w.%+-]+@[\w.]+\.[A-Za-z]{2,4})$/);
        if (match) {
            return {
                protocol: 'mailto',
                uri:      match[1]
            };
        }

        match = this.match(/^(\w+):(\/\/.+?(:\d)?)(\/)?/);

        if (!match) {
            return false;
        }

        return {
            protocol: match[1],
            uri:      match[2]
        };
    }

    function blank () {
        return this == 0;
    }

    function getHashFragment () {
        var matches = this.match(/(#.*)$/);

        return (matches) ? matches[1] : '';
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
        toXML:         toXML,

        isURL: isURL,
        blank: blank,

        getHashFragment: getHashFragment,

        encodeURI:          encodeURI,
        decodeURI:          decodeURI,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent
    };
})());
