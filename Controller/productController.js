import Product from '../models/Products.js'



export const createProduct = async (req, res) => {
   
    // Generate base slug from product name
    let baseSlug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Check if slug already exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await Product.findOne({ slug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    

  try {
    const {
      name,
      description,
      variants = [],
      price,
      brand,
      category,
      stock,
      images = []
    } = req.body;

    // Basic validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Name, description, price, and category are required." });
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      price,
      brand: brand || "",
      category,
      stock: stock || 0,
      images: images || [],
      variants: variants || []
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// Get all products with search, filters, pagination, sorting
export const getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    // Convert to numbers & sanitize
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);
    minPrice = minPrice ? Number(minPrice) : null;
    maxPrice = maxPrice ? Number(maxPrice) : null;

    // Build query
    const query = { isActive: true };

    // Search by name/description
    if (search) {
      // If MongoDB has a text index, use $text
      query.$or = [
        { name: { $text: { $search: search } } },
        { description: { $text: { $search: search } } },
        { brand: { $text: { $search: search } } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }

    // Sorting
    const sort = { [sortBy]: order === "desc" ? -1 : 1 };

    // Fetch products
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    // Count total
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

   
