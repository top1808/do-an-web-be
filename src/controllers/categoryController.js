const Category = require("../db/models/Category");

const categoryController = {
    //getAll
    getAll: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).send({categories});
        } catch (err) {
            res.status(500).send(err);
        }
    },
    //delete
    delete: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            category.deleteOne();
            res.status(200).send({message: "Delete category successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
     //create
     create: async (req, res) => {
        try {
            const newCategory = new Category(req.body)
            await newCategory.save();

            res.status(200).send({ message: "Create category successfully."});
        } catch (err) {
            res.status(500).send(err);
        }
    },
}

module.exports = categoryController;