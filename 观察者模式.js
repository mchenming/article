const { stat } = require("fs")

class Observe{
    constructor(name){
        this.name = name,
        this.arr = [],
        this.status = '在学习'
    }
    attach(teacher){
        this.arr.push(teacher)
    }
    changeStatus(status){
        if (status !==this.status) {
            this.status = status
            this.arr.forEach(t => t.notify(this.name,this.status));
        }
    }
}

class Watcher{
    constructor(name){
        this.name = name
    }
    notify(name,status){
        console.log(this.name+name+'当前状态为'+status)
    }
}

let o = new Observe('学生')

let t = new Watcher('语文老师')
let t2 = new Watcher('数学老师')
o.attach(t)
o.attach(t2)

o.changeStatus('摸鱼')
