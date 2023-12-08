const { response } = require('express');
const fs = require("fs");
const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
const createText = async (universname, promptText) => {
    const response = await openai.completions.create({
        model:  "gpt-3.5-turbo-instruct", 
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
    const promptText = "Fais moi un description de l'univers de ${universname}. Son époque, son histoire et ses spécificités. ";
    return createText(universname, promptText);
}

exports.createPromptUnivers = async (universname) => {
    const promptText = "Ecris moi un prompt pour générer une image avec l'intelligence artificielle Text-to-image nommé StableDiffusion afin de représenter l'univers ${universname}. Le prompt doit etre en anglais et ne pas dépasser 300 caractères  ";
    return createText(universname, promptText);
}
exports.createCharacterDescription = async (charactername) => {
    const promptText = "Fais moi une description du personnage ${charactername}. Donne moi son histoire, sa personnalité et ses spécificités ";
    return createText(charactername, promptText);
}

exports.createPromptCharacter = async (charactername) => {
    const promptText = "Ecris moi un prompt pour générer une image avec l'intelligence artificielle Text-to-image nommé StableDiffusion afin de représenter le personnage ${charactername} . Le prompt doit etre en anglais et ne pas dépasser 300 caractères";
    return createText(charactername, promptText);
}

