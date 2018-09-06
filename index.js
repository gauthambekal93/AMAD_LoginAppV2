const mysql=require('mysql');
const express=require('express');
var app=express();
const bodyparser=require('body-parser');
const jwt=require('jsonwebtoken');

app.use(bodyparser.json());

var mysqlConnection=mysql.createConnection(
{
    host:'localhost',
    user:'root',
    password:'Hydrogen@01',
    database:'EmployeeDB',
    multipleStatements:true
}
);

mysqlConnection.connect((err) =>{
    if(!err)
       console.log('DB connection succeded.');
    else
       console.log('DB connection failed \n Error : '+JSON.stringify(err, undefined, 2));
}
);

app.listen(3000,()=>console.log('Express server is running at port: 3000'));

//Get all employees
app.get('/employees',(req,res)=>{
mysqlConnection.query('SELECT * FROM employee',(err,rows,fields)=>{
      if(!err)
       {
       res.send(rows);
    }
      else
       console.log(err); 
})
});

//Get a specific employees

app.get('/employees/:id',(req,res)=>{
mysqlConnection.query('SELECT * FROM employee where EmpID=?',[req.params.id],(err,rows,fields)=>{
      if(!err)
       {
       res.send(rows);
    }
      else
       console.log(err); 
})
});


//Delete an employees
app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('Delete from employee where EmpID=?',[req.params.id],(err,rows,fields)=>{
          if(!err)
           {
           res.send('Delete successfully');
        }
          else
           console.log(err); 
    })
    });

    //INSERT employees
    app.post('/employees',(req,res)=>{
let emp=req.body;        
var sql="Insert into employee (EmpID,CompleteName,EmpCode,Salary) values(?,?,?,?);";
        mysqlConnection.query(sql, [emp.EmpID,emp.CompleteName,emp.EmpCode,emp.Salary],(err,rows,fields)=>{
              if(!err)
               {
               res.send(rows);
            }
              else
               console.log(err); 
        })
        });


    //UPDATE employees
    app.put('/employees',(req,res)=>{
        let emp=req.body;        
        var sql="Update employee set Salary=? where EmpID=?;";
                mysqlConnection.query(sql, [emp.Salary,emp.EmpID],(err,rows,fields)=>{
                      if(!err)
                       {
                       res.send('Updated Successfully');
                    }
                      else
                       console.log(err); 
                })
                });


//USING JWT(JSON WEB TOKEN)
app.post('/api/login',(req,res)=>{
//MOCK USER
const user={
id:1,
username:'brad',
email:'brad@gmail.com'
}
jwt.sign({user},'secretkey',(err,token)=>{
res.json({
    token
});

});
});

//PROTECT THE BELOW ROUTE
app.post('/api/posts',verifyToken,(req,res)=>{
res.json(
    {
message:'POST CREATED'
    });
});

//FORMAT OF TOKEN
//AUTHORIZATION:Bearer <access_token>

//Verify Token
function verifyToken(req,res,next){
//Get auth header value
const bearerHeader=req.headers['authoriztion'];
//CHECK IF Bearer is undefined
if(typeof bearerHeader!=='undefined')
{

}else{
 //FORBIDDEN
    res.sendStatus(403);
}}


//TESTING PURPOSE URL
app.post('/testURL',(req,res)=>{
   res.json(
       {
           message:'TESING SUCCESSFUL'
       }
   );
            });