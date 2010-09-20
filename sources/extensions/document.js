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

if (!Object.isObject(window.Document)) {
    window.Document = {};
}

Object.extend(Document, {
    fix: function (obj) {
        if (!obj) {
            return;
        }

        if (Prototype.Browser.IE) {
            obj = { real: obj };

            obj.documentElement = obj.real.documentElement;

            obj.getElementsByTagName = function (name) {
                return this.real.getElementsByTagName(name);
            };

            obj.getElementById = function (id) {
                return miniLOL.utils.XML.getElementById.call(this.real, id);
            };

            obj.real.setProperty('SelectionLanguage', 'XPath');
        }
        else if (!Prototype.Browser.Good) {
            obj.getElementById = function (id) {
                return this.xpath("//*[@id='#{0}']".interpolate([id])).first();
            };
        }

        obj.xpath  = Element.xpath;
        obj.select = Element.select;

        return obj;
    },

    check: function (xml, path) {
        var error = false;

        if (!xml) {
            error = 'There is a syntax error.';
        }

        if (xml.documentElement.nodeName == 'parsererror') {
            error = xml.documentElement.textContent;
        }

        if (path && error) {
            miniLOL.error('Error while parsing #{path}\n\n#{error}'.interpolate({
                path:  path,
                error: error
            }), true);

            return error;
        }

        return error;
    }
});
