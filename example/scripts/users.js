'use strict';

const inspect = require('util').inspect;

module.exports = function(mongo, userName) {
    console.log('User name', userName);
};

module.exports = {
    findByLogin(api, login, count, offset) {
        return api.collection('users').find({
            where:{
                _login: new RegExp(login, 'i')
            },
            count,
            offset,
        })
        .then(result => console.log(inspect(result, {colors: true})));
    },
    list() {

    },
    remove(mongo, id) {
        console.log('remove _id', id);
    }
}
