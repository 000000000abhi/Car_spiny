// src/pages/CarDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CarDetailPage() {
  const [car, setCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCar(data);
      } else {
        setError('Failed to fetch car details');
      }
    } catch (err) {
      setError('An error occurred while fetching car details');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!car) return;

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car),
      });
      if (response.ok) {
        setIsEditing(false);
      } else {
        setError('Failed to update car');
      }
    } catch (err) {
      setError('An error occurred while updating car');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const response = await fetch(`/api/cars/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          navigate('/dashboard');
        } else {
          setError('Failed to delete car');
        }
      } catch (err) {
        setError('An error occurred while deleting car');
      }
    }
  };

  if (!car) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{car.title}</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={car.title}
                  onChange={(e) => setCar({ ...car, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={car.description}
                  onChange={(e) => setCar({ ...car, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label htmlFor="carType" className="text-sm font-medium text-gray-700 block mb-2">
                  Car Type
                </label>
                <input
                  type="text"
                  id="carType"
                  value={car.carType}
                  onChange={(e) => setCar({ ...car, carType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-medium text-gray-700 block mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={car.company}
                  onChange={(e) => setCar({ ...car, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="dealer" className="text-sm font-medium text-gray-700 block mb-2">
                  Dealer
                </label>
                <input
                  type="text"
                  id="dealer"
                  value={car.dealer}
                  onChange={(e) => setCar({ ...car, dealer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-6">
                <img src={car.images[0] || '/placeholder.svg'} alt={car.title} className="w-full h-64 object-cover rounded-lg" />
              </div>
              <p className="text-gray-600 mb-4">{car.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="font-semibold">Car Type:</span> {car.carType}
                </div>
                <div>
                  <span className="font-semibold">Company:</span> {car.company}
                </div>
                <div>
                  <span className="font-semibold">Dealer:</span> {car.dealer}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}