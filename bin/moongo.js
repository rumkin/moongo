#!/usr/bin/env node

'use strict';

const argentum = require('argentum');
const _ = require('underscore');
const path = require('path');
const camelcase = require('camelcase');
const Actioner = require('../lib/bin-utils.js');
const attrParser = require('../lib/attr-parser.js');
const functionArgs = require('../lib/fn-args.js');
const mongo = require('mongodb');
const moongo = require('../');
const fs = require('fs');
const prompt = require('prompt-sync')();

const argv = process.argv.slice(2);
const args = argentum.parse(argv, {
    defaults: {
        debug: false,
    },
    aliases: {
        d: 'debug'
    }
});

var config;
var configPath = path.resolve(process.cwd(), args.config || 'moongo.json');
if (args.config) {
    if (! fs.existsSync(configPath)) {
        throw new Error(`Config file ${configPath} not found.`);
    }

    config = require(configPath);
}
else if (fs.existsSync(configPath)) {
    config = require(configPath);
}
else {
    config = {
        connections: {
            local: {
                host: 'localhost',
                port: 27017,
                db: 'test'
            },
        },
    };
}

var action = camelcase(argv.shift() || 'help');

Actioner.new()
.add('run', function (conn, script) {
    var scope = {};
    [...arguments].slice(2).forEach(
        attrs => attrParser.parse(attrs)
        .forEach(attr => {
            scope[camelcase(attr.name)] = attr.value;
        })
    );

    return (new Promise((resolve, reject) => {
        var params = Object.assign({
            host: '127.0.0.1',
            port: 27017,
            base: 'test',
        }, config.connections[conn]);

        if (params.confirm && prompt('Confirm query [Y/n]: ') !== 'Y') {
            reject(new Error('interrupted'));
            return;
        }

        var url = `mongodb://${params.host}:${params.port}/${params.base}`;

        mongo.MongoClient.connect(url, (err, db) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    }))
    .then(db => {
        scope.$db = db;
        scope.$api = moongo(db);
        scope.$prompt = prompt;

        var scriptPath, method;
        if (script.includes('#')) {
            scriptPath = script.slice(0, script.indexOf('#'));
            method = camelcase(script.slice(script.indexOf('#') + 1));
        }
        else {
            scriptPath = script;
        }

        var submodule = require(path.resolve(process.cwd(), scriptPath));
        var fn;

        if (method) {
            fn = submodule[method];
        }
        else {
            fn = submodule;
        }

        var fnArgs = functionArgs(fn);
        return fn(...fnArgs.map(name => scope[name]));
    });
})
.add('help', () => {
    console.error('Moongo is mongo queries automation cli util.\n');
    console.error('Usage: moongo <ACTION> [OPTIONS]');
    console.error('Actions:\n\t- run\n\t- help\n');
    console.error('To get more help, type: moongo help <ACTION>');
})
.run(action, argv)
.then(
    (result) => {
        if (typeof result === 'number') {
            process.exit(result);
        }
        else if (typeof result === 'string') {
            console.log(result);
        }

        process.exit(0)
    },
    (error) => {
        if (error.message !== 'interrupted') {
            console.error(error.stack);
        }
        process.exit(1);
    }
);
