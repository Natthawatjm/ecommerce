const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const _ = require('lodash');

const app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const innerPath = path.join(__dirname, "views")
const adminPath = path.join(__dirname, "admin")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(innerPath));
app.use(express.static(adminPath));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "projects"
})
//-----------------------USER------------------------------------
app.get('/login', function(request, response) {
	response.sendFile(path.join(innerPath , 'login.html'));
});
app.get('/home', function(request, response) {
	response.sendFile(path.join(innerPath , 'index.html'));
});
app.get('/register', function(request, response) {
	response.sendFile(path.join(innerPath , 'register.html'));
});

//------------------------ADMIN-----------------------------------
app.get('/loginadmin', function(request, response) {
	response.sendFile(path.join(adminPath , 'loginadmin.html'));
});
app.get('/homeadmin', function(request, response) {
	response.sendFile(path.join(adminPath , 'homeadmin.html'));
});
app.get('/registeradmin', function(request, response) {
	response.sendFile(path.join(adminPath , 'registeradmin.html'));
});
app.get('/user', function(request, response) {
	response.sendFile(path.join(adminPath , 'user.html'));
});
app.get('/admin', function(request, response) {
	response.sendFile(path.join(adminPath , 'admin.html'));
});
app.get('/report', function(request, response) {
	response.sendFile(path.join(adminPath , 'report.html'));
});
//-------------------------------USER---------------------------------------------
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM tb_uesrs WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/api/register', (req, res) => {
    const {username,password,email,phone,address} = req.body;

    try {
        if(username && password && email && phone && address) {
            db.query('insert into tb_uesrs (username,password,email,phone,address) values (?,?,?,?,?) ', [
                username,password,email,phone,address
            ], (err, resp, field) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success'
                    })
                }
                else {
                    console.log('ERR 2! : Bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            }) 
        }
        else {
            console.log('ERR 1! : Invalid request')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid request',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

//---------------------------------------------------------------------------------------------
app.get('/api/getaccount', (req, res) => {
    try {
        db.query('select * from tb_uesrs', [],
        (err, data, fil) => {
            if(data && data[0]) {

                // for (let i = 0; i < data.length; i++) {
                //     delete data[i].id                    
                // }

                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    Result: data
                })
            }
            else {
                console.log('ERR 1! : not found data')
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data',
                    Log: 1
                })
            }
        })
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

app.delete('/api/deletemoviebyid', (req, res) => {
    var id = _.get(req, ["body", "id"]);

    try {
        if(id) {
            db.query('delete from tb_uesrs where id = ? ', [
                parseInt(id)
            ], (err, resp, fil) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'good',
                    })
                }
                else {
                    console.log('ERR 2! : bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid id')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid id',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})
app.put('/api/update', (req, res) => {
    var id = _.get(req, ["body", "id"]);
    var username = _.get(req, ["body", "username"]);
    var password = _.get(req, ["body", "password"]);
    var email = _.get(req, ["body", "email"]);
    var phone = _.get(req, ["body", "phone"]);
    var address = _.get(req, ["body", "address"]);
    try {
        if(id && username && password&& email&& phone&& address) {
            db.query('update tb_users set username = ?, password = ?, email = ? , phone = ? , address = ? where id = ?', [
                username, password,email,phone,address, parseInt(id)
            ], (err, data, fil) => {
                if(data) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                    })
                }
                else {
                    console.log('ERR 2! : Update fail')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: Update fail',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid data')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid data',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})
//---------------------------------------ADMIN---------------------------------

app.post('/authadmin', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM tb_admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/homeadmin');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/api/getaccountadmin', (req, res) => {
    try {
        db.query('select * from tb_admin', [],
        (err, data, fil) => {
            if(data && data[0]) {

                // for (let i = 0; i < data.length; i++) {
                //     delete data[i].id                    
                // }

                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    Result: data
                })
            }
            else {
                console.log('ERR 1! : not found data')
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data',
                    Log: 1
                })
            }
        })
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

app.delete('/api/deleteadmin', (req, res) => {
    var id = _.get(req, ["body", "id"]);

    try {
        if(id) {
            db.query('delete from tb_admin where id = ? ', [
                parseInt(id)
            ], (err, resp, fil) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'good',
                    })
                }
                else {
                    console.log('ERR 2! : bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid id')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid id',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

app.put('/api/updateadmin', (req, res) => {
    var id = _.get(req, ["body", "id"]);
    var username = _.get(req, ["body", "username"]);
    var password = _.get(req, ["body", "password"]);
    var email = _.get(req, ["body", "email"]);
    var phone = _.get(req, ["body", "phone"]);
    var address = _.get(req, ["body", "address"]);
    try {
        if(id && username && password&& email&& phone&& address) {
            db.query('update tb_admin set username = ?, password = ?, email = ? , phone = ? , address = ? where id = ?', [
                username, password,email,phone,address, parseInt(id)
            ], (err, data, fil) => {
                if(data) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success',
                    })
                }
                else {
                    console.log('ERR 2! : Update fail')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: Update fail',
                        Log: 2
                    })
                }
            })
        }
        else {
            console.log('ERR 1! : Invalid data')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid data',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})

app.post('/api/registeradmin', (req, res) => {
    const {username,password,email,phone,address} = req.body;

    try {
        if(username && password && email && phone && address) {
            db.query('insert into tb_admin (username,password,email,phone,address) values (?,?,?,?,?) ', [
                username,password,email,phone,address
            ], (err, resp, field) => {
                if(resp) {
                    return res.status(200).json({
                        RespCode: 200,
                        RespMessage: 'success'
                    })
                }
                else {
                    console.log('ERR 2! : Bad sql')
                    return res.status(200).json({
                        RespCode: 400,
                        RespMessage: 'bad: bad sql',
                        Log: 2
                    })
                }
            }) 
        }
        else {
            console.log('ERR 1! : Invalid request')
            return res.status(200).json({
                RespCode: 400,
                RespMessage: 'bad: Invalid request',
                Log: 1
            })
        }
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})



app.get('/api/getreport', (req, res) => {
    try {
        db.query('select * from tb_report', [],
        (err, data, fil) => {
            if(data && data[0]) {

                // for (let i = 0; i < data.length; i++) {
                //     delete data[i].id                    
                // }

                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'success',
                    Result: data
                })
            }
            else {
                console.log('ERR 1! : not found data')
                return res.status(200).json({
                    RespCode: 400,
                    RespMessage: 'bad: not found data',
                    Log: 1
                })
            }
        })
    }
    catch(error) {
        console.log('ERR 0! :', error)
        return res.status(200).json({
            RespCode: 400,
            RespMessage: 'bad',
            Log: 0
        })
    }
})


app.listen(3000);