// src/users/usersController.ts
import * as express from "express";
import {
    Body,
    Controller,
    Post,
    Request,
    Route,
    Res
} from "tsoa";
import { UserService} from "../user/user.service";
import { AuthService } from "./authentification.service";
import { IUser, OUser } from "../user/user.interface";

interface ValidationResult {
    success: boolean;
    message?: string;
    token?:string,
    user?:OUser;
  }


@Route("login")

export class LoginController extends Controller {

    @Post()
    public async login(
        @Body() requestBody: {email: string, password: string},
        @Request() req: express.Request
    ): Promise<ValidationResult> {

       
        // Récupérer l'utilisateur par email
        const user = await new UserService().findByEmail(requestBody.email);
        if (!user) {
            this.setStatus(400)
            return {
                success:false,
                message:'Utilisateur non trouvé'
            }
        }

        //filtrer la response 
        const userResponse: OUser = {
            id_user: user.id_user,
            nom: user.nom,
            prenom: user.prenom,
            matricule: user.matricule,
            email: user.email,
            role: user.role,
            id_departement: user.id_departement,
        };

        // Vérifier le mot de passe
        const validPassword = AuthService.verifyPassword(requestBody.password, user.password);
        if (!validPassword) {
            this.setStatus(401)
            return {
                success:false,
                message:'mot de passe incorrect'
            }
        }
        // Créer les tokens d'accès et de rafraîchissement
        const accessToken = AuthService.createAccessToken(userResponse);
        const refreshToken = AuthService.createRefreshToken(userResponse);
        
        req.res.cookie("refresh_token",refreshToken,{
            secure: true,
            signed: true,
            domain:"localhost",
            httpOnly:true,
            path: '/',
        });

        req.res.header("Authorization",`Bearer ${accessToken}`);
        
       
        
        // Retourner les tokens
        return {
            success:true,
            token:accessToken,
            user:userResponse
        };
    }
}

//Refreshtoken

@Route("refreshToken")
export class RefreshtokenController extends Controller{

    @Post()
    public async refreshToken (
        @Request() req: express.Request
    ):Promise<any>{
        try{
            const refresh_token = req.signedCookies['refresh_token'];

            if (!refresh_token) {
                return req.res.status(401).json({ msg: 'No token, authorization denied' });
            }

            const user_data = AuthService.verifyToken(refresh_token, process.env.JWT_SECRET);
            const access_token = AuthService.createAccessToken(user_data);

            req.res.setHeader('Authorization', 'Bearer ' + access_token);

            return user_data;
        }
        catch(error) {
            req.res.status(401).json({ msg: 'Token is not valid' });
        }
    
    }
}

@Route("logout")
export class LogoutController extends Controller {

    @Post()
    public async logout(
        @Request() req: express.Request
    ): Promise<{ success: boolean; message: string }> {
        try {
            // Supprimer le cookie de rafraîchissement
            req.res.clearCookie("refresh_token", {
                secure: true,
                signed: true,
                domain: "localhost",
                httpOnly: true, 

            });
            return {
                success: true,
                message: "Logout successful"
            };
        } catch (error) {
            return {
                success: false,
                message: "Logout failed"
            };
        }
    }
}

