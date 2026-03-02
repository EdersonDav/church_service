import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';
import { EntityEnum } from '../../enums';

export class CreateChurchAssetsTables1762297200000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityEnum.SONG,
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
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      EntityEnum.SONG,
      new TableUnique({
        name: 'UQ_Song_Church_Title',
        columnNames: ['church_id', 'title'],
      }),
    );

    await queryRunner.createForeignKey(
      EntityEnum.SONG,
      new TableForeignKey({
        name: 'FK_Song_Church',
        columnNames: ['church_id'],
        referencedTableName: EntityEnum.CHURCH,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: EntityEnum.MINISTER,
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
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      EntityEnum.MINISTER,
      new TableUnique({
        name: 'UQ_Minister_Church_User',
        columnNames: ['church_id', 'user_id'],
      }),
    );

    await queryRunner.createForeignKeys(EntityEnum.MINISTER, [
      new TableForeignKey({
        name: 'FK_Minister_Church',
        columnNames: ['church_id'],
        referencedTableName: EntityEnum.CHURCH,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_Minister_User',
        columnNames: ['user_id'],
        referencedTableName: EntityEnum.USER,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: EntityEnum.MINISTER_SONG_KEY,
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
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      EntityEnum.MINISTER_SONG_KEY,
      new TableUnique({
        name: 'UQ_MinisterSongKey_Minister_Song',
        columnNames: ['minister_id', 'song_id'],
      }),
    );

    await queryRunner.createForeignKeys(EntityEnum.MINISTER_SONG_KEY, [
      new TableForeignKey({
        name: 'FK_MinisterSongKey_Minister',
        columnNames: ['minister_id'],
        referencedTableName: EntityEnum.MINISTER,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_MinisterSongKey_Song',
        columnNames: ['song_id'],
        referencedTableName: EntityEnum.SONG,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: EntityEnum.SCALE_SONG,
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
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      EntityEnum.SCALE_SONG,
      new TableUnique({
        name: 'UQ_ScaleSong_Scale_Song',
        columnNames: ['scale_id', 'song_id'],
      }),
    );

    await queryRunner.createForeignKeys(EntityEnum.SCALE_SONG, [
      new TableForeignKey({
        name: 'FK_ScaleSong_Scale',
        columnNames: ['scale_id'],
        referencedTableName: EntityEnum.SCALE,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_ScaleSong_Song',
        columnNames: ['song_id'],
        referencedTableName: EntityEnum.SONG,
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_ScaleSong_Minister',
        columnNames: ['minister_id'],
        referencedTableName: EntityEnum.MINISTER,
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(EntityEnum.SCALE_SONG, 'FK_ScaleSong_Minister');
    await queryRunner.dropForeignKey(EntityEnum.SCALE_SONG, 'FK_ScaleSong_Song');
    await queryRunner.dropForeignKey(EntityEnum.SCALE_SONG, 'FK_ScaleSong_Scale');
    await queryRunner.dropTable(EntityEnum.SCALE_SONG);

    await queryRunner.dropForeignKey(EntityEnum.MINISTER_SONG_KEY, 'FK_MinisterSongKey_Song');
    await queryRunner.dropForeignKey(EntityEnum.MINISTER_SONG_KEY, 'FK_MinisterSongKey_Minister');
    await queryRunner.dropTable(EntityEnum.MINISTER_SONG_KEY);

    await queryRunner.dropForeignKey(EntityEnum.MINISTER, 'FK_Minister_User');
    await queryRunner.dropForeignKey(EntityEnum.MINISTER, 'FK_Minister_Church');
    await queryRunner.dropTable(EntityEnum.MINISTER);

    await queryRunner.dropForeignKey(EntityEnum.SONG, 'FK_Song_Church');
    await queryRunner.dropTable(EntityEnum.SONG);
  }
}
