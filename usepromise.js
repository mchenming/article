let Promise = require('./promise')

let p = new Promise((resolve,reject)=>{
    setTimeout(() => {
        reject('失败了咯咯咯')
        resolve('成功了安安aaa')
    }, 10);
})
let p2 = p.then(res=>{
    return res
},rej=>{
    return new Promise((resolve,reject)=>reject(100))
})
// console.log(typeof p2.then)
p2.then(res=>{
    console.log(res,'=====')
},reject=>{
    console.log(reject)
})