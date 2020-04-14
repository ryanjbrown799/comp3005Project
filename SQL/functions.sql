--Ryan Brown
--functions used by book store database

--function creates a new user 
--inserts their data into relations used to store user information
--returns nothing
CREATE FUNCTION newclient(
	username varchar(16),
	password varchar(16),
	fname varchar(12),
	mname varchar(12),
	lname varchar(12),
	email varchar(32),
	phone varchar(10),
	postalcode1 varchar(6),
	city varchar(16),
	prov varchar(16),
	str_num numeric(4,0),
	str_name varchar(16),
	cc_number1 numeric(16,0),
	expiry numeric(4,0),
	pin numeric (3,0)
	)  
RETURNS void AS $$    
BEGIN  
	INSERT INTO client
	VALUES(username, password, fname, mname, lname, email, phone);
	INSERT INTO address 
	VALUES(postalcode1, city, prov)
	ON CONFLICT (postalcode)
	DO NOTHING;
	INSERT INTO shipping
	VALUES (username, postalcode1,str_num,str_name);
	INSERT INTO creditcard
	VALUES(cc_number1, expiry, pin)
	ON CONFLICT (cc_number)
	DO NOTHING;
	INSERT INTO billing
	VALUES (username,cc_number1);
END;    
$$ LANGUAGE plpgsql;  


				 
--creates a new book
--returns nothing
CREATE FUNCTION newbook(
	isbn numeric(13,0),
	pages numeric(4,0),
	name varchar(32),
	price numeric(6,2),
	pubname varchar(16),
	sale_p numeric(4,2)
	)  
RETURNS void AS $$    
BEGIN  
	INSERT INTO book
	VALUES(isbn,pages,name,price);
	INSERT INTO pubbooklist
	VALUES(pubname,isbn,sale_p);
END;
$$ LANGUAGE plpgsql; 


--creates a new publisher and stores their information
--in the required realtions
CREATE FUNCTION newpublisher(
	name varchar(16),
	bankaccount numeric(15,0),
	email varchar(32),
	postalcode1 varchar(6),
	city varchar(16),
	prov varchar(16),
	str_name varchar(16),
	str_num numeric(4,0),
	phonenumber numeric(10,0)
	)  
RETURNS void AS $$    
BEGIN  
	INSERT INTO publisher
	VALUES(name,bankaccount,email);
	INSERT INTO address 
	VALUES(postalcode1, city, prov)
	ON CONFLICT (postalcode)
	DO NOTHING;
	INSERT INTO pubaddress
	VALUES(name,postalcode1,str_name,str_num);
	INSERT INTO pubcontact
	VALUES(name,phonenumber);
END;
$$ LANGUAGE plpgsql; 




--assign a book a genre
--will add the genre if it does not already exist in genre relation
--returns nothing
CREATE FUNCTION bookGenre(
	isbn numeric(13,0),
	name1 varchar(12)
	)  
RETURNS void AS $$    
BEGIN  
	INSERT INTO genre
	VALUES(name1)
	ON CONFLICT (name)
	DO NOTHING;
	INSERT INTO genrelist
	VALUES(isbn,name1);
END;
$$ LANGUAGE plpgsql;


--delete a book and remove information from relations
--returns nothing
CREATE FUNCTION deletebook(
	isbn1 numeric(13,0)
	)  
RETURNS void AS $$    
BEGIN  
	DELETE FROM pubbooklist
	where isbn1=isbn;
	DELETE FROM inventory
	where isbn1=isbn;
	DELETE FROM genrelist
	where isbn1=isbn;
	DELETE FROM authors
	where isbn1=isbn;
	DELETE FROM book
	where isbn1=isbn;
	
END;
$$ LANGUAGE plpgsql; 

--creates a new order
--returns nothing
CREATE FUNCTION neworder(
	username varchar(16),
	order_number numeric(16,0),
	tracking numeric(16,0),
	postalcode1 varchar(6),
	city varchar(16),
	prov varchar(16),
	str_num numeric(4,0),
	str_name varchar(16),
	cc_number1 numeric(16,0),
	expiry numeric(4,0),
	pin numeric (3,0),
	total numeric(6,2)
	)  
RETURNS void AS $$    
BEGIN  
	INSERT INTO anorder
	VALUES(order_number,tracking);
	
	INSERT INTO address
	VALUES(postalcode1,city,prov)
	ON CONFLICT (postalcode)
	DO NOTHING;
	
	INSERT INTO creditcard
	VALUES(cc_number1,expiry,pin)
	ON CONFLICT (cc_number)
	DO NOTHING;
	
	INSERT INTO ordershipping
	VALUES(order_number,postalcode1,str_name,str_num);
	
	INSERT INTO orderbilling
	VALUES(order_number,cc_number1);
	
	INSERT INTO ordered
	VALUES(order_number,username,total);
		
END;    
$$ LANGUAGE plpgsql;
