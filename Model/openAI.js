const { response } = require('express');
const fs = require("fs");
const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
const createText = async (universname, promptText) => {
    const response = await openai.completions.create({
        model: "text-ada-001", // "gpt-3.5-turbo-instruct", // "text-davinci-003"
        prompt: promptText + universname,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response.choices[0].text;
}

exports.createUniversDescription = async (universname) => {
    const promptText = "générer une description pour l'univers ";
    return createText(universname, promptText);
}

exports.createPromptUnivers = async (universname) => {
    const promptText = "générer un prompt pour cet univers ";
    return createText(universname, promptText);
}
exports.createCharacterDescription = async (charactername) => {
    const promptText = "générer une description pour character ";
    return createText(charactername, promptText);
}

exports.createPromptCharacter = async (charactername) => {
    const promptText = "générer un prompt pour cet character ";
    return createText(charactername, promptText);
}

