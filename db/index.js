const route = require('./route')

class employee_management{
    constructor(route){
        this.route = route
    }

    //dept
    allDepartments(){
        return this.route.promise().query(
            "SELECT * FROM department;" );
        }
    addDept(department){
        return this.route.promise().query('INSERT into department SET ?', department)

    }
    //roles
    allRoles(){
        return this.route.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;')
    }

    addRole(role){
        return this.route.promise().query("INSERT INTO role SET ?", role);
    }

    //employees
    allEmployees(){
        return  this.route.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        )
    }
    
    addEmployee(employee){
        return this.route.promise().query("INSERT INTO employee SET ?", employee);
    }

    updateEmployee(rId, eId){
        return this.route.promise().query( "UPDATE employee SET role_id = ? WHERE id = ?",[rId, eId])
    }



}

module.exports = new employee_management(route)