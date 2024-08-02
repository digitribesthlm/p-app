import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import ThemeSelector from '../components/ThemeSelector';

const Settings = () => {
  const [hcp, setHcp] = useState('');
  const [homeCourse, setHomeCourse] = useState('');
  const [unit, setUnit] = useState('meters');
  const [status, setStatus] = useState('active');
  const [gender, setGender] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to an API or update state
    console.log({ hcp, homeCourse, unit, status, gender });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>
        <ThemeSelector />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Handicap</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={hcp}
              onChange={(e) => setHcp(e.target.value)}
              placeholder="Enter your handicap"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Home Courses!</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={homeCourse}
              onChange={(e) => setHomeCourse(e.target.value)}
              placeholder="Enter your home course"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Preferred Unit</label>
            <select
              className="select select-bordered w-full"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="meters">Meters</option>
              <option value="feet">Feet</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              className="select select-bordered w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-full">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
