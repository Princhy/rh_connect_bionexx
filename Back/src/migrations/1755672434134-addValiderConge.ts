import { MigrationInterface, QueryRunner } from "typeorm";

export class AddValiderConge1755672434134 implements MigrationInterface {
    name = 'AddValiderConge1755672434134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conge\` ADD \`valider\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conge\` DROP COLUMN \`valider\``);
    }

}
