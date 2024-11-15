// src/pages/DashboardPage.js
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch } from 'react-icons/fa';

export default function DashboardPage() {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/cars", {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      } else {
        setError('Failed to fetch cars');
      }
    } catch (err) {
      setError('An error occurred while fetching cars');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  const filteredCars = cars
    .filter((car) => {
      const searchMatch = searchTerm
        ? car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.carType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.dealer.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const filterMatch = filterOption ? car.carType === filterOption : true;
      return searchMatch && filterMatch;
    })
    .sort((a, b) => {
      if (sortOption === 'company') return a.company.localeCompare(b.company);
      if (sortOption === 'carType') return a.carType.localeCompare(b.carType);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">CarHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="px-3 py-2 rounded-md bg-white border border-gray-300"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="company">Company</option>
                <option value="carType">Car Type</option>
              </select>
              <select
                className="px-3 py-2 rounded-md bg-white border border-gray-300"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="">Filter by Car Type</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
              </select>
              <Link
                to="/add-car"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add New Car
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Cars</h2>
          <div className="mb-6 flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white overflow-hidden shadow rounded-lg relative"
                >
                  <button
                    onClick={() => toggleFavorite(car._id)}
                    className={`absolute top-4 right-4 p-2 rounded-full ${
                      favorites.has(car._id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <Swiper className="w-full h-48">
                    {car.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image || '/placeholder.svg'}
                          alt={car.title}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{car.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {car.description.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{car.company}</span>
                      <Link
                        to={`/cars/${car._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
