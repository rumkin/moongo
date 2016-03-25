'use strict';

module.exports = Actioner;

function actionSwitcher(actions) {
    var chain = [];
    return function(action) {
        while (typeof actions[action] === 'string') {
            switch(typeof actions[action]) {
                case 'string':
                let target = actions[action];
                if (chain.indexOf(target) > -1) {
                    throw new Error(`Cycle method alias ${action}`)
                }
                chain.push(action);
                action = target;
                break;
                case 'undefined':
                action = 'usage';
                break;
            }
        }

        return (actions[action] || actions.usage).bind(actions);
    };
}

function Actioner() {
    this.actions = {};
};

Actioner.new = function () {
    return new this(...arguments);
};

Actioner.prototype.add = function (action, method){
    this.actions[action] = method;

    return this;
};

Actioner.prototype.run = function (action, argv){
    return Promise.resolve(actionSwitcher(this.actions)(action)(...argv));
};
