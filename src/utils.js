const inspect = require('util').inspect;

module.exports = {
    dump(value) {
        [...arguments].forEach(
            item => console.log(inspect(item, {colors: true}))
        );
    },
};
