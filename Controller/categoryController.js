import catagory from "../models/catagory.js";
import Category from "../models/catagory.js";


// Create new category (admin only)
export const createCategory = async (req, res) => {
  try {
    //check admin
    if (!req.user || !req.user.roles.includes("admin")) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { name, parent = null, image = null } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Generate base slug
    let baseSlug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique

    while (await Category.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = await Category.create({
      name,
      slug,
      parent,
      image,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res)=>{
    try{
        const categories = await Category.find({isActive:true}).populate('parent', 'name slug');
        res.status(200).json({
            success: true,
            data: categories
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get single category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).populate('parent', 'name slug');
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Update category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, parent, image } = req.body;

    // Find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Update category fields
    category.name = name || category.name;
    category.parent = parent || category.parent;
    category.image = image || category.image;

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    await category.remove();
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

