# Moongo

Moongo is a mongo queries automation tool. All you should to do is create
some scripts and create config file.

## Installation

```shell
npm i moongo -g
```

## Example

Create script `moongo/update-counters.js`:

```javascript
// moongo/update-counters.js
module.exports = function($api, type, inc, dec) {
    var col = $api.collection('counters');

    if (inc !== 'undefined') {
        return col.update({
            type
        }, {
            $inc: inc
        });
    }
    else if (dec !== 'undefined') {
        return col.update({
            type
        }, {
            $inc: dec
        });
    }
    else {
        throw new Error('No inc or dec param specified');
    }
};
```

Run script:

```bash
$ cd moongo
$ moongo run local update-counters.js type=active inc=1 # -> ok
$ moongo run local update-counters.js type=inactive dec=1 # -> ok
$ moongo run local update-counters.js type=inactive # -> No inc or dec param specified
```

## Config

Configuration file should contain connections:

```javascript
{
    "connections": {
        "local": {
            "host": "localhost",
            "port": 27017,
            "base": "my-base",
            "confirm": false
        }
    }
}
```

### Connection options

| Option  | Type     | Desc                                           |
|:--------|:---------|:-----------------------------------------------|
| host    | `string` | MongoDB host                                   |
| port    | `number` | MongoDB port                                   |
| base    | `string` | Database name                                  |
| confirm | `bool`   | Force confirmation prompt to prevent accidents |
