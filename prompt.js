const {prompt} = require('inquirer')
const db = require('./db')
const logo = require("asciiart-logo");
require("console.table");

start()
function start(){
    const text = logo({ name: "Employee Manager" }).render();
    console.log(text)
    questions()
}

function questions(){
    prompt([
        {
            type: "list",
            name: "options",
            message: "Pick one option",
            choices: [
                {
                    name: "view all departments",
                    value: "All_DEPARTMENTS"
                },
                {
                    name: "add departments",
                    value: "ADD_DEPARTMENTS"
                }, 
                {
                    name: "view all roles",
                    value: "ALL_ROLES",
                },
                {
                    name: "add roles",
                    value: "ADD_ROLES"
                },
                {
                    name: "view all employees",
                    value: "ALL_EMPLOYEES"
                },
                {
                    name: "add employees",
                    value: "ADD_EMPLOYEES"
                },
                {
                    name: "update employees",
                    value: "UPDATE_EMPLOYEES"
                },
                {
                    name: "finished",
                    value: "FINISHED"
                }
            ]
        }
    ]).then((res) => {
        let option = res.option;
        switch(option){
            case "ALL_DEPARTMENTS":
                allDept();
                break;
            case "ADD_DEPARTMENTS":
                addDeptartment()
                break;
            case "ALL_ROLES":
                seeRoles()
                break
            case "ADD_ROLES":
                createRoles()
                break
            case "ALL_EMPLOYEE":
                seeEmployees()
                break
            case "ADD_EMPLOYEE":
                createEmployee()
                break
            case "UPDATE_EMPLOYEE":
                putEmployee()
                break
            default:
                fin()          
        }
    })
}

function allDept(){
    db.allDepartments()
        .then(([tea]) => {
            let dept = tea
            console.log('\n')
            console.log(depts)
        }).then(() => questions())
}

function addDeptartment(){
    prompt([
        {
          name: "adding department questionos",
          message: "Enter the department name."
        }
      ]).then(res => {
          let dept = res
          db.addDept(dept).then(() => console.log(`${dept.name} added.`))
          .then(() => questions())
      })
    
}

function seeRoles(){
    db.allRoles().then(([tea]) => {
      let role = tea;
      console.log("\n");
      console.table(role);
    })
    .then(() => questions());
}

function createRoles(){
    db.allDepartments().then(([tea])=> {
        let dept = tea
        const deptOptions = dept.map(({id, title}) => ({
            name: title,
            value: id
        }))
        prompt([
            {
                name: "position",
                message: "Enter the name of the role"
            },
            {
                type: "list",
                name: "dept",
                message: "Click on the dept the role belongs too.",
                choices: deptOptions
            }, 
            {
                name: "pay",
                message: "How much do they make?"
            }
        ]).then( pos => {
            db.addRole(pos).then(() => {
                console.log('\n')
                console.log(`${pos.title} added.`)
            }).then(() => questions())
        })
    })
}

function seeEmployees(){
    db.allEmployees().then(([tea]) => {
      let employee = tea;
      console.log("\n");
      console.table(employee);
    }).then(() => questions());
}

function createEmployee(){
    prompt([
        {
            name: "FirstName",
            message: "Enter the first name."
        },
        {
            name: "LastName",
            message: "Enter the last name"

        }
    ]).then(res => {
        let firstName = res.FirstName
        let lastName = res.LastName
        db.allRoles().then(([tea]) => {
            let roles = tea
            const roleOptions = roles.map(({id, title}) => ({
                name: title,
                value: id
            }))

            prompt(
                {
                    type: 'list', 
                    name: 'roleTitle',
                    message: 'Employees role',
                    choices: roleOptions
                }).then(res => {
                    let roleId = res.roleId
                    db.allEmployees().then(([tea]) => {
                       let employee = tea 
                       const employeeOptions = employee.map(({ id, first_name, last_name }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                       }))
                       employeeOptions.unshift({ name: "None", value: null })
                       prompt({
                        type: "list",
                        name: "managerId",
                        message: "Select the Manager Id",
                        choices: employeeOptions
                      }).then(res => {
                        let employee = {
                          manager_id: res.managerId,
                          role_id: roleId,
                          first_name: firstName,
                          last_name: lastName
                        }
                        db.addEmployee(employee);
                      }).then(() => {
                          console.log(`${firstName} ${lastName} added.`)

                      }).then(() => questions())
                    })
                })
        })
    })
}

function putEmployee(){
    db.allEmployees()
    .then(([tea]) => {
      let employees = tea;
      const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "eId",
          message: "Select the id for the employee you wish to update",
          choices: employeeOptions
        }
      ]).then(res => {
          let employeeId = res.employeeId;
          db.allRoles()
            .then(([tea]) => {
              let roles = tea;
              const roleOptions = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "rId",
                  message: "Select the role",
                  choices: roleOptions
                }
              ]).then(res => db.updateEmployee(eId, res.rId)).then(() => console.log("Employee role figured out"))
                .then(() => questions())
            });
        });
    })
}


function fin(){
    console.log('fin')
    process.exit()
}
