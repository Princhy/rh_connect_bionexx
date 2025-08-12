import * as express from "express";
import * as jwt from "jsonwebtoken";
import { AuthService } from "./authentification.service";

interface RequestWithUser extends express.Request {
    user: any
}

export function expressAuthentication(
    req: RequestWithUser,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    return new Promise((resolve, reject) => {
        if (securityName === "jwt") {
            const authHeader = req.headers['authorization'];
            let token;

            if (authHeader) {
                token = authHeader.split(' ')[1];
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
                    //console.log("Access token decoded:", decoded);
                    // Si l'access_token n'est pas valide ou vide, vérifiez le refresh_token
                    if (err || !token) {
                        handleRefreshToken(req, reject, resolve, scopes);
                    } else {
                        // Si l'access_token est valide
                        if (validateScopes(decoded, scopes)) {
                            req.user = decoded;
                            resolve(decoded);
                        } else {
                            reject(new Error("JWT does not contain required scope."));
                        }
                    }
                })
            } else {
                handleRefreshToken(req, reject, resolve, scopes);
            }
        } else {
            reject(new Error('Invalid security name'));
        }
    });
}

function handleRefreshToken(
    req: RequestWithUser, 
    reject: (reason?: any) => void, 
    resolve: (value: any) => void, 
    scopes?: string[]
) {
    const token = req.signedCookies['refresh_token'];
    if (!token) {
        reject(new Error('No token, authorization denied'));
    } else {
        // Si le refresh_token est valide, créez un nouveau access_token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded: any) => {
            
            if (err) {
                reject(new Error('Token is not valid'));
            } else {
                if (validateScopes(decoded, scopes)) {
                    // Création d'un nouveau access_token
                    const access_token = AuthService.createAccessToken(decoded);
                    req.res.setHeader(`authorization`, `Bearer ` + access_token);
                    req.user = decoded;
                    resolve(decoded);
                } else {
                    reject(new Error("JWT does not contain required scope."));
                }
            }
        });
    }
}

function validateScopes(decoded: any, requiredScopes?: string[]): boolean {
    // Si aucun scope n'est requis, l'accès est autorisé
    if (!requiredScopes || requiredScopes.length === 0) {
        return true;
    }

    // Vérifier que le token contient des scopes
    if (!decoded || !decoded.scopes || !Array.isArray(decoded.scopes)) {
        console.log("Token does not contain scopes array");
        return false;
    }

    // Vérifier si au moins un des scopes requis est présent
    const hasRequiredScope = requiredScopes.some(scope => 
        decoded.scopes.includes(scope)
    );

    if (!hasRequiredScope) {
        console.log("Required scopes:", requiredScopes);
        console.log("Token scopes:", decoded.scopes);
    }

    return hasRequiredScope;
}