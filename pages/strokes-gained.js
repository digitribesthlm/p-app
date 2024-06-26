import React, { useState, useEffect } from 'react';
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
    <div>
      <h1>Strokes Gained Putting</h1>
      <div>
        <label htmlFor="hcp-select">Select Handicap: </label>
        <select id="hcp-select" value={selectedHCP} onChange={handleHCPChange}>
          <option value="Pro">Pro</option>
          <option value="10 HCP">10 HCP</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="unit-select">Select Unit: </label>
        <select id="unit-select" value={selectedUnit} onChange={handleUnitChange}>
          <option value="ft">Feet</option>
          <option value="m">Meters</option>
        </select>
      </div>
      <StrokesGainedChart data={data} />
    </div>
  );
}

export default StrokesGainedPage;
