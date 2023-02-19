import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World',
    })
});

app.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;  // Destructure the 'prompt' value from the request body

        if (!prompt) {  // Check if the 'prompt' value is missing
            return res.status(400).send({
                error: "Bad Request: 'prompt' value is missing"
            });
        }

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 1500,
            top_p: 1,
            frequency_penalty: .5,
            presence_penalty: 0,
        });
        cd 

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.error(error);  // Use console.error to log the error
        res.status(500).send({ error: "Internal Server Error" })
    }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
