const Message=require('../Model/message');
const db = require('../database');
require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
exports.newMessage = async (req, res) => {
    const { role, content } = req.body; 
    const conversationId = req.params.conversationId;
    req.body.conversation_id = conversationId;
    const message = Message.fromMap(req.body);
    

    message.conversationId = conversationId; 
    const query="INSERT INTO message (content,conversation_id,role) VALUES (?, ?, ?)"
     
    db.query(query, [message.content,message.conversation_id,message.role], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        }  
    });
  
    const queryprefix = "SELECT p.name AS `personnage_name`, u.nom AS `univers_name`, u.description as `universe_descritpion` FROM conversation c JOIN personnages p ON c.character_id = p.id JOIN univers u ON p.id_univers = u.ID"
    let personnageName;
    let universName;
    let universeDescription;
    db.query(queryprefix, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {

          for (let index = 0;index < rows.length; index ++) {
            personnageName = rows[index].personnage_name;
            universName = rows[index].univers_name;
            universeDescription = rows[index].universe_descritpion;
           
          }
          
         }
      });

      const queryrecup ="SELECT * FROM message where conversation_id = ? ";
      const messages = [];
      const dbMesages = await db.promise().query(queryrecup,[conversationId]).catch((err)=> {
        res.status(500).json(err)
      });
      console.log("dbMessage",dbMesages)

      for (let index = 0;index < dbMesages.length; index ++) {
        let prefix =""
        
        let message = Message.fromMap(dbMesages[0][index]);
        
        if(index ==0){
          prefix =`Dans l'univers de ${universName}, incarne le personnage ${personnageName}. ${universeDescription}\n\nRéponds directement comme si tu étais le personnage sans confirmer que tu as bien compris.\n---\n`;   
          messages.push({role : message.role,content : prefix + message.content});
          
        }
      }
   

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
  const assistantMessage = {
    content: response.choices[0].message.content,
    role: "assistant",
    conversation_id :conversationId,
    create_at: new Date(),
  }
  const assistantresponse = Message.fromMap(assistantMessage);
  const queryassistant="INSERT INTO message (content,conversation_id,role,create_at) VALUES (?, ?, ?, ?)"

    db.query(queryassistant, [assistantresponse.content,assistantresponse.conversation_id,assistantresponse.role,assistantresponse.create_at], (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } 
        else{
          res.status(201).json({ message: assistantresponse.toMap(), status: "Message created" });
        } 
    });
  
      


};


exports.getMessagesById= (req, res) => {
  
  const conversationId = req.params.conversationId;
  let query = `
  SELECT * FROM message
  WHERE conversation_Id = ?;
  `;
  db.query(query,[conversationId] ,(err, rows) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let messages = [];
      for (let row of rows) {
        let Messages = Message.fromMap(row);

        messages.push(Messages.toMap());
      }

      res.status(200).json(messages);
    }
  });
};

exports.regenerateAssistantMessage = async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    
    const getLastUserMessageQuery = "SELECT * FROM message WHERE conversation_id = ? AND role = 'user' ORDER BY create_at DESC LIMIT 1";
    db.query(getLastUserMessageQuery, [conversationId], async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Aucun message user trouvé" });
      }

      const lastUserMessage = rows[0];

      try {
        
        const deleteLastAssistantMessageQuery = "DELETE FROM message WHERE conversation_id = ? AND role = 'assistant' ORDER BY create_at DESC LIMIT 1";
        db.query(deleteLastAssistantMessageQuery, [conversationId], async (deleteErr, deleteResult) => {
          
          if (deleteErr) {
            return res.status(500).json({ error: deleteErr });
          }

         
          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: "user", content: lastUserMessage.content },
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });

          const newAssistantMessage = {
            content: response.choices[0].message.content,
            role: "assistant",
            conversation_id: conversationId,
            
          };

          const newAssistantMessageObj = Message.fromMap(newAssistantMessage);

          const insertNewAssistantMessageQuery = "INSERT INTO message (content, conversation_id, role) VALUES (?, ?, ?)";
          db.query(insertNewAssistantMessageQuery, [
            newAssistantMessageObj.content,
            newAssistantMessageObj.conversation_id,
            newAssistantMessageObj.role,
            
          ], (insertErr, insertResult) => {
            
            if (insertErr) {
              return res.status(500).json({ error: insertErr });
            }

            return res.status(200).json({ message: newAssistantMessageObj.toMap(), status: "Nouveau message d'assistant créé" });
          });
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


