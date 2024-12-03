const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);
const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    sold: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteBy: {
        account_id: String,
        deleteAt: Date
    }
    ,
    updateBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
}, {
    timestamps: true
});
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;