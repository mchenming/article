const Koa = require('koa')
const Vue = require('vue')
const Router = require('@koa/router')
const fs = require('fs')
const VueRenderer = require('vue-server-renderer')

const vm = require('./main.js').vm
// let vm = new Vue({
//     data(){
//         return {
//             name: '张三',
//             age: 22
//         }
//     },
//     template: `<div>
//     <div>姓名:{{name}}</div>
//     <div>年龄:{{age}}</div>
//     </div>`
// })
// console.log(vm)
let renderer = VueRenderer.createRenderer({
    template: fs.readFileSync('./temp.html', 'utf-8')
})

let app = new Koa()
let router = new Router()
router.get('/',async (ctx)=>{
    // ctx.body='hhh'
    // ctx.body = await renderer.renderToString(vm)  // 返回一个promise
    renderer.renderToString(vm).then(res=>{
        ctx.body = res
    })
    // ctx.body='hhh'
})

app.use(router.routes())
app.listen(5051)