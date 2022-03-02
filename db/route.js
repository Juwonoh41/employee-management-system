const sql = require('mysql2')

const route = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_management'
})

route.connect((err)=> {
 if(err){
    throw err
 }
})

module.exports = route