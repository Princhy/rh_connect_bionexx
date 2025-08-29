const { DataSource } = require('typeorm');
const { Analyse } = require('./build/src/analysePointage/analyse.entity.js');
const { User } = require('./build/src/user/user.entity.js');

// Configuration de la base de données
const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "rh_connect",
  synchronize: false,
  logging: false,
  entities: [Analyse, User],
  subscribers: [],
  migrations: [],
});

async function createTestData() {
  try {
    // Initialiser la connexion
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données établie');

    // Récupérer quelques utilisateurs existants
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ take: 5 });
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Créez d\'abord des utilisateurs.');
      return;
    }

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // Créer des analyses de test pour les 5 derniers jours
    const analyseRepository = AppDataSource.getRepository(Analyse);
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      console.log(`📅 Création d'analyses pour le ${dateStr}...`);
      
      for (const user of users) {
        // Créer une analyse pour chaque utilisateur
        const analyse = analyseRepository.create({
          matricule: user.matricule,
          date: dateStr,
          heure_prevue_arrivee: "08:00:00",
          heure_prevue_depart: "17:00:00",
          heure_reelle_arrivee: i % 3 === 0 ? "08:15:00" : "08:00:00", // Quelques retards
          heure_reelle_depart: "17:00:00",
          retard_minutes: i % 3 === 0 ? 15 : 0,
          sortie_anticipee_minutes: 0,
          statut_final: i % 3 === 0 ? "retard" : "present",
          travaille_aujourd_hui: true,
          justifie: false,
          lieu_travail: "Bureau Principal",
          date_analyse: new Date()
        });
        
        await analyseRepository.save(analyse);
      }
    }

    console.log('✅ Données de test créées avec succès !');
    
    // Vérifier le nombre d'analyses créées
    const totalAnalyses = await analyseRepository.count();
    console.log(`📊 Total d'analyses en base: ${totalAnalyses}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

createTestData();




