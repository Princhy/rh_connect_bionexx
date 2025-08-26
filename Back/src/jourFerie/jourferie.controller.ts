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
    Security
} from "tsoa";
import { IJourFerie, JourFerieOutput, JourFerieCreateParams, JourFerieUpdateParams } from "./jourferie.interface";
import { JourFerieService } from "./jourferie.service";

interface JourFerieResult {
    success: boolean;
    message: string;
    data?: any;
}

@Route("jours-feries")
@Tags("JourFerie")
export class JourFerieController extends Controller {
    
    @Get("{id}")
    @Security("jwt")
    public async getJourFerie(@Path() id: number): Promise<JourFerieOutput | undefined> {
        return new JourFerieService().getJourFerieById(id);
    }

    @Post()
    //@Security("jwt", ["admin", "RH"])
    public async createJourFerie(@Body() requestBody: JourFerieCreateParams): Promise<JourFerieResult> {
        try {
            const jourFerie = await new JourFerieService().createJourFerie(requestBody);
            this.setStatus(201);
            return { success: true, message: "Jour férié créé avec succès", data: jourFerie };
        } catch (error) {
            return { success: false, message: `Erreur lors de la création: ${error}` };
        }
    }

    @Get()
    @Security("jwt")
    public async getAllJoursFeries(): Promise<JourFerieOutput[]> {
        return new JourFerieService().getAllJoursFeries();
    }

    @Put("{id}")
    @Security("jwt", ["admin", "RH"])
    public async updateJourFerie(
        @Path() id: number,
        @Body() requestBody: JourFerieUpdateParams
    ): Promise<JourFerieResult> {
        try {
            const updated = await new JourFerieService().updateJourFerie(id, requestBody);
            if (!updated) {
                this.setStatus(404);
                return { success: false, message: "Jour férié non trouvé" };
            }
            return { success: true, message: "Jour férié mis à jour avec succès", data: updated };
        } catch (error) {
            return { success: false, message: `Erreur lors de la mise à jour: ${error}` };
        }
    }

    @Delete("{id}")
    @Security("jwt", ["admin", "RH"])
    public async deleteJourFerie(@Path() id: number): Promise<JourFerieResult> {
        try {
            const deleted = await new JourFerieService().deleteJourFerie(id);
            if (!deleted) {
                this.setStatus(404);
                return { success: false, message: "Jour férié non trouvé" };
            }
            return { success: true, message: "Jour férié supprimé avec succès" };
        } catch (error) {
            return { success: false, message: `Erreur lors de la suppression: ${error}` };
        }
    }

    @Get("periode")
    @Security("jwt")
    public async getJoursFeriesByPeriode(
        @Query() dateDebut: string,
        @Query() dateFin: string
    ): Promise<JourFerieOutput[]> {
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        return new JourFerieService().getJoursFeriesByDateRange(debut, fin);
    }
}
