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
  Security,
} from "tsoa";
import { IEquipe } from "./equipe.entity";
import { EquipeService, EquipeCreationParams, EquipeUpdateParams } from "./equipe.service";

@Route("equipes")
@Tags("Equipe")
export class EquipeController extends Controller {

  @Get("{id}")
  public async getEquipe(@Path() id: number): Promise<IEquipe | undefined> {
    return new EquipeService().getEquipeById(id);
  }

  @Post()
  @Security("jwt", ["admin","RH"])
  public async createEquipe(@Body() body: EquipeCreationParams): Promise<IEquipe> {
    return new EquipeService().createEquipe(body);
  }

  @Get()
  public async getAllEquipes(): Promise<IEquipe[]> {
    return new EquipeService().getAllEquipes();
  }

  @Put("{id}")
  @Security("jwt", ["admin","RH"])
  public async updateEquipe(
    @Path() id: number,
    @Body() body: EquipeUpdateParams
  ): Promise<IEquipe | undefined> {
    return new EquipeService().updateEquipe(id, body);
  }

  @Delete("{id}")
  @Security("jwt", ["admin","RH"])
  public async deleteEquipe(@Path() id: number): Promise<IEquipe | undefined> {
    return new EquipeService().deleteEquipe(id);
  }
}