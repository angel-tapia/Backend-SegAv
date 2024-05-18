import { PrismaClient } from '@prisma/client';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import RestApiHandler from '@zenstackhq/server/api/rest';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// GET endpoint with route parameter "text"
// GET endpoint with route parameter "text"
app.get('/api/save/:text', async (req, res) => {
    const text = req.params.text;
    try {
      // Save the text to the Cookies table
      const savedCookie = await prisma.cookies.create({
        data: {
          text: text
        }
      });
      res.status(201).json({ message: 'Text saved successfully', data: savedCookie });
    } catch (error) {
      console.error('Error saving text:', error);
      res.status(500).json({ error: 'An error occurred while saving the text' });
    }
  });
// Vercel can't properly serve the Swagger UI CSS from its npm package, here we
// load it from a public location
const options = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css'
};

const spec = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../backend-api.json'), 'utf8')
);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(spec, options));

// create a RESTful-style API handler
const apiHandler = RestApiHandler({
  endpoint: 'https://backend-seg-av.vercel.app/api' // Update this to match your Vercel deployment URL
});

app.use('/api', ZenStackMiddleware({ getPrisma: () => prisma, handler: apiHandler }));

export default app;