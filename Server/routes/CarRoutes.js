const express = require("express");
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  //searchCars
} = require("../controller/carcontroller");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", createCar);

// Route to get all cars for a user
router.get("/", getCars);

// Route to search for cars based on a keyword
//router.get("/search", auth, searchCars);

// Route to get a specific car by its ID
router.get("/:id", auth, getCarById);

// Route to update a car by its ID with image upload (uses multer middleware in the controller)
router.put("/:id", auth, updateCar);

// Route to delete a car by its ID
router.delete("/:id", auth, deleteCar);

module.exports = router;
