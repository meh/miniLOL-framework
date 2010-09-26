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

Object.extend(Number.prototype, (function () {
    function milliseconds () {
        return this * 1000;
    }

    function seconds () {
        return this;
    }

    function minutes () {
        return this * 60;
    }

    function hours () {
        return this * 60 * 60;
    }

    function days () {
        return this * 60 * 60 * 24;
    }

    function weeks () {
        return this * 60 * 60 * 24 * 7;
    }

    function years () {
        return this * 60 * 60 * 24 * 375;
    }

    function upTo (num, iterator, context) {
        $R(this, num+1, true).each(iterator, context);
        return this;
    }

    function isEven () {
        return this % 2 == 0;
    }

    function isOdd () {
        return this % 2 != 0;
    }

    function abs () {
        return Math.abs(this);
    }

    function round () {
        return Math.round(this);
    }

    function ceil () {
        return Math.ceil(this);
    }

    function floor () {
        return Math.floor(this);
    }

    function log () {
        return Math.log(this);
    }

    function pow (exp) {
        return Math.pow(this, exp);
    }

    function sqrt () {
        return Math.sqrt(this);
    }

    function sin () {
        return Math.sin(this);
    }

    function cos () {
        return Math.cos(this);
    }

    function tan () {
        return Math.tan(this);
    }

    function asin () {
        return Math.asin(this);
    }

    function acos () {
        return Math.acos(this);
    }

    function atan () {
        return Math.atan(this);
    }

    function toBase (base) {
        return this.toString(base).toUpperCase();
    }

    function toChar () {
        return String.fromCharCode(this);
    }

    function digits () {
        var matches = this.toString().match(/e(.*)$/);

        if (matches) {
            return (matches[1].toNumber() > 0)
                ? 1+matches[1].toNumber()
                : 0;
        }
        else {
            return this.toString().length;
        }
    }

    return {
        milliseconds: milliseconds,
        ms:           milliseconds,

        seconds: seconds,
        second:  seconds,
        minutes: minutes,
        minute:  minutes,
        hours:   hours,
        hour:    hours,
        days:    days,
        day:     days,
        weeks:   weeks,
        week:    weeks,
        years:   years,
        year:    years,

        upTo: upTo,

        isEven: isEven,
        isOdd:  isOdd,

        abs:   abs,
        round: round,
        ceil:  ceil,
        floor: floor,
        log:   log,
        pow:   pow,
        sqrt:  sqrt,
        sin:   sin,
        cos:   cos,
        tan:   tan,
        asin:  asin,
        acos:  acos,
        atan:  atan,

        toBase: toBase,
        toChar: toChar,
        digits: digits
    };
})());