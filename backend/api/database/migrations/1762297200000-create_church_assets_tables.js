"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChurchAssetsTables1762297200000 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateChurchAssetsTables1762297200000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.SONG,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'default_key',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'church_id',
                    type: 'uuid',
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createUniqueConstraint(enums_1.EntityEnum.SONG, new typeorm_1.TableUnique({
            name: 'UQ_Song_Church_Title',
            columnNames: ['church_id', 'title'],
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.SONG, new typeorm_1.TableForeignKey({
            name: 'FK_Song_Church',
            columnNames: ['church_id'],
            referencedTableName: enums_1.EntityEnum.CHURCH,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.MINISTER,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'church_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createUniqueConstraint(enums_1.EntityEnum.MINISTER, new typeorm_1.TableUnique({
            name: 'UQ_Minister_Church_User',
            columnNames: ['church_id', 'user_id'],
        }));
        await queryRunner.createForeignKeys(enums_1.EntityEnum.MINISTER, [
            new typeorm_1.TableForeignKey({
                name: 'FK_Minister_Church',
                columnNames: ['church_id'],
                referencedTableName: enums_1.EntityEnum.CHURCH,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                name: 'FK_Minister_User',
                columnNames: ['user_id'],
                referencedTableName: enums_1.EntityEnum.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        ]);
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.MINISTER_SONG_KEY,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'minister_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'song_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'custom_key',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createUniqueConstraint(enums_1.EntityEnum.MINISTER_SONG_KEY, new typeorm_1.TableUnique({
            name: 'UQ_MinisterSongKey_Minister_Song',
            columnNames: ['minister_id', 'song_id'],
        }));
        await queryRunner.createForeignKeys(enums_1.EntityEnum.MINISTER_SONG_KEY, [
            new typeorm_1.TableForeignKey({
                name: 'FK_MinisterSongKey_Minister',
                columnNames: ['minister_id'],
                referencedTableName: enums_1.EntityEnum.MINISTER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                name: 'FK_MinisterSongKey_Song',
                columnNames: ['song_id'],
                referencedTableName: enums_1.EntityEnum.SONG,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        ]);
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.SCALE_SONG,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()',
                },
                {
                    name: 'scale_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'song_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'key',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'minister_id',
                    type: 'uuid',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createUniqueConstraint(enums_1.EntityEnum.SCALE_SONG, new typeorm_1.TableUnique({
            name: 'UQ_ScaleSong_Scale_Song',
            columnNames: ['scale_id', 'song_id'],
        }));
        await queryRunner.createForeignKeys(enums_1.EntityEnum.SCALE_SONG, [
            new typeorm_1.TableForeignKey({
                name: 'FK_ScaleSong_Scale',
                columnNames: ['scale_id'],
                referencedTableName: enums_1.EntityEnum.SCALE,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                name: 'FK_ScaleSong_Song',
                columnNames: ['song_id'],
                referencedTableName: enums_1.EntityEnum.SONG,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
            new typeorm_1.TableForeignKey({
                name: 'FK_ScaleSong_Minister',
                columnNames: ['minister_id'],
                referencedTableName: enums_1.EntityEnum.MINISTER,
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        ]);
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SCALE_SONG, 'FK_ScaleSong_Minister');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SCALE_SONG, 'FK_ScaleSong_Song');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SCALE_SONG, 'FK_ScaleSong_Scale');
        await queryRunner.dropTable(enums_1.EntityEnum.SCALE_SONG);
        await queryRunner.dropForeignKey(enums_1.EntityEnum.MINISTER_SONG_KEY, 'FK_MinisterSongKey_Song');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.MINISTER_SONG_KEY, 'FK_MinisterSongKey_Minister');
        await queryRunner.dropTable(enums_1.EntityEnum.MINISTER_SONG_KEY);
        await queryRunner.dropForeignKey(enums_1.EntityEnum.MINISTER, 'FK_Minister_User');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.MINISTER, 'FK_Minister_Church');
        await queryRunner.dropTable(enums_1.EntityEnum.MINISTER);
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SONG, 'FK_Song_Church');
        await queryRunner.dropTable(enums_1.EntityEnum.SONG);
    }
}
exports.CreateChurchAssetsTables1762297200000 = CreateChurchAssetsTables1762297200000;
//# sourceMappingURL=1762297200000-create_church_assets_tables.js.map