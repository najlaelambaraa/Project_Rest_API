class Univers {
    constructor(name) {
      this.id = null;
      this.name = name;
      this.description = null;
      this.image = null;
    }
    
    toMap(){
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            image: this.image,
        };
    }

    static fromMap(map){
        let universe = new Univers(map.name);
        universe.id = map.id;
        universe.name = map.name;
        universe.description = map.description;
        universe.image = map.image;
        return universe;
    }

  

}
module.exports = Univers;
    
    
  
  

  