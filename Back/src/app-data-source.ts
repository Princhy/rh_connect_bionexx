import { DataSource } from "typeorm"
import dotenv from "dotenv"
//initialisation dotenv
dotenv.config();

const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number( process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    entities: ["src/**/*.entity.ts"],
    migrations: ["src/migrations/**/*.ts"],
    migrationsTableName: "migrations",
    logging: process.env.ENABLE_WEBHOOK_DEBUG === 'true',
    synchronize: false,
});


export default myDataSource;