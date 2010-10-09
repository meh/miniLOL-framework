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

miniLOL.Template = Class.create({
    initialize: function (template) {
        if (Object.is(miniLOL.File, template)) {
            if (!template.loaded || !template.extension) {
                throw 'The File has to be loaded and have an extension.';
            }

            this.engine = miniLOL.Template.Engine.get(template.extension);

            if (!this.engine) {
                throw 'Engine not available for the given file.';
            }

            this.template = new this.engine(template);
        }
        else {
            this.template = new Template(template);
        }
    },

    interpolate: function (data) {
        return this.template.interpolate(data);
    }
});

miniLOL.Template.Engine = (function () {
    var _engines = {};

    function get (extension) {
        return _engines[extension];
    }

    function add (extension, engine) {
        _engines[extension] = engine;
    }

    function load (path) {
        miniLOL.utils.execute(path);
    }

    return {
        get:  get,
        add:  add,
        load: load
    };
})();
