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

miniLOL.JSON = (function () {
    function parse (raw) {
        return new miniLOL.JSON(raw);
    }

    function serializeSpecial (obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
    
        obj = Object.clone(obj);
    
        for (var key in obj) {
            if (Object.isXML(obj[key])) {
                obj[key] = { __miniLOL_is_xml: true, value: String.fromXML(obj[key]) };
            }
            else if (Object.isFunction(obj[key])) {
                obj[key] = { __miniLOL_is_function: true, value: obj[key].toString() };
            }
            else {
                obj[key] = miniLOL.JSON.serializeSpecial(obj[key]);
            }
        }
    
        return obj;
    }
    
    function unserializeSpecial (obj) {
        if (typeof obj !== 'object') {
            return obj;
        }
        
        obj = Object.clone(obj);
    
        for (var key in obj) {
            if (obj[key].__miniLOL_is_xml) {
                obj[key] = obj[key].value.toXML();
            }
            else if (obj[key].__miniLOL_is_function) {
                obj[key] = Function.parse(obj[key].value);
            }
            else {
                obj[key] = miniLOL.JSON.unserializeSpecial(obj[key]);
            }
        }
    
        return obj;
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
        parse: parse,

        serializeSpecial:   serializeSpecial,
        unserializeSpecial: unserializeSpecial,

        serialize:   serialize,
        unserialize: unserialize
    };
})();
