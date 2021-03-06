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

/** section: Extensions
 * class Element
 *
 *  Extensions to the Prototype [[Element]] object.
**/

if (Prototype.Browser.IE && !document.head) {
  document.head = document.getElementsByTagName('head')[0];
}

Element.addMethods((function () {
    function load (path, options) {
        if (options && !Object.isUndefined(options.frequency)) {
            new Ajax.PeriodicalUpdater(this, path, options);
        }
        else {
            new Ajax.Updater(this, path, options);
        }
    }

    var xpath;

    if (Prototype.Browser.IE) {
        xpath = function (element, query) {
            if (Object.isUndefined(query)) {
                query   = element;
                element = this;
            }
    
            var result = [];
            var tmp    = element.selectNodes(query);
    
            for (var i = 0; i < tmp.length; i++) {
                result.push(tmp.item(i));
            }
    
            return result;
        }
    }
    else {
        xpath = function (element, query) {
            if (Object.isUndefined(query)) {
                query   = element;
                element = this;
            }
    
            var result = [];
            var tmp    = (element.ownerDocument || element).evaluate(query, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
            for (var i = 0; i < tmp.snapshotLength; i++) {
                result.push(tmp.snapshotItem(i));
            }
    
            return result;
        }
    }

    function select (element, query) {
        if (Object.isUndefined(query)) {
            query   = element;
            element = this;
        }

        return Prototype.Selector.select(query, element);
    }

    function getTextDescendants (element) {
        element = element || this;

        var result = [];

        function accumulateTextChildren (parent) {
            var child = parent.firstChild;

            while (child) {
                if (Node.TEXT_NODE == child.nodeType) {
                    result.push(child);
                }

                if (Object.isElement(child)) {
                    accumulateTextChildren(child);
                }

                child = child.nextSibling;
            }
        }

        accumulateTextChildren(element);

        return result;
    }

    function getFirstText (elements) {
        elements = elements || this;

        var result = '';

        if (Object.isElement(elements)) {
            elements = $A(elements.childNodes);
        }
        else if (!Object.isArray(elements)) {
            elements = $A(elements);
        }


        elements.each(function (element) {
            switch (element.nodeType) {
                case Node.ELEMENT_NODE:
                throw $break;
                break;

                case Node.CDATA_SECTION_NODE:
                case Node.TEXT_NODE:
                if (!element.nodeValue.blank()) {
                    result = element.nodeValue.strip();
                    throw $break;
                }
                break;
            }
        });

        return result;
    }

    function toObject (element) {
        element = element || this;

        var result = {};

        if (!Object.isElement(element) && !Object.isDocument(element)) {
            return result;
        }

        $A(element.childNodes).each(function (node) {
            if (node.nodeType != Node.ELEMENT_NODE) {
                return;
            }

            if (node.getElementsByTagName('*').length == 0) {
                var content = '';

                $A(node.childNodes).each(function (text) {
                    if (text.nodeType != Node.CDATA_SECTION_NODE && text.nodeType != Node.TEXT_NODE) {
                        return;
                    }

                    if (text.nodeValue.blank()) {
                        return;
                    }

                    content += text.nodeValue;
                });

                result[node.nodeName] = content;
            }
            else {
                result[node.nodeName] = Element.toObject(node);
            }
        });

        return result;
    }

    return {
        load:               load,
        xpath:              xpath,
        select:             select,
        getTextDescendants: getTextDescendants,
        getFirstText:       getFirstText,
        toObject:           toObject
    };
})());
