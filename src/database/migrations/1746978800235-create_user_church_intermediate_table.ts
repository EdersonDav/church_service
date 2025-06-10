import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum, RoleEnum } from "../../enums";

export class CreateUserChurchIntermediateTable1746978800235 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "role_enum" AS ENUM (${Array.from(Object.keys(RoleEnum)).map((role) => `'${role}'`).join(', ')})
        `);
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.USER_CHURCH,
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
                        name: "user_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "church_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: 'role',
                        type: 'role_enum',
                    }
                ],
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.USER_CHURCH,
            new TableForeignKey({
                name: "FK_User_Church_User",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.USER,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.USER_CHURCH,
            new TableForeignKey({
                name: "FK_User_Church_Church",
                columnNames: ["church_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.CHURCH,
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.USER_CHURCH, "FK_User_Church_User");
        await queryRunner.dropForeignKey(EntityEnum.USER_CHURCH, "FK_User_Church_Church");
        await queryRunner.dropTable(EntityEnum.USER_CHURCH);
        await queryRunner.query('DROP TYPE "role_enum"');
    }

}
