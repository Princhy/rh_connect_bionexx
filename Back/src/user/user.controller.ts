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
  Query,
  Patch,
  Security  // Ajoutez cet import
} from "tsoa";
import { IUser, UserOutput} from "./user.interface";
import { UserService, UserCreationParams, UserUpdateParams } from "./user.service";
import { PointeuseService } from "../pointeuse/pointeuse.service";
import { Role } from "../enum";
import { TypeContrat } from "../enum";
import bcrypt from "bcryptjs"; 
import DigestFetch from "digest-fetch";
import dontev from 'dotenv'

dontev.config()
 interface UserValidationResult {
    success: boolean;
    message: string;
  }

// Identifiants Hikvision
const username = process.env.API_USERNAME; // à remplacer
const password = process.env.API_PASSWORD; // à remplacer
// Création du client digest
const client = new DigestFetch(username, password);

@Route("users")
@Tags("User")
export class UserController extends Controller {
    
  // Récupérer un utilisateur par ID
  @Get("{id}")
  @Security("jwt")
  public async getUser(@Path() id: number): Promise<UserOutput | undefined> {
    return new UserService().getUserById(id);
  }

  // Créer un nouvel utilisateur
  @Post()
  @Security("jwt", ["admin","RH"])
  public async createUser(@Body() requestBody: UserCreationParams): Promise<UserValidationResult> {
    
     const hashPassword = await bcrypt.hash(requestBody.password,10)

      // Vérifiez que l'email est valide
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(requestBody.email)) {
      return {
        success: false,
        message: 'Email is not valid',
      };
    }

     // Vérifiez si l'email existe déjà
     const userExists = await new UserService().findByEmail(requestBody.email);
     if (userExists) {
       return {
         success: false,
         message: 'Email already exists',
       };
     }

    const user = await new UserService().createUser({...requestBody, password: hashPassword});
      this.setStatus(201); // set return status 201
      return {
        success: true,
        message: `User ${user.prenom} created successfully`,
      };
  }

  // Récupérer tous les utilisateurs
  @Get()
  @Security("jwt", ["admin", "RH","superviseur"])
  public async getAllUsers(): Promise<UserOutput[]> {
    const users = await new UserService().getAllUsers();
 // Filtrer pour exclure les admins
  return users.filter(user => user.role !== Role.Admin);
  }

  // Mettre à jour un utilisateur
  @Put("{id}")
  @Security("jwt", ["admin", "RH","superviseur"])
  public async updateUser(
    @Path() id: number,
    @Body() requestBody: UserUpdateParams
  ): Promise<UserValidationResult> {

    const hashPassword = await bcrypt.hash(requestBody.password,10)

    const user = await new UserService().updateUser(id, {...requestBody, password: hashPassword});
      this.setStatus(201); // set return status 201
      return {
        success: true,
        message: `User ${user.prenom} created successfully`,
      };
  }
   // Mettre à jour un utilisateur sans mot de passe
  @Patch("{id}")
  @Security("jwt", ["admin", "RH","superviseur"])
  public async updateUserBase(
    @Path() id: number,
    @Body() requestBody: UserUpdateParams
  ): Promise<UserValidationResult> {

   
    const user = await new UserService().updateUser(id, requestBody);
      this.setStatus(201); // set return status 201
      return {
        success: true,
        message: `User ${user.prenom} created successfully`,
      };
  }


  // Supprimer un utilisateur
  @Delete("{id}")
  @Security("jwt", ["admin"])
  public async deleteUser(@Path() id: number): Promise<IUser | undefined> {
    return new UserService().deleteUser(id);
  }

  // Rechercher un utilisateur par matricule
  @Get("matricule/{matricule}")
  @Security("jwt")
  public async getUserByMatricule(@Path() matricule: string): Promise<UserOutput| undefined> {
    return new UserService().getUserByMatricule(matricule);
  }

  // Récupérer les utilisateurs par département
  @Get("departement/{departementId}")
  @Security("jwt",["admin", "RH","superviseur"])
  public async getUsersByDepartement(@Path() departementId: number): Promise<UserOutput[]> {
    const users = await new UserService().getUsersByDepartement(departementId);
    return users.filter(user => user.role !== Role.Admin);
  }

  // Récupérer les utilisateurs par équipe
  @Get("equipe/{equipeId}")
  @Security("jwt",["admin", "RH", "superviseur"])
  public async getUsersByEquipe(@Path() equipeId: number): Promise<UserOutput[]> {
    return new UserService().getUsersByEquipe(equipeId);
  }

  // Récupérer les utilisateurs par lieu
  @Get("lieu/{id_lieu}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getUsersByLieu(@Path() id_lieu: number): Promise<UserOutput[]> {
    return new UserService().getUsersByLieu(id_lieu);
  }

  // Récupérer les utilisateurs par rôle
  @Get("role/{role}")
  @Security("jwt", ["admin", "RH"])
  public async getUsersByRole(@Path() role: Role): Promise<UserOutput[]> {
    return new UserService().getUsersByRole(role);
  }
  
// Importation via API Hikvision depuis TOUTES les pointeuses avec PAGINATION COMPLÈTE
@Post("import-api")
@Security("jwt", ["admin", "RH"])
public async importFromApi(): Promise<{ 
  success: boolean; 
  count: number; 
  totalUsers?: number;
  errors?: string[];
  pointeusesProcessed?: number;
}> {
  try {
    console.log("🔍 Début import API Hikvision depuis toutes les pointeuses...");

    // 1️⃣ Récupération de toutes les pointeuses
    const pointeuseService = new PointeuseService();
    const pointeuses = await pointeuseService.getAllPointeuses();
    
    if (pointeuses.length === 0) {
      return {
        success: false,
        count: 0,
        errors: ["Aucune pointeuse configurée dans la base de données"]
      };
    }

    console.log(`📡 ${pointeuses.length} pointeuse(s) trouvée(s) dans la base de données`);

    // 2️⃣ Authentification Digest
    const digestClient = new DigestFetch(
      process.env.API_USERNAME || "admin",
      process.env.API_PASSWORD || "12345"
    );

    let totalCreatedCount = 0;
    let totalUsers = 0;
    const allErrors: string[] = [];
    let pointeusesProcessed = 0;
    const processedMatricules = new Set<string>(); // Pour éviter les doublons entre pointeuses

    // ✅ Fonction pour convertir les dates au format MySQL
    const formatDateForMySQL = (isoDate: string): string => {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    // 3️⃣ TRAITEMENT DE CHAQUE POINTEUSE
    for (const pointeuse of pointeuses) {
      try {
        console.log(`\n🔧 Traitement de la pointeuse: ${pointeuse.pointeuse} (${pointeuse.adresse_ip})`);
        
        const url = `http://${pointeuse.adresse_ip}/ISAPI/AccessControl/userInfo/Search?format=json`;
        
        let searchResultPosition = 0;
        const maxResults = 100;
        let pointeuseTotalMatches = 0;
        let pointeuseCreatedCount = 0;

        // 4️⃣ BOUCLE DE PAGINATION POUR CETTE POINTEUSE
        do {
          console.log(`📡 Requête page - Pointeuse: ${pointeuse.pointeuse}, Position: ${searchResultPosition}, Max: ${maxResults}`);

          const body = {
            UserInfoSearchCond: {
              searchID: "1",
              searchResultPosition: searchResultPosition,
              maxResults: maxResults
            }
          };

          const apiResponse = await digestClient.fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          if (!apiResponse.ok) {
            const errorMsg = `❌ Erreur HTTP ${apiResponse.status} pour la pointeuse ${pointeuse.pointeuse} (${pointeuse.adresse_ip})`;
            console.error(errorMsg);
            allErrors.push(errorMsg);
            break;
          }

          const data = await apiResponse.json();
          
          // 5️⃣ Vérification de la structure de réponse
          if (!data?.UserInfoSearch) {
            console.error(`❌ Structure inattendue pour ${pointeuse.pointeuse}:`, JSON.stringify(data, null, 2));
            break;
          }

          const { UserInfo, numOfMatches, totalMatches: total, responseStatusStrg } = data.UserInfoSearch;
          
          pointeuseTotalMatches = total;
          
          console.log(`📋 Page actuelle: ${numOfMatches} utilisateurs`);
          console.log(`📊 Total dans l'API: ${pointeuseTotalMatches} utilisateurs`);
          console.log(`🔄 Statut: ${responseStatusStrg}`);

          // 6️⃣ Traitement des utilisateurs de cette page
          if (UserInfo && Array.isArray(UserInfo)) {
            for (const user of UserInfo) {
              try {
                // Vérifier si le matricule a déjà été traité dans cette session
                if (processedMatricules.has(user.employeeNo)) {
                  console.log(`⏩ Matricule ${user.employeeNo} déjà traité dans une autre pointeuse, ignoré.`);
                  continue;
                }

                // Vérifier si déjà en base
                const existing = await new UserService().getUserByMatricule(user.employeeNo);
                if (existing) {
                  console.log(`⏩ Matricule ${user.employeeNo} déjà existant en base, ignoré.`);
                  processedMatricules.add(user.employeeNo);
                  continue;
                }

                // Mapping interne
                const mappedUser = {
                  matricule: user.employeeNo,
                  nom: user.name.split(" ")[0] || "",
                  prenom: user.name.split(" ").slice(1).join(" ") || "",
                  email: `${user.employeeNo}@bionexx.com`,
                  phone: "+261",
                  badge: "",
                  empreinte: "",
                  poste: "À définir",
                  type_contrat: TypeContrat.CDI,
                  date_embauche: formatDateForMySQL(user.Valid?.beginTime || new Date().toISOString()),
                  date_fin_contrat: formatDateForMySQL(user.Valid?.endTime || new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString()),
                  id_lieu: pointeuse.id_lieu, // Utiliser le lieu de la pointeuse
                  id_equipe: 1,
                  id_departement: 1,
                  role: Role.Employe,
                  password: await bcrypt.hash("123456", 10)
                };

                // Insertion en base
                await new UserService().createUser(mappedUser);
                console.log(`✅ Utilisateur ${mappedUser.matricule} (${mappedUser.nom} ${mappedUser.prenom}) inséré depuis ${pointeuse.pointeuse}`);
                pointeuseCreatedCount++;
                totalCreatedCount++;
                processedMatricules.add(user.employeeNo);

              } catch (err) {
                const errorMsg = `❌ Erreur insertion matricule ${user.employeeNo} (Pointeuse: ${pointeuse.pointeuse}): ${err}`;
                console.error(errorMsg);
                allErrors.push(errorMsg);
              }
            }

            // 7️⃣ Mise à jour de la position pour la page suivante
            searchResultPosition += numOfMatches;
          }

          // 8️⃣ Conditions d'arrêt pour cette pointeuse
          if (responseStatusStrg === "OK" || searchResultPosition >= pointeuseTotalMatches) {
            console.log(`🏁 Toutes les pages ont été récupérées pour ${pointeuse.pointeuse}`);
            break;
          }

          // Petite pause entre les requêtes pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 500));

        } while (true);

        console.log(`✅ Pointeuse ${pointeuse.pointeuse} traitée: ${pointeuseCreatedCount} utilisateurs créés`);
        pointeusesProcessed++;
        totalUsers += pointeuseTotalMatches;

      } catch (err) {
        const errorMsg = `🔥 Erreur critique pour la pointeuse ${pointeuse.pointeuse} (${pointeuse.adresse_ip}): ${err}`;
        console.error(errorMsg);
        allErrors.push(errorMsg);
      }
    }

    // 9️⃣ Résumé final
    console.log(`\n🎯 RÉSUMÉ DE L'IMPORT UTILISATEURS:`);
    console.log(`📡 Pointeuses traitées: ${pointeusesProcessed}/${pointeuses.length}`);
    console.log(`📊 Total utilisateurs dans toutes les APIs: ${totalUsers}`);
    console.log(`✅ Utilisateurs créés: ${totalCreatedCount}`);
    console.log(`⏩ Matricules uniques traités: ${processedMatricules.size}`);
    console.log(`❌ Erreurs: ${allErrors.length}`);

    return { 
      success: true, 
      count: totalCreatedCount,
      totalUsers: totalUsers,
      pointeusesProcessed: pointeusesProcessed,
      errors: allErrors.length > 0 ? allErrors : undefined
    };

  } catch (err) {
    console.error("🔥 Erreur critique import API :", err);
    return { 
      success: false, 
      count: 0,
      errors: [`Erreur critique: ${err}`]
    };
  }
}
}


