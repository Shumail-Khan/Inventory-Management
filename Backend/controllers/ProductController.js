import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
const getproducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }).populate('supplierId').populate('categoryId');
        const suppliers = await Supplier.find();
        const categories = await Category.find();
        return res.status(200).json({ message: 'Products fetched successfully', products, suppliers, categories });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const addproduct = async (req, res) => {
    try {
        const product = new Product(req.body);

        const existingProduct = await Product.findOne({ name: req.body.name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updateproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deleteproduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingproduct = await Product.findById(id);

        if (!existingproduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        if (existingproduct.isDeleted){
            return res.status(400).json({ message: 'Product already deleted' });
        }

        await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        return res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch(error){
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { getproducts, addproduct, updateproduct, deleteproduct };