# Plugin Verify #

Verify a cordova plugin quickly with its own test sample project.

# How To Use #

First, make sure cordova CLI is installed, if not yet, run:
```bash
npm install cordova -g
```

Now install the verify tool and use it to verify a cordova plugin:
```bash
npm install plugin-verify -g

plugin-verify <plugin id or local path>
```

Example:
```bash
plugin-verify cordova-plugin-admobpro
```

# How It Works #

Here are the steps that the tool actualy runs:

```bash
    # create a demo project
    cordova create ./tmp com.rjfun.test1 Test1
    cd ./tmp

    # now add the plugin, cordova CLI will handle dependency automatically
    cordova plugin add <plugin_id>

    cordova platform add android
    cordova platform add ios

    # now remove the default www content, copy the demo html file to www
    rm -r www/*;
    cp plugins/cordova-plugin-admobpro/test/* www/;

    # now build and run the demo in your device or emulator
    cordova emulate ios;
    cordova emulate android; 
```

# Credits #

A simple tool created by Raymond Xie, to verify his lots of plugins.

Any comments are welcome.
