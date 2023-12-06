const Characters = require('../Model/characters'); 

const openAI = require('../Model/openAI');
const db = require('../database');
const stableImage = require('../Model/stableImage');

exports.getCharactersById = (req, res) => {
    const universId = req.params.id; 
    const query = "SELECT * FROM personnages WHERE id_univers = ?";

    db.query(query, [universId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (rows.length === 0) {
                res.status(404).json({ error: "Personnage non trouvé" });
            } else {
                let personnages = [];
                for (let row of rows) {
                    let personnage = Characters.fromMap(row);
                    personnages.push(personnage.toMap());
                }
                res.status(200).json(personnages);
            }
        }
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
          res.status(201).json(character.toMap());
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
    const query = "UPDATE personnages SET name = ?, description = ?, image = ? WHERE id_univers = ? and id = ?";

    db.query(query, [updatedCharactersData.name,updatedCharactersData.description,updatedCharactersData.image, univerId,charactersId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Characters non trouvé" });
            } else {
                res.status(204).send(); 
            }
        }
    });
};
exports.deleteCharacterById = (req, res) => {
    const universId = req.params.univerId;
    const charactersId = req.params.charactersId;

    const query = "DELETE FROM personnages WHERE id_univers = ? AND id = ?";

    db.query(query, [universId, charactersId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: "Personnage non trouvé" });
            } else {
                res.status(204).send();
            }
        }
    });
};
