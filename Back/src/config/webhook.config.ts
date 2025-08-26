/**
 * Configuration centralisée pour le webhook Hikvision
 */

export const WEBHOOK_CONFIG = {
  // Types d'événements acceptés
  ACCEPTED_SUB_EVENT_TYPE: 38, // Empreinte digitale
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 2000,    // 2 secondes
    MAX_REQUESTS: 3     // 3 requêtes par fenêtre
  },
  
  // Validation des données
  VALIDATION: {
    MIN_BODY_LENGTH: 50,  // Taille minimale du body pour être valide
    REQUIRED_FIELDS: ['employeeNoString', 'serialNo', 'name']
  },
  
  // Messages d'erreur
  MESSAGES: {
    EMPTY_REQUEST: "Connexion OK",
    TEST_REQUEST: "Test OK",
    RATE_LIMITED: "Rate limited",
    DUPLICATE_POINTAGE: "Pointage déjà existant",
    EMPLOYEE_NOT_FOUND: "Employé non trouvé",
    POINTEUSE_NOT_FOUND: "Pointeuse non trouvée",
    PARSING_ERROR: "Erreur parsing event_log",
    INCOMPLETE_DATA: "Données de pointage incomplètes",
    MISSING_NAME: "Nom de l'employé manquant",
    INTERNAL_ERROR: "Erreur interne du serveur",
    SUCCESS: "Pointage créé avec succès"
  }
};

/**
 * Vérifie si le mode debug est activé
 */
export const isDebugMode = (): boolean => {
  return process.env.ENABLE_WEBHOOK_DEBUG === 'true';
};

/**
 * Vérifie si le mode silencieux est activé
 */
export const isSilentMode = (): boolean => {
  return process.env.ENABLE_WEBHOOK_SILENT === 'true';
};

/**
 * Vérifie si les logs doivent être affichés
 */
export const shouldLog = (): boolean => {
  return isDebugMode() && !isSilentMode();
};
