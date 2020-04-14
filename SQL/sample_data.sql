--add owner
INSERT INTO owner
VALUES('admin','1234');

--add new user
SELECT newclient('test','12345','test','t',
				 'testerson','testerson@gmail.com','6135554444','K2J3R1','Ottawa',
				 'Ontario', 40,'some st',
				 2222444466667777, 1122,
				 111);
				 
SELECT newclient('test1','12345','test1','t1',
				 'testerson1','testerson1@gmail.com','6135555555','K2G3W1','Toronto',
				 'Ontario', 50,'some ave',
				 123456666666666, 1122,
				 222);

--add publishers
				 
SELECT newpublisher('Joes Publishing',123456789123456,'joepub@gmail.com','K2R7G3','Ottawa','Ontario','somewhere rd',100,'6135552222');
INSERT INTO pubcontact values('Joes Publishing','6134443333');
INSERT INTO pubcontact values('Joes Publishing','6134449999');


SELECT newpublisher('Sallys Pub',121212121212121,'sallyspub@gmail.com','K2R5G6','Ottawa','Ontario','whoknows ave',100,'6135551234');

SELECT newpublisher('Petes Publishing',123451234512345,'petespub@gmail.com','K2J6R3','Toronto','Ontario','bigcity rd',100,'6135559999');
INSERT INTO pubcontact values('Petes Publishing','6131115555');

--add Books
SELECT newbook(1111111111111,100,'Some Book1',19.99,'Joes Publishing',15);
INSERT INTO authors VALUES(1111111111111,'Pete','Peterson');
SELECT bookGenre(1111111111111,'Horror');
INSERT INTO inventory values(1111111111111,'admin',10);

SELECT newbook(2222222222222,150,'Some Book2',12.99,'Joes Publishing',10);
INSERT INTO authors VALUES(2222222222222,'John','Johnson');
SELECT bookGenre(2222222222222,'Action');
SELECT bookGenre(2222222222222,'Adventure');
INSERT INTO inventory values(2222222222222,'admin',10);

SELECT newbook(3333333333333,300,'Some Book3',29.99,'Sallys Pub',10);
INSERT INTO authors VALUES(3333333333333,'Tom','Thompson');
SELECT bookGenre(3333333333333,'Horror');
INSERT INTO inventory values(3333333333333,'admin',10);


SELECT newbook(4444444444444,500,'Some Book4',69.99,'Sallys Pub',15);
INSERT INTO authors VALUES(4444444444444,'Erica','Erikson');
SELECT bookGenre(4444444444444,'Self-Help');
SELECT bookGenre(4444444444444,'Action');
INSERT INTO inventory values(4444444444444,'admin',10);

SELECT newbook(5555555555555,120,'Some Book5',11.99,'Petes Publishing',15);
INSERT INTO authors VALUES(5555555555555,'Jacqueline','Jackson');
INSERT INTO authors VALUES(5555555555555,'Jack','Jackson');
SELECT bookGenre(5555555555555,'Teen');
INSERT INTO inventory values(5555555555555,'admin',10);


SELECT newbook(6666666666666,1000,'Some Textbook',189.99,'Petes Publishing',90);
INSERT INTO authors VALUES(6666666666666,'Daw','Dawson');
SELECT bookGenre(6666666666666,'Textbook');
INSERT INTO inventory values(6666666666666,'admin',10);


--add last month orders

INSERT INTO anorder VALUES(0,0,'20200311');
INSERT INTO ordershipping VALUES(0,'K2J3R1','some st',40);
INSERT INTO orderbilling VALUES(0,2222444466667777);
INSERT INTO items VALUES(0,1111111111111,2);
INSERT INTO items VALUES(0,4444444444444,1);
INSERT INTO ordered VALUES(0,'test',109.97);

INSERT INTO anorder VALUES(1,1,'20200302');
INSERT INTO ordershipping VALUES(1,'K2J3R1','some st',40);
INSERT INTO orderbilling VALUES(1,2222444466667777);
INSERT INTO items VALUES(1,6666666666666,1);
INSERT INTO items VALUES(1,3333333333333,3);
INSERT INTO ordered VALUES(1,'test',279.96);


INSERT INTO anorder VALUES(2,2,'20200320');
INSERT INTO ordershipping VALUES(2,'K2J3R1','some st',40);
INSERT INTO orderbilling VALUES(2,2222444466667777);
INSERT INTO items VALUES(2,2222222222222,3);
INSERT INTO items VALUES(2,5555555555555,2);
INSERT INTO ordered VALUES(2,'test',62.95);


INSERT INTO anorder VALUES(3,3,'20200316');
INSERT INTO ordershipping VALUES(3,'K2G3W1','some av',50);
INSERT INTO orderbilling VALUES(3,123456666666666);
INSERT INTO items VALUES(3,1111111111111,2);
INSERT INTO items VALUES(3,4444444444444,1);
INSERT INTO ordered VALUES(3,'test1',109.97);

INSERT INTO anorder VALUES(4,4,'20200311');
INSERT INTO ordershipping VALUES(4,'K2G3W1','some av',50);
INSERT INTO orderbilling VALUES(4,123456666666666);
INSERT INTO items VALUES(4,1111111111111,2);
INSERT INTO items VALUES(4,4444444444444,1);
INSERT INTO ordered VALUES(4,'test1',109.97);



--add orders
SELECT neworder('test',5,5,'K2J3R1','Ottawa','Ontario',40,'some st',2222444466667777,1122,111,81.98);
INSERT INTO items VALUES(5,5555555555555,1);
INSERT INTO items VALUES(5,4444444444444,1);

SELECT neworder('test',6,6,'K2J3R1','Ottawa','Ontario',40,'some st',2222444466667777,1122,111,39.98);
INSERT INTO items VALUES(6,1111111111111,2);


--add expenditures

INSERT INTO expenditure VALUES('Boxes',20.00);
INSERT INTO expenditure VALUES('Packaging',10.99);
INSERT INTO expenditure VALUES('Tape',2.99);

INSERT INTO extras VALUES('admin','Tape');






