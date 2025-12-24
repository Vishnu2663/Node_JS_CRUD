const pool = require('../../db');
const queries = require('./queries');
const dayjs = require("dayjs");
const pdfdocument = require('pdfkit');
const exceljs = require('exceljs');

const getStudents = (req, res) => {
    const { p_search, p_from_date, p_to_date } = req.body;   //use req.query to fetch the query from the url of key value

    pool.query(
        queries.getStudents,
        [p_search, p_from_date, p_to_date],
        (error, results) => {
            if (error) throw error;
            res.status(200).json(results.rows);
        }
    );
}

const getstudentbyId = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getstudentbyId, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const addStudent = (req, res) => {
    const { std_id, std_name, std_marks, std_email, dates } = req.body;

    // const dates = dayjs().format("DD-MM-YYYY HH:mm:ss");

    // console.log("Inserted date:", dates);


    pool.query(queries.checkemail, [std_email], (error, results) => {
        if (error) {
            return res.status(500).send(error.message);
        }
        if (results.rows.length) {
            res.send("email already exits");
        }

        pool.query(queries.addStudent, [std_id, std_name, std_marks, dates, std_email], (error, results) => {
            if (error) {
                return res.status(500).send(error.message);
            }
            res.status(201).send("student added successfully");

        });
    });
};



const removeStudent = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getstudentbyId, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if (noStudentFound) {
            res.send("no student for deleting")
        }
        pool.query(queries.removeStudent, [id], (error, results) => {
            if (error) throw error;
            return res.status(200).send("student removed successfully");
        });

    });
};

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const { std_name } = req.body;
    pool.query(queries.updateStudent, [id, std_name], (error, results) => {
        if (error) throw error;
        res.status(200).send("student updated successfully");
    });
}



const exportPdf = (req,res)=>{
    const {p_search,p_from_date,p_to_date}=req.query;
    pool.query(queries.getStudents,[p_search || null,p_from_date || null, p_to_date || null],(error,results)=>{
        const rows = results.rows;
        if(!rows.length) return res.status(404).send('students not found');

        res.setHeader('content-type','application/pdf');
        res.setHeader('content-diposition','attachment;filename=="students.pdf"');

        const doc= new pdfdocument({margin:30, size: 'A4'});
        doc.pipe(res);

        doc.fontSize(28).text('students report',{align:'center'});

        const keys = Object.keys(rows[0]);
        
        let startX = 40;
        let startY = doc.y;
        let colWidth= 130;
        let rowHeight=40;

        doc.fontSize(10);
        keys.forEach((k,i)=>{
            const x=startX + (i * colWidth);
            doc.rect(x,startY,colWidth,rowHeight).stroke();
            doc.text(k.toUpperCase(),x+5,startY+8);
        });
        startY+=rowHeight;
       
        doc.fontSize(9);
        rows.forEach(r=>{
            keys.forEach((k,i)=>{
               const x=startX + (i * colWidth);
            doc.rect(x,startY,colWidth,rowHeight).stroke();
            doc.text(String(r[k] || ''),x+5,startY+8);  
            });
            startY+=rowHeight;
        });
        doc.end();
    });
}

const exportExcel = (req, res) => {
    const { p_search, p_from_date, p_to_date } = req.query;
    pool.query(queries.getStudents, [p_search || null, p_from_date || null, p_to_date || null], async (error, results) => {
        if (error) throw error;
        const rows = results.rows;
        if (!rows.length) return res.status(404).send('No students found');

        const workbook = new exceljs.Workbook();
        const sheet = workbook.addWorksheet('Students');

        const keys = Object.keys(rows[0]);
        sheet.columns = keys.map(k => ({ header: k.toUpperCase(), key: k, width: 20 }));

        rows.forEach(r => sheet.addRow(r));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    });
}


module.exports = {
    getStudents,
    getstudentbyId,
    addStudent,
    removeStudent,
    updateStudent,
    exportPdf,
    exportExcel,
};