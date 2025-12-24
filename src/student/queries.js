const getStudents=` SELECT * FROM get_all_details1($1, $2, $3)`;
const getstudentbyId="select * from student where std_id =$1";
const checkemail="select * from student where std_email=$1";
const addStudent=`select * from add_stud($1, $2, $3, $4, $5)`;
const removeStudent="select * from delete_stud($1)";
const updateStudent="select * from update_stud($1,$2)";

module.exports={
    getStudents,
    getstudentbyId,
    checkemail,
    addStudent,
    removeStudent,
    updateStudent,
};