import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Insighta Application API",
      version: "1.0.0",
      description:
        "API documentation for the Insighta Application backend.",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production"
          ? (process.env.RENDER_EXTERNAL_URL || "https://your-render-app.onrender.com")
          : "http://localhost:5000",
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis:
    process.env.NODE_ENV === "production"
      ? ["./dist/routes/*.js"]
      : ["./src/routes/*.ts"],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
