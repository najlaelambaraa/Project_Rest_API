const Univers = require('../Model/univers'); 
const db = require('../database');
const openAI = require('../Model/openAI');
const stableImage = require('../Model/stableImage');
require("dotenv").config();

exports.getAllUnivers = (req, res) => {
  const query = "SELECT * FROM univers";

  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const univers = rows.map(row => Univers.fromMap(row).toMap());

    res.status(200).json(univers);
  });
};


exports.createUniver = async (req, res) => {
  const universeName = req.body.name;

  try {
    const description = await openAI.createUniversDescription(universeName);
    const prompt = await openAI.createPromptUnivers(universeName);
    const imagePath = await stableImage.generateImage(prompt);

    const universe = Univers.fromMap(req.body);
    universe.description = description;
    universe.imagePath = imagePath;

    const query = "INSERT INTO univers (nom, description, image) VALUES (?, ?, ?)";

    db.query(query, [universe.name, universe.description, universe.imagePath], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      universe.id = result.insertId;
      res.status(200).json(universe.toMap());
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



exports.getUniverById = (req, res) => {
  const univerId = req.params.id;
  const query = "SELECT * FROM univers WHERE id = ?";

  db.query(query, [univerId], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err });
          return;
      }

      if (rows.length === 0) {
          res.status(404).json({ error: "univers non trouvé" });
          return;
      }

      const univer = Univers.fromMap(rows[0]);
      res.status(200).json(univer.toMap());
  });
};


exports.updateUniverById = (req, res) => {
  const univerId = req.params.id; 
  const updatedUniverData = req.body; 
  const query = "UPDATE univers SET nom = ?, description = ?, image = ? WHERE id = ?";

  db.query(query, [updatedUniverData.name, updatedUniverData.description, updatedUniverData.image, univerId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Univer non trouvé" });
      }

      res.status(200).send(); 
  });
};


exports.deleteUniverseById = (req, res) => {
  const universeId = req.params.universeId;

  const deleteQuery = `
    DELETE FROM univers
    WHERE id = ?;
  `;

  db.query(deleteQuery, [universeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Univers non trouvé" });
    }

    const deleteCharactersQuery = `
      DELETE FROM personnages
      WHERE id_univers = ?;
    `;

    db.query(deleteCharactersQuery, [universeId], (charactersErr, charactersResult) => {
      if (charactersErr) {
        return res.status(500).json({ error: charactersErr });
      }

      res.status(200).send();
    });
  });
};
