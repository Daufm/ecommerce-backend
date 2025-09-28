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



   
