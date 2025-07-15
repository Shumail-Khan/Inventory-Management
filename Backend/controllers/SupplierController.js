import Supplier from '../models/Supplier.js';

const addsupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);

        const existingSupplier = await Supplier.findOne({ name: req.body.name });
        if (existingSupplier) {
            return res.status(400).json({ message: 'Supplier already exists' });
        }

        await supplier.save();
        res.status(201).json({ message: 'Supplier added successfully', supplier });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getsuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        return res.status(200).json({ message: 'Categories fetched successfully', suppliers });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updatesupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, contact } = req.body;
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        // const existingSupplier = await Supplier.findOne({ name: req.body.name });
        // if (existingSupplier) {
        //     return res.status(400).json({ message: 'Supplier already exists' });
        // }
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, { name, email, address, contact }, { new: true });
        return res.status(200).json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
    }
    catch(error){
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deletesupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await Supplier.findByIdAndDelete(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        return res.status(200).json({ message: 'Supplier deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

export { addsupplier, getsuppliers, updatesupplier, deletesupplier };