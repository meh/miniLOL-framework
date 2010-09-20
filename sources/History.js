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

miniLOL.History = {
    interval: 0.2,

    initialize: function () {
        miniLOL.History.current = window.location.hash;

        Event.observe(window, 'hashchange', function (event) {
            miniLOL.History.current = event.memo = event.memo || window.location.hash.replace(/^#/, '');
        });

        miniLOL.History.Initializers.get().call()
    },

    reset: function (interval, callback) {
        if (Object.isNumber(interval)) {
            miniLOL.History.interval = interval;
        }

        if (!Object.isUndefined(miniLOL.History.timer)) {
            clearInterval(miniLOL.History.timer);
        }

        miniLOL.History.timer = setInterval(callback, miniLOL.History.interval * 1000);
    },

    Initializers: {
        get: function () {
            if ('onhashchange' in window && !navigator.userAgent.include('MSIE 7')) {
                return miniLOL.History.Initializers.Default;
            }
            else {
                return miniLOL.History.Initializers.Unsupported;
            }

        },

        Default: Prototype.emptyFunction,

        Unsupported: function () {
            miniLOL.History.reset(miniLOL.History.interval, miniLOL.History.Checkers.get());
        }
    },

    Checkers: {
        get: function () {
            if (Prototype.Browser.IE) {
                return miniLOL.History.Checkers.InternetExplorer;
            }
            else {
                return miniLOL.History.Checkers.Default;
            }
        },

        Default: function () {
            if (miniLOL.History.current == window.location.hash) {
                return;
            }

            Event.fire(window, 'hashchange', window.location.hash.replace(/^#/, ''));
        },

        InternetExplorer: function () {
        }
    }
}

miniLOL.History.initialize();
