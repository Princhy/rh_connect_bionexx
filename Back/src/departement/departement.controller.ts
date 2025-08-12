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
import { IDepartement } from "./departement.entity";
import { DepartementService, DepartementCreationParams, DepartementUpdateParams } from "./departement.service";

@Route("departements")
@Tags("Departement")
export class DepartementController extends Controller {

  @Get("{id}")
  public async getDepartement(@Path() id: number): Promise<IDepartement | undefined> {
    return new DepartementService().getDepartementById(id);
  }

  @Post()
  @Security("jwt", ["admin","RH"])
  public async createDepartement(@Body() body: DepartementCreationParams): Promise<IDepartement> {
    return new DepartementService().createDepartement(body);
  }

  @Get()
  public async getAllDepartements(): Promise<IDepartement[]> {
    return new DepartementService().getAllDepartements();
  }

  @Put("{id}")
  @Security("jwt", ["admin","RH"])
  public async updateDepartement(
    @Path() id: number,
    @Body() body: DepartementUpdateParams
  ): Promise<IDepartement | undefined> {
    return new DepartementService().updateDepartement(id, body);
  }

  @Delete("{id}")
 @Security("jwt", ["admin","RH"])
  public async deleteDepartement(@Path() id: number): Promise<IDepartement | undefined> {
    return new DepartementService().deleteDepartement(id);
  }
}