import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Inventory from "../models/Inventory.js";

// Browse all products with category, inventory details, filters, and sorting
export const browseProducts = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const { category_id, genre, price_min, price_max, sort_by, order } =
      req.query;

    // Build filter object
    const filter = { is_active: true }; // only active products

    // Filter by category ID
    if (category_id) filter.category_id = category_id;

    // Filter by price range
    if (price_min || price_max) {
      filter.unit_price = {};
      if (price_min) filter.unit_price.$gte = Number(price_min);
      if (price_max) filter.unit_price.$lte = Number(price_max);
    }

    // Start query with filter and populate category details
    let query = Product.find(filter)
      .populate("category_id", "category_name genre")
      .lean();

    // Filter by genre if provided
    if (genre) {
      query = query.where("category_id.genre").equals(genre);
    }

    // Apply sorting if specified
    if (sort_by) {
      const sortOrder = order === "desc" ? -1 : 1;
      query = query.sort({ [sort_by]: sortOrder });
    }

    // Fetch products from database
    const products = await query;

    // Fetch inventory details for each product
    const productsWithInventory = await Promise.all(
      products.map(async (product) => {
        const inventory = await Inventory.findOne({
          product_id: product._id,
        }).lean();
        return {
          ...product,
          inventory: inventory || {
            stock_quantity: 0,
            reorder_level: 0,
            max_stock_level: 0,
          },
        };
      })
    );

    // Return products with inventory info
    res.status(200).json(productsWithInventory);
  } catch (error) {
    console.error("Error browsing products:", error);
    res.status(500).json({ message: "Server error." });
  }
};

//View single product details by ID
export const viewProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    //validate product ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    //Fetch product and populate category and supplier details
    const product = await Product.findById(productId)
      .populate("category_id", "category_name genre")
      .populate(
        "supplier_id",
        "supplier_name contact_person email phone address is_active"
      )
      .lean();

    //If product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    //Fetch inventory details
    const inventory = await Inventory.findOne({
      product_id: product._id,
    }).lean();

    //Combine product with inventory info
    const productDetails = {
      ...product,
      inventory: inventory || {
        stock_quantity: 0,
        reorder_level: 0,
        max_stock_level: 0,
      },
    };

    //Return product details
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error viewing product details:", error);
    res.status(500).json({ message: "Server error." });
  }
};
