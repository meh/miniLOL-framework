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

(function () {

Date.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var _format = {
    '%': function (date) {
        return '%';
    },

    'd': function (date) {
        return date.getDate().toPaddedString(2);
    },

    'D': function (date) {
        return Date.weekDays[date.getDay()].substr(0, 3);
    },

    'j': function (date) {
        return date.getDate();
    },

    'l': function (date) {
        return Date.weekDays[date.getDay()];
    },

    'N': function (date) {
        return (date.getDay() == 0) ? 7 : date.getDay();
    },
    
    'S': function (date) {
        return date.getDate().ordinalized();
    },

    'w': function (date) {
        return date.getDay();
    },

    'z': function (date) {
        var tmp = new Date();
        tmp.setFullYear(date.getFullYear());
        tmp.setDate(1);
        tmp.setMonth(0);

        return (date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24).ceil();
    },

    'W': function (date) {
        var tmp = new Date();
        tmp.setFullYear(date.getFullYear());
        tmp.setDate(1);
        tmp.setMonth(0);

        return (date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24 / 7).ceil();
    },

    'F': function (date) {
        return Date.months[date.getMonth()];
    },

    'd': function (date) {
        return (date.getMonth() + 1).toPaddedString(2);
    },

    'M': function (date) {
        return Date.months[date.getMonth()].substr(0, 3);
    },

    'n': function (date) {
        return date.getMonth() + 1;
    },

    't': function (date) {
        if (date.getMonth() % 2 == 0) {
            return 31;
        }

        if (date.getMonth() == 1) {
            return (date.getFullYear() % 4 == 0) ? 29 : 28;
        }

        return 30;
    },

    'L': function (date) {
        return (date.getFullYear() % 4) ? 0 : 1;
    },

    'o': function (date) {
        return date.getFullYear();
    },

    'Y': function (date) {
        return date.getFullYear();
    },

    'y': function (date) {
        return date.getFullYear().toString().substr(2, 2);
    },

    'a': function (date) {
        return (date.getHours() > 12) ? 'pm' : 'am';
    },

    'A': function (date) {
        return (date.getHours() > 12) ? 'PM' : 'AM';
    },

    'B': function (date) {
        var tmp = new Date(date);
        tmp.setHours(0);
        tmp.setSeconds(0);
        tmp.setMinutes(0);

        return (date.getTime() - tmp.getTime()) / 86.4;
    },

    'g': function (date) {
        return (date.getHours() + 1 > 12) ? (date.getHours() + 1) / 2 : date.getHours() + 1;
    },

    'g': function (date) {
        return date.getHours();
    },

    'h': function (date) {
        return ((date.getHours() + 1 > 12) ? (date.getHours() + 1) / 2 : date.getHours() + 1).toPaddedString(2);
    },

    'H': function (date) {
        return date.getHours().toPaddedString(2);
    },

    'i': function (date) {
        return date.getMinutes().toPaddedString(2);
    },

    's': function (date) {
        return date.getSeconds().toPaddedString(2);
    },

    'u': function (date) {
        return date.getMilliseconds() * 1000;
    },

    'r': function (date) {
        return date.toUTCString();
    },

    'U': function (date) {
        return date.getTime();
    }
};

Object.extend(Date, (function () {
    var _parse = Date.parse

    /**
     *  Date.parse(string[, date]) -> Date
    **/
    function parse (string, date) {
        if (!string.include('%')) {
            return _parse(string);
        }
    }

    return {
        parse: parse
    };
})());

Object.extend(Date.prototype, (function () {
    function format (string) {
            
    }

    return {
        format: format
    };
})());

})();
