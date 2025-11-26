import Category from "../models/Category.js";

// Get all categories grouped by genre
export const getCategoriesByGenre = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true }).lean();

    const grouped = categories.reduce((acc, cat) => {
      const genre = cat.genre;
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push({
        id: cat._id,
        category_name: cat.category_name,
        description: cat.description,
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      genres: grouped,
    });
  } catch (error) {
    console.error("Error fetching categories by genre:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
