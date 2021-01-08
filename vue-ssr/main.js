const Vue = require('vue')
let vm = new Vue({
    data(){
        return {
            name: '张三',
            age: 22
        }
    },
    template: `<div>
    <div>姓名:{{name}}</div>
    <div>年龄:{{age}}</div>
    </div>`
})

module.exports = {vm}