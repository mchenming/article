const express=require("express")
const router=express.Router()

const ct=require("../addCtrl.js")

// 页面渲染
router.get("/article/add",ct.inContent)
// 点击提交按钮提交输入信息
router.post("/article/addContent",ct.addContent)

// 通过文章id获取文章信息
router.get("/article/addContent/:id",ct.ShowText)

//index页面渲染   发送请求获取数据  渲染页面

router.post("/article/list",ct.ShowList)

module.exports=router