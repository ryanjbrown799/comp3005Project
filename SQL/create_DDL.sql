--Ryan Brown
--creates all the realtions need for the book store

create table client
	(username varchar(16) not null,
	password varchar(16) not null,
	fname varchar(12),
	mname varchar(12),
	lname varchar(12),
	email varchar(32),
	phone varchar(10),
	primary key (username)
	);

create table address
	(postalcode varchar(6),
	city	varchar(16),
	prov	varchar(16),
	primary key (postalcode)
	);
	
create table shipping
	(username varchar(16),
	postalcode varchar(6),
	str_num numeric(4,0),
	str_name varchar(16),
	primary key (username),
	foreign key (username) references client,
	foreign key(postalcode) references address	
	);
	
create table creditcard
	(cc_number numeric(16,0),
	expiry numeric(4,0),
	pin numeric (3,0),
	primary key (cc_number)
	);
	
create table billing
	(username varchar(16),
	cc_number numeric(16,0),
	primary key(username),
	foreign key (username) references client,
	foreign key (cc_number) references creditcard
	);
	
create table anorder
	(order_number numeric(16,0),
	tracking numeric(16,0),
	order_date DATE NOT NULL DEFAULT CURRENT_DATE,
	primary key(order_number)
	);
	
create table ordered(
	order_number numeric(16,0),
	username varchar(16),
	total numeric(6,2),
	primary key(order_number),
	foreign key(order_number) references anorder,
	foreign key(username) references client
);

create table ordershipping(
	order_number numeric(16,0),
	postalcode varchar(6),
	str_name varchar(16),
	str_num numeric(4,0),
	primary key(order_number),
	foreign key(order_number) references anorder,
	foreign key(postalcode) references address
);

create table orderbilling(
	order_number numeric(16,0),
	cc_number numeric(16,0),
	primary key(order_number),
	foreign key(order_number) references anorder,
	foreign key(cc_number) references creditcard
);

create table book(
	ISBN numeric(13,0),
	pages numeric(4,0),
	name varchar(32),
	price numeric(6,2),
	primary key(ISBN)
);

create table authors(
	ISBN numeric(13,0),
	fname varchar(12),
	lname varchar(12),
	primary key(ISBN, fname, lname),
	foreign key(ISBN) references book
);


create table items(
	order_number numeric(16,0),
	ISBN numeric(13,0),
	qty numeric(3,0),
	primary key(order_number, ISBN),
	foreign key(order_number) references anorder
);
	
create table genre(
	name varchar(12),
	primary key(name)
);
	
create table genrelist(
	ISBN numeric(13,0),
	name varchar(12),
	primary key(ISBN, name),
	foreign key(ISBN) references book,
	foreign key(name) references genre
);

create table owner(
	name varchar(16),
	password varchar(16),
	primary key(name)
); 

create table inventory(
	ISBN numeric(13,0),
	name varchar(12),
	onhand numeric(4,0),
	primary key(ISBN),
	foreign key(ISBN) references book,
	foreign key(name) references owner
);
	
create table expenditure(
	expname varchar(16),
	cost numeric(8,2),
	primary key(expname)
);
	
create table extras(
	expid  SERIAL,
	name varchar(16),
	expname varchar(16),
	ex_date DATE NOT NULL DEFAULT CURRENT_DATE,
	primary key(expid),
	foreign key(expname) references expenditure,
	foreign key(name) references owner
);


create table publisher(
	name varchar(32),
	bankaccount numeric(15,0),
	email varchar(32),
	primary key(name)
);

create table pubaddress(
	name varchar(32),
	postalcode varchar(6),
	str_name varchar(16),
	str_num numeric(4,0),
	primary key(name),
	foreign key(name) references publisher,
	foreign key(postalcode) references address
);

create table pubcontact(
	name varchar(32),
	phonenumber numeric(10,0),
	primary key(phonenumber),
	foreign key(name) references publisher
);

create table pubbooklist(
	name varchar(32),
	ISBN numeric(13,0),
	sale_percentage numeric(4,2),
	primary key(ISBN),
	foreign key(ISBN) references book,
	foreign key(name) references publisher
);

create table cart(
	username varchar(16),
	ISBN numeric(13,0),
	qty numeric(3,0),
	primary key(username, ISBN),
	foreign key(username) references client,
	foreign key(ISBN) references book
);
	
	
	
	
	
	
	
