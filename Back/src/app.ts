import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../routes/routes";
import bodyParser from "body-parser";
import multer from "multer";
import myDataSource from "./app-data-source";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { WebhookController } from "./pointage/webhook.controller";
import { RateLimiter } from "./middleware/rate-limiter.middleware";
import { WEBHOOK_CONFIG } from "./config/webhook.config";

const app = express();

// Configuration multer pour les données multipart
const upload = multer();

// Configuration du rate limiter
const rateLimiter = new RateLimiter({ 
  windowMs: WEBHOOK_CONFIG.RATE_LIMIT.WINDOW_MS, 
  maxRequests: WEBHOOK_CONFIG.RATE_LIMIT.MAX_REQUESTS 
});

// Initialisation de la connexion à la base de données
myDataSource.initialize()
    .then(() => {
        console.log("Connexion à la base de données établie");
    })
    .catch((error) => console.log(error));

// Middleware (AVANT les routes)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.text({ limit: '10mb' })); // Pour les données texte brut
app.use(bodyParser.raw({ limit: '10mb' })); // Pour les données brutes

// CORS configuration    
app.use(cors({
  origin: 'http://localhost:3000', // Remplacez par l'URL de votre front
  credentials: true // Important pour les cookies/sessions
}));

// Cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

// 🔔 WEBHOOK POUR POINTEUSES HIKVISION (AVANT TSOA)
const webhookController = new WebhookController();
app.post('/pointages/webhook-notification', 
  upload.any(), 
  rateLimiter.middleware(),
  (req, res) => webhookController.handleHikvisionWebhook(req, res)
);

// Routes TSOA
RegisterRoutes(app);

// Documentation Swagger
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(require("../routes/swagger.json"))
);

const port = process.env.PORT || 3000;
app.listen(8000,"0.0.0.0", () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

export { app };