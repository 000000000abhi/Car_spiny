const Car = require("../model/Car");
const multer = require("multer");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Error: Only images are allowed (jpeg, jpg, png, gif)"));
    }
  },
}).array("images", 10);

const convertToBase64 = (buffer) => buffer.toString("base64");

exports.createCar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err && err.code !== 'LIMIT_FILE_SIZE') return res.status(400).json({ message: err.message });

    const { title, description, carType, company, dealer } = req.body;
    const images = req.files
      ? req.files.map((file) => ({
          contentType: file.mimetype,
          data: convertToBase64(file.buffer),
        }))
      : [];

    try {
      const car = new Car({
        userId: req.user.id,
        title,
        description,
        carType,
        company,
        dealer,
        images,
      });
      await car.save();
      res.status(201).json({ message: "Car created successfully", car });
    } catch (error) {
      res.status(500).json({ message: "Error creating car", error: error.message });
    }
  });
};

exports.updateCar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err && err.code !== 'LIMIT_FILE_SIZE') return res.status(400).json({ message: err.message });

    const { title, description, carType, company, dealer } = req.body;
    const images = req.files
      ? req.files.map((file) => ({
          contentType: file.mimetype,
          data: convertToBase64(file.buffer),
        }))
      : [];

    try {
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(carType && { carType }),
        ...(company && { company }),
        ...(dealer && { dealer }),
        ...(images.length > 0 && { images }),
      };

      const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!car) return res.status(404).json({ message: "Car not found" });
      res.json({ message: "Car updated successfully", car });
    } catch (error) {
      res.status(500).json({ message: "Error updating car", error: error.message });
    }
  });
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user.id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cars", error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving car", error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error: error.message });
  }
};
