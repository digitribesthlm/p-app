import React, { useState } from 'react';

const ShortGameForm = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [currentHole, setCurrentHole] = useState(1);
  const [holeScore, setHoleScore] = useState('');
  const [missedGreens, setMissedGreens] = useState([]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleHoleScoreChange = (e) => {
    setHoleScore(e.target.value);
  };

  const handleAddHole = () => {
    if (holeScore) {
      setMissedGreens((prevMissedGreens) => [
        ...prevMissedGreens,
        { hole: currentHole, score: holeScore },
      ]);
      setHoleScore('');
    }
  };

  const handleNextHole = () => {
    setCurrentHole((prevHole) => prevHole + 1);
  };

  const handleSaveRound = () => {
    // TODO: Implement saving the round data when the user has completed the entire round
    console.log('Round data:', {
      course: selectedCourse,
      missedGreens,
    });
    // Reset form data
    setSelectedCourse('');
    setCurrentHole(1);
    setHoleScore('');
    setMissedGreens([]);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="course" className="block text-sm font-medium text-gray-700">
          Select Course:
        </label>
        <select
          id="course"
          name="course"
          value={selectedCourse}
          onChange={handleCourseChange}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          <option value="">Select Course</option>
          <option value="Course 1">Course 1</option>
          <option value="Course 2">Course 2</option>
          <option value="Course 3">Course 3</option>
        </select>
      </div>
      {selectedCourse && (
        <div>
          <h2 className="text-xl font-bold mb-2">Hole {currentHole}</h2>
          <div className="mb-4">
            <label htmlFor="holeScore" className="block text-sm font-medium text-gray-700">
              Score:
            </label>
            <select
              id="holeScore"
              name="holeScore"
              value={holeScore}
              onChange={handleHoleScoreChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">Select Score</option>
              <option value="Birdie">Birdie</option>
              <option value="Par">Par</option>
              <option value="Bogey">Bogey</option>
              <option value="Double Bogey">Double Bogey</option>
              <option value="Triple Bogey">Triple Bogey</option>
            </select>
          </div>
          <button
            onClick={handleAddHole}
            className="btn btn-primary mr-2"
          >
            Add Hole
          </button>
          {currentHole < 18 ? (
            <button
              onClick={handleNextHole}
              className="btn btn-secondary"
            >
              Next Hole
            </button>
          ) : (
            <button
              onClick={handleSaveRound}
              className="btn btn-success"
            >
              Save Round
            </button>
          )}
        </div>
      )}
      {missedGreens.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Missed Greens</h2>
          <ul>
            {missedGreens.map((missedGreen, index) => (
              <li key={index}>
                Hole {missedGreen.hole}: {missedGreen.score}
              </li>
            ))}
          </ul>
        </div>
      )}
      {missedGreens.length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleSaveRound}
            className="btn btn-info"
          >
            Save Round
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortGameForm;
