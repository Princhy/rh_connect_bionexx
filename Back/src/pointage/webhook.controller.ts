import { Request, Response } from 'express';
import { HikvisionWebhookService } from './hikvision-webhook.service';
import { WEBHOOK_CONFIG, shouldLog } from '../config/webhook.config';

export class WebhookController {
  private hikvisionService: HikvisionWebhookService;

  constructor() {
    this.hikvisionService = new HikvisionWebhookService();
  }

  /**
   * Gère les webhooks de pointage Hikvision
   */
  async handleHikvisionWebhook(req: Request, res: Response) {
    try {
             // Debug complet de la requête (seulement si activé et pas en mode silencieux)
       if (shouldLog()) {
         this.logRequestDetails(req);
       }

                      // Protection contre les requêtes vides
         if (!req.body || Object.keys(req.body).length === 0) {
           if (shouldLog()) {
             console.log("⚠️ Requête vide reçue (probablement test de connexion), ignorée");
           }
           return res.status(200).json({
             success: true,
             message: WEBHOOK_CONFIG.MESSAGES.EMPTY_REQUEST
           });
         }

                // Détection des requêtes de test
         if (HikvisionWebhookService.isTestRequest(req.body)) {
           // Les logs de test sont déjà gérés dans isTestRequest()
           return res.status(200).json({
             success: true,
             message: WEBHOOK_CONFIG.MESSAGES.TEST_REQUEST
           });
         }

      // Traitement du webhook
      const result = await this.hikvisionService.processWebhook(req.body);
      
      return res.status(result.success ? 200 : 400).json(result);

         } catch (error) {
       console.error("🔥 Erreur webhook pointage:", error);
       return res.status(500).json({
         success: false,
         message: WEBHOOK_CONFIG.MESSAGES.INTERNAL_ERROR
       });
     }
  }

  /**
   * Log les détails de la requête pour le debug (optimisé)
   */
  private logRequestDetails(req: Request) {
    const requestId = Date.now();
    console.log(`🔔 Webhook #${requestId} reçu`);
    
    // Log des headers essentiels seulement
    const essentialHeaders = {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'],
      'host': req.headers['host']
    };
    console.log("🔍 DEBUG - Headers essentiels:", JSON.stringify(essentialHeaders, null, 2));
    
    // Log du body de manière sécurisée (sans données binaires)
    if (req.body && req.body.event_log) {
      try {
        const eventData = JSON.parse(req.body.event_log);
        const cleanEventData = {
          ipAddress: eventData.ipAddress,
          dateTime: eventData.dateTime,
          eventType: eventData.eventType,
          AccessControllerEvent: {
            deviceName: eventData.AccessControllerEvent?.deviceName,
            majorEventType: eventData.AccessControllerEvent?.majorEventType,
            subEventType: eventData.AccessControllerEvent?.subEventType,
            serialNo: eventData.AccessControllerEvent?.serialNo,
            employeeNoString: eventData.AccessControllerEvent?.employeeNoString,
            name: eventData.AccessControllerEvent?.name,
            attendanceStatus: eventData.AccessControllerEvent?.attendanceStatus
          }
        };
        console.log("🔍 DEBUG - Données d'événement (nettoyées):", JSON.stringify(cleanEventData, null, 2));
      } catch (e) {
        console.log("🔍 DEBUG - Body event_log (brut):", req.body.event_log.substring(0, 500) + "...");
      }
    } else {
      console.log("🔍 DEBUG - Body (structure):", Object.keys(req.body || {}));
    }
    
    // Log des fichiers de manière sécurisée
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log("🔍 DEBUG - Files:", req.files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    } else {
      console.log("🔍 DEBUG - Files: aucun");
    }
  }
}
