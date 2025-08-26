import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCongeStatut1755497388161 implements MigrationInterface {
    name = 'UpdateCongeStatut1755497388161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Supprimer l'ancienne colonne valider
        await queryRunner.query(`ALTER TABLE \`conge\` DROP COLUMN \`valider\``);
        
        // Ajouter la nouvelle colonne statut
        await queryRunner.query(`ALTER TABLE \`conge\` ADD \`statut\` enum('ATTENTE', 'VALIDE', 'REFUSE') NOT NULL DEFAULT 'ATTENTE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la colonne statut
        await queryRunner.query(`ALTER TABLE \`conge\` DROP COLUMN \`statut\``);
        
        // Remettre l'ancienne colonne valider
        await queryRunner.query(`ALTER TABLE \`conge\` ADD \`valider\` boolean NOT NULL DEFAULT false`);
    }
}


