const db = require("../config/database");
const Product = require("../models/Product");
const { stringToSlug } = require("../utils/functionHelper");


db.once("open", async () => {
    console.log('Updating product slugs...');
    try {
        const products = await Product.find({});
        for (let product of products) {
          const newSlug = stringToSlug(product.name);
          await Product.updateOne({ _id: product._id }, { $set: { slug: newSlug } });
        }
        console.log('Product slugs updated successfully');
      } catch (error) {
        console.error('Error updating product slugs:', error);
      } finally {
        db.close();
      }
})