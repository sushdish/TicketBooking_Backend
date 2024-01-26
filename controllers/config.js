const Configuration = require("../models/config");

const { handleError, handleSuccess } = require("../utils/handleResponse");

exports.createConfig = (req, res) => {
    const config = new Configuration(req.body);
    config.save((err, config) => {
        if (err) return handleError(res, "Could not save configuration!", 400);
        res.json({ message: "Successfully created configuration", config });
        console.log(config, "1")
    });

    
};

exports.getAllConfig = (req, res) => {
    Configuration.find().exec((err, config) => {
        if (err) return handleError(res, "Could not get categories!", 400);
        res.json(config);
    });
};

exports.tripConfig = async (req, res) => {
    let pipeline = [
        {
            $project:{
              "Category": {
                $filter: {
                   input: "$tripConfig",
                   as: "item",
                   cond: { $eq: [ "$$item.categoryId", req.params.categoryId ] }
                  
                }
             }
            }
          },
          {
            '$unwind':{
             'path':'$Category'
           } 
         },
      //    {
      //     $lookup: {
      //         from: 'categories', 
      //         localField: 'Category.categoryId',
      //         foreignField: '_id',
      //         as: "categoryInfo"
      //     }
      // },
    ]


    const data = await Configuration.aggregate(pipeline)
    console.log(data, "54")
    res.json(data[0].Category)
}