import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateTablePasswordResetTokens1748182153288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.PASSWORD_RESET_TOKEN,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: false,
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
                ],
            })
        );

        await queryRunner.createForeignKey(
            EntityEnum.PASSWORD_RESET_TOKEN,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                name: 'FK_User_PasswordResetToken',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.PASSWORD_RESET_TOKEN, 'FK_User_PasswordResetToken');
        await queryRunner.dropTable(EntityEnum.PASSWORD_RESET_TOKEN);
    }

}
