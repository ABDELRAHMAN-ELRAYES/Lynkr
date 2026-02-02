import YAML from "yamljs";
import { Express } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";


export function setupSwagger(app: Express) {
    const sourcePath = process.cwd();
    const yamlPath = path.join(sourcePath, "..", "documents", "api", "openapi.bundle.yaml");

    try {
        const swaggerDocument = YAML.load(yamlPath);
        app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    } catch (error) {
        console.error("Failed to load Swagger documentation:", error);
    }
}
