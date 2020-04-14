--Ryan Brown
--Queries used by the server


--create a new users
--calls the newclient functions with parameters from POST request
--SELECT newclient($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)


--create a new publisher
--calls the newpublisher function with parameters from POST request
--SELECT newpublisher($1,$2,$3,$4,$5,$6,$7,$8,$9)


--get user details for checkout
--returns username, creditcard number information and shipping information and users full name
SELECT billing.username,billing.cc_number,expiry,pin,str_name,str_num, shipping.postalcode, city,prov,fname,mname,lname FROM billing, creditcard, shipping, address,client
	WHERE billing.cc_number = creditcard.cc_number and billing.username = shipping.username and shipping.postalcode = address.postalcode
	and billing.username = client.username\
  	and billing.username = '';

	
--get past orders for a user to dispaly on dashboard
--returns ordernumer total qty book names tracking 
select ordered.order_number, total, items.isbn, items.qty, book.name, anorder.tracking from ordered, items, book, anorder
					where ordered.username='' and ordered.order_number = items.order_number and items.isbn = book.isbn
						and anorder.order_number = ordered.order_number
						
					
-- get information on shipping from a tracking number
--used when user wants to know where their package is being sent to
select ordershipping.str_name, ordershipping.str_num, address.city,address.prov from anorder, ordershipping, address where tracking = ''
					and ordershipping.order_number = anorder.order_number
					and ordershipping.postalcode = address.postalcode
					

--create a new book by using newbook function and parameters from POST request from webpage
--insert authors fnames and lnames for the book, server loops over this query for multiple authors
--add/create genre by using bookgenre function and parameters from POST request from webpage
--insert new book isbn, admin who added it and default 10 units for qty
--SELECT newbook($1,$2,$3,$4,$5,$6)
--INSERT INTO authors VALUES($1,$2,$3)
--SELECT bookGenre($1,$2);
--INSERT INTO inventory values($1,$2,$3)


--get password from db for the username that attempted the login
--server will use the password returned from query to compare with inputed
--password to verify client login
select password from client where username = ''


--get all the expenditures
--returns name and cost
--used to populate expenditures drop down
select * from expenditure


--create a new expenditure get the name and cost from POST request 
--INSERT INTO expenditure VALUES($1,$2)


--get sales vs expenditure
--returns total cost of all expenditures made
select SUM(cost) from extras, expenditure where expenditure.expname = extras.expname
--gets the qty sold, publisher percentage, price for all the books sold
--server iterates through the returned array and calculates total amount from price of each book * qty
--also calculates total publishers are owed for their precentage * price * qty sold for each book 
select items.qty, sale_percentage, price from items, pubbooklist, book where items.isbn = pubbooklist.isbn
									and book.isbn = pubbooklist.isbn
									
									
--adding an expense made
--can be made with the current date entered by the db or a different date inputed by a manager
--INSERT INTO extras(name,expname,ex_date) VALUES($1,$2,$3)
--INSERT INTO extras(name,expname) VALUES($1,$2)


--change qty of a book in a users cart
--UPDATE cart SET qty=$1 WHERE username=$2 and isbn=$3;


--get books that are below threshold
select inventory.isbn, pubbooklist.name from inventory, pubbooklist where onhand < '' and inventory.isbn = pubbooklist.isbn
--get the sum of qty sold from the previous month for specific isbn
--server loops this query for each book that is below the threshold
SELECT items.isbn, pubbooklist.name, SUM(items.qty) FROM anorder, items, pubbooklist WHERE order_date >= date_trunc('month', current_date - interval '1 month')
									and order_date < date_trunc('month', current_date) and anorder.order_number = items.order_number and items.isbn = pubbooklist.isbn
									and items.isbn = '' group by(items.isbn,name);

									
--add reordered qty to inventory
--server loops this query for each book
--adding its last month qty sold or the default 10 to onhand value 
--UPDATE inventory SET onhand = onhand + $1 where isbn = $2  


--sales by genre
--returns qty sold by genre
select SUM(qty), name from items, genrelist where items.isbn = genrelist.isbn
									group by (name)

--sales by author	
--returns qty sold by author								
select SUM(qty), fname, lname from items, authors where items.isbn = authors.isbn
								group by (fname, lname);

								
--sales by isbn
--returns qty sold by isbn								
select SUM(qty) ,isbn from items group by(isbn);


--sales by day
--returns total sales by day
select order_date, SUM(items.qty) from anorder, items where items.order_number = anorder.order_number
								group by (order_date);
--returns isbns and the sum qty sold ona  specific day
--server loops this query for each day to breakdown details of the total sold per day from query above
select SUM(items.qty), items.isbn  from anorder, items where items.order_number = anorder.order_number and order_date=''



--add an order
--get the max order number, used by server to generate a new order number
SELECT MAX(order_number) FROM anorder;
--get the max tracking, used by server to generate a new tracking number
SELECT MAX(tracking) FROM anorder;
--use the neworder function create a new order with parameters fomr POST
--SELECT neworder($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);
--insert the books that are in the users cart during checkout
--INSERT INTO items (order_number, isbn, qty) SELECT $1, cart.isbn, cart.qty FROM cart WHERE username=$2
--remove items sold from inventory
update inventory set onhand = (onhand - cart.qty) from cart where inventory.isbn = cart.isbn and username = ''
--delete the users cart as they have checkout 
delete from cart where username = ''


--get manager password
--get password from db to comapre with entered password for authentication
select password from owner where name = ''


--delete book
--call the delete book fucntion with parameters from POST 
select deletebook($1);


--delete item from a specific users cart
DELETE FROM cart WHERE username='' and isbn=''


--add item to cart
--INSERT INTO cart VALUES($1,$2,$3)


--get a users cart
select isbn,qty from cart where username=''


--get book details
select * from book where isbn=''
--get the authors of a book server loops this to get all authors
select * from authors where isbn=''
--get genres for book server loops this to get all genres
select name from genrelist where isbn=''
--get onhand qty from inventory
select onhand from inventory where isbn=''
--get the publisher name
select name from pubbooklist where isbn=''


--search for all books of a genre
select book.name AS title, genrelist.name,book.isbn from book inner join genrelist on book.isbn = genrelist.isbn where genrelist.name = ''


--search for all books by name
select name AS title,isbn from book where name = ''


--search for books by author first and last name provided
select book.isbn, fname, lname, book.name AS title from authors inner join book on book.isbn = authors.isbn where authors.fname = '' and authors.lname = '';


--search for books by author only one name provided, whether its first or last not specified
select book.isbn, fname, lname, book.name AS title from authors inner join book on book.isbn = authors.isbn where authors.fname = '' or authors.lname = '';


--search for books by isbn
select name AS title,isbn from book where isbn = ''


--get all book names and isbns
select name AS title,isbn from book


--get book info for managers
select * from book where isbn=''
--server loops query for all authors
select * from authors where isbn=''
--server loops query for all genres
select name from genrelist where isbn=''
select onhand from inventory where isbn=''
select name, sale_percentage from pubbooklist where isbn=''


--get all publishers and their info
select * from publisher inner join pubaddress on publisher.name = pubaddress.name inner join address 
	on pubaddress.postalcode = address.postalcode inner join pubcontact on publisher.name = pubcontact.name;

	
--get all book isbn and names
select isbn, name from book


--add another phone number for a publisher
--INSERT INTO pubcontact values($1,$2)

















