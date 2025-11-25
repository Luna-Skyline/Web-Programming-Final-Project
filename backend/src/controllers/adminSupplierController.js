import Supplier from "../models/Supplier.js";

// Admin: Create a new supplier
export const createSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_person, email, phone, addres } = req.body;

    const newSupplier = await Supplier.create({
      supplier_name,
      contact_person,
      email,
      phone,
      addres,
      is_active: true,
    });

    res
      .status(201)
      .json({
        message: "Supplier created successfully",
        supplier: newSupplier,
      });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ created_at: -1 }).lean();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Update supplier by ID
export const updateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const updates = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      updates,
      { new: true }
    );
    if (!updatedSupplier)
      return res.status(404).json({ message: "Supplier not found" });

    res
      .status(200)
      .json({
        message: "Supplier updated successfully",
        supplier: updatedSupplier,
      });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete supplier by ID
export const deleteSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;

    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);
    if (!deletedSupplier)
      return res.status(404).json({ message: "Supplier not found" });

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
};
