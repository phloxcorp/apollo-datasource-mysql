import { DataSource } from 'apollo-datasource'
import { Pool, QueryOptions, FieldInfo, PoolConnection } from 'mysql'

interface QueryResponse<T> {
  results?: T[] & { insertId: number } & { affectedRows: number };
  fields?: FieldInfo[];
}

class PoolConnectionPromise {
  private connection: PoolConnection

  constructor(connection: PoolConnection) {
    this.connection = connection
  }

  query<T>(options: QueryOptions): Promise<QueryResponse<T>>;
  query<T>(sql: string, values?: any): Promise<QueryResponse<T>>;
  query(arg: any, values?: any) {
    if (values) {
      return new Promise((resolve, reject) => {
        this.connection.query(arg, values, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            resolve({ results, fields })
          }
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.connection.query(arg, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            resolve({ results, fields })
          }
        })
      })
    }
  }

  commit(options?: QueryOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.commit(options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  rollback(options?: QueryOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.rollback(options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  release() {
    this.connection.release()
  }
}

export function getConnectionPromise(pool: Pool): Promise<PoolConnectionPromise> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        resolve(new PoolConnectionPromise(connection))
      }
    })
  })
}

export class MysqlDataSource<TContext> extends DataSource<TContext> {
  private pool: Pool

  constructor(pool: Pool) {
    super()
    this.pool = pool
  }

  query<T>(options: QueryOptions): Promise<QueryResponse<T>>;
  query<T>(sql: string, values?: any): Promise<QueryResponse<T>>;
  query(arg: any, values?: any) {
    if (values) {
      return new Promise((resolve, reject) => {
        this.pool.query(arg, values, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            resolve({ results, fields })
          }
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.pool.query(arg, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            resolve({ results, fields })
          }
        })
      })
    }
  }

  getConnection(): Promise<PoolConnectionPromise> {
    return getConnectionPromise(this.pool)
  }
}
