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

miniLOL.JSON = Class.create({
    initialize: function (data) {
        this.replace(data);
    },

    get: function (key) {
        return this.data[key];
    },

    set: function (key, value) {
        return this.data[key] = value;
    },

    remove: function (key) {
        var tmp = this.data[key];

        delete this.data[key];

        return tmp;
    },

    clear: function () {
        var tmp   = this.data;
        this.data = {};

        return tmp;
    },

    replace: function (data) {
        var tmp = this.data;

        if (Object.isString(data)) {
            this.data = miniLOL.JSON.unserialize(data);
        }
        else {
            this.data = Object.extend({}, data);
        }

        return tmp;
    },

    toString: function () {
        return miniLOL.JSON.serialize(this.data) || '{}';
    }
});

miniLOL.JSON.parse = function (raw) {
    return new miniLOL.JSON(raw);
}

miniLOL.JSON.serializeSpecial = function (obj) {
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
};

miniLOL.JSON.unserializeSpecial = function (obj) {
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
};

miniLOL.JSON.serialize = function (obj) {
    try {
        return Object.toJSON(miniLOL.JSON.serializeSpecial(obj));
    }
    catch (e) {
        return false;
    }
};

miniLOL.JSON.unserialize = function (string) {
    if (!Object.isString(string)) {
        return null;
    }

    try {
        return miniLOL.JSON.unserializeSpecial(string.evalJSON());
    }
    catch (e) {
        return null;
    }
};
