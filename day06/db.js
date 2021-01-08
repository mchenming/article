//连接数据库 
const mysql =require("mysql")
let conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"node-mysql"
})
// 暴露连接对象
module.exports=conn