const moment=require("moment")

const conn=require("./db.js")
const marked = require('marked')

module.exports={
    // 点击提交按钮添加数据信息到数据库然后跳转到文章列表详情页
    addContent:(req,res)=>{
        let body=req.body
        body.ctime=moment().format("YYYY-MM-DD HH:mm:ss")
        body.authorid=req.session.user.id
        // console.log(req.session.user.id)
        // console.log(body)
        let sql="INSERT INTO article set ?"
        conn.query(sql,body,(err,result)=>{
            if(err) return res.send({status:501,msg:err.message+"数据库报错"})
            // console.log(result)
            if(result.affectedRows!=1) return res.send({status:502,msg:"添加失败"})
            res.send({status:200,msg:"添加成功",data:result,authorid:body.authorid})
        })
        // res.send("123")
    },
    // 点击跳转到文章发表页面的模板  渲染
    inContent:(req,res)=>{
        if(!req.session.isLogin) return res.redirect("/login")
        res.render("article/add.ejs",{
            user:req.session.user,
            isLogin:req.session.isLogin
        })
    },
    // SHOWtext，根据authorId查询用户所有的发表文章信息

    ShowText:(req,res)=>{
        let textid=req.params.id
        console.log(textid)
        let sql="select * from article where id=?"
        conn.query(sql,textid,(err,result)=>{
            console.log(result)
            if(err) return res.send({status:505,msg:err.message})
            const content = marked(result[0].content)
            res.render("article/showContent.ejs",{
                user:req.session.user,
                isLogin:req.session.isLogin,
                data:result,
                content:content
            })
        })
    },


    //  首页渲染的路由对应关系
    ShowList:(req,res)=>{
        console.log(req.body)
        let page=req.body.page
        let pageSize=req.body.pageSize
        let offset =(page-1)*pageSize
        const sql=`select * from heimablog as b  JOIN article as a on a.authorid=b.id ORDER BY a.ctime desc limit ${offset},${pageSize}`
        conn.query(sql,(err,result)=>{
            if(err) return res.send({msg:err.message,status:501})
            // res.send({status:200,data:result})
            let sqlCount="select count(*) as count from article"
            conn.query(sqlCount,(err,resultCount)=>{
                console.log(resultCount)
                if(err) return res.send({status:508,msg:err.message})
                res.send({status:200,msg:"操作成功",data:result,count:resultCount[0].count})
            })
        })
    }
    

}