import Category from '../models/Category.js'
import Product from '../models/Product.js'

const addcategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ categoryName, categoryDescription });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getcategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ message: 'Categories fetched successfully', categories: categories });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updatecategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription } = req.body;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { categoryName, categoryDescription }, { new: true });

        return res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deletecategory = async (req, res) => {
    try {
        const { id } = req.params;
        const productCount = await Product.countDocuments({ categoryId: id });

        if(productCount > 0){
            return res.status(400).json({ message: 'Cannot delete category with associated products' });
        }

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { addcategory, getcategories, updatecategory, deletecategory}