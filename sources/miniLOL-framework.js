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

//= require "preparation"

/**
 *  miniLOL
 *
 *  The main miniLOL namespace.
**/

if (!Object.isObject(window.miniLOL)) {
    window.miniLOL = {
        error: Function.empty,

        Framework: {
            Version: '0.1'
        }
    };
}

//= require "Class"

//= require "utils"

//= require "File"
//= require "Template"

//= require "Document"
//= require "CSS"

//= require "Resource"
//= require "JSON"
//= require "Cookie"
//= require "Storage"

//= require "History"
