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

var _parse = {
    '%': /(%)/,
    'd': /(\d\d)/
}

var _format = {
    // a literal %
    '%': function (date) {
        return '%';
    },

    // locale's abbreviated weekday name (e.g., Sun)
    'a': function (date) {
        return Date.weekDays[date.getDay()].substr(0, 3);
    },

    // locale's full weekday name (e.g., Sunday)
    'A': function (date) {
        return Date.weekDays[date.getDay()];
    },

    // locale's abbreviated month name (e.g., Jan)
    'b': function (date) {
        return Date.months[date.getMonth()].substr(0, 3);
    },

    // locale's full month name (e.g., January)
    'B': function (date) {
        return Date.months[date.getMonth()];
    },

    // locale's date and time (e.g., Thu Mar  3 23:05:25 2005)
    'c': function (date) {
        return date.format('%a %b %_d %X %Y');
    },

    // century; like %Y, except omit last two digits (e.g., 20)
    'C': function (date) {
        return date.getFullYear().substr(0, 2);
    },

    // day of month (e.g, 01)
    'd': function (date) {
        return date.getDate().toPaddedString(2);
    },

    'D': function (date) {
        return date.format('%m/%d/%y');
    },

    'd': function (date) {
        return (date.getMonth() + 1).toPaddedString(2);
    },

    'j': function (date) {
        return date.getDate();
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

        return ((date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24).ceil();
    },

    'W': function (date) {
        var tmp = new Date();
        tmp.setFullYear(date.getFullYear());
        tmp.setDate(1);
        tmp.setMonth(0);

        return ((date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24 / 7).ceil();
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

        return ((date.getTime() - tmp.getTime()) / 1000 / 86.4).toFixed(2);
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
    function parse (format, string) {
        if (!format.include('%')) {
            return _parse(format);
        }
    }

    return {
        parse: parse
    };
})());

Object.extend(Date.prototype, (function () {
    /**
     *  Date#format(format) -> String
     *  - format (String): The date format.
     *
     *  Format a string with the given format (lol redundancy).
     *
     *  The format string is date-like (date as in the *nix command).
     *
     *  %%     a literal %
     *
     *  %a     locale's abbreviated weekday name (e.g., Sun)
     *
     *  %A     locale's full weekday name (e.g., Sunday)
     *
     *  %b     locale's abbreviated month name (e.g., Jan)
     *
     *  %B     locale's full month name (e.g., January)
     *
     *  %c     locale's date and time (e.g., Thu Mar  3 23:05:25 2005)
     *
     *  %C     century; like %Y, except omit last two digits (e.g., 20)
     *
     *  %d     day of month (e.g, 01)
     *
     *
     *  %w     day of week (0..6); 0 is Sunday
     *
     *  %W     week number of year, with Monday as first day of week (00..53)
     *
     *  %x     locale's date representation (e.g., 12/31/99)
     *
     *  %X     locale's time representation (e.g., 23:13:48)
     *
     *  %y     last two digits of year (00..99)
     *
     *  %Y     year
     *
     *  %z     +hhmm numeric timezone (e.g., -0400)
     *
     *  %:z    +hh:mm numeric timezone (e.g., -04:00)
     *
     *  %::z   +hh:mm:ss numeric time zone (e.g., -04:00:00)
     *
     *  %:::z  numeric  time  zone  with  :  to necessary precision (e.g., -04,+05:30)
     *
     *  %Z     alphabetic time zone abbreviation (e.g., EDT)
     *
     *  By default, date  pads  numeric  fields  with  zeroes.   The  following
     *  optional flags may follow `%':
     *
     *  -      (hyphen) do not pad the field
     *
     *  _      (underscore) pad with spaces
     *
     *  0      (zero) pad with zeros
     *
     *  ^      use upper case if possible
     *
     *  #      use opposite case if possible
     *
     *  After  any  flags  comes  an optional field width, as a decimal number;
     *  then an optional modifier, which is either E to use the locale's alter‐
     *  nate  representations  if available, or O to use the locale's alternate
     *  numeric symbols if available.
    **/
    function format (format) {
        var date = this;

        return format.gsub(/%([\-_0^#])?(.)/, function (match) {
            return (_format[match[1]]) ? _format[match[1]](date) : match[1];
        });
    }

    return {
        format: format
    };
})());

})();
