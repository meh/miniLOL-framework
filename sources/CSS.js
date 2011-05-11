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

/**
 *  miniLOL.CSS
 *
 *  Namespace to work with CSS stuff.
**/
miniLOL.CSS = (function () {
    /**
     *  miniLOL.CSS.include(path) -> Element
     *  - path (String): The CSS path.
     *
     *  Includes a CSS with a `link` tag.
    **/
    function include (path, minified) {
        if (minified) {
            minified = path.replace(/\.css$/, '.min.css');
        }

        var style = $$('link').find(function (css) {
            return css.getAttribute('href') == path || css.getAttribute('href') === minified;
        });
        
        if (!style) {
            if (minified && miniLOL.utils.exists(minified)) {
                path = minified;
            }
            else {
                if (!miniLOL.utils.exists(path)) {
                    return false;
                }
            }

            style = new Element('link', {
                rel: 'stylesheet',
                href: path,
                type: 'text/css'
            });

            $$('head')[0].insert(style);

            Event.fire(document, ':css.included', style);
        }

        return style;
    }

    /**
     *  miniLOL.CSS.create(style[, id]) -> Element
     *  - style (String): The CSS content.
     *  - id (String): The `<style>` id.
     *
     *  Create a `style` tag and set the given content.
    **/
    function create (style, id) {
        var css = new Element('style', { type: 'text/css' });

        if (Prototype.Browser.IE) {
            css.styleSheet.cssText = style;
        }
        else {
            css.update(style);
        }

        if (id) {
            css.setAttribute('id', id);
        }

        $$('head').first().appendChild(css);

        Event.fire(document, ':css.created', css);

        return css;
    }

    return {
        include: include,
        create:  create
    };
})();
