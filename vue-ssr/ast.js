let compiler = require('vue-template-compiler')
const result = compiler.compile(`<div v-if='hasname'><div v-for='item in 3'></div></div>`)
console.log(result)
