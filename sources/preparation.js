/* Copyleft meh. [http://meh.paranoid.pk | meh@paranoici.org]
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

/* Cross-Browser faggotree */
(function () {

if (Prototype.Browser.IE) {
    Prototype.Browser.InternetExplorer = true;
}

if (Prototype.Browser.Gecko) {
    Prototype.Browser.Mozilla = true;
}

if (navigator.userAgent.match(/Chrome/)) {
    Prototype.Browser.Chrome = true;
}

if (navigator.userAgent.match(/Safari/) && !Prototype.Browser.Chrome) {
    Prototype.Browser.Safari = true;
}

if (Prototype.Browser.Mozilla || Prototype.Browser.Opera) {
    Prototype.Browser.Good = true;
}
else {
    Prototype.Browser.Bad = true;
}

Prototype.Browser.Name = window.navigator.appName;

var version = window.navigator.appVersion;

try {
    if (Prototype.Browser.IE) {
        Prototype.Browser.Version = parseFloat(version.match(/MSIE ([^;]*)/)[1]);
    }
    else if (Prototype.Browser.Mozilla || Prototype.Browser.Opera) {
        Prototype.Browser.Version = parseFloat(version);
    }
    else {
        throw null;
    }
}
catch (e) {
    Prototype.Browser.Version = 0;
}

if (Prototype.Browser.IE) {
    Error.prototype.toString = function () {
        return '#{name}: #{description}<br/><br/>#{stack}'.interpolate({
            name:        this.name,
            description: this.description,
            stack:       (this.stack || '').replace(/\n/g, '<br/>')
        });
    };
}
else if (Prototype.Browser.Opera) {
    Error.prototype.toString = function () {
        return '#{name}: #{message}'.interpolate(this);
    };
}
else if (Prototype.Browser.Gecko) {
    Error.prototype.toString = function () {
        return '#{name}: #{message}<br/><br/>#{stack}'.interpolate({
            name:       this.name,
            message:    this.message,
            stack:      this.stack.replace(/\n/g, '<br/>')
        });
    };
}
else if (Prototype.Browser.Chrome || Prototype.Browser.Safari) {
    Error.prototype.toString = function () {
        return '#{name}: #{message}<br/><br/>#{stack}'.interpolate({
            name:    this.name,
            message: this.message,
            stack:   this.stack.replace(/\n/g, '<br/>')
        });
    };
}

/* TODO: This shit doesn't work properly, it crashed IE 8 and doesn't do anything on IE 6
if (Prototype.Browser.IE) {
    (function () {
        function addBehaviors (style) {
            $A(style.rules).each(function (rule) {
                if (rule.style['border-radius']) {
                    rule.style['behavior'] = 'url(system/PIE.htc)';
                }
            });
        }

        Event.observe(document, ':initialized', function (event) {
            $A(document.styleSheets).each(function (style) {
                addBehaviors(style);
            });
        });

        Event.observe(document, ':css.create', function (event) {
            addBehaviors(event.memo);
        });
    })();
}
*/

if (Prototype.Browser.IE) {
    if (!window.DOMParser) {
        window.DOMParser = Class.create({
            parseFromString: function (string) {
                var xml = new AciveXObject('Microsoft.XMLDOM');

                xml.async = 'false';
                xml.loadXML(string);

                return xml;
            }
        });
    }

    if (!window.XMLSerializer) {
        window.XMLSerializer = Class.create({
            serializeToString: function (node) {
                return node.xml
            }
        });
    }
}

})();

//= require "extensions"
