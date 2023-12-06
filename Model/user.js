class User {
    constructor(name,password,username,email) {
      this.id = null;
      this.name = name;
      this.password = password;
      this.username = username;
      this.email = email;
    }
  
    toMap(){
        return {
            id: this.id,
            name: this.name,
            password:this.password,
            username: this.username,
            email: this.email,
      
        };
    }

    static fromMap(map){
        let user = new User(map.name);
        user.id = map.id;
        user.email = map.email;
        user.password = map.password;
        user.username = map.username;


        return user;
    }
 
  }
  
  module.exports=User;

  

  


