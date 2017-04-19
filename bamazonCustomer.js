//require all modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require('colors/safe');
require('console.table');

//make a couple color themes
colors.setTheme({
    divider: ['red', 'bgWhite', 'bold'],
    theme1:['yellow','bold'],
    theme2:['cyan','bold']
});


//initialize connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sean2806",
    database: "Bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    loadInventory();
    promptUser();
});

//function to list all products in DB
function loadInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
    	//push to results array, for console.table display
        var results = [];
        for (var i = 	0; i < res.length; i++) {
        	res[i].item_id = colors.inverse(res[i].item_id);
        	res[i].product_name = colors.inverse(res[i].product_name);
        	res[i].department_name = colors.inverse(res[i].department_name);
        	//todo: if statement to set stock_quantity color to red if inventory is 0
        	res[i].price = colors.divider("$")+colors.inverse(res[i].price);
        	res[i].stock_quantity = colors.inverse(res[i].stock_quantity);
           results.push(res[i]);
        }
        //display results array as a table
        console.table(colors.divider("Inventory"),results);
    });
}

//prompt for item number and quantity
function promptUser() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer.prompt([{
            type: "input",
            message: "Please enter the ID# of the product you would like to purchase:\n",
            name: "purchaseID",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
            }
        }, {
            type: "input",
            message: "Please enter the quantity you would like to purchase:\n",
            name: "purchaseQuantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
            }
        }]).then(function(data) {

            //find the product in the database by matching the ID
            connection.query("SELECT * FROM products WHERE ?", {
                item_id: data.purchaseID
            }, function(err, res) {
                if (err) throw err;
                if (data.purchaseQuantity > res[0].stock_quantity) {
                    console.log(colors.divider("Unfortunately we have " + res[0].stock_quantity + " units left in stock, please try again."));
                    promptUser();
                } else {
                    var totalSale = (data.purchaseQuantity * res[0].price);
                    var newQuantity = (res[0].stock_quantity - data.purchaseQuantity);

                    //if there are enough items available, update the database and show the user their total
                    connection.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: newQuantity
                        }, {
                            item_id: data.purchaseID
                        }],
                        function(err) {
                            if (err) throw err;
                            console.log(colors.theme2("Thank you for your purchase!"));
                            console.log(colors.theme2("Your Total is: ") + colors.theme1("$"+totalSale));

                            //prompt user to try again or exit
                            inquirer.prompt([{
                                type: "list",
                                message: "Would you like to see the update inventory or exit Bamazon?",
                                choices: ["Inventory", "Exit"],
                                name: "choice"
                            }]).then(function(data) {
                                if (data.choice === "Inventory") {
                                    loadInventory();
                                    promptUser();
                                } else {
                                    process.exit()
                                }
                            });
                        });

                }
            });

        });

    });
}
