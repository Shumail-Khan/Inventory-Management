import express from "express"
import cors from "cors"
import connectDB from "./Config/db.js";
import authRoutes from "./routes/Auth.js";
import categoryRoutes from "./routes/Category.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);


app.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})