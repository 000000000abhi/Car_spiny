import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CarDetailPage() {
  const [car, setCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCar(data);
      } else {
        setError('Failed to fetch car details');
      }
    } catch {
      setError('An error occurred while fetching car details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!car) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(car),
      });
      if (response.ok) {
        setIsEditing(false);
        setError('');
      } else {
        setError('Failed to update car');
      }
    } catch {
      setError('An error occurred while updating car');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          navigate('/dashboard');
        } else {
          setError('Failed to delete car');
        }
      } catch {
        setError('An error occurred while deleting car');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!car) return <div>No car found.</div>;

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
              {/* Form fields for editing */}
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
              {/* Other fields like description, carType, etc. */}
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
