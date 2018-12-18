const fs              = require('fs');
let regex_link        = /"(?:https?|ftp|http):\/\/[\n\S]+/g  //da match em algum link
let regex_listen      = /listen [0-9]+/g
let file_environment  = './src/environments/environment.prod.ts'
let file_nginx        = './nginx/default.conf'

console.log(`"${process.env.BASE_URL}"`)
console.log(fs.readFileSync(file_environment, 'utf8'))

let new_url = fs.readFileSync(file_environment, 'utf8').replace(regex_link, `"${process.env.BASE_URL}"`)
let new_conf = fs.readFileSync(file_nginx, 'utf8').replace(regex_listen, `listen ${process.env.PORT}`)


fs.writeFileSync(file_environment, new_url)
fs.writeFileSync(file_nginx, new_conf)




