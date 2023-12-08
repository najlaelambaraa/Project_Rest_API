const Characters = require('../Model/characters'); 
const openAI = require('../Model/openAI');
const db = require('../database');
const stableImage = require('../Model/stableImage');

exports.getCharactersById = (req, res) => {
    const universId = req.params.id;
    const query = "SELECT * FROM personnages WHERE id_univers = ?";

    db.query(query, [universId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: "Personnage non trouvé" });
        }

        const personnages = rows.map(row => Characters.fromMap(row).toMap());

        res.status(200).json(personnages);
    });
};


exports.createCharacter = async (req, res) => {
    const universId = req.params.id; 
    const Character = req.body.name;
  
    try {
      const description = await openAI.createCharacterDescription(Character);
      const prompt = await openAI.createPromptCharacter(Character);
      const imagePath = await stableImage.generateImage(prompt);
  
      const character = Characters.fromMap(req.body);
      character.description = description;
      character.imagePath = imagePath;
      character.id_univers = universId; 
  
      const query = "INSERT INTO personnages (name, description, image, id_univers) VALUES (?, ?, ?, ?) "; 
  
      db.query(query, [character.name, character.description, character.imagePath, character.id_univers], (err, result) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
            character.id = result.insertId;
          res.status(200).json(character.toMap());
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


exports.updateCharactersById = (req, res) => {
    const univerId = req.params.univerId;
    const charactersId = req.params.charactersId;
    const updatedCharactersData = req.body;
    
    let query = "UPDATE personnages SET";
    const values = [];

    if (updatedCharactersData.name) {
        query += " name = ?,";
        values.push(updatedCharactersData.name);
    }

    if (updatedCharactersData.description) {
        query += " description = ?,";
        values.push(updatedCharactersData.description);
    }

    if (updatedCharactersData.image) {
        query += " image = ?,";
        values.push(updatedCharactersData.image);
    }

    if (values.length > 0) {
        query = query.slice(0, -1);
    } else {
        return res.status(400).json({ error: "Aucune donnée à mettre à jour" });
    }

    query += " WHERE id_univers = ? and id = ?";
    values.push(univerId, charactersId);
    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Personnage non trouvé" });
        }

        res.status(200).send();
    });
};


exports.deleteCharacterById = (req, res) => {
    const universId = req.params.univerId;
    const charactersId = req.params.charactersId;

    const deleteQuery = "DELETE FROM personnages WHERE id_univers = ? AND id = ?";

    db.query(deleteQuery, [universId, charactersId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Personnage non trouvé" });
        }

        res.status(200).send();
    });
};
