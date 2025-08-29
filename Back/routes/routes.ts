/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../src/user/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PointeuseController } from './../src/pointeuse/pointeuse.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PointageController } from './../src/pointage/pointage.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlanningController } from './../src/planningEquipe/planning.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LieuController } from './../src/lieu/lieu.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { JourFerieController } from './../src/jourFerie/jourferie.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EquipeController } from './../src/equipe/equipe.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DepartementController } from './../src/departement/departement.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CongeController } from './../src/conge/conge.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LoginController } from './../src/Authentification/authentification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RefreshtokenController } from './../src/Authentification/authentification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogoutController } from './../src/Authentification/authentification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AnalyseController } from './../src/analysePointage/analyse.controller';
import { expressAuthentication } from './../src/Authentification/authentification.middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "TypeContrat": {
        "dataType": "refEnum",
        "enums": ["CDI","CDD","stage"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Role": {
        "dataType": "refEnum",
        "enums": ["Admin","RH","Superviseur","Employe"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserOutput": {
        "dataType": "refObject",
        "properties": {
            "id_user": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "nom": {"dataType":"string","required":true},
            "prenom": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "badge": {"dataType":"string","required":true},
            "empreinte": {"dataType":"string"},
            "poste": {"dataType":"string","required":true},
            "type_contrat": {"ref":"TypeContrat","required":true},
            "date_embauche": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "date_fin_contrat": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "id_lieu": {"dataType":"double","required":true},
            "id_equipe": {"dataType":"double","required":true},
            "id_departement": {"dataType":"double","required":true},
            "role": {"ref":"Role","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IUser.matricule-or-nom-or-prenom-or-email-or-phone-or-badge-or-empreinte-or-poste-or-type_contrat-or-date_embauche-or-date_fin_contrat-or-id_lieu-or-id_equipe-or-id_departement-or-role-or-password_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string","required":true},"nom":{"dataType":"string","required":true},"prenom":{"dataType":"string"},"email":{"dataType":"string","required":true},"phone":{"dataType":"string","required":true},"badge":{"dataType":"string","required":true},"empreinte":{"dataType":"string"},"poste":{"dataType":"string","required":true},"type_contrat":{"ref":"TypeContrat","required":true},"date_embauche":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}],"required":true},"date_fin_contrat":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},"id_lieu":{"dataType":"double","required":true},"id_equipe":{"dataType":"double","required":true},"id_departement":{"dataType":"double","required":true},"role":{"ref":"Role","required":true},"password":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IUser.matricule-or-nom-or-prenom-or-email-or-phone-or-badge-or-empreinte-or-poste-or-type_contrat-or-date_embauche-or-date_fin_contrat-or-id_lieu-or-id_equipe-or-id_departement-or-role-or-password_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string"},"nom":{"dataType":"string"},"prenom":{"dataType":"string"},"email":{"dataType":"string"},"phone":{"dataType":"string"},"badge":{"dataType":"string"},"empreinte":{"dataType":"string"},"poste":{"dataType":"string"},"type_contrat":{"ref":"TypeContrat"},"date_embauche":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},"date_fin_contrat":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},"id_lieu":{"dataType":"double"},"id_equipe":{"dataType":"double"},"id_departement":{"dataType":"double"},"role":{"ref":"Role"},"password":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_UserCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id_user": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "nom": {"dataType":"string","required":true},
            "prenom": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "badge": {"dataType":"string","required":true},
            "empreinte": {"dataType":"string"},
            "poste": {"dataType":"string","required":true},
            "type_contrat": {"ref":"TypeContrat","required":true},
            "date_embauche": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "date_fin_contrat": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "id_lieu": {"dataType":"double","required":true},
            "id_equipe": {"dataType":"double","required":true},
            "id_departement": {"dataType":"double","required":true},
            "role": {"ref":"Role","required":true},
            "password": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPointeuse": {
        "dataType": "refObject",
        "properties": {
            "id_pointeuse": {"dataType":"double","required":true},
            "adresse_ip": {"dataType":"string","required":true},
            "pointeuse": {"dataType":"string","required":true},
            "id_lieu": {"dataType":"double","required":true},
            "lieu": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPointeuse.adresse_ip-or-id_lieu-or-pointeuse_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id_lieu":{"dataType":"double","required":true},"adresse_ip":{"dataType":"string","required":true},"pointeuse":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IPointeuse.adresse_ip-or-id_lieu-or-pointeuse_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PointeuseCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id_lieu":{"dataType":"double"},"adresse_ip":{"dataType":"string"},"pointeuse":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_PointeuseCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypePointage": {
        "dataType": "refEnum",
        "enums": ["entree","sortie"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ModePointage": {
        "dataType": "refEnum",
        "enums": ["bio","badge","manuel"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutPointage": {
        "dataType": "refEnum",
        "enums": ["normal","retard","avance"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageOutput": {
        "dataType": "refObject",
        "properties": {
            "id_pointage": {"dataType":"double","required":true},
            "type": {"ref":"TypePointage","required":true},
            "date": {"dataType":"datetime","required":true},
            "mode": {"ref":"ModePointage","required":true},
            "statut": {"ref":"StatutPointage","required":true},
            "id_pointeuse": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "serialNo": {"dataType":"double","required":true},
            "pointeuse": {"dataType":"nestedObjectLiteral","nestedProperties":{"lieu":{"dataType":"any","required":true},"id_lieu":{"dataType":"double","required":true},"pointeuse":{"dataType":"string"},"adresse_ip":{"dataType":"string","required":true},"id_pointeuse":{"dataType":"double","required":true}}},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"departement":{"dataType":"any"},"equipe":{"dataType":"any"},"lieu":{"dataType":"any"},"role":{"dataType":"string","required":true},"id_departement":{"dataType":"double","required":true},"id_equipe":{"dataType":"double","required":true},"id_lieu":{"dataType":"double","required":true},"date_fin_contrat":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},"date_embauche":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},"type_contrat":{"dataType":"string","required":true},"poste":{"dataType":"string","required":true},"empreinte":{"dataType":"string"},"badge":{"dataType":"string","required":true},"phone":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"prenom":{"dataType":"string"},"nom":{"dataType":"string","required":true},"matricule":{"dataType":"string","required":true},"id_user":{"dataType":"double","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPointage.type-or-date-or-mode-or-statut-or-id_pointeuse-or-matricule-or-serialNo_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string","required":true},"type":{"ref":"TypePointage","required":true},"date":{"dataType":"datetime","required":true},"mode":{"ref":"ModePointage","required":true},"statut":{"ref":"StatutPointage","required":true},"id_pointeuse":{"dataType":"double","required":true},"serialNo":{"dataType":"double","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IPointage.type-or-date-or-mode-or-statut-or-id_pointeuse-or-matricule-or-serialNo_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PointageCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string"},"type":{"ref":"TypePointage"},"date":{"dataType":"datetime"},"mode":{"ref":"ModePointage"},"statut":{"ref":"StatutPointage"},"id_pointeuse":{"dataType":"double"},"serialNo":{"dataType":"double"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_PointageCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "horaire": {
        "dataType": "refEnum",
        "enums": ["jour","nuit","repos"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CycleDay": {
        "dataType": "refObject",
        "properties": {
            "jour": {"dataType":"double","required":true},
            "shift": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["jour"]},{"dataType":"enum","enums":["nuit"]},{"dataType":"enum","enums":["repos"]}],"required":true},
            "deb_heure": {"dataType":"string"},
            "fin_heure": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlanningEquipe": {
        "dataType": "refObject",
        "properties": {
            "id_planning": {"dataType":"double","required":true},
            "debut_semaine": {"dataType":"datetime"},
            "jours_travail": {"dataType":"array","array":{"dataType":"string"}},
            "horaire": {"ref":"horaire"},
            "deb_heure": {"dataType":"string"},
            "fin_heure": {"dataType":"string"},
            "type_planning": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["fixe"]},{"dataType":"enum","enums":["cyclique"]}],"required":true},
            "date_debut_cycle": {"dataType":"datetime"},
            "cycle_pattern": {"dataType":"array","array":{"dataType":"refObject","ref":"CycleDay"}},
            "id_equipe": {"dataType":"double","required":true},
            "equipe": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPlanningEquipe.debut_semaine-or-jours_travail-or-horaire-or-deb_heure-or-fin_heure-or-id_equipe-or-type_planning-or-date_debut_cycle-or-cycle_pattern_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id_equipe":{"dataType":"double","required":true},"debut_semaine":{"dataType":"datetime"},"jours_travail":{"dataType":"array","array":{"dataType":"string"}},"horaire":{"ref":"horaire"},"deb_heure":{"dataType":"string"},"fin_heure":{"dataType":"string"},"type_planning":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["fixe"]},{"dataType":"enum","enums":["cyclique"]}],"required":true},"date_debut_cycle":{"dataType":"datetime"},"cycle_pattern":{"dataType":"array","array":{"dataType":"refObject","ref":"CycleDay"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlanningCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IPlanningEquipe.debut_semaine-or-jours_travail-or-horaire-or-deb_heure-or-fin_heure-or-id_equipe-or-type_planning-or-date_debut_cycle-or-cycle_pattern_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PlanningCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id_equipe":{"dataType":"double"},"debut_semaine":{"dataType":"datetime"},"jours_travail":{"dataType":"array","array":{"dataType":"string"}},"horaire":{"ref":"horaire"},"deb_heure":{"dataType":"string"},"fin_heure":{"dataType":"string"},"type_planning":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["fixe"]},{"dataType":"enum","enums":["cyclique"]}]},"date_debut_cycle":{"dataType":"datetime"},"cycle_pattern":{"dataType":"array","array":{"dataType":"refObject","ref":"CycleDay"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlanningUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_PlanningCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmployeePlanningForDate": {
        "dataType": "refObject",
        "properties": {
            "travaille": {"dataType":"boolean","required":true},
            "shift": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["jour"]},{"dataType":"enum","enums":["nuit"]}]},
            "deb_heure": {"dataType":"string"},
            "fin_heure": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILieu": {
        "dataType": "refObject",
        "properties": {
            "id_lieu": {"dataType":"double","required":true},
            "lieu": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ILieu.lieu_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"lieu":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LieuCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_ILieu.lieu_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_LieuCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"lieu":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LieuUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_LieuCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieOutput": {
        "dataType": "refObject",
        "properties": {
            "id_jourferie": {"dataType":"double","required":true},
            "nom": {"dataType":"string","required":true},
            "date": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "recurrent": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieCreateParams": {
        "dataType": "refObject",
        "properties": {
            "nom": {"dataType":"string","required":true},
            "date": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "recurrent": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "nom": {"dataType":"string"},
            "date": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "recurrent": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEquipe": {
        "dataType": "refObject",
        "properties": {
            "id_equipe": {"dataType":"double","required":true},
            "equipe": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IEquipe.equipe_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipe":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipeCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IEquipe.equipe_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_EquipeCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipe":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipeUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_EquipeCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDepartement": {
        "dataType": "refObject",
        "properties": {
            "id_departement": {"dataType":"double","required":true},
            "departement": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IDepartement.departement_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"departement":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartementCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IDepartement.departement_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_DepartementCreationParams_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"departement":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartementUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_DepartementCreationParams_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypeConge": {
        "dataType": "refEnum",
        "enums": ["ANNUEL","MALADIE","MATERNITE","PATERNITE","EXCEPTIONNEL","AUTRE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutConge": {
        "dataType": "refEnum",
        "enums": ["ATTENTE","VALIDE","REFUSE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeOutput": {
        "dataType": "refObject",
        "properties": {
            "id_conge": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "motif": {"dataType":"string","required":true},
            "type": {"ref":"TypeConge","required":true},
            "nbr_jours_permis": {"dataType":"double","required":true},
            "solde_conge": {"dataType":"double","required":true},
            "date_depart": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "date_reprise": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "personne_interim": {"dataType":"string"},
            "statut": {"ref":"StatutConge"},
            "departement_id": {"dataType":"double"},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"prenom":{"dataType":"string","required":true},"nom":{"dataType":"string","required":true}}},
            "userInterim": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string","required":true},"prenom":{"dataType":"string","required":true},"nom":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeCreateParams": {
        "dataType": "refObject",
        "properties": {
            "matricule": {"dataType":"string","required":true},
            "motif": {"dataType":"string","required":true},
            "type": {"ref":"TypeConge","required":true},
            "nbr_jours_permis": {"dataType":"double","required":true},
            "solde_conge": {"dataType":"double","required":true},
            "date_depart": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "date_reprise": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "personne_interim": {"dataType":"string"},
            "statut": {"ref":"StatutConge"},
            "departement_id": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "matricule": {"dataType":"string"},
            "motif": {"dataType":"string"},
            "type": {"ref":"TypeConge"},
            "nbr_jours_permis": {"dataType":"double"},
            "solde_conge": {"dataType":"double"},
            "date_depart": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "date_reprise": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "personne_interim": {"dataType":"string"},
            "statut": {"ref":"StatutConge"},
            "departement_id": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SoldeValidationResult": {
        "dataType": "refObject",
        "properties": {
            "valid": {"dataType":"boolean","required":true},
            "soldeActuel": {"dataType":"double","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OUser": {
        "dataType": "refObject",
        "properties": {
            "id_user": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "nom": {"dataType":"string","required":true},
            "prenom": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "role": {"ref":"Role","required":true},
            "id_departement": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string"},
            "token": {"dataType":"string"},
            "user": {"ref":"OUser"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutAnalyse": {
        "dataType": "refEnum",
        "enums": ["present","retard","absent","sortie_anticipee","present_avec_retard","en_conge","EN_REPOS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IAnalyse.matricule-or-date-or-heure_prevue_arrivee-or-heure_prevue_depart-or-heure_reelle_arrivee-or-heure_reelle_depart-or-retard_minutes-or-sortie_anticipee_minutes-or-statut_final-or-travaille_aujourd_hui-or-commentaire-or-mode_pointage-or-lieu_pointage-or-lieu_travail-or-cycle_travail_debut-or-cycle_travail_fin-or-est_equipe_nuit_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"matricule":{"dataType":"string","required":true},"date":{"dataType":"datetime","required":true},"heure_prevue_arrivee":{"dataType":"string"},"heure_prevue_depart":{"dataType":"string"},"heure_reelle_arrivee":{"dataType":"string"},"heure_reelle_depart":{"dataType":"string"},"retard_minutes":{"dataType":"double","required":true},"sortie_anticipee_minutes":{"dataType":"double","required":true},"statut_final":{"ref":"StatutAnalyse","required":true},"travaille_aujourd_hui":{"dataType":"boolean","required":true},"commentaire":{"dataType":"string"},"mode_pointage":{"ref":"ModePointage"},"lieu_pointage":{"dataType":"string"},"lieu_travail":{"dataType":"string"},"cycle_travail_debut":{"dataType":"datetime"},"cycle_travail_fin":{"dataType":"datetime"},"est_equipe_nuit":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_IAnalyse.matricule-or-date-or-heure_prevue_arrivee-or-heure_prevue_depart-or-heure_reelle_arrivee-or-heure_reelle_depart-or-retard_minutes-or-sortie_anticipee_minutes-or-statut_final-or-travaille_aujourd_hui-or-commentaire-or-mode_pointage-or-lieu_pointage-or-lieu_travail-or-cycle_travail_debut-or-cycle_travail_fin-or-est_equipe_nuit_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseOutput": {
        "dataType": "refObject",
        "properties": {
            "id_analyse": {"dataType":"double","required":true},
            "matricule": {"dataType":"string","required":true},
            "date": {"dataType":"datetime","required":true},
            "heure_prevue_arrivee": {"dataType":"string"},
            "heure_prevue_depart": {"dataType":"string"},
            "heure_reelle_arrivee": {"dataType":"string"},
            "heure_reelle_depart": {"dataType":"string"},
            "retard_minutes": {"dataType":"double","required":true},
            "sortie_anticipee_minutes": {"dataType":"double","required":true},
            "statut_final": {"ref":"StatutAnalyse","required":true},
            "travaille_aujourd_hui": {"dataType":"boolean","required":true},
            "justifie": {"dataType":"boolean","required":true},
            "commentaire": {"dataType":"string"},
            "mode_pointage": {"ref":"ModePointage"},
            "lieu_pointage": {"dataType":"string"},
            "lieu_travail": {"dataType":"string"},
            "date_analyse": {"dataType":"datetime","required":true},
            "cycle_travail_debut": {"dataType":"datetime"},
            "cycle_travail_fin": {"dataType":"datetime"},
            "est_equipe_nuit": {"dataType":"boolean"},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"lieu":{"dataType":"nestedObjectLiteral","nestedProperties":{"lieu":{"dataType":"string","required":true},"id_lieu":{"dataType":"double","required":true}}},"departement":{"dataType":"nestedObjectLiteral","nestedProperties":{"departement":{"dataType":"string","required":true},"id_departement":{"dataType":"double","required":true}}},"equipe":{"dataType":"nestedObjectLiteral","nestedProperties":{"equipe":{"dataType":"string","required":true},"id_equipe":{"dataType":"double","required":true}}},"poste":{"dataType":"string","required":true},"prenom":{"dataType":"string","required":true},"nom":{"dataType":"string","required":true},"matricule":{"dataType":"string","required":true},"id_user":{"dataType":"double","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_IAnalyse.justifie-or-commentaire-or-statut_final-or-mode_pointage__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"statut_final":{"ref":"StatutAnalyse"},"commentaire":{"dataType":"string"},"mode_pointage":{"ref":"ModePointage"},"justifie":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseUpdateParams": {
        "dataType": "refAlias",
        "type": {"ref":"Partial_Pick_IAnalyse.justifie-or-commentaire-or-statut_final-or-mode_pointage__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/users/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUser)),

            async function UserController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserCreationParams"},
        };
        app.post('/users',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createUser)),

            async function UserController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_createUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/users',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAllUsers)),

            async function UserController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserUpdateParams"},
        };
        app.put('/users/:id',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUser)),

            async function UserController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUserBase: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"UserUpdateParams"},
        };
        app.patch('/users/:id',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUserBase)),

            async function UserController_updateUserBase(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUserBase, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUserBase',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/users/:id',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deleteUser)),

            async function UserController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUserByMatricule: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
        };
        app.get('/users/matricule/:matricule',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserByMatricule)),

            async function UserController_getUserByMatricule(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserByMatricule, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserByMatricule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUsersByDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                departementId: {"in":"path","name":"departementId","required":true,"dataType":"double"},
        };
        app.get('/users/departement/:departementId',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersByDepartement)),

            async function UserController_getUsersByDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByDepartement, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersByDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUsersByEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                equipeId: {"in":"path","name":"equipeId","required":true,"dataType":"double"},
        };
        app.get('/users/equipe/:equipeId',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersByEquipe)),

            async function UserController_getUsersByEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByEquipe, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersByEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUsersByLieu: Record<string, TsoaRoute.ParameterSchema> = {
                id_lieu: {"in":"path","name":"id_lieu","required":true,"dataType":"double"},
        };
        app.get('/users/lieu/:id_lieu',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersByLieu)),

            async function UserController_getUsersByLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByLieu, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersByLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUsersByRole: Record<string, TsoaRoute.ParameterSchema> = {
                role: {"in":"path","name":"role","required":true,"ref":"Role"},
        };
        app.get('/users/role/:role',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsersByRole)),

            async function UserController_getUsersByRole(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByRole, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsersByRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_importFromApi: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.post('/users/import-api',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.importFromApi)),

            async function UserController_importFromApi(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_importFromApi, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'importFromApi',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_getPointeuse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/pointeuses/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.getPointeuse)),

            async function PointeuseController_getPointeuse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getPointeuse, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'getPointeuse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_createPointeuse: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PointeuseCreationParams"},
        };
        app.post('/pointeuses',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.createPointeuse)),

            async function PointeuseController_createPointeuse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_createPointeuse, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'createPointeuse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_getAllPointeuses: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/pointeuses',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.getAllPointeuses)),

            async function PointeuseController_getAllPointeuses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getAllPointeuses, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'getAllPointeuses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_updatePointeuse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PointeuseUpdateParams"},
        };
        app.put('/pointeuses/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.updatePointeuse)),

            async function PointeuseController_updatePointeuse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_updatePointeuse, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'updatePointeuse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_deletePointeuse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/pointeuses/:id',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.deletePointeuse)),

            async function PointeuseController_deletePointeuse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_deletePointeuse, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'deletePointeuse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointeuseController_getPointeusesByLieu: Record<string, TsoaRoute.ParameterSchema> = {
                id_lieu: {"in":"path","name":"id_lieu","required":true,"dataType":"double"},
        };
        app.get('/pointeuses/lieu/:id_lieu',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController)),
            ...(fetchMiddlewares<RequestHandler>(PointeuseController.prototype.getPointeusesByLieu)),

            async function PointeuseController_getPointeusesByLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getPointeusesByLieu, request, response });

                const controller = new PointeuseController();

              await templateService.apiHandler({
                methodName: 'getPointeusesByLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getPointage: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/pointages/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getPointage)),

            async function PointageController_getPointage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointage, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getPointage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_createPointage: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PointageCreationParams"},
        };
        app.post('/pointages',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.createPointage)),

            async function PointageController_createPointage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_createPointage, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'createPointage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getAllPointages: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/pointages',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getAllPointages)),

            async function PointageController_getAllPointages(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getAllPointages, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getAllPointages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_updatePointage: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PointageUpdateParams"},
        };
        app.put('/pointages/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.updatePointage)),

            async function PointageController_updatePointage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_updatePointage, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'updatePointage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_deletePointage: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/pointages/:id',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.deletePointage)),

            async function PointageController_deletePointage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_deletePointage, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'deletePointage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getPointagesByMatricule: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
        };
        app.get('/pointages/matricule/:matricule',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getPointagesByMatricule)),

            async function PointageController_getPointagesByMatricule(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByMatricule, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getPointagesByMatricule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getPointagesByDate: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/pointages/date/:date',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getPointagesByDate)),

            async function PointageController_getPointagesByDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByDate, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getPointagesByDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getPointagesByMatriculeAndDate: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/pointages/matricule/:matricule/date/:date',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getPointagesByMatriculeAndDate)),

            async function PointageController_getPointagesByMatriculeAndDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByMatriculeAndDate, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getPointagesByMatriculeAndDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_getPointagesByPointeuse: Record<string, TsoaRoute.ParameterSchema> = {
                id_pointeuse: {"in":"path","name":"id_pointeuse","required":true,"dataType":"double"},
        };
        app.get('/pointages/pointeuse/:id_pointeuse',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.getPointagesByPointeuse)),

            async function PointageController_getPointagesByPointeuse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByPointeuse, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'getPointagesByPointeuse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_importPointagesFromApi: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.post('/pointages/import-pointages-api',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.importPointagesFromApi)),

            async function PointageController_importPointagesFromApi(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_importPointagesFromApi, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'importPointagesFromApi',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPointageController_importPointagesFromApiByDate: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"string","required":true}}},
        };
        app.post('/pointages/import-pointages-api-date',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PointageController)),
            ...(fetchMiddlewares<RequestHandler>(PointageController.prototype.importPointagesFromApiByDate)),

            async function PointageController_importPointagesFromApiByDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_importPointagesFromApiByDate, request, response });

                const controller = new PointageController();

              await templateService.apiHandler({
                methodName: 'importPointagesFromApiByDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getPlanning: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/plannings/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getPlanning)),

            async function PlanningController_getPlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getPlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_createPlanning: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"PlanningCreationParams"},
        };
        app.post('/plannings',
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.createPlanning)),

            async function PlanningController_createPlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createPlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'createPlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getAllPlannings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plannings',
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getAllPlannings)),

            async function PlanningController_getAllPlannings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getAllPlannings, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getAllPlannings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_updatePlanning: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"PlanningUpdateParams"},
        };
        app.put('/plannings/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.updatePlanning)),

            async function PlanningController_updatePlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_updatePlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'updatePlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_deletePlanning: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/plannings/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.deletePlanning)),

            async function PlanningController_deletePlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_deletePlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'deletePlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getPlanningsByEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                equipeId: {"in":"path","name":"equipeId","required":true,"dataType":"double"},
        };
        app.get('/plannings/equipe/:equipeId',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getPlanningsByEquipe)),

            async function PlanningController_getPlanningsByEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByEquipe, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getPlanningsByEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getPlanningsByWeek: Record<string, TsoaRoute.ParameterSchema> = {
                debutSemaine: {"in":"path","name":"debutSemaine","required":true,"dataType":"string"},
        };
        app.get('/plannings/semaine/:debutSemaine',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getPlanningsByWeek)),

            async function PlanningController_getPlanningsByWeek(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByWeek, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getPlanningsByWeek',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getPlanningByEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                equipeId: {"in":"path","name":"equipeId","required":true,"dataType":"double"},
        };
        app.get('/plannings/equipe/:equipeId/planning',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getPlanningByEquipe)),

            async function PlanningController_getPlanningByEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningByEquipe, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getPlanningByEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getPlanningsByHoraire: Record<string, TsoaRoute.ParameterSchema> = {
                horaire: {"in":"path","name":"horaire","required":true,"ref":"horaire"},
        };
        app.get('/plannings/horaire/:horaire',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getPlanningsByHoraire)),

            async function PlanningController_getPlanningsByHoraire(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByHoraire, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getPlanningsByHoraire',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getEmployeePlanningForDate: Record<string, TsoaRoute.ParameterSchema> = {
                equipeId: {"in":"path","name":"equipeId","required":true,"dataType":"double"},
                targetDate: {"in":"path","name":"targetDate","required":true,"dataType":"string"},
        };
        app.get('/plannings/equipe/:equipeId/date/:targetDate',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getEmployeePlanningForDate)),

            async function PlanningController_getEmployeePlanningForDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getEmployeePlanningForDate, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getEmployeePlanningForDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getAllEmployeesPlanningForDate: Record<string, TsoaRoute.ParameterSchema> = {
                targetDate: {"in":"path","name":"targetDate","required":true,"dataType":"string"},
        };
        app.get('/plannings/date/:targetDate',
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getAllEmployeesPlanningForDate)),

            async function PlanningController_getAllEmployeesPlanningForDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getAllEmployeesPlanningForDate, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getAllEmployeesPlanningForDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_createCyclicPlanning: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"date_debut":{"dataType":"string","required":true},"equipe_type":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["A"]},{"dataType":"enum","enums":["B"]},{"dataType":"enum","enums":["C"]}],"required":true},"id_equipe":{"dataType":"double","required":true}}},
        };
        app.post('/plannings/cyclique',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.createCyclicPlanning)),

            async function PlanningController_createCyclicPlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createCyclicPlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'createCyclicPlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_createFixePlanning: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"debut_semaine":{"dataType":"string","required":true},"fin_heure":{"dataType":"string","required":true},"deb_heure":{"dataType":"string","required":true},"jours_travail":{"dataType":"array","array":{"dataType":"string"},"required":true},"id_equipe":{"dataType":"double","required":true}}},
        };
        app.post('/plannings/fixe',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.createFixePlanning)),

            async function PlanningController_createFixePlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createFixePlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'createFixePlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getCurrentWorkingEmployees: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plannings/actuel',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getCurrentWorkingEmployees)),

            async function PlanningController_getCurrentWorkingEmployees(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getCurrentWorkingEmployees, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getCurrentWorkingEmployees',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlanningController_getWeekPlanning: Record<string, TsoaRoute.ParameterSchema> = {
                equipeId: {"in":"path","name":"equipeId","required":true,"dataType":"double"},
        };
        app.get('/plannings/equipe/:equipeId/semaine-suivante',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(PlanningController)),
            ...(fetchMiddlewares<RequestHandler>(PlanningController.prototype.getWeekPlanning)),

            async function PlanningController_getWeekPlanning(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getWeekPlanning, request, response });

                const controller = new PlanningController();

              await templateService.apiHandler({
                methodName: 'getWeekPlanning',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLieuController_getLieu: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/lieux/:id',
            ...(fetchMiddlewares<RequestHandler>(LieuController)),
            ...(fetchMiddlewares<RequestHandler>(LieuController.prototype.getLieu)),

            async function LieuController_getLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_getLieu, request, response });

                const controller = new LieuController();

              await templateService.apiHandler({
                methodName: 'getLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLieuController_createLieu: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LieuCreationParams"},
        };
        app.post('/lieux',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(LieuController)),
            ...(fetchMiddlewares<RequestHandler>(LieuController.prototype.createLieu)),

            async function LieuController_createLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_createLieu, request, response });

                const controller = new LieuController();

              await templateService.apiHandler({
                methodName: 'createLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLieuController_getAllLieux: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/lieux',
            ...(fetchMiddlewares<RequestHandler>(LieuController)),
            ...(fetchMiddlewares<RequestHandler>(LieuController.prototype.getAllLieux)),

            async function LieuController_getAllLieux(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_getAllLieux, request, response });

                const controller = new LieuController();

              await templateService.apiHandler({
                methodName: 'getAllLieux',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLieuController_updateLieu: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"LieuUpdateParams"},
        };
        app.put('/lieux/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(LieuController)),
            ...(fetchMiddlewares<RequestHandler>(LieuController.prototype.updateLieu)),

            async function LieuController_updateLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_updateLieu, request, response });

                const controller = new LieuController();

              await templateService.apiHandler({
                methodName: 'updateLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLieuController_deleteLieu: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/lieux/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(LieuController)),
            ...(fetchMiddlewares<RequestHandler>(LieuController.prototype.deleteLieu)),

            async function LieuController_deleteLieu(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_deleteLieu, request, response });

                const controller = new LieuController();

              await templateService.apiHandler({
                methodName: 'deleteLieu',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_getJourFerie: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/jours-feries/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.getJourFerie)),

            async function JourFerieController_getJourFerie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getJourFerie, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'getJourFerie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_createJourFerie: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"JourFerieCreateParams"},
        };
        app.post('/jours-feries',
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.createJourFerie)),

            async function JourFerieController_createJourFerie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_createJourFerie, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'createJourFerie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_getAllJoursFeries: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/jours-feries',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.getAllJoursFeries)),

            async function JourFerieController_getAllJoursFeries(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getAllJoursFeries, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'getAllJoursFeries',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_updateJourFerie: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"JourFerieUpdateParams"},
        };
        app.put('/jours-feries/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.updateJourFerie)),

            async function JourFerieController_updateJourFerie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_updateJourFerie, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'updateJourFerie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_deleteJourFerie: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/jours-feries/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.deleteJourFerie)),

            async function JourFerieController_deleteJourFerie(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_deleteJourFerie, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'deleteJourFerie',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsJourFerieController_getJoursFeriesByPeriode: Record<string, TsoaRoute.ParameterSchema> = {
                dateDebut: {"in":"query","name":"dateDebut","required":true,"dataType":"string"},
                dateFin: {"in":"query","name":"dateFin","required":true,"dataType":"string"},
        };
        app.get('/jours-feries/periode',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController)),
            ...(fetchMiddlewares<RequestHandler>(JourFerieController.prototype.getJoursFeriesByPeriode)),

            async function JourFerieController_getJoursFeriesByPeriode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getJoursFeriesByPeriode, request, response });

                const controller = new JourFerieController();

              await templateService.apiHandler({
                methodName: 'getJoursFeriesByPeriode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipeController_getEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/equipes/:id',
            ...(fetchMiddlewares<RequestHandler>(EquipeController)),
            ...(fetchMiddlewares<RequestHandler>(EquipeController.prototype.getEquipe)),

            async function EquipeController_getEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_getEquipe, request, response });

                const controller = new EquipeController();

              await templateService.apiHandler({
                methodName: 'getEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipeController_createEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"EquipeCreationParams"},
        };
        app.post('/equipes',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(EquipeController)),
            ...(fetchMiddlewares<RequestHandler>(EquipeController.prototype.createEquipe)),

            async function EquipeController_createEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_createEquipe, request, response });

                const controller = new EquipeController();

              await templateService.apiHandler({
                methodName: 'createEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipeController_getAllEquipes: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/equipes',
            ...(fetchMiddlewares<RequestHandler>(EquipeController)),
            ...(fetchMiddlewares<RequestHandler>(EquipeController.prototype.getAllEquipes)),

            async function EquipeController_getAllEquipes(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_getAllEquipes, request, response });

                const controller = new EquipeController();

              await templateService.apiHandler({
                methodName: 'getAllEquipes',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipeController_updateEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"EquipeUpdateParams"},
        };
        app.put('/equipes/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(EquipeController)),
            ...(fetchMiddlewares<RequestHandler>(EquipeController.prototype.updateEquipe)),

            async function EquipeController_updateEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_updateEquipe, request, response });

                const controller = new EquipeController();

              await templateService.apiHandler({
                methodName: 'updateEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipeController_deleteEquipe: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/equipes/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(EquipeController)),
            ...(fetchMiddlewares<RequestHandler>(EquipeController.prototype.deleteEquipe)),

            async function EquipeController_deleteEquipe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_deleteEquipe, request, response });

                const controller = new EquipeController();

              await templateService.apiHandler({
                methodName: 'deleteEquipe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartementController_getDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/departements/:id',
            ...(fetchMiddlewares<RequestHandler>(DepartementController)),
            ...(fetchMiddlewares<RequestHandler>(DepartementController.prototype.getDepartement)),

            async function DepartementController_getDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_getDepartement, request, response });

                const controller = new DepartementController();

              await templateService.apiHandler({
                methodName: 'getDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartementController_createDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"DepartementCreationParams"},
        };
        app.post('/departements',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(DepartementController)),
            ...(fetchMiddlewares<RequestHandler>(DepartementController.prototype.createDepartement)),

            async function DepartementController_createDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_createDepartement, request, response });

                const controller = new DepartementController();

              await templateService.apiHandler({
                methodName: 'createDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartementController_getAllDepartements: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/departements',
            ...(fetchMiddlewares<RequestHandler>(DepartementController)),
            ...(fetchMiddlewares<RequestHandler>(DepartementController.prototype.getAllDepartements)),

            async function DepartementController_getAllDepartements(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_getAllDepartements, request, response });

                const controller = new DepartementController();

              await templateService.apiHandler({
                methodName: 'getAllDepartements',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartementController_updateDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"ref":"DepartementUpdateParams"},
        };
        app.put('/departements/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(DepartementController)),
            ...(fetchMiddlewares<RequestHandler>(DepartementController.prototype.updateDepartement)),

            async function DepartementController_updateDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_updateDepartement, request, response });

                const controller = new DepartementController();

              await templateService.apiHandler({
                methodName: 'updateDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsDepartementController_deleteDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/departements/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(DepartementController)),
            ...(fetchMiddlewares<RequestHandler>(DepartementController.prototype.deleteDepartement)),

            async function DepartementController_deleteDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_deleteDepartement, request, response });

                const controller = new DepartementController();

              await templateService.apiHandler({
                methodName: 'deleteDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getConge: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/conges/:id',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getConge)),

            async function CongeController_getConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_createConge: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CongeCreateParams"},
        };
        app.post('/conges',
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.createConge)),

            async function CongeController_createConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_createConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'createConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getAllConges: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/conges',
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getAllConges)),

            async function CongeController_getAllConges(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getAllConges, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getAllConges',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_updateConge: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CongeUpdateParams"},
        };
        app.put('/conges/:id',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.updateConge)),

            async function CongeController_updateConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_updateConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'updateConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_deleteConge: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/conges/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.deleteConge)),

            async function CongeController_deleteConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_deleteConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'deleteConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByMatricule: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
        };
        app.get('/conges/matricule/:matricule',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByMatricule)),

            async function CongeController_getCongesByMatricule(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByMatricule, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByMatricule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByType: Record<string, TsoaRoute.ParameterSchema> = {
                type: {"in":"path","name":"type","required":true,"ref":"TypeConge"},
        };
        app.get('/conges/type/:type',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByType)),

            async function CongeController_getCongesByType(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByType, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByType',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByMotif: Record<string, TsoaRoute.ParameterSchema> = {
                motif: {"in":"path","name":"motif","required":true,"dataType":"string"},
        };
        app.get('/conges/motif/:motif',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByMotif)),

            async function CongeController_getCongesByMotif(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByMotif, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByMotif',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                departementId: {"in":"path","name":"departementId","required":true,"dataType":"double"},
        };
        app.get('/conges/departement/:departementId',
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByDepartement)),

            async function CongeController_getCongesByDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByDepartement, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByDepartementFiltres: Record<string, TsoaRoute.ParameterSchema> = {
                departementId: {"in":"query","name":"departementId","required":true,"dataType":"double"},
                statut: {"in":"query","name":"statut","dataType":"string"},
                type: {"in":"query","name":"type","ref":"TypeConge"},
                dateDebut: {"in":"query","name":"dateDebut","dataType":"string"},
                dateFin: {"in":"query","name":"dateFin","dataType":"string"},
        };
        app.get('/conges/departement-filtres',
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByDepartementFiltres)),

            async function CongeController_getCongesByDepartementFiltres(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByDepartementFiltres, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByDepartementFiltres',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesStatsByDepartement: Record<string, TsoaRoute.ParameterSchema> = {
                departementId: {"in":"path","name":"departementId","required":true,"dataType":"double"},
                annee: {"in":"query","name":"annee","dataType":"double"},
        };
        app.get('/conges/departement-stats/:departementId',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesStatsByDepartement)),

            async function CongeController_getCongesStatsByDepartement(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesStatsByDepartement, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesStatsByDepartement',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesEnCours: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/conges/en-cours',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesEnCours)),

            async function CongeController_getCongesEnCours(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesEnCours, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesEnCours',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesAVenir: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/conges/a-venir',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesAVenir)),

            async function CongeController_getCongesAVenir(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesAVenir, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesAVenir',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getCongesByPeriode: Record<string, TsoaRoute.ParameterSchema> = {
                dateDebut: {"in":"query","name":"dateDebut","required":true,"dataType":"string"},
                dateFin: {"in":"query","name":"dateFin","required":true,"dataType":"string"},
        };
        app.get('/conges/periode',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getCongesByPeriode)),

            async function CongeController_getCongesByPeriode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByPeriode, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getCongesByPeriode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getSoldeConge: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
        };
        app.get('/conges/solde/:matricule',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getSoldeConge)),

            async function CongeController_getSoldeConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getSoldeConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getSoldeConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_validerSoldeConge: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"joursDemanDes":{"dataType":"double","required":true},"matricule":{"dataType":"string","required":true}}},
        };
        app.post('/conges/valider-solde',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.validerSoldeConge)),

            async function CongeController_validerSoldeConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_validerSoldeConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'validerSoldeConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCongeController_getStatistiquesConge: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
                annee: {"in":"query","name":"annee","dataType":"double"},
        };
        app.get('/conges/statistiques/:matricule',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(CongeController)),
            ...(fetchMiddlewares<RequestHandler>(CongeController.prototype.getStatistiquesConge)),

            async function CongeController_getStatistiquesConge(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getStatistiquesConge, request, response });

                const controller = new CongeController();

              await templateService.apiHandler({
                methodName: 'getStatistiquesConge',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLoginController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/login',
            ...(fetchMiddlewares<RequestHandler>(LoginController)),
            ...(fetchMiddlewares<RequestHandler>(LoginController.prototype.login)),

            async function LoginController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLoginController_login, request, response });

                const controller = new LoginController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRefreshtokenController_refreshToken: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/refreshToken',
            ...(fetchMiddlewares<RequestHandler>(RefreshtokenController)),
            ...(fetchMiddlewares<RequestHandler>(RefreshtokenController.prototype.refreshToken)),

            async function RefreshtokenController_refreshToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRefreshtokenController_refreshToken, request, response });

                const controller = new RefreshtokenController();

              await templateService.apiHandler({
                methodName: 'refreshToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogoutController_logout: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/logout',
            ...(fetchMiddlewares<RequestHandler>(LogoutController)),
            ...(fetchMiddlewares<RequestHandler>(LogoutController.prototype.logout)),

            async function LogoutController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogoutController_logout, request, response });

                const controller = new LogoutController();

              await templateService.apiHandler({
                methodName: 'logout',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_createAnalyse: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AnalyseCreationParams"},
        };
        app.post('/analyses',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.createAnalyse)),

            async function AnalyseController_createAnalyse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_createAnalyse, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'createAnalyse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAllAnalyses: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/analyses',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAllAnalyses)),

            async function AnalyseController_getAllAnalyses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAllAnalyses, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAllAnalyses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_updateAnalyse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"AnalyseUpdateParams"},
        };
        app.put('/analyses/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.updateAnalyse)),

            async function AnalyseController_updateAnalyse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_updateAnalyse, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'updateAnalyse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_deleteAnalyse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.delete('/analyses/:id',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.deleteAnalyse)),

            async function AnalyseController_deleteAnalyse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_deleteAnalyse, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'deleteAnalyse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalysesByDate: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/date/:date',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalysesByDate)),

            async function AnalyseController_getAnalysesByDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByDate, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalysesByDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalysesByMatricule: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
        };
        app.get('/analyses/matricule/:matricule',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalysesByMatricule)),

            async function AnalyseController_getAnalysesByMatricule(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByMatricule, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalysesByMatricule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalysesByLieuTravail: Record<string, TsoaRoute.ParameterSchema> = {
                lieuTravail: {"in":"path","name":"lieuTravail","required":true,"dataType":"string"},
                date: {"in":"query","name":"date","dataType":"string"},
        };
        app.get('/analyses/lieu-travail/:lieuTravail',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalysesByLieuTravail)),

            async function AnalyseController_getAnalysesByLieuTravail(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByLieuTravail, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalysesByLieuTravail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_analyserJournee: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"string","required":true}}},
        };
        app.post('/analyses/analyser-journee',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.analyserJournee)),

            async function AnalyseController_analyserJournee(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_analyserJournee, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'analyserJournee',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_analyserAujourdhui: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.post('/analyses/analyser-aujourdhui',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.analyserAujourdhui)),

            async function AnalyseController_analyserAujourdhui(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_analyserAujourdhui, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'analyserAujourdhui',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getRetardsDuJour: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/retards/:date',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getRetardsDuJour)),

            async function AnalyseController_getRetardsDuJour(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getRetardsDuJour, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getRetardsDuJour',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getSortiesAnticipeesDuJour: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/sorties-anticipees/:date',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getSortiesAnticipeesDuJour)),

            async function AnalyseController_getSortiesAnticipeesDuJour(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getSortiesAnticipeesDuJour, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getSortiesAnticipeesDuJour',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getStatistiquesJour: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/statistiques/:date',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getStatistiquesJour)),

            async function AnalyseController_getStatistiquesJour(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getStatistiquesJour, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getStatistiquesJour',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalysesPeriode: Record<string, TsoaRoute.ParameterSchema> = {
                dateDebut: {"in":"path","name":"dateDebut","required":true,"dataType":"string"},
                dateFin: {"in":"path","name":"dateFin","required":true,"dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                includeRelations: {"in":"query","name":"includeRelations","dataType":"boolean"},
        };
        app.get('/analyses/analyse-periode/:dateDebut/:dateFin',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalysesPeriode)),

            async function AnalyseController_getAnalysesPeriode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesPeriode, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalysesPeriode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalyseEmployePeriode: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
                dateDebut: {"in":"query","name":"dateDebut","required":true,"dataType":"string"},
                dateFin: {"in":"query","name":"dateFin","required":true,"dataType":"string"},
        };
        app.get('/analyses/employe/:matricule/periode',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalyseEmployePeriode)),

            async function AnalyseController_getAnalyseEmployePeriode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalyseEmployePeriode, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalyseEmployePeriode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_justifierAnalyse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"commentaire":{"dataType":"string"},"justifie":{"dataType":"boolean","required":true}}},
        };
        app.put('/analyses/justifier/:id',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.justifierAnalyse)),

            async function AnalyseController_justifierAnalyse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_justifierAnalyse, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'justifierAnalyse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_justifierParMatriculeDate: Record<string, TsoaRoute.ParameterSchema> = {
                matricule: {"in":"path","name":"matricule","required":true,"dataType":"string"},
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"commentaire":{"dataType":"string"},"justifie":{"dataType":"boolean","required":true}}},
        };
        app.put('/analyses/justifier-matricule/:matricule/:date',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.justifierParMatriculeDate)),

            async function AnalyseController_justifierParMatriculeDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_justifierParMatriculeDate, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'justifierParMatriculeDate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_recalculerPeriode: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"dateFin":{"dataType":"string","required":true},"dateDebut":{"dataType":"string","required":true}}},
        };
        app.post('/analyses/recalculer-periode',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.recalculerPeriode)),

            async function AnalyseController_recalculerPeriode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_recalculerPeriode, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'recalculerPeriode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_nettoyerAnciennesAnalyses: Record<string, TsoaRoute.ParameterSchema> = {
                nbJours: {"in":"path","name":"nbJours","required":true,"dataType":"double"},
        };
        app.delete('/analyses/nettoyer-anciennes/:nbJours',
            authenticateMiddleware([{"jwt":["admin"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.nettoyerAnciennesAnalyses)),

            async function AnalyseController_nettoyerAnciennesAnalyses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_nettoyerAnciennesAnalyses, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'nettoyerAnciennesAnalyses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getEmployesEnRepos: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/en-repos/:date',
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getEmployesEnRepos)),

            async function AnalyseController_getEmployesEnRepos(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getEmployesEnRepos, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getEmployesEnRepos',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_exportCsv: Record<string, TsoaRoute.ParameterSchema> = {
                date: {"in":"path","name":"date","required":true,"dataType":"string"},
        };
        app.get('/analyses/export-csv/:date',
            authenticateMiddleware([{"jwt":["admin","RH"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.exportCsv)),

            async function AnalyseController_exportCsv(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_exportCsv, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'exportCsv',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAnalyseController_getAnalyse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"double"},
        };
        app.get('/analyses/:id',
            authenticateMiddleware([{"jwt":["admin","RH","superviseur"]}]),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController)),
            ...(fetchMiddlewares<RequestHandler>(AnalyseController.prototype.getAnalyse)),

            async function AnalyseController_getAnalyse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalyse, request, response });

                const controller = new AnalyseController();

              await templateService.apiHandler({
                methodName: 'getAnalyse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
