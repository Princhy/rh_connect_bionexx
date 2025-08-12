import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../routes/routes"; // Chemin corrigé
import bodyParser from "body-parser";
import  myDataSource  from "./app-data-source";
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialisation de la connexion à la base de données
myDataSource.initialize()
    .then(() => {
        console.log("Connexion à la base de données établie");
    })
 
    .catch((error) => console.log(error));

// CORS configuration    
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre front
  credentials: true // Important pour les cookies/sessions
}));

//cookie
app.use(cookieParser(process.env.JWT_SECRET))
// Routes TSOA
RegisterRoutes(app);

// Documentation Swagger
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(require("../routes/swagger.json"))
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

export { app };