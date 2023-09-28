const Category = require("../db/models/Category");
const Product = require("../db/models/Product");

const productController = {
    //getAll
    getAll: async ( req, res, next) => {
        try {
            const products = await Product.find();
            res.status(200).send({products});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    //delete
    delete: async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id);
            for (let i = 0; i < product.category_ids.length; i++) {
                let category = await Category.findById(product.category_ids[i]);
                category.products.filter((item) => item !== product._id);
                category.save();
            }
            product.deleteOne();
            res.status(200).send({message: "Delete product successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
     //create
     create: async (req, res) => {
        try {
            console.log(req.body);
            const newProduct = new Product(req.body)
            await newProduct.save();

            for (let i = 0; i < newProduct.category_ids.length; i++) {
                let category = await Category.findById(newProduct.category_ids[i]);
                category.products.push(newProduct);
                category.save();
            }

            res.status(200).send({ message: "Create product successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
}

module.exports = productController;