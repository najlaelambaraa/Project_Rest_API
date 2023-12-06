class Characters {
    constructor(name) {
      this.id = null;
      this.name = name;
      this.description = null;
      this.image = null;
      this.id_univers = null;
    }
  
    toMap(){
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            image: this.image,
            id_univers:this.id_univers,
        };
    }

    static fromMap(map){
        let characters = new Characters(map.name);
        characters.id = map.id;
        characters.description = map.description;
        characters.image = map.image;
        characters.id_univers= map.id_univers;
        return characters;
    }

}
    
module.exports = Characters;