class Message {
    constructor(ID,content, conversation_id,role,create_at) {
        this.id = ID;
        
        this.content = content;
        this.conversation_id= conversation_id;
        this.role = role;
        this.create_at = create_at;

    }

    toMap() {
        return {
            id: this.id,
            
            content: this.content,
            conversation_id :this.conversation_id,
            role: this.role,
            create_at :this.create_at,
            
        };
    }

    static fromMap(map) {
        return new Message(map.ID, map.content,map.conversation_id, map.role, map.create_at);
    }
}

module.exports = Message; 
