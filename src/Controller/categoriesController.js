const dbHandler = require('../DbHandler/DbHandler')
const removeFromSpaces = require('../Services/s3Services')
const addCategory = async (req, res) => {
    const { category_name } = req.body;
    const { location: banner } = req.file;
    if (!category_name) {
        return res.status(400).json({ message: "category name is required!!" })
    }

    try {
        const response = await dbHandler.createCategories(category_name, banner);
        if (response === "success") {
            return res.status(200).json({ message: response })
        } else {
            return res.status(500).json({ message: response })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

const addProductCategory = async (req, res) => {
    const { category_name, category_description } = req.body;
    const { location: banner } = req.file;
    if (!category_name) {
        return res.status(400).json({ message: "category name is required!!" })
    }

    try {
        const response = await dbHandler.createProductCategories(category_name, category_description, banner);
        if (response === "success") {
            return res.status(200).json({ message: response })
        } else {
            return res.status(500).json({ message: response })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await dbHandler.getCategories();
        if (categories.length === 0) {
            return res.status(400).json([])
        } else {
            return res.status(200).json(categories)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}
const getAllProductCategories = async (req, res) => {
    try {
        const categories = await dbHandler.getProductCategories();
        if (categories.length === 0) {
            return res.status(400).json([])
        } else {
            return res.status(200).json(categories)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

//delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch all categories
        const categories = await dbHandler.getCategories();
       

        // Find the category to delete by its ID
        const category = categories.find(cat => cat.category_id === Number(id));
        

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If the category has a banner, attempt to delete it from cloud storage
        if (category.banner) {
            const key = category.banner.split('/').pop();
            try {
                const response = await removeFromSpaces(key);
               
            } catch (error) {
               
                return res.status(500).json({ message: 'Error deleting banner', error });
            }
        }

        // Proceed to delete the category from the database
        await dbHandler.deleteCategory(id);
        return res.status(200).json("Category deleted successfully");

    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json(error);
    }
};


const deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch categories and find the one to delete
        const categories = await dbHandler.getProductCategories();
        const category = categories.find(cat => cat.category_id === Number(id));

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If the category has a banner, attempt to delete it from cloud storage
        if (category.banner) {
            const key = category.banner.split('/').pop();
            try {
                const response = await removeFromSpaces(key);
             
            } catch (error) {
                console.error(`Error deleting old banner ${key}:`, error);
                return res.status(500).json({ message: 'Error deleting banner', error });
            }
        }

        // Proceed to delete the category from the database
        await dbHandler.deleteProductCategory(id);
        return res.status(200).json("Category deleted successfully");
        
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json(error);
    }
};



const addServiceCategory = async (req, res) => {
    const { category_name, category_description } = req.body;
    const { location: banner } = req.file;
    if (!category_name) {
        return res.status(400).json({ message: "category name is required!!" })
    }

    try {
        const response = await dbHandler.createServiceCategories(category_name, category_description, banner);
        if (response === "success") {
            return res.status(200).json({ message: response })
        } else {
            return res.status(500).json({ message: response })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}


const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch service categories and find the one to delete
        const categories = await dbHandler.getServiceCategories();
        const category = categories.find(cat => cat.category_id === Number(id));

        if (!category) {
            return res.status(404).json({ message: 'Service category not found' });
        }

        // If the category has a banner, attempt to delete it from cloud storage
        if (category.banner) {
            const key = category.banner.split('/').pop();
            try {
                const response = await removeFromSpaces(key);
              
            } catch (error) {
            
                return res.status(500).json({ message: 'Error deleting banner', error });
            }
        }

        // Proceed to delete the service category from the database
        await dbHandler.deleteServiceCategory(id);
        return res.status(200).json("Service category deleted successfully");

    } catch (error) {
        console.error('Error deleting service category:', error);
        return res.status(500).json(error);
    }
};


const getAllServiceCategories = async (req, res) => {
    try {
        const categories = await dbHandler.getServiceCategories();
        if (categories.length === 0) {
            return res.status(400).json([])
        } else {
            return res.status(200).json(categories)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}
module.exports = {
    addCategory,
    getAllCategories,
    deleteCategory,
    addProductCategory,
    getAllProductCategories,
    deleteProductCategory,
    addServiceCategory,
    getAllServiceCategories,
    deleteServiceCategory
}