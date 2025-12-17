const pool = require('../../db');
const queries=require('./queries');

const getStudents=(req,res)=>{
    pool.query(queries.getStudents,(error,results)=>{
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const getstudentbyId=(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query(queries.getstudentbyId,[id],(error,results)=>{
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const addStudent=(req,res)=>{
    const {std_id,std_name,std_marks,std_email} =req.body;
    pool.query(queries.checkemail,[std_email],(error,results)=>{
      if (error) throw error;
        if (results.rows.length) {
            res.send("email already exits");
        }

        pool.query(queries.addStudent,[std_id, std_name,std_marks,std_email],(error,results)=>{
            if (error) throw error;
            res.status(201).send("student added successfully");
        });
    });
};

const removeStudent=(req,res)=>{
    const id =parseInt(req.params.id);
    pool.query(queries.getstudentbyId,[id],(error,results)=>{
        const noStudentFound = !results.rows.length;
        if(noStudentFound){
            res.send("no student for deleting")
        }
    pool.query(queries.removeStudent,[id],(error,results)=>{
         if(error) throw error;
          return res.status(200).send("student removed successfully");
    });    
       
    });
};

const updateStudent=(req,res)=>{
    const id = parseInt(req.params.id);
    const {std_name} = req.body;
    pool.query(queries.updateStudent,[std_name,id],(error,results)=>{
        if (error) throw error;
        res.status(200).send("student updated successfully");
    });
}


module.exports={
    getStudents,
    getstudentbyId,
    addStudent,
    removeStudent,
    updateStudent,
};