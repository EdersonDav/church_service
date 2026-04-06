"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDataSource = void 0;
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const config_1 = require("../config");
exports.ApiDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    logging: true,
    host: config_1.env.db.HOST,
    port: config_1.env.db.PORT,
    database: config_1.env.db.NAME,
    entities: [(0, path_1.resolve)(__dirname, 'entities', '*{.ts,.js}')],
    migrations: [(0, path_1.resolve)(__dirname, 'migrations', '*{.ts,.js}')],
    password: config_1.env.db.PASSWORD,
    username: config_1.env.db.USER,
    schema: config_1.env.db.SCHEMA,
    synchronize: true,
    uuidExtension: 'uuid-ossp',
});
//# sourceMappingURL=datasource.js.map