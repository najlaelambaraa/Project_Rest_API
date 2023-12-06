class Message {
    constructor(id,content, conversation_id,role,create_at) {
        this.id = id;
        
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
        console.log('Mapping from', map);
        return new Message(
            map.id || null,
            map.content || null,
            map.conversation_id || null,
            map.role || null,
            map.create_at || null
        );
    }
}

module.exports = Message; 
