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

miniLOL.JSON = (function () {
    function convert (data) {
        if (Object.isObject(data)) {
            if (data.__miniLOL_is_xml) {
                return data.value.toXML();
            }
            else if (data.__miniLOL_is_function) {
                return Function.parse(data.value);
            }
            else {
                return miniLOL.JSON.unserializeSpecial(data);
            }
        }
        else {
            if (Object.isXML(data)) {
                return { __miniLOL_is_xml: true, value: String.fromXML(data) };
            }
            else if (Object.isFunction(data)) {
                return { __miniLOL_is_function: true, value: data.toString() };
            }
            else {
                return miniLOL.JSON.serializeSpecial(data);
            }
        }
    }

    function special (obj) {
        var result;

        if (Object.isObject(obj)) {
            result = Object.clone(obj);

            for (var key in obj) {
                result[key] = convert(obj[key]);
            }
        }
        else if (Object.isArray(obj)) {
            result = [];

            obj.each(function (data) {
                result.push(convert(data));
            });
        }
        else {
            result = obj;
        }
    
        return result;
    }
    
    function serialize (obj) {
        try {
            return Object.toJSON(miniLOL.JSON.serializeSpecial(obj));
        }
        catch (e) {
            return false;
        }
    }
    
    function unserialize (string) {
        if (!Object.isString(string)) {
            return null;
        }
    
        try {
            return miniLOL.JSON.unserializeSpecial(string.evalJSON());
        }
        catch (e) {
            return null;
        }
    }

    return {
        special:            special,
        serializeSpecial:   special,
        unserializeSpecial: special,

        serialize:   serialize,
        unserialize: unserialize,

        convert: convert
    };
})();
