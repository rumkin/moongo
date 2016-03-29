'use strict';

const Proxy = require('node-proxy');

module.exports = moongo;

function moongo(db) {
    var moongo = {
        get() {
            return this.collection(...arguments);
        },
        collection(name) {
            var collection = db.collection(name);

            return {
                exec(params) {
                    return new Promise((resolve, reject) => {
                        var args = [params.where];
                        if (params.select) {
                            args.push(params.select);
                        }
                        var cursor = collection.find(...args);

                        if (params.sort) {
                            cursor.sort(params.sort);
                        }

                        if (typeof params.offset === 'number') {
                            cursor.skip(params.offset);
                        }

                        if (typeof params.count === 'number') {
                            cursor.limit(params.count);
                        }

                        cursor.toArray((error, items) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(items);
                            }
                        });
                    });
                },
                find(query, select) {
                    return new Promise((resolve, reject) => {
                        collection.find(query, select).toArray((err, docs) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(docs);
                            }
                        });
                    });
                },
                findOne(params) {
                    var args = [...arguments];
                    return new Promise((resolve, reject) => {
                        args.push(
                            (error, document)=>{
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(document);
                                }
                            }
                        )

                        collection.findOne(...args);
                    });
                },
                count(query) {
                    return new Promise((resolve, reject) => {
                        collection.count(query, (err, docs) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(docs);
                            }
                        });
                    });
                },
                update(query, update, options) {
                    return new Promise((resolve, reject) => {
                        collection.update(
                            query,
                            update,
                            options,
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });
                },
                updateOne(query, update, options) {
                    return new Promise((resolve, reject) => {
                        collection.updateOne(
                            query,
                            update,
                            options,
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });
                },
                remove(query) {
                    return new Promise((resolve, reject) => {
                        collection.remove(
                            query,
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });
                },
                removeOne(query) {
                    return new Promise((resolve, reject) => {
                        collection.removeOne(
                            query,
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });
                },
            }
        }
    };

    return Proxy.create({
        get(obj, prop) {
            if (! moongo.hasOwnProperty(prop)) {
                moongo[prop] = moongo.collection(prop);
            }

            return moongo[prop];
        }
    }, moongo);
};

moongo.utils = require('./utils.js');
