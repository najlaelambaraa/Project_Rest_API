const db = require('../database');
const Conversation = require('../Model/conversation');
const user = require('../Model/user')


exports.createConversation = (req, res) => {
  const { user_id, character_id } = req.body;

  if (!user_id || !character_id) {
      return res.status(400).json({ error: "Les champs user_id et character_id sont obligatoires" });
  }
  const newConversation = new Conversation(null, user_id, character_id);

  const query = "INSERT INTO conversation (user_id, character_id) VALUES (?, ?)";

  db.query(query, [newConversation.user_id, newConversation.character_id], (err, result) => {
     
      if (err) {
          return res.status(500).json({ error: err });
      }
      res.status(201).json(newConversation.toMap());
  });
};

exports.deleteConversationByIdCharactere = (req, res) => {
  const conversationId = req.params.character_id;
  if (!conversationId) {
      return res.status(400).json({ error: "ID de conversation manquant" });
  }
  const query = "DELETE FROM conversation WHERE character_id = ?";
  db.query(query, [conversationId], (err, result) => {
  
      if (err) {
          return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "La conversation avec l'ID spécifié n'existe pas" });
      }
      res.status(204).send();
  });
};

exports.getConversations = (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT * FROM conversation WHERE user_id = ?';
  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({ error: err.message });
    }

  
    const conversations = rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      character_id: row.character_id
    }));


    res.status(200).json(conversations);
  });

};

exports.getConversationById = (req, res) => {
  const conversationId = req.params.conversationId;
  const userId = req.user.id; 
  const query = `
    SELECT
      c.ID AS conversation_id,
      c.character_id,  -- Ajout de la colonne user_id pour pouvoir l'utiliser plus tard
      univ.ID AS univers_id,
      univ.nom AS univers_nom,  -- Correction du nom de la colonne
      univ.description AS univers_description,
      univ.image AS univers_image
    FROM conversation c
    JOIN utilisateur u ON c.user_id = u.id
    JOIN personnages p ON c.character_id = p.ID
    JOIN univers univ ON p.id_univers = univ.ID
    WHERE c.ID = ? AND c.user_id = ?;
  `;

  db.query(query, [conversationId, userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Conversation non trouvée ou vous n\'êtes pas propriétaire' });
    }

    const conversation = {
      id_conversation: rows[0].conversation_id,
      character: {
        id: rows[0].character_id,
      },

      Univers_Complet: {
        id: rows[0].univers_id,
        nom: rows[0].univers_nom,
        description: rows[0].univers_description,
        image: rows[0].univers_image,
      },
    };

    res.status(200).json(conversation);
  });
};
