const bodyParser = require('body-parser');
const bopyParser = require('body-parser');
const express = require('express');
const request = require('request');
const https = require('https');

const app = express();

const port = process.env.PORT;
const localPort = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',  (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
   

    const url = 'https://us21.api.mailchimp.com/3.0/lists/6a1f2ffc8';

    const options = {
        method: 'POST',
        auth: 'joe1:9b4938cc7845dce3cda17ecbe9ecfe75-us21'
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode == 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});


app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(port || 3000, () => {
    console.log(`Email Project listening on port ${localPort}`);
});

// 9b4938cc7845dce3cda17ecbe9ecfe75-us21

// 6a1f2ffc8d