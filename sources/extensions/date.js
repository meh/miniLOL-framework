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
 *  class Date
 *
 *  Extensions to the built-in [[Date]] object.
**/

(function () {

Date.weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.months   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var _width = {
    'd': 2,
    'H': 2,
    'I': 2,
    'j': 3,
    'k': 2,
    'l': 2,
    'm': 2,
    'M': 2,
    'N': 9,
    'S': 2,
    'U': 2,
    'V': 2,
    'W': 2,
    'y': 2,

    'i': 3
};

var _parse = {
    '%': /(%)/,
    'd': /(\d\d)/
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

var _format = {
    flag: {
        '-': function (value, width) {
            return value;
        },

        '_': function (value, width) {
            return value.toPaddedString(width, 10, ' ');
        },

        '0': function (value, width) {
            return value.toPaddedString(width, 10, '0');
        },

        '^': function (value, width) {
            return value.toString().toUpperCase().toPaddedString(width, ' ')
        },

        '#': function (value, width) {
            return value.toString().toInvertedCase().toPaddedString(width, ' ');
        }
    },

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
        return date.getFullYear().toString().substr(0, 2);
    },

    // day of month (e.g, 01)
    'd': function (date) {
        return date.getDate();
    },

    // date; same as %m/%d/%
    'D': function (date) {
        return date.format('%m/%d/%y');
    },

    // day of month, space padded; same as %_d
    'e': function (date) {
        return date.format('%_d');
    },

    // full date; same as %Y-%m-%d
    'F': function (date) {
        return date.format('%Y-%m-%d');
    },

    // last two digits of year of ISO week number (see %G)
    'g': function (date) {
        return date.format('%y');
    },

    // year of ISO week number (see %V); normally useful only with %V
    'G': function (date) {
        return date.format('%Y');
    },

    // same as %b
    'h': function (date) {
        return date.format('%b');
    },

    // hour (00..23)
    'H': function (date) {
        return date.getHours();
    },

    // hour (01..12)
    'I': function (date) {
        var hours = date.getHours();

        return ((hours + 1 > 12) ? (hours + 1) / 2 : hours + 1);
    },

    // day of year (001..366)
    'j': function (date) {
        var tmp = new Date();
        tmp.setFullYear(date.getFullYear());
        tmp.setDate(1);
        tmp.setMonth(0);

        return ((date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24).ceil();
    },

    // hour ( 0..23)
    'k': function (date) {
        return date.format('%_H');
    },

    // hour ( 1..12)
    'l': function (date) {
        return date.format('%_l');
    },

    // month (01..12)
    'm': function (date) {
        return (date.getMonth() + 1);
    },

    // minute (00..59)
    'M': function (date) {
        return date.getMinutes();
    },

    // a newline
    'n': function (date) {
        return "\n";
    },

    // nanoseconds (000000000..999999999)
    'N': function (date) {
        return date.getMilliseconds() * 1000000;
    },

    // locale's equivalent of either AM or PM; blank if not known
    'p': function (date) {
        return (date.getHours() > 12) ? 'PM' : 'AM';
    },

    // like %p, but lower case
    'P': function (date) {
        return date.format('%#p');
    },

    // locale's 12-hour clock time (e.g., 11:11:04 PM)
    'r': function (date) {
        return date.format('%I:%M:%S %p');
    },

    // 24-hour hour and minute; same as %H:%M
    'R': function (date) {
        return date.format('%H:%M');
    },

    // seconds since 1970-01-01 00:00:00 UTC
    's': function (date) {
        return date.getDate();
    },

    // second (00..60)
    'S': function (date) {
        return date.getSeconds();
    },

    // a tab
    't': function (date) {
        return "\t";
    },

    // time; same as %H:%M:%S
    'T': function (date) {
        return date.format('%H:%M:%S');
    },

    // day of week (1..7); 1 is Monday
    'u': function (date) {
        return (date.getDay() == 0) ? 7 : date.getDay();
    },

    // week number of year, with Sunday as first day of week (00..53)
    'U': function (date) {
        var tmp = new Date();
        tmp.setFullYear(date.getFullYear());
        tmp.setDate(1);
        tmp.setMonth(0);

        return ((date.getTime() - tmp.getTime()) / 1000 / 60 / 60 / 24 / 7).ceil();
    },

    // ISO week number, with Monday as first day of week (01..53)
    'V': function (date) {
        return date.format('%U');
    },

    // day of week (0..6); 0 is Sunday
    'w': function (date) {
        return date.getDay();
    },

    // week number of year, with Monday as first day of week (00..53)
    'W': function (date) {
        return date.format('%U');
    },

    // locale's date representation (e.g., 12/31/99)
    'x': function (date) {
        return date.format('%m/%d/%y');
    },

    // locale's time representation (e.g., 23:13:48)
    'X': function (date) {
        return date.format('%T');
    },

    // last two digits of year (00..99)
    'y': function (date) {
        return date.getFullYear().toString().substr(2, 2)
    },

    // year
    'Y': function (date) {
        return date.getFullYear();
    },

    //== Additions ==
    
    // number of days in the given month
    'E': function (date) {
        if (date.getMonth() % 2 == 0) {
            return 31;
        }

        if (date.getMonth() == 1) {
            return (date.getFullYear() % 4 == 0) ? 29 : 28;
        }

        return 30;
    },

    // English ordinal suffix for the day of the month, 2 characters: st, nd, rd or th.
    'o': function (date) {
        return date.getDate().ordinalized();
    },

    // whether it's a leap year: 1 if it is a leap year, 0 otherwise.
    'O': function (date) {
        return (date.getFullYear() % 4) ? 0 : 1;
    },

    // Swatch Internet time
    'i': function (date) {
        var tmp = new Date(date);
        tmp.setHours(0);
        tmp.setSeconds(0);
        tmp.setMinutes(0);

        return ((date.getTime() - tmp.getTime()) / 1000 / 86.4).toFixed(2);
    }
};

Object.extend(Date.prototype, (function () {
    /**
     *  Date#format(format) -> String
     *  - format (String): The date format.
     *
     *  Format a string with the given format (lol redundancy).
     *
     *  The format string is date-like (date as in the *nix command).
     *
     *  `%%`     a literal %
     *
     *  `%a`     locale's abbreviated weekday name (e.g., Sun)
     *
     *  `%A`     locale's full weekday name (e.g., Sunday)
     *
     *  `%b`     locale's abbreviated month name (e.g., Jan)
     *
     *  `%B`     locale's full month name (e.g., January)
     *
     *  `%c`     locale's date and time (e.g., Thu Mar  3 23:05:25 2005)
     *
     *  `%C`     century; like %Y, except omit last two digits (e.g., 20)
     *
     *  `%d`     day of month (e.g, 01)
     *  
     *  `%D`     date; same as %m/%d/%y
     *
     *  `%e`     day of month, space padded; same as %_d
     *  
     *  `%F`     full date; same as %Y-%m-%d
     *  
     *  `%g`     last two digits of year of ISO week number (see %G)
     *  
     *  `%G`     year of ISO week number (see %V); normally useful only with %V
     *  
     *  `%h`     same as %b
     *  
     *  `%H`     hour (00..23)
     *  
     *  `%I`     hour (01..12)
     *  
     *  `%j`     day of year (001..366)
     *  
     *  `%k`     hour ( 0..23)
     *  
     *  `%l`     hour ( 1..12)
     *  
     *  `%m`     month (01..12)
     *  
     *  `%M`     minute (00..59)
     *  
     *  `%n`     a newline
     *  
     *  `%N`     nanoseconds (000000000..999999999)
     *  
     *  `%p`     locale's equivalent of either AM or PM; blank if not known
     *
     *  `%P`     like %p, but lower case
     *  
     *  `%r`     locale's 12-hour clock time (e.g., 11:11:04 PM)
     *  
     *  `%R`     24-hour hour and minute; same as %H:%M
     *  
     *  `%s`     seconds since 1970-01-01 00:00:00 UTC
     *  
     *  `%S`     second (00..60)
     *  
     *  `%t`     a tab
     *  
     *  `%T`     time; same as %H:%M:%S
     *  
     *  `%u`     day of week (1..7); 1 is Monday
     *  
     *  `%U`     week number of year, with Sunday as first day of week (00..53)
     *  
     *  `%V`     ISO week number, with Monday as first day of week (01..53)
     *  
     *  `%w`     day of week (0..6); 0 is Sunday
     *
     *  `%W`     week number of year, with Monday as first day of week (00..53)
     *
     *  `%x`     locale's date representation (e.g., 12/31/99)
     *
     *  `%X`     locale's time representation (e.g., 23:13:48)
     *
     *  `%y`     last two digits of year (00..99)
     *
     *  `%Y`     year
     *
     *  Additions
     *
     *  `%E`     number of days in the given month
     *
     *  `%o`     English ordinal suffix for the day of the month, 2 characters: st, nd, rd or th.
     *
     *  `%O`     whether it's a leap year: 1 if it is a leap year, 0 otherwise.
     *
     *  `%i`     Swatch Internet time
     *
     *  By default, date  pads  numeric  fields  with  zeroes.   The  following
     *  optional flags may follow `%':
     *
     *  `-`      (hyphen) do not pad the field
     *
     *  `_`      (underscore) pad with spaces
     *
     *  `0`      (zero) pad with zeros
     *
     *  `^`      use upper case if possible
     *
     *  `#`      use opposite case if possible
     *
     *  After  any  flags  comes  an optional field width, as a decimal number;
     *  then an optional modifier, which is either E to use the locale's alter‐
     *  nate  representations  if available, or O to use the locale's alternate
     *  numeric symbols if available.
     *
     *  ##### Examples
     *      
     *      new Date().format('%d%o day of %B')
     *      // -> "4th day of October"
    **/
    function format (format) {
        var date = this;

        return format.gsub(/%([\-_0^#])?(\d+)?(.)/, function (match) {
            var flag  = match[1] || '0';
            var width = parseInt(match[2] || _width[type] || '0');
            var type  = match[3];

            if (!_format[type]) {
                return match[0];
            }

            return _format.flag[flag](_format[type](date), width);
        });
    }

    return {
        format: format
    };
})());

})();
