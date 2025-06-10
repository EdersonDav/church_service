import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateTableVerificationCode1747258200848 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: EntityEnum.VERIFICATION_CODE,
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
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: false
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'code',
                        type: 'varchar',
                        isNullable: false
                    }
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityEnum.VERIFICATION_CODE,
            new TableForeignKey({
                name: 'FK_User_Code',
                columnNames: ['user_id'],
                referencedTableName: EntityEnum.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.query(
            `ALTER TABLE "${EntityEnum.VERIFICATION_CODE}" ADD CONSTRAINT "UQ_User_Code" UNIQUE ("user_id", "code")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.VERIFICATION_CODE, 'UQ_User_Code');
        await queryRunner.dropForeignKey(EntityEnum.VERIFICATION_CODE, 'FK_User_Code');
        await queryRunner.dropTable(EntityEnum.VERIFICATION_CODE);
    }

}
