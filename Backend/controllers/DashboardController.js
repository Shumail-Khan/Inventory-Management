import Product from "../models/Product.js";
import Order from "../models/Order.js";
const getData = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const stock = await Product.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stock" } } }]);
        const totalStock = stock[0]?.totalStock || 0;

        const startofDay = new Date();
        startofDay.setHours(0, 0, 0, 0);

        const endofDay = new Date();
        endofDay.setHours(23, 59, 59, 999);

        const ordersToday = await Order.countDocuments({ orderDate: { $gte: startofDay, $lte: endofDay } });

        const revenue = await Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$total_price" } } }]);
        const totalRevenue = revenue[0]?.totalRevenue || 0;

        const outofStock = await Product.find({ stock: 0 })
            .select("name stock")
            .populate('categoryId', 'categoryName')

        const highestSaleResult = await Order.aggregate(
            [
                { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
                { $sort: { totalQuantity: -1 } },
                { $limit: 1 },
                {
                    $lookup: { // Join with the Product collection
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $unwind: "$product" //Unwrap the Product document
                },
                {
                    $lookup:{
                        from:"categories",
                        localField:"product.categoryId",
                        foreignField:"_id",
                        as:"product.categoryId"
                    }
                },
                {
                    $unwind:"$product.categoryId"
                },
                {
                    $project: {
                        _id: 0,
                        name: "$product.name",
                        category: "$product.categoryId.categoryName",
                        totalQuantity: 1,  // Include the totalQuantity field Means True
                    }
                }
            ]);

            const highestSaleProduct = highestSaleResult[0] || {message: "No Sale Data found"};

            const lowStockResult = await Product.find({ stock: { $gt:0, $lt: 5 } })
            .select("name stock")
            .populate('categoryId', 'categoryName');

            const dashboardData = {
                totalProducts: totalProducts,
                totalStock: totalStock,
                ordersToday: ordersToday,
                revenue: totalRevenue,
                outOfStock: outofStock,
                highestSaleProduct: highestSaleProduct,
                lowStockProducts: lowStockResult
            }
            res.status(200).json({ message: "Dashboard Data Fetched Successfully", dashboardData });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { getData }