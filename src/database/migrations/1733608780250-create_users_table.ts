import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { EntityEnum, RoleEnum } from "../../enums";

export class CreateUserTable1733608780250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP EXTENSION "uuid-ossp"')
        await queryRunner.query('CREATE EXTENSION "uuid-ossp"')
        await queryRunner.query(`
            CREATE TYPE "role_enum" AS ENUM (${Array.from(Object.keys(RoleEnum)).map((role) => `'${role}'`).join(', ')})
        `);
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.USER,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isUnique: true,
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
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'role',
                        type: 'role_enum',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    }
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(EntityEnum.USER)
        await queryRunner.query('DROP TYPE "role_enum"');
    }

}
