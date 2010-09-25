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
        year:    years
    };
})());
