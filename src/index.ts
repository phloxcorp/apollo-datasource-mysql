import { DataSource } from 'apollo-datasource'
import { Pool, QueryOptions, FieldInfo, PoolConnection } from 'mysql'

export class MysqlDataSource extends DataSource {
  private pool: Pool

  constructor(pool: Pool) {
    super()
    this.pool = pool
  }

  query(options: QueryOptions): Promise<{ results?: any; fields?: FieldInfo[] }>;
  query(sql: string, values?: any): Promise<{ results?: any; fields?: FieldInfo[] }>;
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