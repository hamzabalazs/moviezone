import sqlite from "sqlite3";
import events = require("events")
// Database class
export class Database extends events.EventEmitter{
  db!: sqlite.Database | null;
  filename!: string;

  static get OPEN_READONLY():number {
    return sqlite.OPEN_READONLY;
  }

  static get OPEN_READWRITE():number {
    return sqlite.OPEN_READWRITE;
  }

  static get OPEN_CREATE():number {
    return sqlite.OPEN_CREATE;
  }

  static get SQLITE3_VERSION() {
    return "5.1.4";
  }
  static open(filename:any, mode?:number|undefined) {
    let db = new Database();
    return db.open(filename, mode);
  }
  

  open(filename:any, mode?:number|undefined):Promise<this> {
    if (typeof mode === 'undefined') {
      mode = Database.OPEN_READWRITE | Database.OPEN_CREATE;
    } else if (typeof mode !== 'number') {
      throw new TypeError('Database.open: mode is not a number');
    }
    return new Promise((resolve:(value:any) => void, reject) => {
      if (this.db) {
        return reject(new Error('Database.open: database is already open'));
      }
      let db = new sqlite.Database(filename, mode, (err) => {
        if (err) {
          reject(err);
        } else {

          this.db = db;

          this.filename = filename;
          resolve(this);
        }
      });
    });
  }

  close(fn?:any) {
    if (!this.db) {
      return Promise.reject(new Error('Database.close: database is not open'));
    }
    if (fn) {
      return fn(this)
        .then((result:any) => {
          return this.close().then((_:any) => {
            return result;
          });
        })
        .catch((err:any) => {
          return this.close().then((_:any) => {
            return Promise.reject(err);
          });
        });
    }
    return new Promise((resolve:(value:any) => void, reject) => {
      this.db!.close((err:any) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          resolve(this);
        }
      });
    });
  }

  run(...args: [sql:string, ...params:any[]]):Promise<any> {
    return new Promise((resolve:(value:any) => void, reject) => {
      if (!this.db) {
        return reject(new Error("Database.run: database is not open"));
      }
      // Need a real function because 'this' is used.
      let callback = function (err: any) {
        if (err) {
          reject(err);
        } else {
          resolve({
            //@ts-ignore
            lastID: this.lastID,
            //@ts-ignore
            changes: this.changes,
          });
        }
      };
      args.push(callback);
      this.db.run.apply(this.db, args);
    });
  }

  get<T>(...args: [sql:string, ...params:any[]]):Promise<T|null> {
    return new Promise((resolve:(value:T) => void, reject) => {
      if (!this.db) {
        return reject(new Error("Database.get: database is not open"));
      }
      let callback = (err: any, row: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      };
      args.push(callback);
      this.db.get.apply(this.db, args);
    });
  }

  all<T>(...args: [sql:string, ...params:any[]]):Promise<T[]> {
    return new Promise((resolve:(value:any) => void, reject) => {
      if (!this.db) {
        return reject(new Error("Database.all: database is not open"));
      }
      let callback = (err: any, rows: T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      };
      args.push(callback);
      this.db.all.apply(this.db, args);
    });
  }
  each(...args:[sql:string, ...params:any[]]) {
    if (args.length === 0 || typeof args[args.length - 1] !== 'function') {
      throw TypeError('Database.each: last arg is not a function');
    }
    return new Promise((resolve:(value:any) => void, reject) => {
      if (!this.db) {
        return reject(new Error('Database.each: database is not open'));
      }
      let callback = (err:any, nrows:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(nrows);
        }
      };
      args.push(callback);
      this.db.each.apply(this.db, args);
    });
  }

  exec(sql:any) {
    return new Promise((resolve:(value:any) => void, reject) => {

      if (!this.db) {
        return reject(new Error('Database.exec: database is not open'));
      }
      this.db.exec(sql, (err:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  async transaction(fn:any) {
    await this.exec('BEGIN TRANSACTION');
    try {
      const result = await fn(this);
      await this.exec('END TRANSACTION');
      return result;
    } catch (e) {
      await this.exec('ROLLBACK TRANSACTION');
      throw e;
    }
  }
  prepare(...args:[sql:string, ...params:any[]]) {
    return new Promise((resolve:(value:any) => void, reject) => {
      if (!this.db) {
        return reject(new Error('Database.prepare: database is not open'));
      }
      let statement:any;
      let callback = (err:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(new Statement(statement));
        }
      };
      args.push(callback);
      statement = this.db.prepare.apply(this.db, args);
    });
  }
  
}

//-----------------------------------------------------------------------------
// The Statement class
//-----------------------------------------------------------------------------

export class Statement {
  statement:sqlite.Statement
  constructor(statement:any) {
    if (!(statement instanceof sqlite.Statement)) {
      throw new TypeError(`Statement: 'statement' is not a statement instance`);
    }
    this.statement = statement;
  }

  bind(...args:any[]) {
    return new Promise((resolve:(value:any) => void, reject) => {
      let callback = (err:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      };
      args.push(callback);
      this.statement.bind.apply(this.statement, args);
    });
  }

  reset() {
    return new Promise((resolve:(value:any) => void, reject) => {
      this.statement.reset((_) => {
        resolve(this);
      });
    });
  }

  // finalize() {
  //   return new Promise((resolve:(value:any) => void, reject) => {
  //     this.statement.finalize((err) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(); // can't use it anymore
  //       }
  //     });
  //   });
  // }

  run(...args:any[]) {
    return new Promise((resolve:(value:any) => void, reject) => {
      // Need a real function because 'this' is used.
      let callback = function (err:any) {
        if (err) {
          reject(err);
        } else {
          resolve({
            //@ts-ignore
            lastID: this.lastID,
            //@ts-ignore
            changes: this.changes
          });
        }
      };
      args.push(callback);
      this.statement.run.apply(this.statement, args);
    });
  }

  get<T>(...args:any[]):Promise<T> {
    return new Promise((resolve:(value:any) => void, reject) => {
      let callback = (err:any, row:T) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      };
      args.push(callback);
      this.statement.get.apply(this.statement, args);
    });
  }

  all<T>(...args:any[]):Promise<T[]> {
    return new Promise((resolve:(value:any) => void, reject) => {
      let callback = (err:any, rows:T[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      };
      args.push(callback);
      this.statement.all.apply(this.statement, args);
    });
  }

  each(...args:any[]) {
    if (args.length === 0 || typeof args[args.length - 1] !== 'function') {
      throw TypeError('Statement.each: last arg is not a function');
    }
    return new Promise((resolve:(value:any) => void, reject) => {
      let callback = (err:any, nrows:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(nrows);
        }
      };
      args.push(callback);
      this.statement.each.apply(this.statement, args);
    });
  }
}
