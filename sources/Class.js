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
 *  Class
**/

Class = (function () {
    var Type = {
        Normal:   0x01,
        Abstract: 0x02
    };

    var Methods = (function () {
        function addMethods (source) {
            var ancestor   = this.superclass && this.superclass.prototype; // if superclass is defined get its prototype
            var properties = Object.keys(source);

            for (var i = 0, length = properties.length; i < length; i++) {
                var name  = properties[i];
                var value = source[name];

                if (ancestor && Object.isFunction(value) && value.argumentNames().first() == '$super') {
                    var method = value;
     
                    value = (function (m) {
                        return function () {
                            return ancestor[m].apply(this, arguments);
                        };
                    })(name).wrap(method);
     
                    value.valueOf  = method.valueOf.bind(method);
                    value.toString = method.toString.bind(method);
                }

                this.prototype[name] = value;

                if (this.__type__ == Class.Abstract) {
                    this[name] = value;
                }
            }
        }

        function addStatic (source) {
            var properties = Object.keys(source);

            for (var i = 0, length = properties.length; i < length; i++) {
                var name   = properties[i];
                this[name] = source[name];
            }
        }

        function addAttributes (source) {
            Object.extendAttributes(this.prototype, source);

            if (this.__type__ == Class.Abstract) {
                Object.extendAttributes(this, source);
            }
        }

        return {
            addMethods:    addMethods,
            addStatic:     addStatic,
            addAttributes: addAttributes
        };
    })();

    function create () {
        var properties = $A(arguments);
        var parent     = (Object.isFunction(properties.first())) ? properties.shift() : null;

        var klass = function () {
            switch (this.__type__) {
                case Type.Abstract:
                throw new Error('You cannot instantiate an abstract class.');
                break;

                default:
                if (Object.isFunction(this.initialize)) {
                    return this.initialize.apply(this, arguments);
                }
                break;
            }

            return null;
        }

        klass['__miniLOL.Class__'] = true;

        Object.extend(klass, Class.Methods);
        klass.superclass = parent
        klass.subclasses = [];
    
        if (parent) {
            if (!parent.__type__) {
                parent.__type__ = Type.Normal;
            }

            if (!parent.subclasses) {
                parent.subclasses = [];
            }

            var subclass       = Function.empty.clone();
            subclass.prototype = parent.prototype
            klass.prototype    = new subclass;
            parent.subclasses.push(klass);
        }

        klass.__type__ = klass.prototype.__type__ = properties.first().type || Class.Normal;

        properties.each(function (properties) {
            klass.addMethods({ initialize: properties.initialize || properties.constructor || Function.empty.clone() });
            klass.addMethods(Object.without(properties, ['constructor', 'initialize', 'Methods', 'Static', 'Attributes']));

            klass.addMethods(properties.Methods || {});
            klass.addStatic(properties.Static || {});
            klass.addAttributes(properties.Attributes || {});
        });
      
        klass.prototype.constructor = klass;

        return klass;
    }

    return {
        create: create,

        Type:    Type,
        Methods: Methods
    };
})();

