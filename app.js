const mysql = require("mysql2")
const express = require("express")
const bodyparser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));

connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "mydbuser",
  database: "myDB",
  port: 3306,
});
connection.connect(function(err){
    if (err) throw err
    else console.log("connected");
})

// question 2

app.get("/install", (req,res)=>{
    let done = "table created"
    let sql1 = `CREATE TABLE IF NOT EXISTS Products(
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_url VARCHAR(255),
        product_name VARCHAR(255)
    );`;

    let sql2 = `CREATE TABLE IF NOT EXISTS ProductDescription(
        description_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        product_brief_description TEXT,
        product_description TEXT,
        product_img VARCHAR(255) ,
        product_link VARCHAR(255),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
    );`;

    let sql3 = `CREATE TABLE IF NOT EXISTS ProductPrice(
        price_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        starting_price VARCHAR(50),
        price_range VARCHAR(50),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
        );`;
    let sql4 = `CREATE TABLE IF NOT EXISTS User(
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        User_name VARCHAR(255),
        User_password VARCHAR(255)
    );`;
    let sql5 = `CREATE TABLE IF NOT EXISTS Orders(
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        user_id INT,
        FOREIGN KEY (product_id) REFERENCES Products(product_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
    );`;
    connection.query(sql1, function (err, result) {
      if(err) throw err;
      console.log("Table created 1");
    });
    connection.query(sql2, function (err, result) {
      if(err) throw err;
      console.log("Table created 2");
    });
    connection.query(sql3, function (err, result) {
      if(err) throw err;
      console.log("Table created 3");
    });
    connection.query(sql4, function (err, result) {
      if(err) throw err;
      console.log("Table created 4");
    });
    connection.query(sql5, function (err, result) {
      if(err) throw err;
      console.log("Table created 5");
    });
    res.end(done)
})


//question 3

app.post("/addiphones", (req, res) => {
  // console.log(bodyparser.json);
  let url = req.body.product_url;
  let img = req.body.img;
  let link = req.body.link;
  let name = req.body.product_name;
  let Brief = req.body.brief;
  let StartPrice = req.body.StartPrice;
  let PriceRange = req.body.priceRange;
  let Description = req.body.desc;

 

  console.log(req.body);
//   var url = req.body.product_url;
//   var product = req.body.product_name;
  let prd = `INSERT INTO Products (product_url, product_name)
VALUES (?,?);`;

connection.query(prd, [url, name], function (err, result) {
  if (err) throw err;
  console.log("inserted");
  var id = result.insertId;


  // if(Brief!=0 && Description!=0 && link!=0){
    let description = `INSERT INTO ProductDescription (product_id, product_brief_description,
        product_description , product_img , product_link)
VALUES (?,?,?,?,?);`;

    connection.query(
      description,
      [id, Brief, Description, img, link],
      function (err, result) {
        if (err) throw err;
        console.log("inserted desc table");
      }
    );
  // }
  let price_table = `INSERT INTO ProductPrice(product_id,starting_price,price_range)
  VALUES(?,?,?)`;
  connection.query(price_table,[id,StartPrice,PriceRange],(err,res)=>{
    if(err) throw err;
    console.log("inserted price table")
  })
});

})

// week 7 API integeration 
app.get("/iphones", (req,res)=>{
connection.query(
  "SELECT*FROM Products JOIN ProductDescription JOIN ProductPrice ON Products.product_id=ProductDescription.product_id AND Products.product_id = ProductPrice.product_id",(err,row,fields)=>{
    let iphones = {products: []};
    iphones.products = row
    // var stringIphones = JSON.stringify(iphones);
    res.send(iphones)

  }
)
  
})

        app.listen(4117,(err)=>{
            if(err) throw err;
            console.log("listening port 4117");
        })


       