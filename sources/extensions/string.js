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

Object.extend(String, {
    fromAttributes: function (attributes) {
        var result = '';

        for (var i = 0; i < attributes.length; i++) {
            result += '#{name}="#{value}" '.interpolate({
                name: attributes.item(i).nodeName,
                value: attributes.item(i).nodeValue
            });
        }

        return result;
    },
    
    fromXML: function (node) {
        if (!Object.isXML(node)) {
            return false;
        }

        return new XMLSerializer().serializeToString(node);
    }
});

Object.extend(String.prototype, {
    toQueryParams: function () {
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
    },

    toXML: function () {
        return new DOMParser().parseFromString(this, 'text/xml');
    },

    isURL: function () {
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
    },

    blank: function () {
        return this == 0;
    },

    getHashFragment: function () {
        var matches = this.match(/(#.*)$/);

        return (matches) ? matches[1] : '';
    },

    encodeURI: function () {
        return encodeURI(this);
    },

    decodeURI: function () {
        return decodeURI(this);
    },

    encodeURIComponent: function () {
        return encodeURIComponent(this);
    },

    decodeURIComponent: function () {
        return decodeURIComponent(this);
    }
});
