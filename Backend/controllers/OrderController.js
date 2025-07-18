import Order from "../models/Order.js";
import Product from "../models/Product.js";

const addOrder = async (req, res) => {
    try {
        const {productId, quantity, total} = req.body;
        const userId = req.user._id;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if(product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        else{
            product.stock -= quantity;
            await product.save();
        }

        const order = new Order({
            customer: userId,
            product: productId,
            quantity,
            total_price: total
        });
        order.save();
        res.status(201).json({ message: 'Order added successfully', order });
        fetchProducts();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        let query = {};
        if(req.user.role == 'customer'){
            query = {customer: userId};
        }
        const orders = await Order.find(query)
        .populate(
            {
                path:'product', 
                populate:
                {
                    path:'categoryId',
                    select:'categoryName'
                }, select: 'name price'}).populate('customer', 'username email')
        res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { addOrder, getOrders };