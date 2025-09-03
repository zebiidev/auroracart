import Product from "../models/ProductModel.js";

export const GetAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().sort({ createdAt: -1 });

    if (!allProducts) {
      return res
        .status(400)
        .json({ message: "Unable to fetch products", success: false });
    }

    res.status(200).json({
      message: "All products fetched successfully",
      success: true,
      allProducts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const GetSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const singleProduct = await Product.findById(id);

    if (!singleProduct) {
      return res
        .status(400)
        .json({ message: "Product not found", success: false });
    }

    res
      .status(200)
      .json({ message: "Requested  Product", success: true, singleProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const SearchedProduct = async (req, res) => {
  try {
    const { name, material, category, brand } = req.query;

    let conditions = [];

    if (name) conditions.push({ name: { $regex: name, $options: "i" } });
    if (material)
      conditions.push({ material: { $regex: material, $options: "i" } });
    if (category)
      conditions.push({ category: { $regex: category, $options: "i" } });
    if (brand) conditions.push({ brand: { $regex: brand, $options: "i" } });

    if (conditions.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one search field",
        success: false,
      });
    }

    const searchedProduct = await Product.find({ $or: conditions });

    if (searchedProduct.length === 0) {
      return res
        .status(404)
        .json({ message: "Matching Products not found", success: false });
    }

    res.status(200).json({
      message: "Matching keywords products",
      success: true,
      searchedProduct,
      count: searchedProduct.length,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const GetFilteredProducts = async (req, res) => {
  try {
    const filters = req.query;

    const {
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      minPrice,
      maxPrice,
    } = filters;

    const andFilters = [];

    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      andFilters.push({
        category: { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) },
      });
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      andFilters.push({
        brand: { $in: brands.map((b) => new RegExp(`^${b}$`, "i")) },
      });
    }

    if (sizes) {
      const sizeArr = Array.isArray(sizes) ? sizes : [sizes];
      andFilters.push({
        sizes: { $in: sizeArr.map((s) => new RegExp(`^${s}$`, "i")) },
      });
    }

    if (colors) {
      const colorArr = Array.isArray(colors) ? colors : [colors];
      andFilters.push({
        colors: { $in: colorArr.map((c) => new RegExp(`^${c}$`, "i")) },
      });
    }

    if (collections) {
      const colArr = Array.isArray(collections) ? collections : [collections];
      andFilters.push({
        collections: { $in: colArr.map((c) => new RegExp(`^${c}$`, "i")) },
      });
    }

    if (material) {
      const matArr = Array.isArray(material) ? material : [material];
      andFilters.push({
        material: { $in: matArr.map((m) => new RegExp(`^${m}$`, "i")) },
      });
    }

    if (gender) {
      andFilters.push({ gender: new RegExp(`^${gender}$`, "i") });
    }

    const priceFilter = {};

    if (minPrice !== undefined && minPrice !== "" && !isNaN(minPrice)) {
      priceFilter.price = { ...priceFilter.price, $gte: Number(minPrice) };
    }

    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(maxPrice)) {
      priceFilter.price = { ...priceFilter.price, $lte: Number(maxPrice) };
    }

    if (Object.keys(priceFilter).length) {
      andFilters.push(priceFilter);
    }

    let query = {};
    if (andFilters.length) {
      query = { $and: andFilters };
    }

    const products = await Product.find(query).sort({ price: 1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
