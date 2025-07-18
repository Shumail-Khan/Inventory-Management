import express from "express"
import cors from "cors"
import connectDB from "./Config/db.js";
import authRoutes from "./routes/Auth.js";
import categoryRoutes from "./routes/Category.js";
import supplierRoutes from "./routes/Supplier.js";
import productRoutes from "./routes/Product.js";
import userRoutes from "./routes/User.js";
import orderRoutes from "./routes/Order.js";
import dashboardRoutes from "./routes/Dashboard.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/product', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})