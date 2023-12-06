class Conversation {
    constructor(id, user_id, character_id) {
        this.id = id;
        this.user_id = user_id;
        this.character_id = character_id;
        
    }

    toMap() {
        return {
            //id: this.id,
            user_id: this.user_id,
            character_id: this.character_id,
            
        };
    }

    static fromMap(map) {
        return new Conversation(map.id, map.id_user, map.id_character);
    }
}

module.exports = Conversation; 
