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
 *  class miniLOL.Storage
 *
 *  Creates and keeps an offline data storage.
 *
 *  This class lets you keep data in the browser even after reload/quit/whatever of
 *  the browser depending on the available backend.
**/
miniLOL.Storage = Class.create({
    /**
     *  new miniLOL.Storage(name[, backend])
    **/
    initialize: function (name, backend) {
        this.name    = name;
        
        this.backend = (miniLOL.Storage.Instances[name])
            ? miniLOL.Storage.Instances[name]
            : new (backend || miniLOL.Storage.Backends.available())(name);

        miniLOL.Storage.Instances[name] = this.backend;
    },

    get: function (key) {
        return this.backend.get(key.toString());
    },

    set: function (key, value, noSave) {
        return this.backend.set(key.toString(), value, noSave);
    },

    remove: function (key, noSave) {
        return this.backend.remove(key.toString(), noSave);
    },

    clear: function (noSave) {
        return this.backend.clear(noSave);
    },

    size: function () {
        return this.backend.size;
    },

    save: function () {
        this.backend.save();
    }
});

miniLOL.Storage.Instances = {};

miniLOL.Storage.Backend = Class.create(miniLOL.JSON, {
    initialize: function ($super, name, data) {
        $super(data);

        this.name = miniLOL.Storage.Backend.filter(name);

        if (Object.isString(data)) {
            this.size = data.size;
        }
    },

    get: function ($super, key) {
        return $super(key);
    },

    set: function ($super, key, value, noSave) {
        var result = $super(key, value);

        if (!noSave) {
            this.save();
        }

        return result;
    },

    remove: function ($super, key, noSave) {
        var result = $super(key);

        if (!noSave) {
            this.save();
        }

        return result;
    },

    clear: function ($super, noSave) {
        var result = $super();

        if (!noSave) {
            this.save();
        }

        return result;
    },

    replace: function ($super, data) {
        if (Object.isString(data)) {
            this.size = data.length;
        }
        else {
            this.size = 0;
        }

        return $super(data);
    }
});

Object.extend(miniLOL.Storage.Backend, {
    filter: function (value) {
        return value.replace(/\s/g, '');
    }
});

miniLOL.Storage.Backends = {
    available: function () {
        try {
            if (window.localStorage) {
                return miniLOL.Storage.Backends.LocalStorage;
            }
            else if (window.globalStorage) {
                return miniLOL.Storage.Backends.GlobalStorage;
            }
            else if (document.body.addBehavior) {
                return miniLOL.Storage.Backends.UserDataBehavior;
            }
            else {
                return miniLOL.Storage.Backends.Cookie;
            }
        }
        catch (e) {
            return miniLOL.Storage.Backends.Null;
        }
    },

    LocalStorage: Class.create(miniLOL.Storage.Backend, {
        initialize: function ($super, name) {
            $super(name);

            this.replace(window.localStorage['__miniLOL.storage.' + this.name] || '{}');
        },

        save: function () {
            var raw = this.toString();

            this.size = raw.length;

            window.localStorage['__miniLOL.storage.' + this.name] = raw;
        }
    }),

    GlobalStorage: Class.create(miniLOL.Storage.Backend, {
        initialize: function ($super, name) {
            $super(name);

            this.replace(window.globalStorage[window.location.hostname]['__miniLOL.storage.' + this.name] || '{}');
        },

        save: function () {
            var raw = this.toString();

            this.size = raw.length;

            window.globalStorage[window.location.hostname]['__miniLOL.storage.' + this.name] = raw;
        }
    }),

    UserDataBehavior: Class.create(miniLOL.Storage.Backend, {
        initialize: function ($super, name) {
            $super(name);
            
            this.element = document.createElement('link');
            this.element.addBehavior('#default#userData');
            $$('head')[0].appendChild(this.element);
            this.element.load('__miniLOL.storage.' + name);

            var raw   = this.element.getAttribute('__miniLOL.storage.' + this.name) || '{}';
            this.size = raw.length;
            this.replace(raw);
        },

        save: function () {
            var raw = this.toString();

            this.size = raw.length;

            this.element.setAttribute('__miniLOL.storage.' + this.name, raw);
            this.element.save('__miniLOL.storage.' + this.name);
        }
    }),

    Cookie: Class.create(miniLOL.Storage.Backend, {
        initialize: function ($super, name) {
            $super(name);

            this.replace(miniLOL.Cookie.get('__miniLOL.storage.' + this.name, { raw: true }) || '{}');
        },

        save: function () {
            var raw = this.toString();

            this.size = raw.length;

            miniLOL.Cookie.set('__miniLOL.storage.' + this.name, raw, { expires: 60 * 60 * 24 * 365, raw: true });
        }
    }),

    Null: Class.create(miniLOL.Storage.Backend, {
        save: Prototype.emptyFunction
    })
};
