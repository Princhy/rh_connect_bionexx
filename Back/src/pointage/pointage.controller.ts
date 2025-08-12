import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Path,
  Post,
  Route,
  Tags,
  Security
} from "tsoa";
import { PointageOutput } from "./pointage.interface";
import { PointageService, PointageCreationParams, PointageUpdateParams } from "./pointage.service";
import { TypePointage, StatutPointage, ModePointage } from "../enum";
import { UserService } from "../user/user.service";
import { userRepository } from "../user/user.repository";
import DigestFetch from "digest-fetch";
import { pointageRepository } from "./pointage.repository";
interface PointageValidationResult {
  success: boolean;
  message: string;
  data?: any;
}

@Route("pointages")
@Tags("Pointage")
export class PointageController extends Controller {
 
  // Récupérer un pointage par ID
  @Get("{id}")
  @Security("jwt")
  public async getPointage(@Path() id: number): Promise<PointageOutput | undefined> {
    return new PointageService().getPointageById(id);
  }

  // Créer un nouveau pointage
  @Post()
  @Security("jwt", ["admin", "RH"])
  public async createPointage(@Body() requestBody: PointageCreationParams): Promise<PointageValidationResult> {
    try {
      // Validation des enums
      if (!Object.values(TypePointage).includes(requestBody.type)) {
        return {
          success: false,
          message: `Type invalide. Valeurs acceptées: ${Object.values(TypePointage).join(", ")}`
        };
      }

      if (!Object.values(ModePointage).includes(requestBody.mode)) {
        return {
          success: false,
          message: `Mode invalide. Valeurs acceptées: ${Object.values(ModePointage).join(", ")}`
        };
      }

      if (!Object.values(StatutPointage).includes(requestBody.statut)) {
        return {
          success: false,
          message: `Statut invalide. Valeurs acceptées: ${Object.values(StatutPointage).join(", ")}`
        };
      }

      const pointage = await new PointageService().createPointage(requestBody);
      this.setStatus(201);
      return {
        success: true,
        message: `Pointage créé avec succès`,
        data: pointage
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la création: ${error}`
      };
    }
  }

  // Récupérer tous les pointages
  @Get()
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getAllPointages(): Promise<PointageOutput[]> {
    return await new PointageService().getAllPointages();
  }

  // Mettre à jour un pointage
  @Put("{id}")
  @Security("jwt", ["admin", "RH"])
  public async updatePointage(
    @Path() id: number,
    @Body() requestBody: PointageUpdateParams
  ): Promise<PointageValidationResult> {
    try {
      // Validation des enums si fournis
      if (requestBody.type && !Object.values(TypePointage).includes(requestBody.type)) {
        return {
          success: false,
          message: `Type invalide. Valeurs acceptées: ${Object.values(TypePointage).join(", ")}`
        };
      }

      if (requestBody.mode && !Object.values(ModePointage).includes(requestBody.mode)) {
        return {
          success: false,
          message: `Mode invalide. Valeurs acceptées: ${Object.values(ModePointage).join(", ")}`
        };
      }

      if (requestBody.statut && !Object.values(StatutPointage).includes(requestBody.statut)) {
        return {
          success: false,
          message: `Statut invalide. Valeurs acceptées: ${Object.values(StatutPointage).join(", ")}`
        };
      }

      const pointage = await new PointageService().updatePointage(id, requestBody);
      return {
        success: true,
        message: `Pointage mis à jour avec succès`,
        data: pointage
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la mise à jour: ${error}`
      };
    }
  }

  // Supprimer un pointage
  @Delete("{id}")
  @Security("jwt", ["admin"])
  public async deletePointage(@Path() id: number): Promise<PointageOutput | undefined> {
    return new PointageService().deletePointage(id);
  }

  // Récupérer les pointages par matricule
  @Get("matricule/{matricule}")
  @Security("jwt")
  public async getPointagesByMatricule(@Path() matricule: string): Promise<PointageOutput[]> {
    return new PointageService().getPointagesByMatricule(matricule);
  }

  // Récupérer les pointages par date
  @Get("date/{date}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getPointagesByDate(@Path() date: string): Promise<PointageOutput[]> {
    return new PointageService().getPointagesByDate(date);
  }

  // Récupérer les pointages par matricule et date
  @Get("matricule/{matricule}/date/{date}")
  @Security("jwt")  
  public async getPointagesByMatriculeAndDate(
    @Path() matricule: string,
    @Path() date: string
  ): Promise<PointageOutput[]> {
    return new PointageService().getPointagesByMatriculeAndDate(matricule, date);
  }

  // Récupérer les pointages par pointeuse
  @Get("pointeuse/{id_pointeuse}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getPointagesByPointeuse(@Path() id_pointeuse: number): Promise<PointageOutput[]> {
    return new PointageService().getPointagesByPointeuse(id_pointeuse);
  }

  // Importation des pointages via API Hikvision avec PAGINATION COMPLÈTE
@Post("import-pointages-api")
@Security("jwt", ["admin", "RH"])
public async importPointagesFromApi(): Promise<{ 
  success: boolean; 
  count: number; 
  totalPointages?: number;
  errors?: string[];
}> {
  try {
    console.log("🔍 Début import pointages API Hikvision avec pagination...");

    // 1️⃣ Authentification Digest
    const digestClient = new DigestFetch(
      process.env.API_USERNAME || "admin",
      process.env.API_PASSWORD || "12345"
    );

    const url = "http://10.4.101.206/ISAPI/AccessControl/AcsEvent?format=json";

    let allPointages: any[] = [];
    let createdCount = 0;
    let totalMatches = 0;
    let searchResultPosition = 0;
    const maxResults = 100; // Taille de page
    const errors: string[] = [];

    // ✅ Fonction pour convertir les dates au format MySQL
    const formatDateForMySQL = (isoDate: string): string => {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };


    // ✅ Fonction pour mapper le type de pointage
    const mapAttendanceStatus = (status: string): TypePointage => {
      switch (status) {
        case 'checkIn':
          return TypePointage.ENTREE;
        case 'checkOut':
          return TypePointage.SORTIE;
        default:
          return TypePointage.ENTREE;
      }
    };
// ✅ Date d'HIER au format ISO
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Reculer d'un jour
    const startTime = yesterday.toISOString().slice(0, 10) + 'T00:00:00+03:00';
    
    console.log(`📅 Récupération des pointages depuis: ${startTime}`);

    // 2️⃣ BOUCLE DE PAGINATION
    do {
      console.log(`📡 Requête page - Position: ${searchResultPosition}, Max: ${maxResults}`);

      const body = {
        AcsEventCond: {
          searchID: "1",
          searchResultPosition: searchResultPosition,
          maxResults: maxResults,
          major: 5,
          minor: 38,
          startTime: startTime
        }
      };

      const apiResponse = await digestClient.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP ${apiResponse.status} - ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      
      // 3️⃣ Vérification de la structure de réponse
      if (!data?.AcsEvent) {
        console.error("❌ Structure inattendue :", JSON.stringify(data, null, 2));
        break;
      }

      const { InfoList, numOfMatches, totalMatches: total, responseStatusStrg } = data.AcsEvent;
      
      // Mise à jour du total
      totalMatches = total;
      
      console.log(`📋 Page actuelle: ${numOfMatches} pointages`);
      console.log(`📊 Total dans l'API: ${totalMatches} pointages`);
      console.log(`🔄 Statut: ${responseStatusStrg}`);

      // 4️⃣ Traitement des pointages de cette page
      if (InfoList && Array.isArray(InfoList)) {
        for (const pointage of InfoList) {
          try {
            // Vérifier si le pointage existe déjà (par serialNo)
            const existing = await new PointageService().getPointageBySerialNo(pointage.serialNo);
            if (existing) {
              console.log(`⏩ Pointage serialNo ${pointage.serialNo} déjà existant, ignoré.`);
              continue;
            }

            // Vérifier si l'employé existe
            const employee = await new UserService().getUserByMatricule(pointage.employeeNoString);
            if (!employee) {
              const errorMsg = `❌ Employé ${pointage.employeeNoString} non trouvé pour le pointage ${pointage.serialNo}`;
              console.error(errorMsg);
              errors.push(errorMsg);
              continue;
            }

            // Mapping interne selon vos types d'enum
            const mappedPointage: PointageCreationParams = {
              matricule: pointage.employeeNoString,
              type: mapAttendanceStatus(pointage.attendanceStatus),
              date: new Date(pointage.time), // TypeORM accepte les objets Date
              mode: ModePointage.BIO,
              statut: StatutPointage.NORMAL,
              id_pointeuse: pointage.doorNo || 1,
              serialNo: pointage.serialNo
            };

            // Insertion en base avec votre service existant
            await new PointageService().createPointage(mappedPointage);
            console.log(`✅ Pointage ${mappedPointage.serialNo} pour ${mappedPointage.matricule} (${pointage.name}) inséré - ${mappedPointage.type} à ${mappedPointage.date}`);
            createdCount++;

          } catch (err) {
            const errorMsg = `❌ Erreur insertion pointage ${pointage.serialNo}: ${err}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }

        // 5️⃣ Mise à jour de la position pour la page suivante
        searchResultPosition += numOfMatches;
        allPointages.push(...InfoList);
      }

      // 6️⃣ Conditions d'arrêt
      // - responseStatusStrg: "OK" = dernière page, "MORE" = il y a d'autres pages
      // - Ou si on a récupéré tous les pointages
      if (responseStatusStrg === "OK" || searchResultPosition >= totalMatches) {
        console.log("🏁 Toutes les pages ont été récupérées");
        break;
      }

      // Petite pause entre les requêtes pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));

    } while (true);

    // 7️⃣ Résumé final
    console.log(`\n🎯 RÉSUMÉ DE L'IMPORT POINTAGES:`);
    console.log(`📅 Date: ${startTime}`);
    console.log(`📊 Total pointages dans l'API: ${totalMatches}`);
    console.log(`📥 Pointages récupérés: ${allPointages.length}`);
    console.log(`✅ Pointages créés: ${createdCount}`);
    console.log(`⏩ Pointages ignorés (déjà existants): ${allPointages.length - createdCount - errors.length}`);
    console.log(`❌ Erreurs: ${errors.length}`);

    return { 
      success: true, 
      count: createdCount,
      totalPointages: totalMatches,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (err) {
    console.error("🔥 Erreur critique import pointages API :", err);
    return { 
      success: false, 
      count: 0,
      errors: [`Erreur critique: ${err}`]
    };
  }
}

// 📝 FONCTION BONUS: Import pour une date spécifique
@Post("import-pointages-api-date")
@Security("jwt", ["admin", "RH"])
public async importPointagesFromApiByDate(@Body() body: { date: string }): Promise<{
  success: boolean;
  count: number;
  totalPointages?: number;
  errors?: string[];
}> {
  try {
    const { date } = body;
   
    // Validation de la date
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      throw new Error("Format de date invalide. Utilisez le format YYYY-MM-DD");
    }

    // Conversion au format requis par l'API
    const startTime = targetDate.toISOString().slice(0, 10) + 'T00:00:00+03:00';
   
    console.log(`📅 Import pointages depuis le ${date} (${startTime})`);

    // 1️⃣ Authentification Digest
    const digestClient = new DigestFetch(
      process.env.API_USERNAME || "admin",
      process.env.API_PASSWORD || "12345"
    );

    const url = "http://10.4.101.206/ISAPI/AccessControl/AcsEvent?format=json";

    let allPointages: any[] = [];
    let createdCount = 0;
    let totalMatches = 0;
    let searchResultPosition = 0;
    const maxResults = 100; // Taille de page
    const errors: string[] = [];

    // ✅ Fonction pour mapper le type de pointage
    const mapAttendanceStatus = (status: string): TypePointage => {
      switch (status) {
        case 'checkIn':
          return TypePointage.ENTREE;
        case 'checkOut':
          return TypePointage.SORTIE;
        default:
          return TypePointage.ENTREE;
      }
    };

    // 2️⃣ BOUCLE DE PAGINATION
    do {
      console.log(`📡 Requête page - Position: ${searchResultPosition}, Max: ${maxResults}`);

      const body = {
        AcsEventCond: {
          searchID: "1",
          searchResultPosition: searchResultPosition,
          maxResults: maxResults,
          major: 5,
          minor: 38,
          startTime: startTime
        }
      };

      const apiResponse = await digestClient.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP ${apiResponse.status} - ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      
      // 3️⃣ Vérification de la structure de réponse
      if (!data?.AcsEvent) {
        console.error("❌ Structure inattendue :", JSON.stringify(data, null, 2));
        break;
      }

      const { InfoList, numOfMatches, totalMatches: total, responseStatusStrg } = data.AcsEvent;
      
      // Mise à jour du total
      totalMatches = total;
      
      console.log(`📋 Page actuelle: ${numOfMatches} pointages`);
      console.log(`📊 Total dans l'API: ${totalMatches} pointages`);
      console.log(`🔄 Statut: ${responseStatusStrg}`);

      // 4️⃣ Traitement des pointages de cette page
      if (InfoList && Array.isArray(InfoList)) {
        for (const pointage of InfoList) {
          try {
            // Vérifier si le pointage existe déjà (par serialNo)
            const existing = await new PointageService().getPointageBySerialNo(pointage.serialNo);
            if (existing) {
              console.log(`⏩ Pointage serialNo ${pointage.serialNo} déjà existant, ignoré.`);
              continue;
            }

            // Vérifier si l'employé existe
            const employee = await new UserService().getUserByMatricule(pointage.employeeNoString);
            if (!employee) {
              const errorMsg = `❌ Employé ${pointage.employeeNoString} non trouvé pour le pointage ${pointage.serialNo}`;
              console.error(errorMsg);
              errors.push(errorMsg);
              continue;
            }

            // Mapping interne selon vos types d'enum
            const mappedPointage: PointageCreationParams = {
              matricule: pointage.employeeNoString,
              type: mapAttendanceStatus(pointage.attendanceStatus),
              date: new Date(pointage.time), // TypeORM accepte les objets Date
              mode: ModePointage.BIO,
              statut: StatutPointage.NORMAL,
              id_pointeuse: pointage.doorNo || 1,
              serialNo: pointage.serialNo
            };

            // Insertion en base avec votre service existant
            await new PointageService().createPointage(mappedPointage);
            console.log(`✅ Pointage ${mappedPointage.serialNo} pour ${mappedPointage.matricule} (${pointage.name}) inséré - ${mappedPointage.type} à ${mappedPointage.date}`);
            createdCount++;

          } catch (err) {
            const errorMsg = `❌ Erreur insertion pointage ${pointage.serialNo}: ${err}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }

        // 5️⃣ Mise à jour de la position pour la page suivante
        searchResultPosition += numOfMatches;
        allPointages.push(...InfoList);
      }

      // 6️⃣ Conditions d'arrêt
      if (responseStatusStrg === "OK" || searchResultPosition >= totalMatches) {
        console.log("🏁 Toutes les pages ont été récupérées");
        break;
      }

      // Petite pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 500));

    } while (true);

    // 7️⃣ Résumé final
    console.log(`\n🎯 RÉSUMÉ DE L'IMPORT POINTAGES:`);
    console.log(`📅 Date: ${date}`);
    console.log(`📊 Total pointages dans l'API: ${totalMatches}`);
    console.log(`📥 Pointages récupérés: ${allPointages.length}`);
    console.log(`✅ Pointages créés: ${createdCount}`);
    console.log(`⏩ Pointages ignorés (déjà existants): ${allPointages.length - createdCount - errors.length}`);
    console.log(`❌ Erreurs: ${errors.length}`);

    return { 
      success: true, 
      count: createdCount,
      totalPointages: totalMatches,
      errors: errors.length > 0 ? errors : undefined
    };
   
  } catch (err) {
    console.error("🔥 Erreur import pointages par date:", err);
    return {
      success: false,
      count: 0,
      errors: [`Erreur: ${err}`]
    };
  }
}

}

