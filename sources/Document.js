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

/**
 *  miniLOL.Document
 *
 *  Namespace to work with Documents.
**/
miniLOL.Document = (function () {
    /**
     *  miniLOL.Document.fix(dom) -> Document
     *  - dom (Document): A Document object.
     *
     *  Fix the given document to have some useful standard functions cross-platformly.
    **/
    var fix;
    if (Prototype.Browser.IE) {
        fix = function (obj) {
            if (!obj) {
                return;
            }
    
            obj = { real: obj };

            obj.documentElement = obj.real.documentElement;

            obj.getElementsByTagName = function (name) {
                return this.real.getElementsByTagName(name);
            };

            obj.getElementById = (function (id) {
                return Element.xpath(this, "//*[@id='#{0}']".interpolate([id])).first();
            }).bind(obj.real);

            obj.real.setProperty('SelectionLanguage', 'XPath');

            obj.xpath  = Element.xpath.bind(obj.real);
            obj.select = Element.select.bind(obj.real);
    
            return obj;
        }
    }
    else if (!Prototype.Browser.Good) {
        fix = function (obj) {
            if (!obj) {
                return;
            }
    
            obj.getElementById = function (id) {
                return this.xpath("//*[@id='#{0}']".interpolate([id])).first();
            };

            obj.xpath  = Element.xpath;
            obj.select = Element.select;
    
            return obj;
        }
    }
    else {
        fix = function (obj) {
            if (!obj) {
                return;
            }
    
            obj.xpath  = Element.xpath;
            obj.select = Element.select;
    
            return obj;
        }
    }

    /**
     *  miniLOL.Document.check(xml, path) -> String
     *  - xml (Document): The DOMDocument to check.
     *  - path (String): The path where the XML was retrieved from.
     *
     *  Check if the Document has some parsing errors, and return the error message if present.
    **/
    function check (xml, path) {
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

    return {
        fix:   fix,
        check: check
    };
})();
