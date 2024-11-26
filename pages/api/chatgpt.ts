import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';
import { Template, TemplateInput } from "../../constants/templates";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type InputsData = {
    [key: string]: string;
};

const createInstruction = (inputs: TemplateInput[], inputsData: InputsData): string => {
    return inputs.map((input) => `${input.label}: ${inputsData[input.id]}`).join("\n");
};

export async function generateHashtags(topic: string): Promise<string[]> {
    const messages = [
        { role: "system" as "system", content: "You are a helpful assistant specialized in generating relevant hashtags." },
        { role: "user" as "user", content: `Generate 10 relevant hashtags for the topic: ${topic}. Provide only the hashtags, separated by spaces.` }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
        });

        const reply = response.choices[0]?.message?.content;
        if (!reply) {
            throw new Error("No content in the API response");
        }
        return reply.split(' ');
    } catch (error) {
        console.error("Error while generating hashtags:", error);
        throw error;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { template, inputsData, model } = req.body as { template: Template; inputsData: InputsData; model: string };
        const instruction = createInstruction(template.inputs, inputsData);
        const mainGoal = template.command;

        const messages = [
            { role: "system" as "system", content: "You are a helpful assistant." },
            { role: "user" as "user", content: `Your task is: "${mainGoal}".\n\nHere are the details:\n${instruction}. Please suggest 3 outputs. number them 1,2,3` },
        ];

        try {
            const response = await openai.chat.completions.create({
                model: model || "gpt-3.5-turbo",
                messages: messages,
                temperature: 1,
            });

            const reply = response.choices[0]?.message?.content;
            if (!reply) {
                throw new Error("No content in the API response");
            }
            res.status(200).json({ reply });
        } catch (error) {
            console.error("Error while making the API call:", error);
            res.status(500).json({ error: "Error while making the API call." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed. Use POST." });
    }
}
