const moment = require("moment")
// 数据库连接
let conn = require("./db.js")

// 注册用户名的时候加密处理的模块
const bcrypt = require("bcrypt")
// 循环的幂次
const saltRounds = 10

module.exports = {
    // 注册页面的请求，数据库的验证
    register: (req, res) => {
        // 获取请求参数方便下面做验证
        let body = req.body
        // 创建查询语句根据 提交的用户名查询判断数据库是否存在该用户名，如果不存在那么就继续执行下面的代码
        // 如果存在那么就退出执行后面的代码  返回错误信息
        let sql2 = "select count(*) as count from `heimablog` where username=?"
        conn.query(sql2, body.username, (err, result) => {
            if (err) return res.send({ status: 501, msg: err.message + "查询数据库失败" })
            // 如果数据库查询成功但是数据库中已经存在前台传过来的用户名 那么就不能注册成功 退出 返回错误提示
            if (result[0].count != 0) return res.send({ status: 502, msg: "用户名已存在，请重新输入用户名" })
            // console.log(result)
            // 当用户名不存在那么就可以执行添加语句数据库

            // 因为这里是异步执行所以要嵌套在这个查询中

            // 然后就是调用第三方的获取当前时间的一个模块功能 获取到当前时间
            // 然后给请求的参数里面添加一个ctime值对应数据库添加语句
            body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
            // bcrypt.hash("要加密的密码","循环的幂次",(err,newpwd)=>{})
            bcrypt.hash(body.password, saltRounds, (err, newpwd) => {
                // 如果加密失败则返回给用户
                if (err) return res.send({ msg: "注册用户失败！", status: 506 })
                // 加密成功后将加密后的密码赋值给输入数据库的请求密码
                body.password = newpwd
                // 将用户输入的信息存放进数据库
                sql3 = "INSERT INTO `heimablog` set ?"
                // 执行的增加的sql语句
                conn.query(sql3, body, (err, result) => {
                    if (err) return res.send({ status: 503, msg: err.message + "创建用户失败" })
                    res.send({ status: 200, msg: "用户名注册成功" })
                })
            })
        })
    },
    // 登录页面的请求，
    login: (req, res) => {
        // res.send("nihao1")
        let data = req.body
        let sql = "select * from `heimablog` where  username=?"
        conn.query(sql, data.username, (err, result) => {
            if (err) return res.send({ status: 505, msg: err.message + "查询数据库失败" })
            // console.log(result)
            if (result.length == 0) return res.send({ status: 506, msg: "请输入正确的用户名和密码" })
            // bcrypt.compare("用户输入的密码","数据库中记录的被加密过了的密码","回调函数")
            bcrypt.compare(data.password, result[0].password, (err, compareResult) => {
                if (err) return res.send({ msg: "比较时用户登录失败", status: 508 })
                //  compareResult为查询后的结果  boole类型  true || false
                if (!compareResult) return res.send({ msg: "密码输入错误，请重新输入密码", status: 502 })
                // 如果用户输入的信息和加密过的密码作比较成功后那么就执行后面的代码
                // console.log(req.session)
                // console.log(result[0])
                // req.session.user:// {id: 1,
                // username: 'chenm',
                // password: '123',
                // nickname: 'roo',
                // ctime: '0000-00-00 00:00:00',
                // isdel: 0 },
                // 当登录成功后 ，存放用户信息
                req.session.user = result[0]
                req.session.isLogin = true
                console.log(req.session)
                res.send({ status: 200, msg: "登录成功", data: result })
            })

        })
    },
    showreg: (req, res) => {
        res.render("register.ejs", {})
    },
    showlogin: (req, res) => {
        res.render("login.ejs", {})
    },
    logout: (req, res) => {
        // 清除session
        req.session.destroy(() => {
            res.redirect("/")
            // 跳转到index页面
        })
    }
}