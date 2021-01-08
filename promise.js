// es6规范中提供一个类
//   1.每一个promise需要提供一个执行器函数executor（这个函数会立即同步执行）
//   2.new Promise之后会产生一个promise实例，这个实例上存在一个then方法
//   3.executor中需要提供一个成功的方法和失败的方法
const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'

class Promise {
    constructor(executor) {
        this.status = PENDING
        this.value = undefined  // 成功的原因
        this.reason = undefined  // 失败的原因

        // 存放成功的callbacks
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = (value) => {  // 成功的函数
            if (this.status === PENDING) {
                this.status = RESOLVE //成功后的状态
                this.value = value  // 成功的原因
                this.onResolvedCallbacks.forEach(cb => cb())
            }
        }
        let reject = (reason) => {  // 失败的函数
            if (this.status === PENDING) {
                this.status = REJECT  // 失败的状态
                this.reason = reason  // 失败的原因
                this.onRejectedCallbacks.forEach(cb => cb())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = onFulfilled? onFulfilled : this.value
        onRejected = onRejected? onRejected: {  }
        // 递归每次调用then的时候都返回一个新的promise2 （链式调用）
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === RESOLVE) {
                // 异步执行 try catch捕获不到
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        // 只需要拿到then的返回结果传递 直接将这个返回结果返回给promise2即可
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            if (this.status === REJECT) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)

                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            // 有可能我调用then的时候当前的promise没有成功也没有失败 处于pending
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {

                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);

                })
                // this.onResolvedCallbacks.push(onFulfilled)
                // this.onRejectedCallbacks.push(onRejected)
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
        })
        return promise2
    }
}

let resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 == x) {
        // 说明死循环了 直接拒绝即可
        return reject(new TypeError('Chaining cycle detected for promise #<Promise'))
    }

    // 判断一x的数据类型，是promise还是函数
    // 如果是对象或者函数就有可能为promise 如果是普通值就成功返回普通值

    if ((typeof x === 'object' && x!==null) || typeof x ==='function') {
         // 如何判断一个对象是不是promise promise必须要有then方法
         try {
            // 有可能这个then方法在别人的promise中是通过defineProperty定义的取值的时候可能会发生异常，那就让这个promise2变成失败即可
            let then = x.then
            then.call(x,(y)=>{
                resolve(y)
            },(err)=>{
                reject(err)
            })
         } catch (error) {
            reject(error) 
         }
    } else {
        resolve(x)
    }

}

module.exports = Promise