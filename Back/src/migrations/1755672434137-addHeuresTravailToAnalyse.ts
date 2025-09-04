import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHeuresTravailToAnalyse1755672434137 implements MigrationInterface {
    name = 'AddHeuresTravailToAnalyse1755672434137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` ADD \`h_travail\` VARCHAR(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` DROP COLUMN \`h_travail\``);
    }
}


