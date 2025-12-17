const getStudents="select * from student";
const getstudentbyId="select * from student where std_id =$1";
const checkemail="select * from student where std_email=$1";
const addStudent="insert into student (std_id,std_name,std_marks,std_email) values($1,$2,$3,$4)";
const removeStudent="delete from student where std_id =$1";
const updateStudent="update student set std_name=$1 where std_id=$2";

module.exports={
    getStudents,
    getstudentbyId,
    checkemail,
    addStudent,
    removeStudent,
    updateStudent,
};