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
    interval: 0.15,

    initialize: function () {
        miniLOL.History.current = window.location.hash;

        if (Prototype.Browser.Opera && history.navigationMode) {
            history.navigationMode = 'compatible';
        }

        Event.observe(document, ':url.change', function (event) {
            miniLOL.History.current = event.memo;
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
            if ('onhashchange' in window && !(Prototype.Browser.InternetExplorer && Prototype.Browser.Version == 7)) {
                return miniLOL.History.Initializers.Default;
            }
            else if (Prototype.Browser.InternetExplorer) {
                return miniLOL.History.Initializers.InternetExplorer;
            }
            else {
                return miniLOL.History.Initializers.Unsupported;
            }
        },

        Default: function () {
            Event.observe(window, 'hashchange', function (event) {
                 Event.fire(document, ':url.change', (Prototype.Browser.Mozilla)
                    ? window.location.hash.replace(/^#/, '')
                    : decodeURIComponent(window.location.hash.replace(/^#/, ''))
                );
            });
        },

        Unsupported: function () {
            document.observe('dom:loaded', function () {
                miniLOL.History.reset(miniLOL.History.interval, miniLOL.History.Checkers.Default);
            });
        },

        InternetExplorer: function () {
            document.observe('dom:loaded', function () {
                miniLOL.History.IE = {
                    put: function (hash) {
                        var doc = miniLOL.History.IE.element.document;

                        doc.open();
                        doc.close();

                        doc.location.hash = encodeURIComponent(hash.substring(1));
                    },
    
                    get: function () {
                        var doc = miniLOL.History.IE.element.document;

                        return doc.location.hash.substring(1);
                    },
    
                    element: new Element('iframe', { name: '__miniLOL.History', style: 'display: none;', src: 'javascript:false' })
                };
 
                $(document.body).insert({ top: miniLOL.History.IE.element });

                var first = miniLOL.History.current;
                
                miniLOL.History.IE.put(first);

                miniLOL.History.reset(miniLOL.History.interval, miniLOL.History.Checkers.InternetExplorer);
            });
        }
    },

    Checkers: {
        Default: function () {
            if (miniLOL.History.current == window.location.hash) {
                return;
            }

            Event.fire(document, ':url.change', (Prototype.Browser.Mozilla)
                ? window.location.hash.replace(/^#/, '')
                : decodeURIComponent(window.location.hash.replace(/^#/, ''))
            );
        },

        InternetExplorer: function () {
            var hashes = {
                iframe: miniLOL.History.IE.get(),
                actual: window.location.hash,
                current: miniLOL.History.current
            };

            var url;

            if (hashes.actual != hashes.iframe) {
                if (hashes.actual != hashes.current) { // The user is moving in the History
                    url = miniLOL.History.current = hashes.iframe
                }
                else { // The user went to the actual URL
                    url = miniLOL.History.current = hashes.actual

                    miniLOL.History.IE.put(url);
                }

                Event.fire(document, ':url.change', url);
            }
        }
    }
}

miniLOL.History.initialize();
