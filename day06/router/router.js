const express=require("express")
const router=express.Router()
const ct=require("../contallor")


router.get("/login",ct.showlogin)

// 退出注销页面
router.get("/logout",ct.logout)

router.get("/register",ct.showreg)

// 前台ajax点击发送过来的注册信息请求
router.post("/register",ct.register)

//登录页面的post请求
router.post("/login",ct.login)

module.exports=router