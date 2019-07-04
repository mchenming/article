const express =require("express")
const app=express()
const fs=require("fs")

// 静态托管
app.use("/node_modules",express.static("./node_modules"))

//注册session中间件
const session=require("express-session")
app.use(session({
    secret:"用户session存放",
    resave:false,
    saveUninitialized:false
}))

// 引入第三方模块   获取请求信息
const bodyParser=require("body-parser")
// 注册中间件   
app.use(bodyParser.urlencoded({ extended:false }))

// 设置模板配置
const ejs=require("ejs")
app.set("view engine","ejs")
app.set("views","./views")

// const router=require("./router/router.js")
// const router2=require("./router/index.js")
// app.use(router)
// app.use(router2)
fs.readdir(__dirname+"/router",(err,data)=>{
    console.log(data)
    for(var i=0;i<data.length;i++){
        let router=require(__dirname+"/router/"+data[i])
        // 注册中间件  挂载路由
        app.use(router)
    }
})

app.listen(80,()=>{
    console.log("http://127.0.0.1")
})