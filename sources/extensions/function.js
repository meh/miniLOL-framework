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

Function.empty = function () { };

Object.extend(Function, (function () {
    function parse (string) {
        var matches = string.match(/^function\s*\((.*?)\)[\s\n]*\{([\s\S]*)\}[\s\n]*/m);

        if (!matches) {
            return;
        }

        var signature = matches[1].split(/\s*,\s*/);
        var body      = matches[2];

        return new Function(signature, body);
    }

    return {
        parse: parse
    };
})());

Object.extend(Function.prototype, (function () {
    function clone () {
        return Function.parse(this.toString());
    }

    return {
        clone: clone
    };
})());
