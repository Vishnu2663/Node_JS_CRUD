const express = require('express');
const studentRoutes=require('./src/student/routes');
const app = express();

const port =3000;


app.use(express.json());

app.get('/',(req,res)=>{
  res.send('hello world');
});


app.use('/rest/v1/student',studentRoutes);

app.listen(port,()=>{
  console.log(`app listeining on port ${port}`);

});