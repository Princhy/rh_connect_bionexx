import { IPlanningEquipe, CycleDay } from "./planning.entity";
import { planningRepository } from "./planning.repository";
import { horaire } from "../enum";

export type PlanningCreationParams = Pick<
  IPlanningEquipe,
  "debut_semaine" | "jours_travail" | "horaire" | "deb_heure" | "fin_heure" | "id_equipe" | "type_planning" | "date_debut_cycle" | "cycle_pattern"
>;

export type PlanningUpdateParams = Partial<PlanningCreationParams>;

export interface EmployeePlanningForDate {
  travaille: boolean;
  shift?: 'jour' | 'nuit';
  deb_heure?: string;
  fin_heure?: string;
}

export class PlanningService {
  public async getPlanningById(id: number): Promise<IPlanningEquipe | undefined> {
    return await planningRepository().findOne({
      where: { id_planning: id },
      relations: ['equipe']
    });
  }

  public async createPlanning(params: PlanningCreationParams): Promise<IPlanningEquipe> {
    const planning = planningRepository().create(params);
    return await planningRepository().save(planning);
  }

  public async getAllPlannings(): Promise<IPlanningEquipe[]> {
    return await planningRepository().find({
      relations: ['equipe']
    });
  }

  public async updatePlanning(id: number, params: PlanningUpdateParams): Promise<IPlanningEquipe | undefined> {
    await planningRepository().update(id, params);
    return await this.getPlanningById(id);
  }

  public async deletePlanning(id: number): Promise<IPlanningEquipe | undefined> {
    const planning = await this.getPlanningById(id);
    if (planning) {
      await planningRepository().delete(id);
    }
    return planning;
  }

  public async getPlanningsByEquipe(id_equipe: number): Promise<IPlanningEquipe[]> {
    return await planningRepository().find({
      where: { id_equipe },
      relations: ['equipe']
    });
  }

  public async getPlanningsByWeek(debut_semaine: Date): Promise<IPlanningEquipe[]> {
    return await planningRepository().find({
      where: { debut_semaine },
      relations: ['equipe']
    });
  }

  public async getPlanningByEquipe(id_equipe: number): Promise<IPlanningEquipe | undefined> {
    return await planningRepository().findOne({
      where: { id_equipe },
      relations: ['equipe']
    });
  }

  public async getPlanningsByHoraire(horaire: horaire): Promise<IPlanningEquipe[]> {
    return await planningRepository().find({
      where: { horaire },
      relations: ['equipe']
    });
  }

  // NOUVELLE MÉTHODE PRINCIPALE : Calculer le planning d'un employé pour une date donnée
  public async getEmployeePlanningForDate(id_equipe: number, targetDate: Date): Promise<EmployeePlanningForDate> {
    const planning = await this.getPlanningByEquipe(id_equipe);
    
    if (!planning) {
      return { travaille: false };
    }

    if (planning.type_planning === 'fixe') {
      // Équipe normale - logique existante
      const dayOfWeek = targetDate.getDay(); // 0=dimanche, 1=lundi...
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      
      if (planning.jours_travail && planning.jours_travail.includes(dayNames[dayOfWeek])) {
        return {
          shift: planning.horaire === horaire.jour ? 'jour' : 'nuit',
          deb_heure: planning.deb_heure,
          fin_heure: planning.fin_heure,
          travaille: true
        };
      }
      return { travaille: false };
    }

    if (planning.type_planning === 'cyclique') {
      // Équipes A, B, C - calcul cyclique
      if (!planning.date_debut_cycle || !planning.cycle_pattern) {
        return { travaille: false };
      }

      const startDate = new Date(planning.date_debut_cycle);
      const diffTime = targetDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const cycleDay = (diffDays % 6) + 1; // Position dans le cycle de 6 jours (1 à 6)
      
      const dayPattern = planning.cycle_pattern.find(p => p.jour === cycleDay);
      
      if (!dayPattern || dayPattern.shift === 'repos') {
        return { travaille: false };
      }
      
      return {
        shift: dayPattern.shift,
        deb_heure: dayPattern.deb_heure,
        fin_heure: dayPattern.fin_heure,
        travaille: true
      };
    }

    return { travaille: false };
  }

  // Méthode pour obtenir le planning de plusieurs employés pour une date
  public async getAllEmployeesPlanningForDate(targetDate: Date): Promise<{ id_equipe: number, planning: EmployeePlanningForDate, equipe: any }[]> {
    const allPlannings = await this.getAllPlannings();
    const results = [];

    for (const planning of allPlannings) {
      const employeePlanning = await this.getEmployeePlanningForDate(planning.id_equipe, targetDate);
      results.push({
        id_equipe: planning.id_equipe,
        planning: employeePlanning,
        equipe: planning.equipe
      });
    }

    return results;
  }

  // Méthode helper pour créer un planning cyclique automatiquement
  public async createCyclicPlanning(id_equipe: number, equipe_type: 'A' | 'B' | 'C', date_debut: Date): Promise<IPlanningEquipe> {
    const cyclePatterns: Record<'A' | 'B' | 'C', CycleDay[]> = {
      A: [ // Jour → Jour → Nuit → Nuit → Repos → Repos
        { jour: 1, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' },
        { jour: 2, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' },
        { jour: 3, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' },
        { jour: 4, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' },
        { jour: 5, shift: 'repos' },
        { jour: 6, shift: 'repos' }
      ],
      B: [ // Nuit → Nuit → Repos → Repos → Jour → Jour
        { jour: 1, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' },
        { jour: 2, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' },
        { jour: 3, shift: 'repos' },
        { jour: 4, shift: 'repos' },
        { jour: 5, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' },
        { jour: 6, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' }
      ],
      C: [ // Repos → Repos → Jour → Jour → Nuit → Nuit
        { jour: 1, shift: 'repos' },
        { jour: 2, shift: 'repos' },
        { jour: 3, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' },
        { jour: 4, shift: 'jour', deb_heure: '06:00:00', fin_heure: '18:00:00' },
        { jour: 5, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' },
        { jour: 6, shift: 'nuit', deb_heure: '18:00:00', fin_heure: '06:00:00' }
      ]
    };

    const params: PlanningCreationParams = {
      type_planning: 'cyclique',
      date_debut_cycle: date_debut,
      cycle_pattern: cyclePatterns[equipe_type],
      id_equipe: id_equipe
    };

    return await this.createPlanning(params);
  }

  // Méthode pour créer un planning fixe (équipe normale)
  public async createFixePlanning(
    id_equipe: number, 
    jours_travail: string[], 
    deb_heure: string, 
    fin_heure: string,
    debut_semaine: Date
  ): Promise<IPlanningEquipe> {
    const params: PlanningCreationParams = {
      type_planning: 'fixe',
      debut_semaine,
      jours_travail,
      horaire: horaire.jour,
      deb_heure,
      fin_heure,
      id_equipe
    };

    return await this.createPlanning(params);
  }

  // Validation
  public validateJoursTravail(jours: string[]): boolean {
    const joursValides = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return jours.every(jour => joursValides.includes(jour));
  }

  public validateHoraires(deb_heure: string, fin_heure: string): boolean {
    if (!deb_heure || !fin_heure) return true;
   
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:00)?$/;
    if (!timeRegex.test(deb_heure) || !timeRegex.test(fin_heure)) {
      return false;
    }
    
    const [debutHours, debutMinutes] = deb_heure.split(':').map(Number);
    const [finHours, finMinutes] = fin_heure.split(':').map(Number);
    const debutTime = debutHours * 60 + debutMinutes;
    const finTime = finHours * 60 + finMinutes;
    
    // Pour les shifts de nuit, fin peut être le lendemain
    if (finTime < debutTime) {
      return true; // Shift de nuit valide (ex: 18:00 à 06:00)
    }
    
    return debutTime < finTime;
  }
}