const Cart = require("../models/Cart");
const Product = require("../models/Product");

const cartController = {
    getCart: async (req, res) => {
        try {
            const carts = await Cart.find();
            
            res.status(200).send({carts});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    addToCart: async (req, res) => {
        try {
            const newCartItem = new Cart(req.body);
            await newCartItem.save();
            
            res.status(200).send({ message: 'Add item to cart successfully.' });
        } catch (err) {
            res.status(500).send(err);
        }
    },
    deleteCartItem: async (req, res) => {
        try {
            const findCartItem = await Cart.findById(req.params.id);
            await findCartItem.deleteOne();
            
            res.status(200).send({ message: 'Delete item successfully.' });
        } catch (err) {
            res.status(500).send(err);
        } 
    }
    
}

module.exports = cartController;