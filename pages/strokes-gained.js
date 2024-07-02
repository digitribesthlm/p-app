import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import StrokesGainedChart from '../components/StrokesGainedChart';

// Dummy data for different handicap levels
const dataPro = [
  { name: '0-3 ft', SGA: 0.8 },
  { name: '3-6 ft', SGA: -0.2 },
  { name: '6-10 ft', SGA: 0.5 },
  { name: '10-15 ft', SGA: -0.6 },
  { name: '15-25 ft', SGA: 0.3 },
  { name: '25-40 ft', SGA: -0.8 },
  { name: '40+ ft', SGA: -0.7 }
];

const data10HCP = [
  { name: '0-3 ft', SGA: 0.6 },
  { name: '3-6 ft', SGA: -0.3 },
  { name: '6-10 ft', SGA: 0.4 },
  { name: '10-15 ft', SGA: -0.5 },
  { name: '15-25 ft', SGA: 0.2 },
  { name: '25-40 ft', SGA: -0.6 },
  { name: '40+ ft', SGA: -0.8 }
];

const convertToMeters = (data) => {
  return data.map(entry => {
    const range = entry.name.split('-');
    if (range.length === 2) {
      const min = parseFloat(range[0]);
      const max = parseFloat(range[1]);
      return {
        ...entry,
        name: `${(min * 0.3048).toFixed(1)}-${(max * 0.3048).toFixed(1)} m`
      };
    } else {
      const value = parseFloat(range[0].split('+')[0]);
      return {
        ...entry,
        name: `${(value * 0.3048).toFixed(1)}+ m`
      };
    }
  });
};

const convertToYards = (data) => {
  return data.map(entry => {
    const range = entry.name.split('-');
    if (range.length === 2) {
      const min = parseFloat(range[0]);
      const max = parseFloat(range[1]);
      return {
        ...entry,
        name: `${(min / 0.3048).toFixed(1)}-${(max / 0.3048).toFixed(1)} yd`
      };
    } else {
      const value = parseFloat(range[0].split('+')[0]);
      return {
        ...entry,
        name: `${(value / 0.3048).toFixed(1)}+ yd`
      };
    }
  });
};

const StrokesGainedPage = () => {
  const [selectedHCP, setSelectedHCP] = useState('Pro');
  const [selectedUnit, setSelectedUnit] = useState('ft');
  const [data, setData] = useState(dataPro);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login');
    }
  }, []);

  const handleHCPChange = (event) => {
    const hcp = event.target.value;
    setSelectedHCP(hcp);
    if (hcp === 'Pro') {
      setData(selectedUnit === 'ft' ? dataPro : convertToMeters(dataPro));
    } else if (hcp === '10 HCP') {
      setData(selectedUnit === 'ft' ? data10HCP : convertToMeters(data10HCP));
    }
  };

  const handleUnitChange = (event) => {
    const unit = event.target.value;
    setSelectedUnit(unit);
    if (selectedHCP === 'Pro') {
      setData(unit === 'ft' ? dataPro : convertToMeters(dataPro));
    } else if (selectedHCP === '10 HCP') {
      setData(unit === 'ft' ? data10HCP : convertToMeters(data10HCP));
    }
  };

  useEffect(() => {
    handleHCPChange({ target: { value: selectedHCP } });
  }, [selectedUnit]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Strokes Gained Putting</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <div className="mb-4">
          <label htmlFor="hcp-select" className="block text-gray-700">Select Handicap:</label>
          <select
            id="hcp-select"
            className="select select-bordered w-full"
            value={selectedHCP}
            onChange={handleHCPChange}
          >
            <option value="Pro">Pro</option>
            <option value="10 HCP">10 HCP</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="unit-select" className="block text-gray-700">Select Unit:</label>
          <select
            id="unit-select"
            className="select select-bordered w-full"
            value={selectedUnit}
            onChange={handleUnitChange}
          >
            <option value="ft">Feet</option>
            <option value="m">Meters</option>
          </select>
        </div>
        <StrokesGainedChart data={data} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <StrokesGainedChart data={data} />
      </div>
    </div>
  );
}

export default StrokesGainedPage;
