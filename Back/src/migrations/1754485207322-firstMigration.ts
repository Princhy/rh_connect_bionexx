import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1754485207322 implements MigrationInterface {
    name = 'FirstMigration1754485207322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`planning_equipe\` (\`id_planning\` int NOT NULL AUTO_INCREMENT, \`debut_semaine\` date NULL, \`jours_travail\` text NULL, \`horaire\` enum ('jour', 'nuit', 'repos') NULL, \`deb_heure\` time NULL, \`fin_heure\` time NULL, \`type_planning\` enum ('fixe', 'cyclique') NOT NULL DEFAULT 'fixe', \`date_debut_cycle\` date NULL, \`cycle_pattern\` json NULL, \`id_equipe\` int NOT NULL, PRIMARY KEY (\`id_planning\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`equipe\` (\`id_equipe\` int NOT NULL AUTO_INCREMENT, \`equipe\` varchar(255) NOT NULL, PRIMARY KEY (\`id_equipe\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`departement\` (\`id_departement\` int NOT NULL AUTO_INCREMENT, \`departement\` varchar(150) NOT NULL, PRIMARY KEY (\`id_departement\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id_user\` int NOT NULL AUTO_INCREMENT, \`matricule\` varchar(20) NOT NULL, \`nom\` varchar(100) NOT NULL, \`prenom\` varchar(100) NULL, \`email\` varchar(150) NOT NULL, \`phone\` varchar(20) NOT NULL, \`badge\` varchar(100) NOT NULL, \`empreinte\` varchar(255) NULL, \`poste\` varchar(100) NOT NULL, \`type_contrat\` enum ('CDI', 'CDD', 'stage') NOT NULL, \`date_embauche\` date NOT NULL, \`date_fin_contrat\` date NULL, \`id_lieu\` int NOT NULL, \`id_equipe\` int NOT NULL, \`id_departement\` int NOT NULL, \`role\` enum ('Admin', 'RH', 'Superviseur', 'Employe') NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_259473ab221f66ce5b7842195f\` (\`matricule\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lieu\` (\`id_lieu\` int NOT NULL AUTO_INCREMENT, \`lieu\` varchar(150) NOT NULL, PRIMARY KEY (\`id_lieu\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pointeuse\` (\`id_pointeuse\` int NOT NULL AUTO_INCREMENT, \`adresse_ip\` varchar(50) NOT NULL, \`pointeuse\` varchar(20) NOT NULL, \`id_lieu\` int NOT NULL, PRIMARY KEY (\`id_pointeuse\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pointage\` (\`id_pointage\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('entree', 'sortie') NOT NULL, \`serialNo\` bigint NOT NULL, \`date\` datetime(3) NOT NULL, \`mode\` enum ('bio', 'badge', 'manuel') NOT NULL, \`statut\` enum ('normal', 'retard', 'avance') NOT NULL DEFAULT 'normal', \`id_pointeuse\` int NOT NULL, \`matricule\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_8c5bf21f0ff485b5ba9838a1d6\` (\`serialNo\`), PRIMARY KEY (\`id_pointage\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`analyse\` (\`id_analyse\` int NOT NULL AUTO_INCREMENT, \`matricule\` varchar(20) NOT NULL, \`date\` date NOT NULL, \`heure_prevue_arrivee\` time NULL, \`heure_prevue_depart\` time NULL, \`heure_reelle_arrivee\` time NULL, \`heure_reelle_depart\` time NULL, \`retard_minutes\` int NOT NULL DEFAULT '0', \`sortie_anticipee_minutes\` int NOT NULL DEFAULT '0', \`statut_final\` enum ('present', 'retard', 'absent', 'sortie_anticipee', 'present_avec_retard') NOT NULL DEFAULT 'absent', \`travaille_aujourd_hui\` tinyint NOT NULL DEFAULT 1, \`justifie\` tinyint NOT NULL DEFAULT 0, \`commentaire\` text NULL, \`date_analyse\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`id_analyse\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`planning_equipe\` ADD CONSTRAINT \`FK_dc2985acb63b63cba800a7f22f0\` FOREIGN KEY (\`id_equipe\`) REFERENCES \`equipe\`(\`id_equipe\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_d53d37cabfa6eaa6aa43f9ed139\` FOREIGN KEY (\`id_lieu\`) REFERENCES \`lieu\`(\`id_lieu\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_118a55d40c52d14a3f9b88aa4f9\` FOREIGN KEY (\`id_equipe\`) REFERENCES \`equipe\`(\`id_equipe\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_40d895e3fc63d25cf07a1e38933\` FOREIGN KEY (\`id_departement\`) REFERENCES \`departement\`(\`id_departement\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pointeuse\` ADD CONSTRAINT \`FK_4ce8fcf948518fe125c009277ba\` FOREIGN KEY (\`id_lieu\`) REFERENCES \`lieu\`(\`id_lieu\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pointage\` ADD CONSTRAINT \`FK_cee4d1bd8260dbd7190c53a9402\` FOREIGN KEY (\`id_pointeuse\`) REFERENCES \`pointeuse\`(\`id_pointeuse\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pointage\` ADD CONSTRAINT \`FK_ab6e3f5c36b45d864277ee5f09c\` FOREIGN KEY (\`matricule\`) REFERENCES \`user\`(\`matricule\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`analyse\` ADD CONSTRAINT \`FK_5673d4e2d417d9fba61c79c808e\` FOREIGN KEY (\`matricule\`) REFERENCES \`user\`(\`matricule\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` DROP FOREIGN KEY \`FK_5673d4e2d417d9fba61c79c808e\``);
        await queryRunner.query(`ALTER TABLE \`pointage\` DROP FOREIGN KEY \`FK_ab6e3f5c36b45d864277ee5f09c\``);
        await queryRunner.query(`ALTER TABLE \`pointage\` DROP FOREIGN KEY \`FK_cee4d1bd8260dbd7190c53a9402\``);
        await queryRunner.query(`ALTER TABLE \`pointeuse\` DROP FOREIGN KEY \`FK_4ce8fcf948518fe125c009277ba\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_40d895e3fc63d25cf07a1e38933\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_118a55d40c52d14a3f9b88aa4f9\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_d53d37cabfa6eaa6aa43f9ed139\``);
        await queryRunner.query(`ALTER TABLE \`planning_equipe\` DROP FOREIGN KEY \`FK_dc2985acb63b63cba800a7f22f0\``);
        await queryRunner.query(`DROP TABLE \`analyse\``);
        await queryRunner.query(`DROP INDEX \`IDX_8c5bf21f0ff485b5ba9838a1d6\` ON \`pointage\``);
        await queryRunner.query(`DROP TABLE \`pointage\``);
        await queryRunner.query(`DROP TABLE \`pointeuse\``);
        await queryRunner.query(`DROP TABLE \`lieu\``);
        await queryRunner.query(`DROP INDEX \`IDX_259473ab221f66ce5b7842195f\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`departement\``);
        await queryRunner.query(`DROP TABLE \`equipe\``);
        await queryRunner.query(`DROP TABLE \`planning_equipe\``);
    }

}
