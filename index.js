const SSE = require('./sse');
const app = require('express')();
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});
app.get('/status',(req,res)=>{
    res.sendFile(__dirname+'/status.html');
});
let current_users = [];

let current_sse_status = undefined;
app.get('/sse',(req,res)=>{
    const event = new SSE(res);

    current_users.push(req.query.id)
    if (current_sse_status){
        current_sse_status.send(current_users)
    }
    
    event.disconnect(()=>{
        const index = current_users.indexOf(req.query.id);
        current_users.splice(index,1);
        current_sse_status.send(current_users)
    });
});
app.get('/status_sse',(req,res)=>{
    const event = new SSE(res);
    current_sse_status = event
});
app.listen(3000, () => console.log('web start on port 3000!'));