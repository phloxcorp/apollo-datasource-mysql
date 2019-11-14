import { DataSource } from 'apollo-datasource';
import { Pool, QueryOptions, FieldInfo, PoolConnection } from 'mysql';
export declare class MysqlDataSource extends DataSource {
    private pool;
    constructor(pool: Pool);
    query(options: QueryOptions): Promise<{
        results?: any;
        fields?: FieldInfo[];
    }>;
    query(sql: string, values?: any): Promise<{
        results?: any;
        fields?: FieldInfo[];
    }>;
    getConnection(): Promise<PoolConnection>;
}
