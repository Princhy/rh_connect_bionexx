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
import { ILieu } from "./lieu.entity";
import { LieuService, LieuCreationParams, LieuUpdateParams } from "./lieu.service";

@Route("lieux")
@Tags("Lieu")
export class LieuController extends Controller {

  @Get("{id}")
  public async getLieu(@Path() id: number): Promise<ILieu | undefined> {
    return new LieuService().getLieuById(id);
  }

  @Post()
 @Security("jwt", ["admin","RH"])
  public async createLieu(@Body() body: LieuCreationParams): Promise<ILieu> {
    return new LieuService().createLieu(body);
  }

  @Get()
  public async getAllLieux(): Promise<ILieu[]> {
    return new LieuService().getAllLieux();
  }

  @Put("{id}")
  @Security("jwt", ["admin","RH"])
  public async updateLieu(
    @Path() id: number,
    @Body() body: LieuUpdateParams
  ): Promise<ILieu | undefined> {
    return new LieuService().updateLieu(id, body);
  }

  @Delete("{id}")
 @Security("jwt", ["admin","RH"])
  public async deleteLieu(@Path() id: number): Promise<ILieu | undefined> {
    return new LieuService().deleteLieu(id);
  }
}