require 'rake'
require 'rake/clean'
require 'sprockets'

# You need this: http://code.google.com/closure/compiler/
# I suggest using 20100616 version, because later versions break prototype.js on IE6
COMPILER = 'closure-compiler' # --compilation_level ADVANCED_OPTIMIZATIONS'

CLEAN.include(FileList['build/**', 'sources/**/.*.pdoc.yaml', 'doc/'])

ROOT_DIR  = File.expand_path(File.dirname(__FILE__))
SRC_DIR   = File.join(ROOT_DIR, 'sources')
BUILD_DIR = File.join(ROOT_DIR, 'build')
DOC_DIR   = File.join(ROOT_DIR, 'doc')
VERSION   = '0.1'

module Helper
    def self.minify (file, out=nil)
        if !File.exists?(file)
            return false
        end
    
        if !out
            out = file.clone;
            out[out.length - 3, 3] = '.min.js'
        end
    
        if !File.exists?(out) || File.mtime(file) > File.mtime(out)
            result = `#{COMPILER} --js '#{file}' --js_output_file '#{out}'`
    
            if $? != 0
                File.delete(out) rescue nil

                return false
            end
        else
            return 1
        end
    
        return true
    end

    def self.miniHeader (file, header)
        content = File.read(file)

        file = File.new(file, 'w');
        file.puts header
        file.write content
        file.close
    end

    def self.sprocketize (options = {})
        options = {
          :destination    => File.join(BUILD_DIR, options[:source]),
          :strip_comments => false
        }.merge(options)
        
        load_path = [SRC_DIR]
        
        secretary = Sprockets::Secretary.new(
          :root           => File.join(ROOT_DIR, options[:path]),
          :load_path      => load_path,
          :source_files   => [options[:source]],
          :strip_comments => options[:strip_comments]
        )
        
        secretary.concatenation.save_to(options[:destination])
    end
end

task :default => [:framework, :minify, :template]

task :framework do
    updated = false

    if !File.exists?('build/miniLOL-framework.js')
        updated = true
    else
        files = FileList['sources/**/*.js']
        files.exclude('source/template')
        
        files.each {|file|
            if File.mtime("#{file}") >= File.mtime('build/miniLOL-framework.js')
                updated = true
                break
            end
        }
    end

    if updated
        Helper.sprocketize(
            :path   => 'sources',
            :source => 'miniLOL-framework.js'
        )
    end
end

task :minify do
    if tmp = Helper.minify('build/miniLOL-framework.js')
        if tmp != 1
            Helper.miniHeader('build/miniLOL-framework.min.js',
                '/* miniLOL is released under AGPLv3. Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org] */'
            )
        end
    else
        exit
    end

    if tmp = Helper.minify('dependencies/prototype.js', 'build/prototype.min.js')
        if tmp != 1
            Helper.miniHeader('build/prototype.min.js',
                '/* Prototype JavaScript framework. (c) 2005-2010 Sam Stephenson. MIT-style license. */'
            )
        end
    else
        exit
    end

    updated       = false
    scriptaculous = ['effects', 'builder', 'sound', 'slider', 'controls', 'dragdrop']

    if !File.exists?('build/scriptaculous.min.js')
        updated = true
    else
        scriptaculous.each {|file|
            if File.mtime("dependencies/scriptaculous/#{file}.js") >= File.mtime('build/scriptaculous.min.js')
                updated = true
                break
            end
        }
    end

    if updated
        minified = File.new(`mktemp -u`.strip, 'w')
        scriptaculous.each {|file|
            minified.write(File.read("dependencies/scriptaculous/#{file}.js"))
        }
        minified.close

        Helper.minify(minified.path, 'build/scriptaculous.min.js') || exit

        Helper.miniHeader('build/scriptaculous.min.js',
            '/* scriptaculous.js. (c) 2005-2009 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us) */'
        )
    end

    if !File.exists?('build/miniLOL-framework.full.js')
        updated = true
    else
        ['prototype', 'miniLOL-framework'].each {|file|
            if File.mtime("build/#{file}.min.js") >= File.mtime('build/miniLOL-framework.full.js')
                updated = true
                break
            end
        }
    end

    if updated
        minified = File.new('build/miniLOL-framework.full.js', 'w')
        minified.write(File.read('build/prototype.min.js') + File.read('build/miniLOL-framework.min.js'))
        minified.close
    end
end

task :template do
    # HAML

    updated = false

    if !File.exists?('build/templates/HAML.min.js')
        updated = true
    else
        ['main', 'haml'].each {|file|
            if File.mtime("sources/templates/HAML/#{file}.js") >= File.mtime('build/templates/HAML.min.js')
                updated = true
                break
            end
        }
    end

    if updated
        minified = File.new(`mktemp -u`.strip, 'w')
        minified.write(File.read('sources/templates/HAML/main.js') + File.read('sources/templates/HAML/haml.js'))
        minified.close

        Helper.minify(minified.path, 'build/templates/HAML.min.js') || exit
        Helper.miniHeader('build/templates/HAML.min.js', %{
/* miniLOL is released under AGPLv3. Copyleft meh. [http://meh.doesntexist.org | meh@paranoici.org] */
/* haml.js (c) 2009 Tim Caswell (http://github.com/creationix/haml-js) */
        })
    end
end

task :doc do
    sh "pdoc -o '#{DOC_DIR}' -d '#{SRC_DIR}'"
end
