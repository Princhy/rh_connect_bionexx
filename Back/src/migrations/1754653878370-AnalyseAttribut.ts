import { MigrationInterface, QueryRunner } from "typeorm";

export class AnalyseAttribut1754653878370 implements MigrationInterface {
    name = 'AnalyseAttribut1754653878370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` ADD \`mode_pointage\` enum ('bio', 'badge', 'manuel') NULL`);
        await queryRunner.query(`ALTER TABLE \`analyse\` ADD \`lieu_pointage\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`analyse\` CHANGE \`statut_final\` \`statut_final\` enum ('present', 'retard', 'absent', 'sortie_anticipee', 'present_avec_retard', 'en_conge') NOT NULL DEFAULT 'absent'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` CHANGE \`statut_final\` \`statut_final\` enum ('present', 'retard', 'absent', 'sortie_anticipee', 'present_avec_retard') NOT NULL DEFAULT 'absent'`);
        await queryRunner.query(`ALTER TABLE \`analyse\` DROP COLUMN \`lieu_pointage\``);
        await queryRunner.query(`ALTER TABLE \`analyse\` DROP COLUMN \`mode_pointage\``);
    }

}
