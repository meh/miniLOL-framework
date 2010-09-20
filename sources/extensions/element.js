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

Element.addMethods({
    load: function (path, options) {
        if (options && !Object.isUndefined(options.frequency)) {
            new Ajax.PeriodicalUpdater(this, path, options);
        }
        else {
            new Ajax.Updater(this, path, options);
        }
    },

    xpath: function (element, query) {
        element = (Object.isElement(element) || Object.isDocument(element)) ? element : this;
        query   = (Object.isElement(element) || Object.isDocument(element)) ? query : element;

        var result = [];
        var tmp;

        if (Prototype.Browser.IE) {
            tmp = element.real.selectNodes(query);

            for (var i = 0; i < tmp.length; i++) {
                result.push(tmp.item(i));
            }
        }
        else {
            tmp = (element.ownerDocument || element).evaluate(query, element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (var i = 0; i < tmp.snapshotLength; i++) {
                result.push(tmp.snapshotItem(i));
            }
        }

        return result;
    },

    select: function (element, query) {
        element = (Object.isElement(element) || Object.isDocument(element)) ? element : this;
        query   = (Object.isElement(element) || Object.isDocument(element)) ? query : element;

        return Prototype.Selector.select(query, element);
    },

    getTextDescendants: function (element) {
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
    },

    toObject: function (element) {
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

                    if (text.nodeValue.isEmpty()) {
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
});
