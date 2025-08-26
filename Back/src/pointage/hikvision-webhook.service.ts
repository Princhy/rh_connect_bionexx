import { PointageService } from './pointage.service';
import { UserService } from '../user/user.service';
import { PointeuseService } from '../pointeuse/pointeuse.service';
import { NotificationService } from './notification.service';
import { TypePointage, StatutPointage, ModePointage } from '../enum';
import { WEBHOOK_CONFIG, shouldLog } from '../config/webhook.config';

interface HikvisionEventData {
  ipAddress: string;
  portNo: number;
  protocol: string;
  macAddress: string;
  channelID: number;
  dateTime: string;
  activePostCount: number;
  eventType: string;
  eventState: string;
  eventDescription: string;
  AccessControllerEvent: {
    deviceName: string;
    majorEventType: number;
    subEventType: number;
    cardReaderKind?: number;
    doorNo?: number;
    serialNo: number;
    currentVerifyMode: string;
    frontSerialNo?: number;
    attendanceStatus?: string;
    label?: string;
    statusValue?: number;
    mask?: string;
    purePwdVerifyEnable?: boolean;
    name?: string;
    cardReaderNo?: number;
    verifyNo?: number;
    employeeNoString?: string;
    userType?: string;
  };
}

interface HikvisionWebhookBody {
  event_log: string;
}

export class HikvisionWebhookService {
  private pointageService: PointageService;
  private userService: UserService;
  private pointeuseService: PointeuseService;
  private notificationService: NotificationService;

  constructor() {
    this.pointageService = new PointageService();
    this.userService = new UserService();
    this.pointeuseService = new PointeuseService();
    this.notificationService = new NotificationService();
  }

  /**
   * Traite un webhook reçu de la pointeuse Hikvision
   */
  async processWebhook(body: HikvisionWebhookBody): Promise<{
    success: boolean;
    message: string;
    pointage?: any;
  }> {
    try {
      // Extraction et validation des données
      const eventData = this.parseEventLog(body.event_log);
      if (!eventData) {
        return {
          success: false,
          message: "Erreur parsing event_log"
        };
      }

      const acsEvent = eventData.AccessControllerEvent;
      
      // Validation des données de pointage
      const validation = this.validatePointageData(acsEvent);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.message
        };
      }

             // Vérification des doublons
       const existing = await this.pointageService.getPointageBySerialNo(acsEvent.serialNo);
       if (existing) {
         if (shouldLog()) {
           console.log(`⏩ Pointage serialNo ${acsEvent.serialNo} déjà existant, ignoré.`);
         }
         return {
           success: true,
           message: WEBHOOK_CONFIG.MESSAGES.DUPLICATE_POINTAGE
         };
       }

             // Récupération de l'employé
       const employee = await this.userService.getUserByMatricule(acsEvent.employeeNoString!);
       if (!employee) {
         return {
           success: false,
           message: WEBHOOK_CONFIG.MESSAGES.EMPLOYEE_NOT_FOUND
         };
       }

             // Identification de la pointeuse
       const pointeuse = await this.identifyPointeuse(eventData.ipAddress);
       if (!pointeuse) {
         return {
           success: false,
           message: WEBHOOK_CONFIG.MESSAGES.POINTEUSE_NOT_FOUND
         };
       }

      // Création du pointage
      const mappedPointage = this.mapPointageData(acsEvent, eventData, pointeuse);
      const newPointage = await this.pointageService.createPointage(mappedPointage);

             // Envoi des notifications
       await this.sendNotifications(newPointage, employee, pointeuse);

       if (shouldLog()) {
         console.log(`✅ Pointage webhook créé: ${newPointage.serialNo} pour ${newPointage.matricule} (${acsEvent.name || 'N/A'}) - ${newPointage.type} à ${newPointage.date} (Pointeuse: ${pointeuse.pointeuse})`);
       }

       return {
         success: true,
         message: WEBHOOK_CONFIG.MESSAGES.SUCCESS,
         pointage: newPointage
       };

         } catch (error) {
       console.error("🔥 Erreur webhook pointage:", error);
       return {
         success: false,
         message: WEBHOOK_CONFIG.MESSAGES.INTERNAL_ERROR
       };
     }
  }

     /**
    * Parse les données JSON du event_log
    */
   private parseEventLog(eventLog: string): HikvisionEventData | null {
     try {
       return JSON.parse(eventLog);
     } catch (e) {
       if (shouldLog()) {
         console.error("❌ Erreur parsing event_log:", e);
       }
       return null;
     }
   }

     /**
    * Valide les données de pointage
    */
   private validatePointageData(acsEvent: any): { isValid: boolean; message: string } {
     if (!acsEvent.employeeNoString || !acsEvent.serialNo) {
       return {
         isValid: false,
         message: WEBHOOK_CONFIG.MESSAGES.INCOMPLETE_DATA
       };
     }

     if (!acsEvent.name) {
       return {
         isValid: false,
         message: WEBHOOK_CONFIG.MESSAGES.MISSING_NAME
       };
     }

     return { isValid: true, message: "" };
   }

          /**
      * Identifie la pointeuse par son IP
      */
     private async identifyPointeuse(ipAddress: string) {
       if (shouldLog()) {
         console.log(`🔍 Recherche de la pointeuse avec IP: ${ipAddress}`);
       }
       
       const pointeuses = await this.pointeuseService.getAllPointeuses();
       const pointeuse = pointeuses.find(p => p.adresse_ip === ipAddress);
       
       if (!pointeuse) {
         console.error(`❌ Pointeuse avec IP ${ipAddress} non trouvée dans la base de données`);
         if (shouldLog()) {
           console.log(`📋 Pointeuses disponibles:`, pointeuses.map(p => `${p.pointeuse} (${p.adresse_ip})`));
         }
         return null;
       }
       
       if (shouldLog()) {
         console.log(`✅ Pointeuse identifiée: ${pointeuse.pointeuse} (${pointeuse.adresse_ip})`);
       }
       return pointeuse;
     }

  /**
   * Mappe les données Hikvision vers le format de pointage
   */
  private mapPointageData(acsEvent: any, eventData: HikvisionEventData, pointeuse: any) {
    return {
      matricule: acsEvent.employeeNoString,
      type: this.mapAttendanceStatus(acsEvent.attendanceStatus || 'checkIn'),
      date: new Date(eventData.dateTime),
      mode: ModePointage.BIO,
      statut: StatutPointage.NORMAL,
      id_pointeuse: pointeuse.id_pointeuse,
      serialNo: acsEvent.serialNo
    };
  }

  /**
   * Mappe le statut de présence Hikvision vers TypePointage
   */
  private mapAttendanceStatus(status: string): TypePointage {
    switch (status) {
      case 'checkIn':
        return TypePointage.ENTREE;
      case 'checkOut':
        return TypePointage.SORTIE;
      default:
        return TypePointage.ENTREE;
    }
  }

          /**
      * Envoie les notifications
      */
     private async sendNotifications(pointage: any, employee: any, pointeuse: any) {
       await this.notificationService.sendPointageNotification(pointage, employee, pointeuse, {
         log: shouldLog(),
         email: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
         webSocket: process.env.ENABLE_WEBSOCKET_NOTIFICATIONS === 'true',
         push: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true'
       });
     }

  /**
   * Détecte si une requête est un test de la pointeuse
   * Seuls les événements d'empreinte digitale (subEventType = 38) sont traités
   */
  static isTestRequest(body: any): boolean {
    // Si pas de données du tout
    if (!body || Object.keys(body).length === 0) {
      return true;
    }
    
    // Si les données contiennent des champs de test typiques
    if (body.test || body.ping || body.heartbeat || body.status) {
      return true;
    }
    
         // Si les données sont trop courtes (probablement un test)
     const bodyStr = JSON.stringify(body);
     if (bodyStr.length < WEBHOOK_CONFIG.VALIDATION.MIN_BODY_LENGTH) {
       return true;
     }
    
    // Vérifier si c'est un vrai événement de pointage avec des données utilisateur
    if (body.event_log) {
      try {
        const eventData = JSON.parse(body.event_log);
        const accessEvent = eventData.AccessControllerEvent;
        
        // Si pas d'événement AccessControllerEvent
        if (!accessEvent) {
          return true;
        }
        
                 // FILTRE STRICT : Seuls les événements d'empreinte digitale
         if (accessEvent.subEventType !== WEBHOOK_CONFIG.ACCEPTED_SUB_EVENT_TYPE) {
           if (shouldLog()) {
             console.log(`🔄 Événement ignoré - subEventType: ${accessEvent.subEventType} (seul ${WEBHOOK_CONFIG.ACCEPTED_SUB_EVENT_TYPE} = empreinte digitale accepté)`);
           }
           return true;
         }
         
         // Si pas de données utilisateur (employeeNoString, name)
         if (!accessEvent.employeeNoString && !accessEvent.name) {
           return true;
         }
         
         // Si c'est un événement système (pas de pointage réel)
         if (accessEvent.attendanceStatus === "undefined" && !accessEvent.employeeNoString) {
           return true;
         }
         
         if (shouldLog()) {
           console.log(`✅ Événement d'empreinte digitale détecté - subEventType: ${accessEvent.subEventType}, employé: ${accessEvent.name || accessEvent.employeeNoString}`);
         }
         return false; // C'est un vrai pointage d'empreinte digitale
      } catch (e) {
        return true; // Erreur de parsing = probablement un test
      }
    }
    
    // Si pas de données de pointage valides
    if (!body.AcsEvent && !body.employeeNoString && !body.time) {
      return true;
    }
    
    return false;
  }
}
