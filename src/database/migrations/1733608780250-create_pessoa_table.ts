import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePessoaTable1733608780250 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP EXTENSION "uuid-ossp"')
        await queryRunner.query('CREATE EXTENSION "uuid-ossp"')
        await queryRunner.createTable(
            new Table({
                name: 'pessoas',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'deleted_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'senha',
                        type: 'varchar',
                    },
                    {
                        name: 'role',
                        type: 'enum',
                        enum: ['admin', 'voluntario', 'root'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('pessoas')
    }

}
