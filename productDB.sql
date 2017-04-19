-- create Bamazon database
CREATE DATABASE Bamazon;

-- use the db
USE Bamazon;

-- create products table
CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(30),
department_name VARCHAR(30),
price INT,
stock_quantity INT,
PRIMARY KEY (item_id));

--  inserting dummy data
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("iPad", "Electronics", 100.00, 10),
	   ("Soccer Ball", "Sporting Goods", 20.00, 50),
       ("Coffee Pot", "Kitchen", 15.00, 3),
       ("T-Shirt", "Clothing", 19.00, 25),
       ("Shorts", "Clothing", 24.00, 15),
       ("Baseball Bat", "Sporting Goods", 10.00, 7),
       ("4K LED TV", "Electronics", 2000.00, 5),
       ("Drone", "Electronics", 500.00, 18),
       ("Toaster", "Kitchen", 50.00, 30),
       ("Shoes", "Clothing", 42.00, 22),
       ("Bicycle", "Sporting Goods", 150.00, 8)