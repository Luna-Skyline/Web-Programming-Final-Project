import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Inventory from "../models/Inventory.js";

// Browse all products with category, inventory details, filters, and sorting
export const browseProducts = async (req, res) => {
  try {
    // Get query parameters for filtering and sorting
    const {
      category_id,
      genre,
      price_min,
      price_max,
      sort_by,
      order,
      search,
      limit,
    } = req.query;

    // Build filter object
    const filter = { is_active: true };

    // Handle search
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { product_name: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
      ];
    }

    // Handle category and genre filtering
    let categoryIds = [];
    if (genre) {
      const categoriesInGenre = await Category.find({
        genre: genre,
        is_active: true,
      }).select("_id");
      categoryIds = categoriesInGenre.map((cat) => cat._id);
    }

    if (category_id) {
      const selectedCategoryIds = category_id.split(",");
      if (categoryIds.length > 0) {
        // Intersect with genre-filtered categories
        const genreCategoryIdsSet = new Set(
          categoryIds.map((id) => id.toString())
        );
        const finalCategoryIds = selectedCategoryIds.filter((id) =>
          genreCategoryIdsSet.has(id)
        );
        if (finalCategoryIds.length > 0) {
          filter.category_id = { $in: finalCategoryIds };
        } else {
          // If no intersection, return no products
          return res.status(200).json([]);
        }
      } else {
        filter.category_id = { $in: selectedCategoryIds };
      }
    } else if (genre && categoryIds.length > 0) {
      filter.category_id = { $in: categoryIds };
    }

    // Filter by price range
    if (price_min || price_max) {
      filter.unit_price = {};
      if (price_min) filter.unit_price.$gte = Number(price_min);
      if (price_max) filter.unit_price.$lte = Number(price_max);
    }

    // Start query with filter
    let query = Product.find(filter);

    // Apply sorting if specified
    if (sort_by) {
      const sortOrder = order === "desc" ? -1 : 1;
      query = query.sort({ [sort_by]: sortOrder });
    }

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }
    
    // Populate category details
    query = query.populate("category_id", "category_name genre").lean();


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

// View single product details by ID
export const viewProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate product ID
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // Fetch product and populate category and supplier details
    const product = await Product.findById(productId)
      .populate("category_id", "category_name genre")
      .populate(
        "supplier_id",
        "supplier_name contact_person email phone address is_active"
      )
      .lean();

    // If product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Fetch inventory details
    const inventory = await Inventory.findOne({
      product_id: product._id,
    }).lean();

    // Combine product with inventory info
    const productDetails = {
      ...product,
      inventory: inventory || {
        stock_quantity: 0,
        reorder_level: 0,
        max_stock_level: 0,
      },
    };

    // Return product details
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error viewing product details:", error);
    res.status(500).json({ message: "Server error." });
  }
};
