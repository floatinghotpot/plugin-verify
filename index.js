#!/usr/bin/env node

'use strict';

var fs = require('fs'),
	path = require('path'),
    glob = require('glob'),
    minimist = require('minimist');

require('shelljs/global');

var verify_cli = {
    force_landscape: false,
    force_portrait: false,
    run_device: false,

    verify: function( id_or_path, platform ) {
        var plugin_id = id_or_path;
        var localpath = path.resolve( id_or_path );

        var tmp_path = './tmp';
        if(test('-d', tmp_path) ) rm('-rf', tmp_path);

        exec('cordova create ' + tmp_path + ' com.rjfun.demo Demo');
        cd( tmp_path );
        
        if(this.force_landscape) {
            var config_xml = './config.xml';
            var config_content = fs.readFileSync( './config.xml', 'utf8' )
                .replace('</widget>', '<preference name="Orientation" value="landscape" />\n</widget>');
            fs.writeFileSync( config_xml, config_content, "utf8" );
        }

        if(this.force_portrait) {
            var config_xml = './config.xml';
            var config_content = fs.readFileSync( './config.xml', 'utf8' )
                .replace('</widget>', '<preference name="Orientation" value="portrait" />\n</widget>');
            fs.writeFileSync( config_xml, config_content, "utf8" );
        }
        
        var plugin_xml = localpath + '/plugin.xml';
        if(test('-d', localpath) && test('-f', plugin_xml) ) {
            echo('Verifying plugin in local path ...');
            
            // find the plugin id from plugin.xml
            var xml_str = fs.readFileSync( plugin_xml, 'utf8' );
            var items = xml_str.match(/[\s]id=\"([\S]+)\"/g);
            if(items.length > 0) {
                plugin_id = items[0].replace(/[\s]id=\"/g, '').replace('"', '');
            } else {
                echo('failed to find plugin id in ' + plugin_xml);
                return;
            }
            
            var ret = exec('cordova plugin add ' + localpath);
            if(ret.code != 0) return;

        } else {
            var ret = exec('cordova plugin add ' + plugin_id);
            if(ret.code != 0) return;
        }

        if(typeof platform === 'undefined') {
            exec('cordova platform add ios@latest');
            exec('cordova platform add android@latest');
        } else {
            exec('cordova platform add ' + platform + '@latest');
        }

        var demo_dir = '';
        if( test('-f', 'plugins/' + plugin_id + '/demo/index.html') ) {
            rm('-r', 'www/*');
            cp('-r', 'plugins/' + plugin_id + '/demo/*', 'www/');
        } else if( test('-f', 'plugins/' + plugin_id + '/test/index.html') ) {
            rm('-r', 'www/*');
            cp('-r', 'plugins/' + plugin_id + '/test/*', 'www/');
        } else {
            // no demo found
        }

        var run = this.run_device ? 'run' : 'emulate';
        if(typeof platform === 'undefined') {
            exec('cordova ' + run + ' ios');
            exec('cordova ' + run + ' android');
        } else {
            exec('cordova ' + run + ' ' + platform);
        }

        cd('..');
    },

    main: function( argv ) {
        var cli = argv[1];
        var args = minimist( argv.slice(2) );
        
        this.force_landscape = (typeof args.landscape !== 'undefined');
        this.force_portrait = (typeof args.portrait !== 'undefined');
        this.run_device = (typeof args.device !== 'undefined');

        if(args._.length > 0) {
            this.verify( args._[0], args._[1] );
            
        } else {
            echo('Arguments missing. \n' + 
                 'Syntax: plugin-verify <plugin> [ios | android | ...] [--landscape] [--portrait] [--device]\n' +
                 'Example: plugin-verify cordova-plugin-admobpro ios\n');
        }
    }
};

verify_cli.main( process.argv );

    

