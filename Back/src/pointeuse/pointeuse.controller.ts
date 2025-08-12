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
import { IPointeuse } from "./pointeuse.interface";
import { PointeuseService, PointeuseCreationParams, PointeuseUpdateParams } from "./pointeuse.service";

interface PointeuseValidationResult {
  success: boolean;
  message: string;
}

@Route("pointeuses")
@Tags("Pointeuse")
export class PointeuseController extends Controller {
    
  // Récupérer une pointeuse par ID
  @Get("{id}")
  @Security("jwt")
  public async getPointeuse(@Path() id: number): Promise<IPointeuse | undefined> {
    return new PointeuseService().getPointeuseById(id);
  }

  // Créer une nouvelle pointeuse
  @Post()
  @Security("jwt", ["admin", "RH"])
  public async createPointeuse(@Body() requestBody: PointeuseCreationParams): Promise<PointeuseValidationResult> {

    // Vérifiez si l'adresse IP existe déjà
    const pointeuseExists = await new PointeuseService().getPointeuseByIp(requestBody.adresse_ip);
    if (pointeuseExists) {
      return {
        success: false,
        message: 'Adresse IP déjà utilisée',
      };
    }

    const pointeuse = await new PointeuseService().createPointeuse(requestBody);
    this.setStatus(201); // set return status 201
    return {
      success: true,
      message: `Pointeuse ${pointeuse.adresse_ip} créée avec succès`,
    };
  }

  // Récupérer toutes les pointeuses
  @Get()
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getAllPointeuses(): Promise<IPointeuse[]> {
    return await new PointeuseService().getAllPointeuses();
  }

  // Mettre à jour une pointeuse
  @Put("{id}")
  @Security("jwt", ["admin", "RH"])
  public async updatePointeuse(
    @Path() id: number,
    @Body() requestBody: PointeuseUpdateParams
  ): Promise<PointeuseValidationResult> {

    // Vérification de l'adresse IP si elle est fournie
    if (requestBody.adresse_ip) {
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(requestBody.adresse_ip)) {
        return {
          success: false,
          message: 'Adresse IP n\'est pas valide',
        };
      }

      // Vérifiez si l'adresse IP existe déjà (exclure la pointeuse actuelle)
      const existingPointeuse = await new PointeuseService().getPointeuseByIp(requestBody.adresse_ip);
      if (existingPointeuse && existingPointeuse.id_pointeuse !== id) {
        return {
          success: false,
          message: 'Adresse IP déjà utilisée',
        };
      }
    }

    const pointeuse = await new PointeuseService().updatePointeuse(id, requestBody);
    this.setStatus(200);
    return {
      success: true,
      message: `Pointeuse mise à jour avec succès`,
    };
  }

  // Supprimer une pointeuse
  @Delete("{id}")
  @Security("jwt", ["admin"])
  public async deletePointeuse(@Path() id: number): Promise<IPointeuse | undefined> {
    return new PointeuseService().deletePointeuse(id);
  }

  // Récupérer les pointeuses par lieu
  @Get("lieu/{id_lieu}")
  @Security("jwt", ["admin", "RH", "superviseur"])
  public async getPointeusesByLieu(@Path() id_lieu: number): Promise<IPointeuse[]> {
    return new PointeuseService().getPointeusesByLieu(id_lieu);
  }
}