const { Category } = require("../models");

exports.read = async (req, res) => {
try {
    const categories = await Category.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    });

    
    res.send({ data: categories });
} catch (error) {
    console.log(error);
}
}; 

exports.create = async (req, res) => {
try {
    const categories = await Category.create(req.body);

    const { id, name } = categories;
    res.send({
        data: {
            id,
            name
        },
    });
} catch (error) {
    console.log(error);
}
};

// Find Category
exports.readOne = async (req, res) => {
try {
    const { idCategory } = req.params;
    const userX = await Category.findOne({
        where: {
            id: idCategory
        }, 
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    });
    

    res.send({ data: userX });
} catch (error) {
    console.log(error);
}
};

// DELETE Category
exports.delete = async (req, res) => {
try {
    const { idCategory } = req.params;

    const userX = await Category.findOne({
        where: {
            id: idCategory
        }, 
        attributes: {
            exclude: ["createdAt", "updatedAt", "name"]
        }
    });
    
    const category = await Category.destroy({
        where: {
            id: idCategory
        }
    });

    res.send({ data: userX });
} catch (error){
        console.log(error);
    }
};

// PATCH or Update Category
exports.updateOne = async (req, res) => {
    try {
        const { idCategory } = req.params;
        const userX = await Category.findOne({
            where: {
                id: idCategory
            }, 
            attributes: {
                exclude: ["createdAt","updatedAt"]
            }
        });

        userX.name = req.body.name;
        await userX.save();
        
        res.send({ data: userX });
    } catch (error) {
        console.log(error);
    }
    };

