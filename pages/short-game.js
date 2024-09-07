import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { saveShortGameData } from '../lib/mongodb';

const ShortGamePage = () => {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [holeScores, setHoleScores] = useState({});

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleScoreChange = (hole, score) => {
    setHoleScores((prevScores) => ({
      ...prevScores,
      [hole]: score,
    }));
  };

  const handleSaveRound = async () => {
    const roundData = {
      course: selectedCourse,
      scores: holeScores,
    };

    try {
      await saveShortGameData(roundData);
      alert('Round saved successfully!');
      setSelectedCourse('');
      setHoleScores({});
    } catch (error) {
      console.error('Error saving round:', error);
      alert('An error occurred while saving the round.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Short Game Tracker</h1>
      <div className="mb-4">
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">
          Select Course:
        </label>
        <select
          id="course"
          name="course"
          value={selectedCourse}
          onChange={handleCourseChange}
          className="select select-bordered w-full"
        >
          <option value="">Select Course</option>
          <option value="Course 1">Course 1</option>
          <option value="Course 2">Course 2</option>
          <option value="Course 3">Course 3</option>
        </select>
      </div>
      {selectedCourse && (
        <div>
          <h2 className="text-xl font-bold mb-2">Hole Scores</h2>
          {[...Array(18)].map((_, index) => (
            <div key={index} className="mb-2">
              <label htmlFor={`hole-${index + 1}`} className="block text-sm font-medium text-gray-700">
                Hole {index + 1}:
              </label>
              <select
                id={`hole-${index + 1}`}
                name={`hole-${index + 1}`}
                value={holeScores[index + 1] || ''}
                onChange={(e) => handleScoreChange(index + 1, e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select Score</option>
                <option value="Birdie">Birdie</option>
                <option value="Par">Par</option>
                <option value="Bogey">Bogey</option>
                <option value="Double Bogey">Double Bogey</option>
                <option value="Triple Bogey">Triple Bogey</option>
              </select>
            </div>
          ))}
          <button onClick={handleSaveRound} className="btn btn-primary">
            Save Round
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortGamePage;
