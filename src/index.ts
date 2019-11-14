import { DataSource } from 'apollo-datasource'
import { Pool, QueryOptions, FieldInfo, PoolConnection } from 'mysql'

interface QueryResponse<T> {
  results?: T[] & { insertId: number } & { affectedRows: number };
  fields?: FieldInfo[];
}

export class MysqlDataSource extends DataSource {
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

  getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err)
        } else {
          resolve(connection)
        }
      })
    })
  }
}