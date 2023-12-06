const mysql = require('mysql2');
class Singleton{
  static instance;
  static getInstance(){
    if(!this.instance){
      this.instance = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
      this.instance.connect((err) => {
        if (err) {
          console.error('Erreur de connexion à la base de données :', err);
        } else {
          console.log('Connexion à la base de données établie');
        }
      });
   
    }
    return Singleton.instance;
  }


}
module.exports = Singleton.getInstance();