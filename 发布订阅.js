let fs =require('fs')

let events = {
    arr:[],
    resourse: [],
    on(callback){
        this.arr.push(callback)
    },
    emit(data){
        this.resourse.push(data)
        this.arr.forEach(cb=>cb(this.resourse))
    }
}

events.on(function(result){
    if (result.length == 2) {
        console.log('订阅',result)
    }
})

fs.readFile('./age.txt','utf-8',(err,data)=>{
    events.emit(data)
})

fs.readFile('./name.txt','utf-8',(err,data)=>{
    events.emit(data)
})