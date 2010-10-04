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
 *  class Hash
 *
 *  Extensions to the Prototype Hash object.
**/
Hash.addMethods((function () {
    function clear () {
        var tmp      = this._object;
        this._object = {};

        return tmp;
    }

    function replace (data) {
        var tmp = this._object;

        if (Object.isString(data)) {
            this._object = miniLOL.JSON.unserialize(data);
        }
        else {
            this._object = Object.extend({}, data);
        }

        return tmp;
    }

    var _toJSON = Hash.prototype.toJSON

    function toJSON (improved) {
        if (improved) {
            return miniLOL.JSON.serialize(this._object) || '{}';
        }
        else {
            return _toJSON.call(this);
        }
    }

    return {
        remove: Hash.prototype.unset,

        clear:   clear,
        replace: replace,
        
        toJSON: toJSON
    };
})());
