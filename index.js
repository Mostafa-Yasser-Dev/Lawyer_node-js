const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});


app.get('/test', (req, res) => {
    res.send('Hello test!');
});


app.post('/data', (req, res) => {
    const data = req.body;
    const query = req.query;
    console.log('Received data:', data);
    console.log('Received query:', query);
    
    res.json({
        message: 'Data received successfully',
        data: data ,
        query: query
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

