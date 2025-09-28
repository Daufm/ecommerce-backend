import Product from '../models/Products.js'


// Create new product (admin only)
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

   
// Get single product by  slug
export const getProductBySlug = async (req,res)=>{
    try{
        const {slug} = req.params
        const product = await Product.findOne({slug:slug, isActive:true})
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        res.status(200).json({product})
    }catch(error){
        console.error("Get Product By Slug Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update product by slug
export const updateProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;
    if (updates.name) {
      // Generate new slug if name is updated
      let baseSlug = updates.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      let slug = baseSlug;
      let counter = 1;

      while (await Product.findOne({ slug: slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      updates.slug = slug;
    }

    const updatedProduct = await Product.findOneAndUpdate({ slug }, updates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete product by slug (soft delete by setting isActive to false)
export const deleteProduct = async (req ,res)=>{
  try{
    const {slug} = req.params
    const deletedProduct = await Product.findOneAndUpdate({slug}, {isActive:false}, {new:true})
     
    if(!deletedProduct){
      return res.status(400).json({message:"Product not found"})
    }

    res.status(200).json(
      {message:"Product deleted successfully",
        product: deletedProduct
      }
    )
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
       

// Add product review
export const addProductReview = async (req, res) => {
  try{
    const { slug } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.length < 3) {
      return res.status(400).json({ message: "Comment is too short." });
    }

     const product = await Product.findOne({slug, isActive:true});
      if(!product){
          return res.status(404).json({message:"Product not found"});
      }
    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(r=> r.user.toString()=== userId);

    if(alreadyReviewed){
        return res.status(400).json({message:"Product already reviewed"});
    }

    product.reviews.push({ user: userId, rating, comment });
    product.reviewsCount = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  }catch(error){
      console.error("Add Product Review Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

// Get product reviews
export  const  getProductReviews = async (req, res)=>{
  try{
    const {slug} = req.params
    //populate to get user name from user id
    const product = await Product.findOne({slug, isActive:true}).populate("reviews.user", "name");
    if(!product){
      return res.status(404).json({message:"Product not found"});
    }
    res.status(200).json({reviews: product.reviews});
  }catch(error){
    console.error("Get Product Reviews Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}