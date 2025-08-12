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
  Query,
} from "tsoa";
import { IPlanningEquipe } from "./planning.entity";
import { PlanningService, PlanningCreationParams, PlanningUpdateParams, EmployeePlanningForDate } from "./planning.service";
import { horaire } from "../enum";

@Route("plannings")
@Tags("Planning")
export class PlanningController extends Controller {
  @Get("{id}")
  @Security("jwt", ["admin","RH"])
  public async getPlanning(@Path() id: number): Promise<IPlanningEquipe | undefined> {
    return new PlanningService().getPlanningById(id);
  }

  @Post()
  //@Security("jwt", ["admin","RH"])
  public async createPlanning(@Body() body: PlanningCreationParams): Promise<IPlanningEquipe> {
    return new PlanningService().createPlanning(body);
  }

  @Get()
  //@Security("jwt", ["admin","RH"])
  public async getAllPlannings(): Promise<IPlanningEquipe[]> {
    return new PlanningService().getAllPlannings();
  }

  @Put("{id}")
  @Security("jwt", ["admin","RH"])
  public async updatePlanning(
    @Path() id: number,
    @Body() body: PlanningUpdateParams
  ): Promise<IPlanningEquipe | undefined> {
    return new PlanningService().updatePlanning(id, body);
  }

  @Delete("{id}")
  @Security("jwt", ["admin","RH"])
  public async deletePlanning(@Path() id: number): Promise<IPlanningEquipe | undefined> {
    return new PlanningService().deletePlanning(id);
  }

  // Récupérer les plannings par équipe
  @Get("equipe/{equipeId}")
  @Security("jwt", ["admin","RH"])
  public async getPlanningsByEquipe(@Path() equipeId: number): Promise<IPlanningEquipe[]> {
    return new PlanningService().getPlanningsByEquipe(equipeId);
  }

  // Récupérer les plannings par semaine (pour équipes normales)
  @Get("semaine/{debutSemaine}")
  @Security("jwt", ["admin","RH"])
  public async getPlanningsByWeek(@Path() debutSemaine: string): Promise<IPlanningEquipe[]> {
    const date = new Date(debutSemaine);
    return new PlanningService().getPlanningsByWeek(date);
  }

  // Récupérer le planning d'une équipe
  @Get("equipe/{equipeId}/planning")
  @Security("jwt", ["admin","RH"])
  public async getPlanningByEquipe(@Path() equipeId: number): Promise<IPlanningEquipe | undefined> {
    return new PlanningService().getPlanningByEquipe(equipeId);
  }

  // Récupérer les plannings par type d'horaire
  @Get("horaire/{horaire}")
  @Security("jwt", ["admin","RH"])
  public async getPlanningsByHoraire(@Path() horaire: horaire): Promise<IPlanningEquipe[]> {
    return new PlanningService().getPlanningsByHoraire(horaire);
  }

  // NOUVELLE ROUTE : Obtenir le planning d'une équipe pour une date spécifique
  @Get("equipe/{equipeId}/date/{targetDate}")
  @Security("jwt", ["admin","RH"])
  public async getEmployeePlanningForDate(
    @Path() equipeId: number,
    @Path() targetDate: string
  ): Promise<EmployeePlanningForDate> {
    const date = new Date(targetDate);
    return new PlanningService().getEmployeePlanningForDate(equipeId, date);
  }

  // NOUVELLE ROUTE : Obtenir le planning de tous les employés pour une date spécifique
  @Get("date/{targetDate}")
  //@Security("jwt", ["admin","RH"])
  public async getAllEmployeesPlanningForDate(
    @Path() targetDate: string
  ): Promise<{ id_equipe: number, planning: EmployeePlanningForDate, equipe: any }[]> {
    const date = new Date(targetDate);
    return new PlanningService().getAllEmployeesPlanningForDate(date);
  }

  // NOUVELLE ROUTE : Créer un planning cyclique automatiquement
  @Post("cyclique")
  @Security("jwt", ["admin","RH"])
  public async createCyclicPlanning(
    @Body() body: { id_equipe: number, equipe_type: 'A' | 'B' | 'C', date_debut: string }
  ): Promise<IPlanningEquipe> {
    const date = new Date(body.date_debut);
    return new PlanningService().createCyclicPlanning(body.id_equipe, body.equipe_type, date);
  }

  // NOUVELLE ROUTE : Créer un planning fixe (équipe normale)
  @Post("fixe")
  @Security("jwt", ["admin","RH"])
  public async createFixePlanning(
    @Body() body: { 
      id_equipe: number, 
      jours_travail: string[], 
      deb_heure: string, 
      fin_heure: string,
      debut_semaine: string
    }
  ): Promise<IPlanningEquipe> {
    const date = new Date(body.debut_semaine);
    return new PlanningService().createFixePlanning(
      body.id_equipe, 
      body.jours_travail, 
      body.deb_heure, 
      body.fin_heure,
      date
    );
  }

  // NOUVELLE ROUTE : Obtenir qui devrait travailler maintenant
  @Get("actuel")
  @Security("jwt", ["admin","RH"])
  public async getCurrentWorkingEmployees(): Promise<{ id_equipe: number, planning: EmployeePlanningForDate, equipe: any }[]> {
    const now = new Date();
    const allPlannings = await new PlanningService().getAllEmployeesPlanningForDate(now);
    
    // Filtrer seulement ceux qui travaillent aujourd'hui
    return allPlannings.filter(p => p.planning.travaille);
  }

  // NOUVELLE ROUTE : Planning pour les 7 prochains jours
  @Get("equipe/{equipeId}/semaine-suivante")
  @Security("jwt", ["admin","RH"])
  public async getWeekPlanning(@Path() equipeId: number): Promise<{ date: string, planning: EmployeePlanningForDate }[]> {
    const service = new PlanningService();
    const results = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      const planning = await service.getEmployeePlanningForDate(equipeId, currentDate);
      results.push({
        date: currentDate.toISOString().split('T')[0],
        planning
      });
    }
    
    return results;
  }
}