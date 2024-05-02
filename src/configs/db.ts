import { Sequelize } from 'sequelize';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export enum ORM {
    Sequelize,
    Drizzle
}

export enum DB {
    MySQL,
    PostgreSQL,
    Redis
}

class DBConfig {

    host: any;
    port: any;
    database: string = '';
    user: string = '';
    pwd: any;
    dialect: any;

    constructor(db: DB) {
        if (db == DB.MySQL) {
            this.host = process.env.DB_HOST;
            this.port = process.env.MYSQL_PORT;
            this.database = process.env.DB_DATABASE as string;
            this.user = process.env.MYSQL_USER as string;
            this.pwd = process.env.MYSQL_PWD;
            this.dialect = 'mysql';
        }
    }
}

class DBManager {

    private static instance: DBManager;

    protected readonly LIMIT = 10;
    private sequelize: Sequelize = new Sequelize({ dialect: 'mysql' });
    private poolConnection: any;

    private constructor(db: DB) {
        if (db == DB.MySQL) {
            const dbConfig: DBConfig = new DBConfig(DB.MySQL);

            this.sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.pwd, {
                host: dbConfig.host,
                dialect: dbConfig.dialect
            });
            this.poolConnection = mysql.createPool({
                connectionLimit: this.LIMIT,
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user,
                password: dbConfig.pwd,
                database: dbConfig.database,
                debug: false
            });
        }
    }

    public static getInstance(db: DB): DBManager {
        if (this.instance == null) this.instance = new DBManager(db);
        return this.instance;
    }

    public getSequelize() {
        return this.sequelize;
    }

    public getDrizzle() {
        return drizzle(this.poolConnection);
    }

    /**
     * sequelize 데이터베이스 연결과 테이블 동기화
     */
    public async connect(orm: ORM) {
        try {
            if (orm == ORM.Sequelize) {
                await this.sequelize.authenticate();
                console.log('데이터베이스 연결 성공');
                await this.sequelize.sync();
                console.log('테이블이 동기화되었습니다.');
            }
        } catch (error) {
            console.error('데이터베이스 연결 실패:', error);
            throw error;
        }
    }
}

export { DBManager }