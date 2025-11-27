import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 9;

// Price slider component
const PriceRangeSlider = ({ min, max, onChange, initialMin, initialMax }) => {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);

  useEffect(() => {
    setMinVal(initialMin);
    setMaxVal(initialMax);
  }, [initialMin, initialMax]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - 1);
    setMinVal(value);
    onChange({ min: value, max: maxVal });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + 1);
    setMaxVal(value);
    onChange({ min: minVal, max: value });
  };

  return (
    <div className="relative w-full group hover:scale-[1.02] transition-transform duration-200">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinChange}
        className="absolute w-full h-2 bg-transparent appearance-none z-10"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxChange}
        className="absolute w-full h-2 bg-transparent appearance-none z-20"
      />
      <div className="relative h-2">
        <div className="absolute w-full h-2 bg-[#E0E0E0] rounded-md"></div>
        <div
          className="absolute h-2 bg-[#0F1E3D] rounded-md transition-all duration-300"
          style={{
            left: `${(minVal / max) * 100}%`,
            right: `${100 - (maxVal / max) * 100}%`,
          }}
        ></div>
        <div
          className="absolute w-4 h-4 -mt-1 bg-white border-2 border-[#0F1E3D] rounded-full cursor-pointer transition-transform duration-200 group-hover:scale-125"
          style={{ left: `calc(${(minVal / max) * 100}% - 8px)` }}
        ></div>
        <div
          className="absolute w-4 h-4 -mt-1 bg-white border-2 border-[#0F1E3D] rounded-full cursor-pointer transition-transform duration-200 group-hover:scale-125"
          style={{ left: `calc(${(maxVal / max) * 100}% - 8px)` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-[#4A4A4A]">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>
    </div>
  );
};

const BrowseBooksPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState("product_name");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [genres, setGenres] = useState([]);
  const [allCategories, setAllCategories] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Debounce price range
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedPriceRange(priceRange), 300);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Fetch genres and categories
  useEffect(() => {
    const fetchGenresAndCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/categories/by-genre"
        );
        if (res.data.success) {
          setAllCategories(res.data.genres);
          setGenres(Object.keys(res.data.genres));
        }
      } catch (err) {
        console.error("Error fetching genres and categories", err);
      }
    };
    fetchGenresAndCategories();
  }, []);

  // Update categories when genre changes
  useEffect(() => {
    if (selectedGenre && allCategories[selectedGenre]) {
      setCategories(allCategories[selectedGenre]);
    } else {
      setCategories([]);
    }
    setSelectedCategories([]);
  }, [selectedGenre, allCategories]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearchQuery || undefined,
        genre: selectedGenre || undefined,
        category_id: selectedCategories.join(",") || undefined,
        price_min: debouncedPriceRange.min,
        price_max: debouncedPriceRange.max,
        sort_by: sortBy,
        order,
      };
      const res = await axios.get("http://localhost:5000/api/products", {
        params,
      });
      setProducts(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  }, [
    sortBy,
    order,
    debouncedSearchQuery,
    selectedGenre,
    selectedCategories,
    debouncedPriceRange,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#0F1E3D]">Browse Books</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#0F1E3D]">Filters</h2>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("");
                  setSelectedCategories([]);
                  setPriceRange({ min: 0, max: 500 });
                }}
                className="text-sm text-[#4A90E2] hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Genre */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] hover:border-[#0F3B60] transition-colors"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Category
                </label>
                <div className="max-h-40 overflow-y-auto border border-[#E0E0E0] rounded-lg p-2 hover:shadow-inner transition-shadow duration-300 hover:scale-[1.02]">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={c.id}
                        value={c.id}
                        checked={selectedCategories.includes(c.id)}
                        onChange={() => handleCategoryChange(c.id)}
                        className="h-4 w-4 text-[#0F1E3D] focus:ring-[#0F3B60] border-gray-300 rounded"
                      />
                      <label
                        htmlFor={c.id}
                        className="ml-2 text-sm text-[#4A4A4A]"
                      >
                        {c.category_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Price Range
              </label>
              <PriceRangeSlider
                min={0}
                max={500}
                initialMin={priceRange.min}
                initialMax={priceRange.max}
                onChange={setPriceRange}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center w-full sm:w-1/2">
              <Search className="w-5 h-5 text-[#4A4A4A] mr-2" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] hover:border-[#0F3B60] transition-colors"
              />
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] hover:border-[#0F3B60] transition-colors"
              >
                <option value="product_name">Name</option>
                <option value="unit_price">Price</option>
                <option value="publication_year">Year</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1E3D] hover:border-[#0F3B60] transition-colors"
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center mt-12">
              <Loader className="animate-spin w-8 h-8 text-[#0F1E3D]" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <img
                      src={`http://localhost:5000/public/images/${product.image_url
                        .split("/")
                        .pop()}`}
                      alt={product.product_name}
                      className="w-full h-48 object-cover rounded-md mb-3 bg-[#F5F7FA]"
                    />
                    <h2 className="font-semibold text-lg text-[#0F1E3D] mb-1 truncate">
                      {product.product_name}
                    </h2>
                    <p className="text-[#4A4A4A] text-sm mb-2">
                      {product.author}
                    </p>
                    <p className="text-[#4A90E2] font-bold mb-2">
                      ${product.unit_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-[#0F1E3D] text-white rounded-lg disabled:opacity-50 hover:bg-[#0F3B60]"
                  >
                    <ChevronLeft />
                  </button>
                  <span className="font-medium text-[#4A4A4A]">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-[#0F1E3D] text-white rounded-lg disabled:opacity-50 hover:bg-[#0F3B60]"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseBooksPage;
