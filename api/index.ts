import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import RestApiHandler from '@zenstackhq/server/api/rest';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// Vercel can't properly serve the Swagger UI CSS from its npm package, here we
// load it from a public location
const options = { customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css' };
const spec = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../petstore-api.json'), 'utf8')
);

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(spec, options));

// create a RESTful-style API handler
const apiHandler = RestApiHandler({ endpoint: 'http://localhost:3000/api' });

app.use('/api', ZenStackMiddleware({ 
    getPrisma: () => prisma,
    handler: apiHandler 
}));

export default app;