"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("@zenstackhq/server/express");
const rest_1 = __importDefault(require("@zenstackhq/server/api/rest"));
const express_2 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Vercel can't properly serve the Swagger UI CSS from its npm package, here we
// load it from a public location
const options = { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css' };
const spec = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../petstore-api.json'), 'utf8'));
const app = (0, express_2.default)();
app.use(express_2.default.json());
const prisma = new client_1.PrismaClient();
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec, options));
// create a RESTful-style API handler
const apiHandler = (0, rest_1.default)({ endpoint: 'http://localhost:3000/api' });
app.use('/api', (0, express_1.ZenStackMiddleware)({
    getPrisma: () => prisma,
    handler: apiHandler
}));
exports.default = app;
