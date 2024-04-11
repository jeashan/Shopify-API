const express = require('express');
const app = express();
const Shopify = require('shopify-api-node');
require('dotenv').config();

const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    accessToken: process.env.ACCESS_TOKEN
});

app.get('/', function (req, res) {
    res.send('shopify app is running...');
});

// View all products
app.get('/products', async (req, res) => {
    try {
        const products = await shopify.product.list({ limit: 5 });
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

//  Add single product
app.get('/Addproducts', async (req, res) => {
    shopify.product
        .create({
            title: 'warehouse',
            body_html: 'this is warehouse',
            vendor: "test 1",
            product_type: 'warehouse test 1',
            status: "draft",
            tags: "hose, warehouse",
            images: [
                {
                    src: "https://fliteboard.com/cdn/shop/files/24LandingHero_CON-UL-MB-CW-B82-PG-CW11_1024x.png?v=18335359375742845438"
                },
                {
                    src: 'https://fliteboard.com/cdn/shop/files/24LandingHero_CON-FA-YZ-ST-B75-PG-CW11_1024x.png?v=98144519174611563'
                }
            ]

        })
        .then(
            (product) => res.send(product),
            (err) => console.error(err)
        );
});

//Fetch Products from External API
async function getProducts(){
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json()
    return data

}
app.get('/add-products-external', async (req, res) => {
     
    const  products = await getProducts()
    products.forEach(product => {
         shopify.product
         .create({
            title: product.title,
            body_html: product.description,
            variants:[{
                price:product.price
            }],
            images:[
                {
                    src:product.image
                }
            ],
            tags:"",
            status: "active",
         }) 
         .then((product) =>  console.log(product))
         .catch((err) => console.error(err))
            
    });
});

//Update single Product
app.get('/update', async (req, res) => {
    shopify.product
        .update(9210771439900, {
            title: "new prodcut title",
            status: "draft"

        })
        .then(product => res.send(product))
        .catch((err) => console.error(err))

});

app.listen(5000);
