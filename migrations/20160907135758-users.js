'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
    db.createTable('users', {
        id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true
        },
        SlackID: {
            type: 'string',
            unique: true
        },
        JobName: 'string',
        HitPoint: 'int',
        MagicPoint: 'int'
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable('users', callback);
};
