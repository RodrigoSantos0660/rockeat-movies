const { hash,compare } = require("bcryptjs");
const AppError = require( "../uttils/AppError");
const sqliteConnection = require("../DataBase/sqlite");



class UsersControllers{
 async create( request , response){
    const {name, email, password} = request.body;
    
    const database = await sqliteConnection();
    const checkUsersExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    
    if(checkUsersExist){
      throw new AppError("email ja esta em uso");
    }
    
    const hashedPassowrd = await hash(password,8);

    await database.run("INSERT INTO users(name,email,password) VALUES (?,?,?)",[name,email,hashedPassowrd]);

    return response.status(201).json();
  }

  async update(request,response) {
    const{ name,email,password,old_password} = request.body;
    const { id } = request.params;
    const database = await sqliteConnection();
    const user = await database.get(`SELECT * FROM users WHERE id = (?)`, [id]);
    
     if(!user){
        throw new AppError('usuario nao encontrado');
    }
    const userWhitUpdatedemail = await database.get(`SELECT * FROM users WHERE email = (?)`, [email]);
     if(userWhitUpdatedemail && userWhitUpdatedemail.id !== user.id){
       throw new AppError("email ja esta em uso");
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password){
      throw new AppError("digte a senha antiga");
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password,user.password);
      if(!checkOldPassword){
       throw new AppError("as senhas nao coicidem")
      }
      user.password = await hash(password,8);
    }



    await database.run(` 
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('NOW')
    WHERE id = ?`,
    [user.name, user.email, user.password,  id]
    );
    
    return response.json();
  }
}
module.exports = UsersControllers;