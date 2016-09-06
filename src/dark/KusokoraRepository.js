"use strict"
class KusokoraRepositoryOnSqlite {
    constructor(db) {
        this.db = db;
    }

    getAll(callback) {
        this.db.all("SELECT pictureUrl FROM kusokoras;", (err, rows) => {
            if (err) {
                return err;
            }
            return callback(rows.map((r) => r.pictureUrl));
        });
    }
}

module.exports = KusokoraRepositoryOnSqlite;
