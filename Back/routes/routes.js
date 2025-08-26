"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const user_controller_1 = require("./../src/user/user.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const pointeuse_controller_1 = require("./../src/pointeuse/pointeuse.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const pointage_controller_1 = require("./../src/pointage/pointage.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const planning_controller_1 = require("./../src/planningEquipe/planning.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const lieu_controller_1 = require("./../src/lieu/lieu.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const jourferie_controller_1 = require("./../src/jourFerie/jourferie.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const equipe_controller_1 = require("./../src/equipe/equipe.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const departement_controller_1 = require("./../src/departement/departement.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const conge_controller_1 = require("./../src/conge/conge.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const authentification_controller_1 = require("./../src/Authentification/authentification.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const authentification_controller_2 = require("./../src/Authentification/authentification.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const authentification_controller_3 = require("./../src/Authentification/authentification.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const analyse_controller_1 = require("./../src/analysePointage/analyse.controller");
const authentification_middleware_1 = require("./../src/Authentification/authentification.middleware");
const expressAuthenticationRecasted = authentification_middleware_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "TypeContrat": {
        "dataType": "refEnum",
        "enums": ["CDI", "CDD", "stage"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Role": {
        "dataType": "refEnum",
        "enums": ["Admin", "RH", "Superviseur", "Employe"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserOutput": {
        "dataType": "refObject",
        "properties": {
            "id_user": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "nom": { "dataType": "string", "required": true },
            "prenom": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "phone": { "dataType": "string", "required": true },
            "badge": { "dataType": "string", "required": true },
            "empreinte": { "dataType": "string" },
            "poste": { "dataType": "string", "required": true },
            "type_contrat": { "ref": "TypeContrat", "required": true },
            "date_embauche": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "date_fin_contrat": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] },
            "id_lieu": { "dataType": "double", "required": true },
            "id_equipe": { "dataType": "double", "required": true },
            "id_departement": { "dataType": "double", "required": true },
            "role": { "ref": "Role", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IUser.matricule-or-nom-or-prenom-or-email-or-phone-or-badge-or-empreinte-or-poste-or-type_contrat-or-date_embauche-or-date_fin_contrat-or-id_lieu-or-id_equipe-or-id_departement-or-role-or-password_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string", "required": true }, "nom": { "dataType": "string", "required": true }, "prenom": { "dataType": "string" }, "email": { "dataType": "string", "required": true }, "phone": { "dataType": "string", "required": true }, "badge": { "dataType": "string", "required": true }, "empreinte": { "dataType": "string" }, "poste": { "dataType": "string", "required": true }, "type_contrat": { "ref": "TypeContrat", "required": true }, "date_embauche": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }], "required": true }, "date_fin_contrat": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] }, "id_lieu": { "dataType": "double", "required": true }, "id_equipe": { "dataType": "double", "required": true }, "id_departement": { "dataType": "double", "required": true }, "role": { "ref": "Role", "required": true }, "password": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IUser.matricule-or-nom-or-prenom-or-email-or-phone-or-badge-or-empreinte-or-poste-or-type_contrat-or-date_embauche-or-date_fin_contrat-or-id_lieu-or-id_equipe-or-id_departement-or-role-or-password_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_UserCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string" }, "nom": { "dataType": "string" }, "prenom": { "dataType": "string" }, "email": { "dataType": "string" }, "phone": { "dataType": "string" }, "badge": { "dataType": "string" }, "empreinte": { "dataType": "string" }, "poste": { "dataType": "string" }, "type_contrat": { "ref": "TypeContrat" }, "date_embauche": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] }, "date_fin_contrat": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] }, "id_lieu": { "dataType": "double" }, "id_equipe": { "dataType": "double" }, "id_departement": { "dataType": "double" }, "role": { "ref": "Role" }, "password": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_UserCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "id_user": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "nom": { "dataType": "string", "required": true },
            "prenom": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "phone": { "dataType": "string", "required": true },
            "badge": { "dataType": "string", "required": true },
            "empreinte": { "dataType": "string" },
            "poste": { "dataType": "string", "required": true },
            "type_contrat": { "ref": "TypeContrat", "required": true },
            "date_embauche": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "date_fin_contrat": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] },
            "id_lieu": { "dataType": "double", "required": true },
            "id_equipe": { "dataType": "double", "required": true },
            "id_departement": { "dataType": "double", "required": true },
            "role": { "ref": "Role", "required": true },
            "password": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPointeuse": {
        "dataType": "refObject",
        "properties": {
            "id_pointeuse": { "dataType": "double", "required": true },
            "adresse_ip": { "dataType": "string", "required": true },
            "pointeuse": { "dataType": "string", "required": true },
            "id_lieu": { "dataType": "double", "required": true },
            "lieu": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPointeuse.adresse_ip-or-id_lieu-or-pointeuse_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id_lieu": { "dataType": "double", "required": true }, "adresse_ip": { "dataType": "string", "required": true }, "pointeuse": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IPointeuse.adresse_ip-or-id_lieu-or-pointeuse_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PointeuseCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id_lieu": { "dataType": "double" }, "adresse_ip": { "dataType": "string" }, "pointeuse": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointeuseUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_PointeuseCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypePointage": {
        "dataType": "refEnum",
        "enums": ["entree", "sortie"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ModePointage": {
        "dataType": "refEnum",
        "enums": ["bio", "badge", "manuel"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutPointage": {
        "dataType": "refEnum",
        "enums": ["normal", "retard", "avance"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageOutput": {
        "dataType": "refObject",
        "properties": {
            "id_pointage": { "dataType": "double", "required": true },
            "type": { "ref": "TypePointage", "required": true },
            "date": { "dataType": "datetime", "required": true },
            "mode": { "ref": "ModePointage", "required": true },
            "statut": { "ref": "StatutPointage", "required": true },
            "id_pointeuse": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "serialNo": { "dataType": "double", "required": true },
            "pointeuse": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lieu": { "dataType": "any", "required": true }, "id_lieu": { "dataType": "double", "required": true }, "pointeuse": { "dataType": "string" }, "adresse_ip": { "dataType": "string", "required": true }, "id_pointeuse": { "dataType": "double", "required": true } } },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "departement": { "dataType": "any" }, "equipe": { "dataType": "any" }, "lieu": { "dataType": "any" }, "role": { "dataType": "string", "required": true }, "id_departement": { "dataType": "double", "required": true }, "id_equipe": { "dataType": "double", "required": true }, "id_lieu": { "dataType": "double", "required": true }, "date_fin_contrat": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }] }, "date_embauche": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true }, "type_contrat": { "dataType": "string", "required": true }, "poste": { "dataType": "string", "required": true }, "empreinte": { "dataType": "string" }, "badge": { "dataType": "string", "required": true }, "phone": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true }, "prenom": { "dataType": "string" }, "nom": { "dataType": "string", "required": true }, "matricule": { "dataType": "string", "required": true }, "id_user": { "dataType": "double", "required": true } } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPointage.type-or-date-or-mode-or-statut-or-id_pointeuse-or-matricule-or-serialNo_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string", "required": true }, "type": { "ref": "TypePointage", "required": true }, "date": { "dataType": "datetime", "required": true }, "mode": { "ref": "ModePointage", "required": true }, "statut": { "ref": "StatutPointage", "required": true }, "id_pointeuse": { "dataType": "double", "required": true }, "serialNo": { "dataType": "double", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IPointage.type-or-date-or-mode-or-statut-or-id_pointeuse-or-matricule-or-serialNo_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PointageCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string" }, "type": { "ref": "TypePointage" }, "date": { "dataType": "datetime" }, "mode": { "ref": "ModePointage" }, "statut": { "ref": "StatutPointage" }, "id_pointeuse": { "dataType": "double" }, "serialNo": { "dataType": "double" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PointageUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_PointageCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "horaire": {
        "dataType": "refEnum",
        "enums": ["jour", "nuit", "repos"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CycleDay": {
        "dataType": "refObject",
        "properties": {
            "jour": { "dataType": "double", "required": true },
            "shift": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["jour"] }, { "dataType": "enum", "enums": ["nuit"] }, { "dataType": "enum", "enums": ["repos"] }], "required": true },
            "deb_heure": { "dataType": "string" },
            "fin_heure": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlanningEquipe": {
        "dataType": "refObject",
        "properties": {
            "id_planning": { "dataType": "double", "required": true },
            "debut_semaine": { "dataType": "datetime" },
            "jours_travail": { "dataType": "array", "array": { "dataType": "string" } },
            "horaire": { "ref": "horaire" },
            "deb_heure": { "dataType": "string" },
            "fin_heure": { "dataType": "string" },
            "type_planning": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["fixe"] }, { "dataType": "enum", "enums": ["cyclique"] }], "required": true },
            "date_debut_cycle": { "dataType": "datetime" },
            "cycle_pattern": { "dataType": "array", "array": { "dataType": "refObject", "ref": "CycleDay" } },
            "id_equipe": { "dataType": "double", "required": true },
            "equipe": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IPlanningEquipe.debut_semaine-or-jours_travail-or-horaire-or-deb_heure-or-fin_heure-or-id_equipe-or-type_planning-or-date_debut_cycle-or-cycle_pattern_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id_equipe": { "dataType": "double", "required": true }, "debut_semaine": { "dataType": "datetime" }, "jours_travail": { "dataType": "array", "array": { "dataType": "string" } }, "horaire": { "ref": "horaire" }, "deb_heure": { "dataType": "string" }, "fin_heure": { "dataType": "string" }, "type_planning": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["fixe"] }, { "dataType": "enum", "enums": ["cyclique"] }], "required": true }, "date_debut_cycle": { "dataType": "datetime" }, "cycle_pattern": { "dataType": "array", "array": { "dataType": "refObject", "ref": "CycleDay" } } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlanningCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IPlanningEquipe.debut_semaine-or-jours_travail-or-horaire-or-deb_heure-or-fin_heure-or-id_equipe-or-type_planning-or-date_debut_cycle-or-cycle_pattern_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_PlanningCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "id_equipe": { "dataType": "double" }, "debut_semaine": { "dataType": "datetime" }, "jours_travail": { "dataType": "array", "array": { "dataType": "string" } }, "horaire": { "ref": "horaire" }, "deb_heure": { "dataType": "string" }, "fin_heure": { "dataType": "string" }, "type_planning": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["fixe"] }, { "dataType": "enum", "enums": ["cyclique"] }] }, "date_debut_cycle": { "dataType": "datetime" }, "cycle_pattern": { "dataType": "array", "array": { "dataType": "refObject", "ref": "CycleDay" } } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlanningUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_PlanningCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EmployeePlanningForDate": {
        "dataType": "refObject",
        "properties": {
            "travaille": { "dataType": "boolean", "required": true },
            "shift": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["jour"] }, { "dataType": "enum", "enums": ["nuit"] }] },
            "deb_heure": { "dataType": "string" },
            "fin_heure": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILieu": {
        "dataType": "refObject",
        "properties": {
            "id_lieu": { "dataType": "double", "required": true },
            "lieu": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ILieu.lieu_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lieu": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LieuCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_ILieu.lieu_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_LieuCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lieu": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LieuUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_LieuCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieOutput": {
        "dataType": "refObject",
        "properties": {
            "id_jourferie": { "dataType": "double", "required": true },
            "nom": { "dataType": "string", "required": true },
            "date": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "recurrent": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieCreateParams": {
        "dataType": "refObject",
        "properties": {
            "nom": { "dataType": "string", "required": true },
            "date": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "recurrent": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "JourFerieUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "nom": { "dataType": "string" },
            "date": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] },
            "recurrent": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEquipe": {
        "dataType": "refObject",
        "properties": {
            "id_equipe": { "dataType": "double", "required": true },
            "equipe": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IEquipe.equipe_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "equipe": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipeCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IEquipe.equipe_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_EquipeCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "equipe": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipeUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_EquipeCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDepartement": {
        "dataType": "refObject",
        "properties": {
            "id_departement": { "dataType": "double", "required": true },
            "departement": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IDepartement.departement_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "departement": { "dataType": "string", "required": true } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartementCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IDepartement.departement_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_DepartementCreationParams_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "departement": { "dataType": "string" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DepartementUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_DepartementCreationParams_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TypeConge": {
        "dataType": "refEnum",
        "enums": ["ANNUEL", "MALADIE", "MATERNITE", "PATERNITE", "EXCEPTIONNEL", "AUTRE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutConge": {
        "dataType": "refEnum",
        "enums": ["ATTENTE", "VALIDE", "REFUSE"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeOutput": {
        "dataType": "refObject",
        "properties": {
            "id_conge": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "motif": { "dataType": "string", "required": true },
            "type": { "ref": "TypeConge", "required": true },
            "nbr_jours_permis": { "dataType": "double", "required": true },
            "solde_conge": { "dataType": "double", "required": true },
            "date_depart": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "date_reprise": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "personne_interim": { "dataType": "string" },
            "statut": { "ref": "StatutConge" },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "email": { "dataType": "string", "required": true }, "prenom": { "dataType": "string", "required": true }, "nom": { "dataType": "string", "required": true } } },
            "userInterim": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string", "required": true }, "prenom": { "dataType": "string", "required": true }, "nom": { "dataType": "string", "required": true } } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeCreateParams": {
        "dataType": "refObject",
        "properties": {
            "matricule": { "dataType": "string", "required": true },
            "motif": { "dataType": "string", "required": true },
            "type": { "ref": "TypeConge", "required": true },
            "nbr_jours_permis": { "dataType": "double", "required": true },
            "solde_conge": { "dataType": "double", "required": true },
            "date_depart": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "date_reprise": { "dataType": "union", "subSchemas": [{ "dataType": "datetime" }, { "dataType": "string" }], "required": true },
            "personne_interim": { "dataType": "string" },
            "statut": { "ref": "StatutConge" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CongeUpdateParams": {
        "dataType": "refObject",
        "properties": {
            "matricule": { "dataType": "string" },
            "motif": { "dataType": "string" },
            "type": { "ref": "TypeConge" },
            "nbr_jours_permis": { "dataType": "double" },
            "solde_conge": { "dataType": "double" },
            "date_depart": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] },
            "date_reprise": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "datetime" }] },
            "personne_interim": { "dataType": "string" },
            "statut": { "ref": "StatutConge" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SoldeValidationResult": {
        "dataType": "refObject",
        "properties": {
            "valid": { "dataType": "boolean", "required": true },
            "soldeActuel": { "dataType": "double", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OUser": {
        "dataType": "refObject",
        "properties": {
            "id_user": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "nom": { "dataType": "string", "required": true },
            "prenom": { "dataType": "string" },
            "email": { "dataType": "string", "required": true },
            "role": { "ref": "Role", "required": true },
            "id_departement": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string" },
            "token": { "dataType": "string" },
            "user": { "ref": "OUser" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseValidationResult": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "any" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StatutAnalyse": {
        "dataType": "refEnum",
        "enums": ["present", "retard", "absent", "sortie_anticipee", "present_avec_retard", "en_conge", "EN_REPOS"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IAnalyse.matricule-or-date-or-heure_prevue_arrivee-or-heure_prevue_depart-or-heure_reelle_arrivee-or-heure_reelle_depart-or-retard_minutes-or-sortie_anticipee_minutes-or-statut_final-or-travaille_aujourd_hui-or-commentaire-or-mode_pointage-or-lieu_pointage-or-cycle_travail_debut-or-cycle_travail_fin-or-est_equipe_nuit_": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "matricule": { "dataType": "string", "required": true }, "date": { "dataType": "datetime", "required": true }, "heure_prevue_arrivee": { "dataType": "string" }, "heure_prevue_depart": { "dataType": "string" }, "heure_reelle_arrivee": { "dataType": "string" }, "heure_reelle_depart": { "dataType": "string" }, "retard_minutes": { "dataType": "double", "required": true }, "sortie_anticipee_minutes": { "dataType": "double", "required": true }, "statut_final": { "ref": "StatutAnalyse", "required": true }, "travaille_aujourd_hui": { "dataType": "boolean", "required": true }, "commentaire": { "dataType": "string" }, "mode_pointage": { "ref": "ModePointage" }, "lieu_pointage": { "dataType": "string" }, "cycle_travail_debut": { "dataType": "datetime" }, "cycle_travail_fin": { "dataType": "datetime" }, "est_equipe_nuit": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseCreationParams": {
        "dataType": "refAlias",
        "type": { "ref": "Pick_IAnalyse.matricule-or-date-or-heure_prevue_arrivee-or-heure_prevue_depart-or-heure_reelle_arrivee-or-heure_reelle_depart-or-retard_minutes-or-sortie_anticipee_minutes-or-statut_final-or-travaille_aujourd_hui-or-commentaire-or-mode_pointage-or-lieu_pointage-or-cycle_travail_debut-or-cycle_travail_fin-or-est_equipe_nuit_", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseOutput": {
        "dataType": "refObject",
        "properties": {
            "id_analyse": { "dataType": "double", "required": true },
            "matricule": { "dataType": "string", "required": true },
            "date": { "dataType": "datetime", "required": true },
            "heure_prevue_arrivee": { "dataType": "string" },
            "heure_prevue_depart": { "dataType": "string" },
            "heure_reelle_arrivee": { "dataType": "string" },
            "heure_reelle_depart": { "dataType": "string" },
            "retard_minutes": { "dataType": "double", "required": true },
            "sortie_anticipee_minutes": { "dataType": "double", "required": true },
            "statut_final": { "ref": "StatutAnalyse", "required": true },
            "travaille_aujourd_hui": { "dataType": "boolean", "required": true },
            "justifie": { "dataType": "boolean", "required": true },
            "commentaire": { "dataType": "string" },
            "mode_pointage": { "ref": "ModePointage" },
            "lieu_pointage": { "dataType": "string" },
            "date_analyse": { "dataType": "datetime", "required": true },
            "cycle_travail_debut": { "dataType": "datetime" },
            "cycle_travail_fin": { "dataType": "datetime" },
            "est_equipe_nuit": { "dataType": "boolean" },
            "user": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lieu": { "dataType": "nestedObjectLiteral", "nestedProperties": { "lieu": { "dataType": "string", "required": true }, "id_lieu": { "dataType": "double", "required": true } } }, "departement": { "dataType": "nestedObjectLiteral", "nestedProperties": { "departement": { "dataType": "string", "required": true }, "id_departement": { "dataType": "double", "required": true } } }, "equipe": { "dataType": "nestedObjectLiteral", "nestedProperties": { "equipe": { "dataType": "string", "required": true }, "id_equipe": { "dataType": "double", "required": true } } }, "poste": { "dataType": "string", "required": true }, "prenom": { "dataType": "string", "required": true }, "nom": { "dataType": "string", "required": true }, "matricule": { "dataType": "string", "required": true }, "id_user": { "dataType": "double", "required": true } } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_IAnalyse.justifie-or-commentaire-or-statut_final-or-mode_pointage__": {
        "dataType": "refAlias",
        "type": { "dataType": "nestedObjectLiteral", "nestedProperties": { "statut_final": { "ref": "StatutAnalyse" }, "commentaire": { "dataType": "string" }, "mode_pointage": { "ref": "ModePointage" }, "justifie": { "dataType": "boolean" } }, "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyseUpdateParams": {
        "dataType": "refAlias",
        "type": { "ref": "Partial_Pick_IAnalyse.justifie-or-commentaire-or-statut_final-or-mode_pointage__", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const argsUserController_getUser = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/users/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUser)), function UserController_getUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUser, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_createUser = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserCreationParams" },
    };
    app.post('/users', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.createUser)), function UserController_createUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_createUser, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'createUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getAllUsers = {};
    app.get('/users', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getAllUsers)), function UserController_getAllUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getAllUsers',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_updateUser = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserUpdateParams" },
    };
    app.put('/users/:id', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.updateUser)), function UserController_updateUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUser, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'updateUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_updateUserBase = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "UserUpdateParams" },
    };
    app.patch('/users/:id', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.updateUserBase)), function UserController_updateUserBase(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUserBase, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'updateUserBase',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_deleteUser = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/users/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.deleteUser)), function UserController_deleteUser(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUser, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'deleteUser',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUserByMatricule = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
    };
    app.get('/users/matricule/:matricule', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUserByMatricule)), function UserController_getUserByMatricule(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserByMatricule, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUserByMatricule',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUsersByDepartement = {
        departementId: { "in": "path", "name": "departementId", "required": true, "dataType": "double" },
    };
    app.get('/users/departement/:departementId', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUsersByDepartement)), function UserController_getUsersByDepartement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByDepartement, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUsersByDepartement',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUsersByEquipe = {
        equipeId: { "in": "path", "name": "equipeId", "required": true, "dataType": "double" },
    };
    app.get('/users/equipe/:equipeId', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUsersByEquipe)), function UserController_getUsersByEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByEquipe, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUsersByEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUsersByLieu = {
        id_lieu: { "in": "path", "name": "id_lieu", "required": true, "dataType": "double" },
    };
    app.get('/users/lieu/:id_lieu', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUsersByLieu)), function UserController_getUsersByLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByLieu, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUsersByLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_getUsersByRole = {
        role: { "in": "path", "name": "role", "required": true, "ref": "Role" },
    };
    app.get('/users/role/:role', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.getUsersByRole)), function UserController_getUsersByRole(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsersByRole, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'getUsersByRole',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_importFromApi = {};
    app.post('/users/import-api', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(user_controller_1.UserController.prototype.importFromApi)), function UserController_importFromApi(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_importFromApi, request, response });
                const controller = new user_controller_1.UserController();
                yield templateService.apiHandler({
                    methodName: 'importFromApi',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_getPointeuse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/pointeuses/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.getPointeuse)), function PointeuseController_getPointeuse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getPointeuse, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'getPointeuse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_createPointeuse = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PointeuseCreationParams" },
    };
    app.post('/pointeuses', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.createPointeuse)), function PointeuseController_createPointeuse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_createPointeuse, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'createPointeuse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_getAllPointeuses = {};
    app.get('/pointeuses', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.getAllPointeuses)), function PointeuseController_getAllPointeuses(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getAllPointeuses, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'getAllPointeuses',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_updatePointeuse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PointeuseUpdateParams" },
    };
    app.put('/pointeuses/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.updatePointeuse)), function PointeuseController_updatePointeuse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_updatePointeuse, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'updatePointeuse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_deletePointeuse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/pointeuses/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.deletePointeuse)), function PointeuseController_deletePointeuse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_deletePointeuse, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'deletePointeuse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointeuseController_getPointeusesByLieu = {
        id_lieu: { "in": "path", "name": "id_lieu", "required": true, "dataType": "double" },
    };
    app.get('/pointeuses/lieu/:id_lieu', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController)), ...((0, runtime_1.fetchMiddlewares)(pointeuse_controller_1.PointeuseController.prototype.getPointeusesByLieu)), function PointeuseController_getPointeusesByLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointeuseController_getPointeusesByLieu, request, response });
                const controller = new pointeuse_controller_1.PointeuseController();
                yield templateService.apiHandler({
                    methodName: 'getPointeusesByLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getPointage = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/pointages/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getPointage)), function PointageController_getPointage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointage, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getPointage',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_createPointage = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PointageCreationParams" },
    };
    app.post('/pointages', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.createPointage)), function PointageController_createPointage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_createPointage, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'createPointage',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getAllPointages = {};
    app.get('/pointages', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getAllPointages)), function PointageController_getAllPointages(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getAllPointages, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getAllPointages',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_updatePointage = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "PointageUpdateParams" },
    };
    app.put('/pointages/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.updatePointage)), function PointageController_updatePointage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_updatePointage, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'updatePointage',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_deletePointage = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/pointages/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.deletePointage)), function PointageController_deletePointage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_deletePointage, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'deletePointage',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getPointagesByMatricule = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
    };
    app.get('/pointages/matricule/:matricule', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getPointagesByMatricule)), function PointageController_getPointagesByMatricule(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByMatricule, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getPointagesByMatricule',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getPointagesByDate = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/pointages/date/:date', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getPointagesByDate)), function PointageController_getPointagesByDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByDate, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getPointagesByDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getPointagesByMatriculeAndDate = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/pointages/matricule/:matricule/date/:date', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getPointagesByMatriculeAndDate)), function PointageController_getPointagesByMatriculeAndDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByMatriculeAndDate, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getPointagesByMatriculeAndDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_getPointagesByPointeuse = {
        id_pointeuse: { "in": "path", "name": "id_pointeuse", "required": true, "dataType": "double" },
    };
    app.get('/pointages/pointeuse/:id_pointeuse', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.getPointagesByPointeuse)), function PointageController_getPointagesByPointeuse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_getPointagesByPointeuse, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'getPointagesByPointeuse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_importPointagesFromApi = {};
    app.post('/pointages/import-pointages-api', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.importPointagesFromApi)), function PointageController_importPointagesFromApi(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_importPointagesFromApi, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'importPointagesFromApi',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPointageController_importPointagesFromApiByDate = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "date": { "dataType": "string", "required": true } } },
    };
    app.post('/pointages/import-pointages-api-date', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController)), ...((0, runtime_1.fetchMiddlewares)(pointage_controller_1.PointageController.prototype.importPointagesFromApiByDate)), function PointageController_importPointagesFromApiByDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPointageController_importPointagesFromApiByDate, request, response });
                const controller = new pointage_controller_1.PointageController();
                yield templateService.apiHandler({
                    methodName: 'importPointagesFromApiByDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getPlanning = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/plannings/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getPlanning)), function PlanningController_getPlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getPlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_createPlanning = {
        body: { "in": "body", "name": "body", "required": true, "ref": "PlanningCreationParams" },
    };
    app.post('/plannings', ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.createPlanning)), function PlanningController_createPlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createPlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'createPlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getAllPlannings = {};
    app.get('/plannings', ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getAllPlannings)), function PlanningController_getAllPlannings(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getAllPlannings, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getAllPlannings',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_updatePlanning = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "PlanningUpdateParams" },
    };
    app.put('/plannings/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.updatePlanning)), function PlanningController_updatePlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_updatePlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'updatePlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_deletePlanning = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/plannings/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.deletePlanning)), function PlanningController_deletePlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_deletePlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'deletePlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getPlanningsByEquipe = {
        equipeId: { "in": "path", "name": "equipeId", "required": true, "dataType": "double" },
    };
    app.get('/plannings/equipe/:equipeId', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getPlanningsByEquipe)), function PlanningController_getPlanningsByEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByEquipe, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getPlanningsByEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getPlanningsByWeek = {
        debutSemaine: { "in": "path", "name": "debutSemaine", "required": true, "dataType": "string" },
    };
    app.get('/plannings/semaine/:debutSemaine', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getPlanningsByWeek)), function PlanningController_getPlanningsByWeek(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByWeek, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getPlanningsByWeek',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getPlanningByEquipe = {
        equipeId: { "in": "path", "name": "equipeId", "required": true, "dataType": "double" },
    };
    app.get('/plannings/equipe/:equipeId/planning', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getPlanningByEquipe)), function PlanningController_getPlanningByEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningByEquipe, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getPlanningByEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getPlanningsByHoraire = {
        horaire: { "in": "path", "name": "horaire", "required": true, "ref": "horaire" },
    };
    app.get('/plannings/horaire/:horaire', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getPlanningsByHoraire)), function PlanningController_getPlanningsByHoraire(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getPlanningsByHoraire, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getPlanningsByHoraire',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getEmployeePlanningForDate = {
        equipeId: { "in": "path", "name": "equipeId", "required": true, "dataType": "double" },
        targetDate: { "in": "path", "name": "targetDate", "required": true, "dataType": "string" },
    };
    app.get('/plannings/equipe/:equipeId/date/:targetDate', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getEmployeePlanningForDate)), function PlanningController_getEmployeePlanningForDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getEmployeePlanningForDate, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getEmployeePlanningForDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getAllEmployeesPlanningForDate = {
        targetDate: { "in": "path", "name": "targetDate", "required": true, "dataType": "string" },
    };
    app.get('/plannings/date/:targetDate', ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getAllEmployeesPlanningForDate)), function PlanningController_getAllEmployeesPlanningForDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getAllEmployeesPlanningForDate, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getAllEmployeesPlanningForDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_createCyclicPlanning = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "date_debut": { "dataType": "string", "required": true }, "equipe_type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["A"] }, { "dataType": "enum", "enums": ["B"] }, { "dataType": "enum", "enums": ["C"] }], "required": true }, "id_equipe": { "dataType": "double", "required": true } } },
    };
    app.post('/plannings/cyclique', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.createCyclicPlanning)), function PlanningController_createCyclicPlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createCyclicPlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'createCyclicPlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_createFixePlanning = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "debut_semaine": { "dataType": "string", "required": true }, "fin_heure": { "dataType": "string", "required": true }, "deb_heure": { "dataType": "string", "required": true }, "jours_travail": { "dataType": "array", "array": { "dataType": "string" }, "required": true }, "id_equipe": { "dataType": "double", "required": true } } },
    };
    app.post('/plannings/fixe', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.createFixePlanning)), function PlanningController_createFixePlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_createFixePlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'createFixePlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getCurrentWorkingEmployees = {};
    app.get('/plannings/actuel', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getCurrentWorkingEmployees)), function PlanningController_getCurrentWorkingEmployees(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getCurrentWorkingEmployees, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getCurrentWorkingEmployees',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsPlanningController_getWeekPlanning = {
        equipeId: { "in": "path", "name": "equipeId", "required": true, "dataType": "double" },
    };
    app.get('/plannings/equipe/:equipeId/semaine-suivante', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController)), ...((0, runtime_1.fetchMiddlewares)(planning_controller_1.PlanningController.prototype.getWeekPlanning)), function PlanningController_getWeekPlanning(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlanningController_getWeekPlanning, request, response });
                const controller = new planning_controller_1.PlanningController();
                yield templateService.apiHandler({
                    methodName: 'getWeekPlanning',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLieuController_getLieu = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/lieux/:id', ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController)), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController.prototype.getLieu)), function LieuController_getLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_getLieu, request, response });
                const controller = new lieu_controller_1.LieuController();
                yield templateService.apiHandler({
                    methodName: 'getLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLieuController_createLieu = {
        body: { "in": "body", "name": "body", "required": true, "ref": "LieuCreationParams" },
    };
    app.post('/lieux', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController)), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController.prototype.createLieu)), function LieuController_createLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_createLieu, request, response });
                const controller = new lieu_controller_1.LieuController();
                yield templateService.apiHandler({
                    methodName: 'createLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLieuController_getAllLieux = {};
    app.get('/lieux', ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController)), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController.prototype.getAllLieux)), function LieuController_getAllLieux(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_getAllLieux, request, response });
                const controller = new lieu_controller_1.LieuController();
                yield templateService.apiHandler({
                    methodName: 'getAllLieux',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLieuController_updateLieu = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "LieuUpdateParams" },
    };
    app.put('/lieux/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController)), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController.prototype.updateLieu)), function LieuController_updateLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_updateLieu, request, response });
                const controller = new lieu_controller_1.LieuController();
                yield templateService.apiHandler({
                    methodName: 'updateLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLieuController_deleteLieu = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/lieux/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController)), ...((0, runtime_1.fetchMiddlewares)(lieu_controller_1.LieuController.prototype.deleteLieu)), function LieuController_deleteLieu(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLieuController_deleteLieu, request, response });
                const controller = new lieu_controller_1.LieuController();
                yield templateService.apiHandler({
                    methodName: 'deleteLieu',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_getJourFerie = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/jours-feries/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.getJourFerie)), function JourFerieController_getJourFerie(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getJourFerie, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'getJourFerie',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_createJourFerie = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "JourFerieCreateParams" },
    };
    app.post('/jours-feries', ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.createJourFerie)), function JourFerieController_createJourFerie(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_createJourFerie, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'createJourFerie',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_getAllJoursFeries = {};
    app.get('/jours-feries', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.getAllJoursFeries)), function JourFerieController_getAllJoursFeries(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getAllJoursFeries, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'getAllJoursFeries',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_updateJourFerie = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "JourFerieUpdateParams" },
    };
    app.put('/jours-feries/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.updateJourFerie)), function JourFerieController_updateJourFerie(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_updateJourFerie, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'updateJourFerie',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_deleteJourFerie = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/jours-feries/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.deleteJourFerie)), function JourFerieController_deleteJourFerie(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_deleteJourFerie, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'deleteJourFerie',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsJourFerieController_getJoursFeriesByPeriode = {
        dateDebut: { "in": "query", "name": "dateDebut", "required": true, "dataType": "string" },
        dateFin: { "in": "query", "name": "dateFin", "required": true, "dataType": "string" },
    };
    app.get('/jours-feries/periode', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController)), ...((0, runtime_1.fetchMiddlewares)(jourferie_controller_1.JourFerieController.prototype.getJoursFeriesByPeriode)), function JourFerieController_getJoursFeriesByPeriode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsJourFerieController_getJoursFeriesByPeriode, request, response });
                const controller = new jourferie_controller_1.JourFerieController();
                yield templateService.apiHandler({
                    methodName: 'getJoursFeriesByPeriode',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipeController_getEquipe = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/equipes/:id', ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController)), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController.prototype.getEquipe)), function EquipeController_getEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_getEquipe, request, response });
                const controller = new equipe_controller_1.EquipeController();
                yield templateService.apiHandler({
                    methodName: 'getEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipeController_createEquipe = {
        body: { "in": "body", "name": "body", "required": true, "ref": "EquipeCreationParams" },
    };
    app.post('/equipes', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController)), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController.prototype.createEquipe)), function EquipeController_createEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_createEquipe, request, response });
                const controller = new equipe_controller_1.EquipeController();
                yield templateService.apiHandler({
                    methodName: 'createEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipeController_getAllEquipes = {};
    app.get('/equipes', ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController)), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController.prototype.getAllEquipes)), function EquipeController_getAllEquipes(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_getAllEquipes, request, response });
                const controller = new equipe_controller_1.EquipeController();
                yield templateService.apiHandler({
                    methodName: 'getAllEquipes',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipeController_updateEquipe = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "EquipeUpdateParams" },
    };
    app.put('/equipes/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController)), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController.prototype.updateEquipe)), function EquipeController_updateEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_updateEquipe, request, response });
                const controller = new equipe_controller_1.EquipeController();
                yield templateService.apiHandler({
                    methodName: 'updateEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsEquipeController_deleteEquipe = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/equipes/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController)), ...((0, runtime_1.fetchMiddlewares)(equipe_controller_1.EquipeController.prototype.deleteEquipe)), function EquipeController_deleteEquipe(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipeController_deleteEquipe, request, response });
                const controller = new equipe_controller_1.EquipeController();
                yield templateService.apiHandler({
                    methodName: 'deleteEquipe',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDepartementController_getDepartement = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/departements/:id', ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController)), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController.prototype.getDepartement)), function DepartementController_getDepartement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_getDepartement, request, response });
                const controller = new departement_controller_1.DepartementController();
                yield templateService.apiHandler({
                    methodName: 'getDepartement',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDepartementController_createDepartement = {
        body: { "in": "body", "name": "body", "required": true, "ref": "DepartementCreationParams" },
    };
    app.post('/departements', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController)), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController.prototype.createDepartement)), function DepartementController_createDepartement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_createDepartement, request, response });
                const controller = new departement_controller_1.DepartementController();
                yield templateService.apiHandler({
                    methodName: 'createDepartement',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDepartementController_getAllDepartements = {};
    app.get('/departements', ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController)), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController.prototype.getAllDepartements)), function DepartementController_getAllDepartements(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_getAllDepartements, request, response });
                const controller = new departement_controller_1.DepartementController();
                yield templateService.apiHandler({
                    methodName: 'getAllDepartements',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDepartementController_updateDepartement = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "ref": "DepartementUpdateParams" },
    };
    app.put('/departements/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController)), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController.prototype.updateDepartement)), function DepartementController_updateDepartement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_updateDepartement, request, response });
                const controller = new departement_controller_1.DepartementController();
                yield templateService.apiHandler({
                    methodName: 'updateDepartement',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsDepartementController_deleteDepartement = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/departements/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController)), ...((0, runtime_1.fetchMiddlewares)(departement_controller_1.DepartementController.prototype.deleteDepartement)), function DepartementController_deleteDepartement(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsDepartementController_deleteDepartement, request, response });
                const controller = new departement_controller_1.DepartementController();
                yield templateService.apiHandler({
                    methodName: 'deleteDepartement',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getConge = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/conges/:id', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getConge)), function CongeController_getConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_createConge = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CongeCreateParams" },
    };
    app.post('/conges', ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.createConge)), function CongeController_createConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_createConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'createConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getAllConges = {};
    app.get('/conges', ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getAllConges)), function CongeController_getAllConges(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getAllConges, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getAllConges',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_updateConge = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "CongeUpdateParams" },
    };
    app.put('/conges/:id', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.updateConge)), function CongeController_updateConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_updateConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'updateConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_deleteConge = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/conges/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.deleteConge)), function CongeController_deleteConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_deleteConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'deleteConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesByMatricule = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
    };
    app.get('/conges/matricule/:matricule', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesByMatricule)), function CongeController_getCongesByMatricule(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByMatricule, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesByMatricule',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesByType = {
        type: { "in": "path", "name": "type", "required": true, "ref": "TypeConge" },
    };
    app.get('/conges/type/:type', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesByType)), function CongeController_getCongesByType(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByType, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesByType',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesByMotif = {
        motif: { "in": "path", "name": "motif", "required": true, "dataType": "string" },
    };
    app.get('/conges/motif/:motif', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesByMotif)), function CongeController_getCongesByMotif(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByMotif, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesByMotif',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesEnCours = {};
    app.get('/conges/en-cours', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesEnCours)), function CongeController_getCongesEnCours(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesEnCours, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesEnCours',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesAVenir = {};
    app.get('/conges/a-venir', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesAVenir)), function CongeController_getCongesAVenir(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesAVenir, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesAVenir',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getCongesByPeriode = {
        dateDebut: { "in": "query", "name": "dateDebut", "required": true, "dataType": "string" },
        dateFin: { "in": "query", "name": "dateFin", "required": true, "dataType": "string" },
    };
    app.get('/conges/periode', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getCongesByPeriode)), function CongeController_getCongesByPeriode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getCongesByPeriode, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getCongesByPeriode',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getSoldeConge = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
    };
    app.get('/conges/solde/:matricule', authenticateMiddleware([{ "jwt": [] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getSoldeConge)), function CongeController_getSoldeConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getSoldeConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getSoldeConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_validerSoldeConge = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "joursDemanDes": { "dataType": "double", "required": true }, "matricule": { "dataType": "string", "required": true } } },
    };
    app.post('/conges/valider-solde', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.validerSoldeConge)), function CongeController_validerSoldeConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_validerSoldeConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'validerSoldeConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCongeController_getStatistiquesConge = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
        annee: { "in": "query", "name": "annee", "dataType": "double" },
    };
    app.get('/conges/statistiques/:matricule', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController)), ...((0, runtime_1.fetchMiddlewares)(conge_controller_1.CongeController.prototype.getStatistiquesConge)), function CongeController_getStatistiquesConge(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCongeController_getStatistiquesConge, request, response });
                const controller = new conge_controller_1.CongeController();
                yield templateService.apiHandler({
                    methodName: 'getStatistiquesConge',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLoginController_login = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "password": { "dataType": "string", "required": true }, "email": { "dataType": "string", "required": true } } },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/login', ...((0, runtime_1.fetchMiddlewares)(authentification_controller_1.LoginController)), ...((0, runtime_1.fetchMiddlewares)(authentification_controller_1.LoginController.prototype.login)), function LoginController_login(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLoginController_login, request, response });
                const controller = new authentification_controller_1.LoginController();
                yield templateService.apiHandler({
                    methodName: 'login',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRefreshtokenController_refreshToken = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/refreshToken', ...((0, runtime_1.fetchMiddlewares)(authentification_controller_2.RefreshtokenController)), ...((0, runtime_1.fetchMiddlewares)(authentification_controller_2.RefreshtokenController.prototype.refreshToken)), function RefreshtokenController_refreshToken(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRefreshtokenController_refreshToken, request, response });
                const controller = new authentification_controller_2.RefreshtokenController();
                yield templateService.apiHandler({
                    methodName: 'refreshToken',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogoutController_logout = {
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
    };
    app.post('/logout', ...((0, runtime_1.fetchMiddlewares)(authentification_controller_3.LogoutController)), ...((0, runtime_1.fetchMiddlewares)(authentification_controller_3.LogoutController.prototype.logout)), function LogoutController_logout(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogoutController_logout, request, response });
                const controller = new authentification_controller_3.LogoutController();
                yield templateService.apiHandler({
                    methodName: 'logout',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_createAnalyse = {
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AnalyseCreationParams" },
    };
    app.post('/analyses', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.createAnalyse)), function AnalyseController_createAnalyse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_createAnalyse, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'createAnalyse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAllAnalyses = {};
    app.get('/analyses', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAllAnalyses)), function AnalyseController_getAllAnalyses(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAllAnalyses, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAllAnalyses',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_updateAnalyse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "AnalyseUpdateParams" },
    };
    app.put('/analyses/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.updateAnalyse)), function AnalyseController_updateAnalyse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_updateAnalyse, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'updateAnalyse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_deleteAnalyse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.delete('/analyses/:id', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.deleteAnalyse)), function AnalyseController_deleteAnalyse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_deleteAnalyse, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'deleteAnalyse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAnalysesByDate = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/date/:date', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAnalysesByDate)), function AnalyseController_getAnalysesByDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByDate, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAnalysesByDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAnalysesByMatricule = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
    };
    app.get('/analyses/matricule/:matricule', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAnalysesByMatricule)), function AnalyseController_getAnalysesByMatricule(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByMatricule, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAnalysesByMatricule',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAnalysesByStatut = {
        statut: { "in": "path", "name": "statut", "required": true, "ref": "StatutAnalyse" },
        date: { "in": "query", "name": "date", "dataType": "string" },
    };
    app.get('/analyses/statut/:statut', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAnalysesByStatut)), function AnalyseController_getAnalysesByStatut(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalysesByStatut, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAnalysesByStatut',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_analyserJournee = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "date": { "dataType": "string", "required": true } } },
    };
    app.post('/analyses/analyser-journee', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.analyserJournee)), function AnalyseController_analyserJournee(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_analyserJournee, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'analyserJournee',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_analyserAujourdhui = {};
    app.post('/analyses/analyser-aujourdhui', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.analyserAujourdhui)), function AnalyseController_analyserAujourdhui(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_analyserAujourdhui, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'analyserAujourdhui',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getRetardsDuJour = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/retards/:date', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getRetardsDuJour)), function AnalyseController_getRetardsDuJour(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getRetardsDuJour, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getRetardsDuJour',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAbsentsDuJour = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/absents/:date', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAbsentsDuJour)), function AnalyseController_getAbsentsDuJour(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAbsentsDuJour, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAbsentsDuJour',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getSortiesAnticipeesDuJour = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/sorties-anticipees/:date', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getSortiesAnticipeesDuJour)), function AnalyseController_getSortiesAnticipeesDuJour(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getSortiesAnticipeesDuJour, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getSortiesAnticipeesDuJour',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getStatistiquesJour = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/statistiques/:date', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getStatistiquesJour)), function AnalyseController_getStatistiquesJour(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getStatistiquesJour, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getStatistiquesJour',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_justifierAnalyse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "commentaire": { "dataType": "string" }, "justifie": { "dataType": "boolean", "required": true } } },
    };
    app.put('/analyses/justifier/:id', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.justifierAnalyse)), function AnalyseController_justifierAnalyse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_justifierAnalyse, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'justifierAnalyse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_justifierParMatriculeDate = {
        matricule: { "in": "path", "name": "matricule", "required": true, "dataType": "string" },
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "commentaire": { "dataType": "string" }, "justifie": { "dataType": "boolean", "required": true } } },
    };
    app.put('/analyses/justifier-matricule/:matricule/:date', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.justifierParMatriculeDate)), function AnalyseController_justifierParMatriculeDate(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_justifierParMatriculeDate, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'justifierParMatriculeDate',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getDashboardAujourdhui = {};
    app.get('/analyses/dashboard-aujourdhui', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getDashboardAujourdhui)), function AnalyseController_getDashboardAujourdhui(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getDashboardAujourdhui, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getDashboardAujourdhui',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getDashboardTempsReel = {};
    app.get('/analyses/dashboard-temps-reel', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getDashboardTempsReel)), function AnalyseController_getDashboardTempsReel(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getDashboardTempsReel, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getDashboardTempsReel',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getRapportPeriode = {
        dateDebut: { "in": "query", "name": "dateDebut", "required": true, "dataType": "string" },
        dateFin: { "in": "query", "name": "dateFin", "required": true, "dataType": "string" },
    };
    app.get('/analyses/rapport-periode', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getRapportPeriode)), function AnalyseController_getRapportPeriode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getRapportPeriode, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getRapportPeriode',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getRapportMensuel = {
        annee: { "in": "path", "name": "annee", "required": true, "dataType": "double" },
        mois: { "in": "path", "name": "mois", "required": true, "dataType": "double" },
    };
    app.get('/analyses/rapport-mensuel/:annee/:mois', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getRapportMensuel)), function AnalyseController_getRapportMensuel(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getRapportMensuel, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getRapportMensuel',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_recalculerPeriode = {
        body: { "in": "body", "name": "body", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "dateFin": { "dataType": "string", "required": true }, "dateDebut": { "dataType": "string", "required": true } } },
    };
    app.post('/analyses/recalculer-periode', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.recalculerPeriode)), function AnalyseController_recalculerPeriode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_recalculerPeriode, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'recalculerPeriode',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_nettoyerAnciennesAnalyses = {
        nbJours: { "in": "path", "name": "nbJours", "required": true, "dataType": "double" },
    };
    app.delete('/analyses/nettoyer-anciennes/:nbJours', authenticateMiddleware([{ "jwt": ["admin"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.nettoyerAnciennesAnalyses)), function AnalyseController_nettoyerAnciennesAnalyses(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_nettoyerAnciennesAnalyses, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'nettoyerAnciennesAnalyses',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getEmployesEnRepos = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/en-repos/:date', ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getEmployesEnRepos)), function AnalyseController_getEmployesEnRepos(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getEmployesEnRepos, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getEmployesEnRepos',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_exportCsv = {
        date: { "in": "path", "name": "date", "required": true, "dataType": "string" },
    };
    app.get('/analyses/export-csv/:date', authenticateMiddleware([{ "jwt": ["admin", "RH"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.exportCsv)), function AnalyseController_exportCsv(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_exportCsv, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'exportCsv',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAnalyseController_getAnalyse = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "double" },
    };
    app.get('/analyses/:id', authenticateMiddleware([{ "jwt": ["admin", "RH", "superviseur"] }]), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController)), ...((0, runtime_1.fetchMiddlewares)(analyse_controller_1.AnalyseController.prototype.getAnalyse)), function AnalyseController_getAnalyse(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAnalyseController_getAnalyse, request, response });
                const controller = new analyse_controller_1.AnalyseController();
                yield templateService.apiHandler({
                    methodName: 'getAnalyse',
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            }
            catch (err) {
                return next(err);
            }
        });
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return function runAuthenticationMiddleware(request, response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                // keep track of failed auth attempts so we can hand back the most
                // recent one.  This behavior was previously existing so preserving it
                // here
                const failedAttempts = [];
                const pushAndRethrow = (error) => {
                    failedAttempts.push(error);
                    throw error;
                };
                const secMethodOrPromises = [];
                for (const secMethod of security) {
                    if (Object.keys(secMethod).length > 1) {
                        const secMethodAndPromises = [];
                        for (const name in secMethod) {
                            secMethodAndPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow));
                        }
                        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                            .then(users => { return users[0]; }));
                    }
                    else {
                        for (const name in secMethod) {
                            secMethodOrPromises.push(expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow));
                        }
                    }
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                try {
                    request['user'] = yield Promise.any(secMethodOrPromises);
                    // Response was sent in middleware, abort
                    if (response.writableEnded) {
                        return;
                    }
                    next();
                }
                catch (err) {
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
            });
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
