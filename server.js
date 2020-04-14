var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
const { Client } = require('pg');
session = require('express-session');

const port = 3000;

//connect to db
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DBNAME',
    password: 'PASSWORD',
    port: 5432,
});

client.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
// Authentication and Authorization Middleware
//check session cookie for regular user
var auth = function(req, res, next) {
	
	if(req.session.user && (!req.session.admin) ){
		const getUser = 'select username from client where username = $1';
		values = [req.session.user];
		console.log(req.session);
		client.query(getUser, values, (err, result) => {
		  if (err) {
			console.error(err);
			return res.sendStatus(401);

		  } else {
			console.log(req.session);
			return next(); 
			
		  }

		});
		
	}else{
	return res.sendStatus(401);}
			
};


// Authentication and Authorization Middleware
//check session cookie for admin user
var authOwner = function(req, res, next) {
	
	if(req.session.user && req.session.admin){
		const getOwner = 'select name from owner where name = $1';
		values = [req.session.user];
		console.log(req.session);
		client.query(getOwner, values, (err, result) => {
		  if (err) {
			console.error(err);
			return res.sendStatus(401);

		  } else {
			console.log(req.session);
			return next(); 
			
		  }

		});
		
	}else{
	return res.sendStatus(401);}
			
};
 



//---------------------routes-----------------------//

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', function(req, res){
  res.sendFile(__dirname + '/public/register.html');
});


app.get('/dashboard', auth, function (req, res) {
    res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/manportal', authOwner, function (req, res) {
    res.sendFile(__dirname + '/public/manportal.html');
});

app.get('/checkout', auth, function (req, res) {
    res.sendFile(__dirname + '/public/checkout.html');
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});

//register a new user by using the newclient function
//on success sends confirmation back to webpage
app.post('/reg', function(req, res){
  
	const createUser = 'SELECT newclient($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);';
	values = [req.body.username,
	req.body.password,
	req.body.fname,
	req.body.mname,
	req.body.lname,
	req.body.email,
	req.body.phone,
	req.body.postalcode,
	req.body.city,
	req.body.prov,
	req.body.st_num,
	req.body.st_name,
	req.body.cc_number,
	req.body.expiry,
	req.body.pin];


	client.query(createUser, values, (err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } else {
		for (let row of result.rows) {
			console.log(row);
		
		}
	  	res.send('success');
	  
	  }

	});
	
	

});

//create a publisher with newpublisher function
//send back to webpage if successful
app.post('/pubcreate', function(req, res){
  
	const createPub = 'SELECT newpublisher($1,$2,$3,$4,$5,$6,$7,$8,$9);';
	values = [
	req.body.name,
	req.body.bankaccount,
	req.body.email,
	req.body.postalcode,
	req.body.city,
	req.body.prov,
	req.body.str_name,
	req.body.str_num,
	req.body.phonenumber];
	


	client.query(createPub, values, (err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } else {
		for (let row of result.rows) {
			console.log(row);
		
		}
	  	res.send('success');
	  
	  }

	});
	
});

//get user information shipping billing full name for checkout
app.get('/getuserdetails', function(req, res){
  
	const query = 'SELECT billing.username,billing.cc_number,expiry,pin,str_name,str_num, shipping.postalcode, city,prov,fname,mname,lname FROM billing, creditcard, shipping, address,client\
	WHERE billing.cc_number = creditcard.cc_number and billing.username = shipping.username and shipping.postalcode = address.postalcode\
	and billing.username = client.username\
  	and billing.username = $1;';
	
	client.query(query, [req.session.user], (err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } else {
	  	res.send(result.rows);
	  
	  }

	});
	
});

//gets order history for a user to dispaly on the dashboard
app.get('/getorders', function(req, res){
  
	client.query('select ordered.order_number, total, items.isbn, items.qty, book.name, anorder.tracking from ordered, items, book, anorder\
					where ordered.username=$1 and ordered.order_number = items.order_number and items.isbn = book.isbn\
						and anorder.order_number = ordered.order_number', [req.session.user],(err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } else {
	  	res.send(result.rows);
	  
	  }

	});
	
});


//get information on where a past order is being shipped too
app.post('/track', function(req, res){
  
	client.query('select ordershipping.str_name, ordershipping.str_num, address.city,address.prov from anorder, ordershipping, address where tracking = $1\
					and ordershipping.order_number = anorder.order_number\
					and ordershipping.postalcode = address.postalcode', [req.body.tracking],(err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } else {
	  	res.send(result.rows);
	  
	  }

	});
	
});

//creates a new books
app.post('/bookcreate', function(req, res){
  
	const createBook = 'SELECT newbook($1,$2,$3,$4,$5,$6);';
	values = [
	req.body.isbn,
	req.body.pages,
	req.body.bname,
	req.body.price,
	req.body.publisher,
	req.body.sp];
	
	console.log(req.body);
	console.log(req.session.user);
	var onhand = 10;
	
	client.query(createBook, values, (err, result) => {
	  if (err) {
		console.error(err);
		res.send('fail');
        return;
	  } 
	  else {		
			const addAuthors = 'INSERT INTO authors VALUES($1,$2,$3);';
			const j = req.body.alname.length;
				
				for (let i = 0; i < j; i++) {
					values = [
						req.body.isbn,
						req.body.afname[i],
						req.body.alname[i]
					];
					client.query(addAuthors, values, (err1, result1) => {
						if (err1) {
							console.error(err1);
							return;}});
				
				}
				
				
			const addGenre = 'SELECT bookGenre($1,$2);';
			const k = req.body.genre.length;
				
				for (let l = 0; l < k; l++) {
					values = [
						req.body.isbn,
						req.body.genre[l]
					];
					client.query(addGenre, values, (err2, result2) => {
						if (err2) {
							console.error(err2);
							return;}});
				
				}	
			
		
			const addToInv = 'INSERT INTO inventory values($1,$2,$3);';
			client.query(addToInv, [req.body.isbn,req.session.user,onhand], (err3, result3) => {
				if(err3){
					console.error(err3);
					return;
				}
				
			});
		res.send("gotit");
		}

	});
				

	
});


//regular user login
//get password from bd for username that attempted login
//compare password with inputed password to verify login credentials
app.post('/login', function(req, res){
  
	const getPass = 'select password from client where username = $1';
	values = [req.body.username];

	var pass = req.body.password;
	var realPass;
	
	client.query(getPass, values, (err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		for (let row of result.rows) {
			console.log(row);
			realPass = row.password;
		}
		
		if(pass == realPass){
			req.session.admin = false;
			req.session.user = req.body.username;
			res.send('go');
			
		}else{
			res.send('nope');		
		}
		
	  }

	});
		 
});


//get types of expeditures
app.get('/exptype', function(req, res){
	
	client.query('select * from expenditure',(err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		  res.send(result.rows);
		  
	  }
	});
	
});

//create a new type of expenditure
app.post('/createexp', function(req, res){
	
	client.query('INSERT INTO expenditure VALUES($1,$2)',[req.body.expname,req.body.cost],(err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		  res.send('ok');
		  
	  }
	});
	
});

//get sales vs expenditure data
app.get('/sve', function(req, res){
	
	
	var se = {
			excosts: 0,
			totsale: 0,
			pubcosts: 0
			};
	
	client.query('select SUM(cost) from extras, expenditure where expenditure.expname = extras.expname',(err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		  se.excosts=result.rows[0].sum;
		  
			client.query('select items.qty, sale_percentage, price from items, pubbooklist, book where items.isbn = pubbooklist.isbn\
										and book.isbn = pubbooklist.isbn',(err1, result1) => {
			  if (err1) {
				console.error(err1);
				return;
			  } else {
						for(var i=0;i<result1.rows.length;i++){
							se.totsale += (result1.rows[i].price * result1.rows[i].qty);
							se.pubcosts += ((result1.rows[i].price * result1.rows[i].qty) * (result1.rows[i].sale_percentage / 100)   );
							
						
						}
						res.send(se);
				
				
				  
			  }
			});
		  	  
	  }
	});
	
});

//add an expense made on either the current date or from a manually inputed date 
app.post('/addexp', function(req, res){
	console.log(req.body);
	if(req.body.date1 !=''){
		
		client.query('INSERT INTO extras(name,expname,ex_date) VALUES($1,$2,$3)',[req.session.user,req.body.expname,req.body.date1],(err, result) => {
		  if (err) {
			console.error(err);
			return;
		  } else {
			  res.send('ok');
			  
		  }
		});
	}
	
	else{
		
		client.query('INSERT INTO extras(name,expname) VALUES($1,$2)',[req.session.user,req.body.expname],(err, result) => {
		  if (err) {
			console.error(err);
			return;
		  } else {
			  res.send('ok');
			  
		  }
		});
	}
	
});

//change qty of an item in a cart
//used for when onhand qty has changed from what was originally in the users cart
app.post('/updateqty', function(req, res){
			console.log(req.body);
			client.query('UPDATE cart SET qty=$1 WHERE username=$2 and isbn=$3;',[req.body.qty,req.session.user,req.body.isbn],(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					res.send("cart updated");
			  
				}
			});
	
	
});


//determine books below threshold qty onhand and get their sale history
//from last month, send back books on reorder list that need to be reordered and how many sold last month
//or for books that are new with no history send them back aswell on neworder list
app.get('/reorder', function(req, res){
	var threshold=5;
	var data = {
		reorder: [],
		neworder: []
	};
	
	client.query('select inventory.isbn, pubbooklist.name from inventory, pubbooklist where onhand < $1 and inventory.isbn = pubbooklist.isbn',[threshold],(err, result) => {
				if (err) {
					console.error(err);
					
				} else {
					
					const query1 = `SELECT items.isbn, pubbooklist.name, SUM(items.qty) FROM anorder, items, pubbooklist WHERE order_date >= date_trunc('month', current_date - interval '1 month')
									and order_date < date_trunc('month', current_date) and anorder.order_number = items.order_number and items.isbn = pubbooklist.isbn
									and items.isbn = $1 group by(items.isbn,name);`
									
					if(result.rows.length == 0)
					{res.send('none');
					}
					else{
						for(let i=0;i<result.rows.length;i++){
						
							client.query(query1,[result.rows[i].isbn],(err1, result1) => {
							if (err1) {
							console.error(err1);
							
							} else {
								
								if (result1.rows.length ==0){
									data.neworder.push([result.rows[i].isbn,result.rows[i].name]);
									
								}
								else{
									data.reorder.push([result1.rows[0].isbn,result1.rows[0].name,result1.rows[0].sum]);
									console.log(result1.rows);
								}
								if(i==result.rows.length-1){
									sendit();
								}
														
								}
							});
						
						}
						
						function sendit(){
							res.send(data);
						}
					
			}
		}	
	});
	
	
	

	
		
});
//add ordered qty from publishers to inventory
app.post('/pubord', function(req, res){
	console.log(req.body);
	
	for(let i=0;i<req.body.isbns.length;i++){
		client.query('UPDATE inventory SET onhand = onhand + $1 where isbn = $2  ',[req.body.isbns[i][1],req.body.isbns[i][0]],(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					if(i==req.body.isbns.length-1){sendit();}
			  
				}
			});
	}
	
	function sendit(){
		res.send('confirm');
	}
	
	
	
});


//get amounts sold for specific category
//by genre, author, isbn, per day
app.post('/getsales', function(req, res){
	console.log(req.body);
	
	switch(req.body.type){
		case "genre":
		
			client.query('select SUM(qty), name from items, genrelist where items.isbn = genrelist.isbn\
									group by (name)',(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					res.send(result.rows);
			  
				}
			});
		
			break;
		case 'author':
		
			client.query('select SUM(qty), fname, lname from items, authors where items.isbn = authors.isbn\
								group by (fname, lname)',(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					res.send(result.rows);
			  
				}
			});
		
			break;			
		case 'isbn':
		
			client.query('select SUM(qty) ,isbn from items group by(isbn)',(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					res.send(result.rows);
			  
				}
			});
		
			break;	

		case 'day':
		
			client.query('select order_date, SUM(items.qty) from anorder, items where items.order_number = anorder.order_number\
								group by (order_date)',(err, result) => {
				if (err) {
					console.error(err);
					res.send('fail');
				} else {
					
					var salebydate = {
						totday: result.rows,
						isbnperday:[]			
															
					};
					
					for (let i=0;i<result.rows.length;i++) {
					
						client.query('select SUM(items.qty), items.isbn  from anorder, items where items.order_number = anorder.order_number and order_date=$1\
						group by (isbn)',[result.rows[i].order_date],(err1, result1) => {
								if (err1) {
									console.error(err1);
									res.send('fail');
								} else {
									salebydate.isbnperday.push(result1.rows);
									
									if(i==result.rows.length-1) {sendit();}
									
								}
						});
					
					}
					
					function sendit() {
						res.send(salebydate);
					}
					
					
				}
			});
		
			break;						
		
	}
	
});

//place an order
app.post('/order', function(req, res){
	console.log(req.body);
	console.log(req.session.user);
	order_num=0;
	track_num=0;

	
	
	
	client.query('SELECT MAX(order_number) FROM anorder', (err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		
			
			
		
			if(result.rows[0].max == null){ order_num=0;}
			else{order_num = parseInt(result.rows[0].max)+1;}
			
			client.query('SELECT MAX(tracking) FROM anorder', (err1, result1) => {
			  if (err1) {
				console.error(err1);
				return;
			  } else {
					if(result.rows[0].max == null){track_num=0;}
					else{track_num = parseInt(result.rows[0].max)+1;}
					
						var data=[
							req.session.user,
							order_num,
							track_num,
							req.body.postalcode,
							req.body.city,
							req.body.prov,
							req.body.str_num,
							req.body.str_name,
							req.body.cc_number,
							req.body.expiry,
							req.body.pin,
							req.body.total
						];
			  
					
					client.query('SELECT neworder($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', data, (err1, result1) => {
						if (err1) {
							console.error(err1);
						return;
						} else {
							
							client.query('INSERT INTO items (order_number, isbn, qty) SELECT $1, cart.isbn, cart.qty FROM cart WHERE username=$2',[order_num,req.session.user], (err2,result2) =>{
								if (err2) {
									console.error(err2);
								return;
								} else {
									
									
									client.query('update inventory set onhand = (onhand - cart.qty) from cart where inventory.isbn = cart.isbn and username = $1',[req.session.user],(err4,result4) =>{
										if (err4) {
											console.error(err4);
											return;
											} else {
													client.query('delete from cart where username = $1',[req.session.user], (err3,result3) =>{
									
														if(err3){
															console.error(err3);
														}else{
													
															res.send('confirm');
														}
													
													});
											}
										
									});
									
									
								
								}
												
							});
							
							
						}
					});
			  
			  
			  
			  }
			});
	  }
	});
	
	
});



//managers login
app.post('/loginman', function(req, res){
  
	const getManPass = 'select password from owner where name = $1';

	values = [req.body.username];

	var pass = req.body.password;
	var realPass;
	
	client.query(getManPass, values, (err, result) => {
	  if (err) {
		console.error(err);
        return;
	  } else {
		for (let row of result.rows) {
			console.log(row);
			realPass = row.password;
		}
		
		if(pass == realPass){
			req.session.admin = true;
			req.session.user = req.body.username;
			res.send('good');
			
		}else{
			res.send('nope');		
		}
		
	  }

	});
		 
});

//delete book from db
app.post('/bookdelete', function(req, res){
	console.log('delete: '+req.body.isbn);
	
	client.query('select deletebook($1);',[req.body.isbn],(err, result) => {
				if (err) {
				console.error(err);
				res.send('fail');
				return;
			  } else {
				res.send('deleted');
				  
			  }
	});
	
	
});

//remove an item from cart
app.post('/deletecartitem', function(req, res){
	var data = [req.session.user,req.body.isbn];
	
	client.query('DELETE FROM cart WHERE username=$1 and isbn=$2',data,(err, result) => {
					if (err) {
					console.error(err);
					res.send('fail');
					return;
				  } else {
					  
					  res.send('del');
					  
				  }
				  
	});
	
});

//add item to cart then get new cart and return to user
//if isbn is na then just return cart, used for loading cart when dashboard loads
app.post('/addtocart', function(req, res){
	
	
	if(req.body.isbn != 'na'){
	
		var data = [req.session.user,req.body.isbn,req.body.qty];
		
		client.query('INSERT INTO cart VALUES($1,$2,$3)',data,(err, result) => {
					if (err) {
					console.error(err);
					res.send('fail');
					return;
				  } else {
					
					client.query('select isbn,qty from cart where username=$1',[data[0]],(err1,result1)=>{
						if (err1) {
						console.error(err1);
						res.send('fail');
						return;
					  } else {
						res.send(result1.rows);
					  
					  }
					});
					
				  }
		});
	
	}else{
		client.query('select isbn,qty from cart where username=$1',[req.session.user],(err,result)=>{
						if (err) {
						console.error(err);
						res.send('fail');
						return;
					  } else {
						res.send(result.rows);
					  
					  }
					})
		
	}
	
	
	
});




//get details about a book
app.post('/details', function(req, res){
	var data = req.body.isbn;
	var bookDetails = {
			isbn: '',
			pages: '',
			name: '',
			price: '',
			authors: [],
			genres: [],
			onhand: '',
			pname: ''
			};
	client.query('select * from book where isbn=$1',[data],(err, result) => {
				if (err) {
				console.error(err);
				return;
			  } else {
				bookDetails.isbn = result.rows[0].isbn;
				bookDetails.name = result.rows[0].name;
				bookDetails.pages = result.rows[0].pages;
				bookDetails.price = result.rows[0].price;
			  
			  
				client.query('select * from authors where isbn=$1',[data],(err1, result1) => {
					if (err1) {
						console.error(err1);
						
						return;
					}else{
						
					
						for(let i =0;i<result1.rows.length;i++){
							bookDetails.authors.push([result1.rows[i].fname,result1.rows[i].lname]);
					
						}
						
						client.query('select name from genrelist where isbn=$1',[data],(err2, result2) => {
							if (err2) {
								console.error(err2);
								return;
							}else{
								for(let i =0;i<result2.rows.length;i++){
									bookDetails.genres.push(result2.rows[i]);
								}
								
								client.query('select onhand from inventory where isbn=$1',[data],(err3, result3) => {
									if (err3) {
										console.error(err3);
										return;
									}else{
										bookDetails.onhand = result3.rows[0].onhand;
										
										client.query('select name from pubbooklist where isbn=$1',[data],(err4, result4) => {
											if (err4) {
												console.error(err4);
												return;
											}else{
												
												bookDetails.pname = result4.rows[0].name;
												res.send(bookDetails);
											}
										
										});
										
									}	
								});
							}
							
						});
						
					}
				});
			  
			  
			  
			  }
			});
	
	
});

//search book inventory by criteria
app.post('/search', function(req, res){
	console.log(req.body);
	var data = req.body.keyword;
	switch(req.body.stype){
		case "genre":
		
			client.query('select book.name AS title, genrelist.name,book.isbn from book inner join genrelist on book.isbn = genrelist.isbn where genrelist.name = $1',[data],(err, result) => {
				if (err) {
					console.error(err);
					res.send("error");
					return;
				} else {
					res.send(result.rows);
					
				  }
				});
				
		break;
		case "name":
			client.query('select name AS title,isbn from book where name = $1',[data],(err, result) => {
				if (err) {
						console.error(err);
						res.send("error");
						return;
					} else {
						res.send(result.rows);
						
					  }
				});
		
		
			
		break;
		case "author":
			var aname = data.split(" ");
			if(aname.length == 2){
				client.query('select book.isbn, fname, lname, book.name AS title from authors inner join book on book.isbn = authors.isbn where authors.fname = $1 and authors.lname = $2;',aname,(err, result) => {
					if (err) {
						console.error(err);
						res.send("error");
						return;
					} else {
						res.send(result.rows);
						
					  }
				});
			}
			if(aname.length == 1){
				client.query('select book.isbn, fname, lname, book.name AS title from authors inner join book on book.isbn = authors.isbn where authors.fname = $1 or authors.lname = $1;',aname,(err, result) => {
					if (err) {
						console.error(err);
						res.send("error");
						return;
					} else {
						res.send(result.rows);
						
					  }
				});
			}
			
		break;
		case "ISBN":
			client.query('select name AS title,isbn from book where isbn = $1',[data],(err, result) => {
				if (err) {
						console.error(err);
						res.send("error");
						return;
					} else {
						res.send(result.rows);
						
					  }
				});
		break;
		
		case "all":
			client.query('select name AS title,isbn from book',(err, result) => {
				if (err) {
						console.error(err);
						res.send("error");
						return;
					} else {
						res.send(result.rows);
						
					  }
				});
		
		break;
		default:
			res.send("error");
		break;
		
	}
	
});


//handle sockets
io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	//get details about a book for a manager
	socket.on('getManBookInfo', function(data){
		console.log(data);
		
		
		var bookDetails = {
			isbn: '',
			pages: '',
			name: '',
			price: '',
			authors: [],
			genres: [],
			onhand: '',
			pname: '',
			sp: '',
			};
			
		client.query('select * from book where isbn=$1',[data],(err, result) => {
				if (err) {
				console.error(err);
				return;
			  } else {
				bookDetails.isbn = result.rows[0].isbn;
				bookDetails.name = result.rows[0].name;
				bookDetails.pages = result.rows[0].pages;
				bookDetails.price = result.rows[0].price;
			  
			  
				client.query('select * from authors where isbn=$1',[data],(err1, result1) => {
					if (err1) {
						console.error(err1);
						
						return;
					}else{
						
					
						for(let i =0;i<result1.rows.length;i++){
							bookDetails.authors.push([result1.rows[i].fname,result1.rows[i].lname]);
					
						}
						
						client.query('select name from genrelist where isbn=$1',[data],(err2, result2) => {
							if (err2) {
								console.error(err2);
								return;
							}else{
								for(let i =0;i<result2.rows.length;i++){
									bookDetails.genres.push(result2.rows[i]);
								}
								
								client.query('select onhand from inventory where isbn=$1',[data],(err3, result3) => {
									if (err3) {
										console.error(err3);
										return;
									}else{
										bookDetails.onhand = result3.rows[0].onhand;
										
										
										client.query('select name, sale_percentage from pubbooklist where isbn=$1',[data],(err4, result4) => {
											if (err4) {
												console.error(err4);
												return;
											}else{
												bookDetails.sp = result4.rows[0].sale_percentage;
												bookDetails.pname = result4.rows[0].name;
												socket.emit('bookinfo',bookDetails);
											}
										
										});
											
								}});
							}
							
						});
						
					}
				});
			  
			  
			  
			  }
			});
		
		
	});
	
	
	
	
	
	//connect to manager portal, send publisher details
	socket.on("manp", function(data){
		if(data == "connected"){	
			const getPubs = 'select * from publisher inner join pubaddress on publisher.name = pubaddress.name inner join address\
				on pubaddress.postalcode = address.postalcode inner join pubcontact on publisher.name = pubcontact.name;';
			
			client.query(getPubs, (err, result) => {
			  if (err) {
				console.error(err);
				return;
			  } else {
				
					socket.emit('publist',result.rows);
				
			}
			});
		}
		
		//send all the books
		if(data == "getbooks"){
			
			client.query('select isbn, name from book', (err, result) => {
				if (err) {
				console.error(err);
				return;
			  } else {
			  
				socket.emit('booklist',result.rows);
			  }
			});
			
			
		}
		
		
		
	});
	
	
	
	//add another phone number to a publisher
	socket.on('addnum', function(data){
		const addNum = 'INSERT INTO pubcontact values($1,$2);';
			values = [data.name,data.phonenumber];
						
			client.query(addNum, values, (err, result) => {
			  if (err) {
				console.error(err);
				return;
			  } else {
				console.log("added");
				
			}
			});
	});
  
  
});



http.listen(port, function(){
  console.log('listening on *:3000');
});
