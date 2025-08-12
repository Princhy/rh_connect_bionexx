import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AuthService = {
    hashPassword: (password) => {
        return bcrypt.hashSync(password, 10);
    },

    verifyPassword: (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword);
    },

    createAccessToken: (user) => {
        let scopes;
        if (user.role === 'Admin') {
            scopes = ['admin', 'read', 'write']; // Définir les scopes pour l'administrateur
        } else if (user.role === 'RH') {
            scopes = ['RH']; // Définir les scopes pour RH
        } else if (user.role === 'Superviseur') {
            scopes = ['superviseur']; // Définir les scopes pour le superviseur
        } else if (user.role === 'Employe') {
            scopes = ['employe']; // Définir les scopes pour l'employé
        }
        return jwt.sign({ user: user, scopes:scopes }, process.env.JWT_SECRET, { expiresIn: '15m' });
    },
    createRefreshToken :(user) =>{
        let scopes;
        if (user.role === 'Admin') {
            scopes = ['admin',]; // Définir les scopes pour l'administrateur
         } else if (user.role === 'RH') {
            scopes = ['RH']; // Définir les scopes pour RH
        } else if (user.role === 'Superviseur') {
            scopes = ['superviseur']; // Définir les scopes pour le superviseur
        } else if (user.role === 'Employe') {
            scopes = ['employe']; // Définir les scopes pour l'employé
        }
        return jwt.sign({user:user, scopes:scopes}, process.env.JWT_SECRET, {expiresIn:'1d'});
    },

    verifyToken: (token,secret_key) => {
        try {
            return jwt.verify(token, secret_key);
        } catch (error) {
            return null;
        }
    }
}
