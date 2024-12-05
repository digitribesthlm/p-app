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
            <div className="flex space-x-2">
              <button
                className={`btn ${unit === 'meters' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUnit('meters')}
              >
                Meters
              </button>
              <button
                className={`btn ${unit === 'feet' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUnit('feet')}
              >
                Feet
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <div className="flex space-x-2">
              <button
                className={`btn ${status === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatus('active')}
              >
                Active
              </button>
              <button
                className={`btn ${status === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatus('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <div className="flex space-x-2">
              <button
                className={`btn ${gender === 'male' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGender('male')}
              >
                Male
              </button>
              <button
                className={`btn ${gender === 'female' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGender('female')}
              >
                Female
              </button>
              <button
                className={`btn ${gender === 'other' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGender('other')}
              >
                Other
              </button>
              <button
                className={`btn ${gender === 'prefer_not_to_say' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGender('prefer_not_to_say')}
              >
                Prefer not to say
              </button>
            </div>
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
