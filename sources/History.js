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

/**
 *  miniLOL.History
 *
 *  History management namespace.
**/
miniLOL.History = {
    /**
     *  miniLOL.History.interval = 0.15
     *
     *  Standard interval for checking url changes.
    **/
    interval: 0.15,

    initialize: function () {
        miniLOL.History.current = window.location.hash || '#';

        if (Prototype.Browser.Opera && history.navigationMode) {
            history.navigationMode = 'compatible';
        }

        Event.observe(document, ':url.change', function (event) {
            miniLOL.History.current = (Object.isString(event.memo)) ? event.memo : '';
        });

        miniLOL.History.Initializers.get().call()
    },

    /**
     *  miniLOL.History.reset(interval[, callback]) -> null
     *  - interval (Number): A new interval checking.
     *  - callback (Function): The URL checking callback.
     *
     *  Reset the timer to change the check interval or the check function.
     *
     *  Available callbacks are:
     *  + miniLOL.History.Checkers.Default
     *  + miniLOL.History.Checkers.InernetExplorer
    **/
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
                    ? window.location.hash
                    : decodeURIComponent(window.location.hash)
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
                    check: function () {
                        if (!miniLOL.History.IE.element.parentNode || miniLOL.History.IE.element.parentNode.nodeName == '#document-fragment') {
                            $(document.body).insert({ top: miniLOL.History.IE.element });
                        }
                    },

                    put: function (hash) {
                        miniLOL.History.IE.check();

                        var doc = miniLOL.History.IE.element.contentWindow.document;

                        doc.open();
                        doc.close();

                        doc.location.hash = encodeURIComponent(hash);
                    },
    
                    get: function () {
                        miniLOL.History.IE.check();

                        return miniLOL.History.IE.element.contentWindow.document.location.hash;
                    },
    
                    element: new Element('iframe', { id: '__miniLOL.History', style: 'display: none !important; z-index: -9001 !important;', src: 'javascript:false;' })
                };

                $(document.body).insert({ top: miniLOL.History.IE.element });                
                miniLOL.History.IE.put(miniLOL.History.current);
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
                ? window.location.hash
                : decodeURIComponent(window.location.hash)
            );
        },

        InternetExplorer: function () {
            var hashes = {
                iframe: miniLOL.History.IE.get(),
                actual: window.location.hash || '#',
                current: miniLOL.History.current
            };

            if (hashes.actual != hashes.iframe) {
                if (hashes.actual && hashes.actual == hashes.current) { // The user is moving in the History
                    window.location.hash = miniLOL.History.current = hashes.iframe;
                }
                else { // The user went to the actual URL
                    miniLOL.History.IE.put(miniLOL.History.current = hashes.actual);
                }

                Event.fire(document, ':url.change', miniLOL.History.current);
            }
        }
    }
}

miniLOL.History.initialize();
