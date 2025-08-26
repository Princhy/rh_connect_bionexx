import { PointageOutput } from "./pointage.interface";

export interface NotificationOptions {
  email?: boolean;
  webSocket?: boolean;
  log?: boolean;
  push?: boolean;
}

export class NotificationService {
  
  /**
   * Envoie une notification de pointage
   */
  async sendPointageNotification(
    pointage: PointageOutput, 
    employee: any, 
    pointeuse: any,
    options: NotificationOptions = { log: true }
  ): Promise<void> {
    try {
      console.log(`🔔 NOTIFICATION: ${employee.nom} ${employee.prenom} (${employee.matricule}) a pointé ${pointage.type} sur la pointeuse ${pointeuse.pointeuse} à ${pointage.date}`);
      
      // Log de base (toujours activé par défaut)
      if (options.log !== false) {
        await this.logNotification(pointage, employee, pointeuse);
      }
      
      // Notification par email
      if (options.email) {
        await this.sendEmailNotification(pointage, employee, pointeuse);
      }
      
      // Notification WebSocket pour mise à jour temps réel
      if (options.webSocket) {
        await this.sendWebSocketNotification(pointage, employee, pointeuse);
      }
      
      // Notification push (si configurée)
      if (options.push) {
        await this.sendPushNotification(pointage, employee, pointeuse);
      }
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la notification:", error);
    }
  }

  /**
   * Log de notification dans un fichier
   */
  private async logNotification(pointage: PointageOutput, employee: any, pointeuse: any): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'POINTAGE_NOTIFICATION',
        employee: {
          matricule: employee.matricule,
          nom: employee.nom,
          prenom: employee.prenom
        },
        pointage: {
          id: pointage.id_pointage,
          type: pointage.type,
          date: pointage.date,
          serialNo: pointage.serialNo
        },
        pointeuse: {
          id: pointeuse.id_pointeuse,
          nom: pointeuse.pointeuse,
          ip: pointeuse.adresse_ip
        }
      };
      
      console.log(`📝 LOG NOTIFICATION:`, JSON.stringify(logEntry, null, 2));
      
      // Ici vous pouvez ajouter la logique pour écrire dans un fichier de log
      // ou dans une base de données de logs
      
    } catch (error) {
      console.error("❌ Erreur lors du log de notification:", error);
    }
  }

  /**
   * Envoi de notification par email
   */
  private async sendEmailNotification(pointage: PointageOutput, employee: any, pointeuse: any): Promise<void> {
    try {
      // Ici vous pouvez implémenter l'envoi d'email
      // Exemple avec nodemailer ou autre service d'email
      
      const emailContent = {
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: `Pointage - ${employee.nom} ${employee.prenom}`,
        body: `
          Nouveau pointage détecté:
          
          Employé: ${employee.nom} ${employee.prenom} (${employee.matricule})
          Type: ${pointage.type}
          Date: ${pointage.date}
          Pointeuse: ${pointeuse.pointeuse} (${pointeuse.adresse_ip})
          Serial No: ${pointage.serialNo}
        `
      };
      
      console.log(`📧 EMAIL NOTIFICATION:`, emailContent);
      
      // Implémentez ici votre logique d'envoi d'email
      // await emailService.send(emailContent);
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi d'email:", error);
    }
  }

  /**
   * Envoi de notification WebSocket pour mise à jour temps réel
   */
  private async sendWebSocketNotification(pointage: PointageOutput, employee: any, pointeuse: any): Promise<void> {
    try {
      // Ici vous pouvez implémenter l'envoi de notification WebSocket
      // pour mettre à jour l'interface en temps réel
      
      const wsMessage = {
        type: 'POINTAGE_NOTIFICATION',
        data: {
          pointage,
          employee,
          pointeuse,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log(`🔌 WEBSOCKET NOTIFICATION:`, JSON.stringify(wsMessage, null, 2));
      
      // Implémentez ici votre logique WebSocket
      // await webSocketService.broadcast(wsMessage);
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi WebSocket:", error);
    }
  }

  /**
   * Envoi de notification push
   */
  private async sendPushNotification(pointage: PointageOutput, employee: any, pointeuse: any): Promise<void> {
    try {
      // Ici vous pouvez implémenter l'envoi de notification push
      // Exemple avec Firebase Cloud Messaging ou autre service
      
      const pushMessage = {
        title: `Pointage - ${employee.nom} ${employee.prenom}`,
        body: `${pointage.type} sur ${pointeuse.pointeuse}`,
        data: {
          pointageId: pointage.id_pointage,
          employeeMatricule: employee.matricule,
          type: pointage.type
        }
      };
      
      console.log(`📱 PUSH NOTIFICATION:`, pushMessage);
      
      // Implémentez ici votre logique de notification push
      // await pushService.send(pushMessage);
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de notification push:", error);
    }
  }

  /**
   * Notification pour les superviseurs/RH
   */
  async notifySupervisors(pointage: PointageOutput, employee: any, pointeuse: any): Promise<void> {
    try {
      // Notification spéciale pour les superviseurs
      const supervisorNotification = {
        type: 'SUPERVISOR_NOTIFICATION',
        priority: 'HIGH',
        data: {
          pointage,
          employee,
          pointeuse,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log(`👨‍💼 SUPERVISOR NOTIFICATION:`, JSON.stringify(supervisorNotification, null, 2));
      
      // Ici vous pouvez implémenter la logique pour notifier les superviseurs
      // - Email aux superviseurs du département
      // - Notification dans l'interface d'administration
      // - etc.
      
    } catch (error) {
      console.error("❌ Erreur lors de la notification superviseur:", error);
    }
  }

  /**
   * Notification d'anomalie de pointage
   */
  async notifyAnomaly(pointage: PointageOutput, employee: any, pointeuse: any, anomalyType: string): Promise<void> {
    try {
      const anomalyNotification = {
        type: 'POINTAGE_ANOMALY',
        anomalyType,
        severity: 'WARNING',
        data: {
          pointage,
          employee,
          pointeuse,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log(`⚠️ ANOMALY NOTIFICATION:`, JSON.stringify(anomalyNotification, null, 2));
      
      // Ici vous pouvez implémenter la logique pour notifier les anomalies
      // - Email d'alerte
      // - Notification urgente
      // - etc.
      
    } catch (error) {
      console.error("❌ Erreur lors de la notification d'anomalie:", error);
    }
  }
}


