import { Request, Response, NextFunction } from 'express';
import { WEBHOOK_CONFIG, shouldLog } from '../config/webhook.config';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export class RateLimiter {
  private requestCache: Map<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { windowMs: 5000, maxRequests: 1 }) {
    this.requestCache = new Map();
    this.config = config;
  }

  /**
   * Middleware pour limiter la fréquence des requêtes
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestKey = this.generateRequestKey(req);
      const now = Date.now();
      
      // Récupérer l'historique des requêtes pour cette clé
      const requestHistory = this.requestCache.get(requestKey) || [];
      
      // Filtrer les requêtes dans la fenêtre de temps
      const recentRequests = requestHistory.filter(
        timestamp => (now - timestamp) < this.config.windowMs
      );
      
             // Vérifier si on dépasse la limite
       if (recentRequests.length >= this.config.maxRequests) {
         // Log silencieux en production
         if (shouldLog()) {
           console.log("⏱️ Requête trop fréquente, ignorée");
         }
         return res.status(200).json({
           success: true,
           message: WEBHOOK_CONFIG.MESSAGES.RATE_LIMITED
         });
       }
      
      // Ajouter la requête actuelle
      recentRequests.push(now);
      this.requestCache.set(requestKey, recentRequests);
      
      // Nettoyer les anciennes entrées (optionnel)
      this.cleanup();
      
      next();
    };
  }

  /**
   * Génère une clé unique pour identifier la requête
   */
  private generateRequestKey(req: Request): string {
    return JSON.stringify(req.body) + JSON.stringify(req.headers);
  }

  /**
   * Nettoie les anciennes entrées du cache
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requestCache.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => (now - timestamp) < this.config.windowMs
      );
      
      if (validTimestamps.length === 0) {
        this.requestCache.delete(key);
      } else {
        this.requestCache.set(key, validTimestamps);
      }
    }
  }

  /**
   * Réinitialise le cache (utile pour les tests)
   */
  reset() {
    this.requestCache.clear();
  }
}
