import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StrokesGainedPage = () => {
    const [puttingData, setPuttingData] = useState([]);
    const [puttingStats, setPuttingStats] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);
    const [selectedHcp, setSelectedHcp] = useState('pro');

    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            router.replace('/login');
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/fetchPuttingData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&hcp=${selectedHcp}`);
                if (response.data) {
                    setPuttingData(response.data.puttingData || []);
                    setPuttingStats(response.data.puttingStats || []);
                } else {
                    setError('No data returned from the server.');
                }
            } catch (error) {
                console.error('Failed to fetch putting data:', error);
                setError('Failed to fetch data from the database.');
            }
        };
        fetchData();
    }, [startDate, endDate, selectedHcp]);


    useEffect(() => {
        if (puttingData.length > 0 && puttingStats.length > 0) {
            const processedData = processPuttingData(puttingData, puttingStats);
            console.log('Processed Data:', processedData);  // What does this look like?
            const groupedData = groupByDistanceRanges(processedData, puttingStats);
            console.log('Grouped Data:', groupedData);  // Are these grouped correctly?
            setChartData(createChartData(groupedData));
            console.log('Chart Data:', createChartData(groupedData));  // Final structure for Chart.js
        }
    }, [puttingData, puttingStats]);

    const calculateStrokesGained = (puttLength, numPutts, puttingStats) => {
        const puttLengthNumber = parseFloat(puttLength); // Ensure precise floating-point comparisons
        console.log(`Calculating strokes gained for putt length: ${puttLengthNumber}, number of putts: ${numPutts}`);
    
        const statsForRange = puttingStats.find(stat => {
            if (stat.distance.includes('+')) {
                const min = parseFloat(stat.distance.replace('+', ''));
                const isInRange = puttLengthNumber >= min;
                console.log(`Checking range ${min}+: ${isInRange}`);
                return isInRange;
            } else {
                const parts = stat.distance.split('-').map(parseFloat); // Use parseFloat for precise comparisons
                if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                    console.error(`Invalid distance range format: '${stat.distance}'`);
                    return false;
                }
                const [min, max] = parts;
                // Make the range inclusive on both ends
                const isInRange = puttLengthNumber >= min && puttLengthNumber <= max;
                console.log(`Checking range ${min}-${max}: ${isInRange}`);
                return isInRange;
            }
        });
    
        if (!statsForRange) {
            console.log('No stats found for this range');
            return 0;
        }
    
        const proAveragePutts = statsForRange.statistics[selectedHcp].average_putts;
        const strokesGained = proAveragePutts - numPutts;
        console.log(`Pro average putts: ${proAveragePutts}, Strokes gained: ${strokesGained}`);
        return strokesGained;
    };
    
    

    const processPuttingData = (puttingData, puttingStats) => {
    console.log('Processing putting data:', puttingData);
    console.log('Using putting stats:', puttingStats);

    return puttingData.flatMap(round => {
        return round.holes.map(hole => {
            const initialPuttLength = parseFloat(hole.putts[0].length);  // Ensure this is a number
            const numPutts = hole.putts.length;
            const strokesGained = calculateStrokesGained(initialPuttLength, numPutts, puttingStats);
            console.log(`Hole ${hole.hole_number}: Initial putt length: ${initialPuttLength}, Number of putts: ${numPutts}, Strokes gained: ${strokesGained}`);
            return {
                holeNumber: hole.hole_number,
                initialPuttLength,
                numPutts,
                strokesGained
            };
        });
    });
};

const groupByDistanceRanges = (processedData, puttingStats) => {
    return puttingStats.map(stat => {
        const isPlusRange = stat.distance.includes('+');
        const min = parseFloat(stat.distance.replace('+', ''));
        const max = isPlusRange ? Infinity : parseFloat(stat.distance.split('-')[1]);

        const puttsInRange = processedData.filter(putt => {
            const puttLength = parseFloat(putt.initialPuttLength);
            return isPlusRange ? 
                puttLength >= min : 
                puttLength >= min && puttLength <= max;
        });

        const totalStrokesGained = puttsInRange.reduce((sum, putt) => sum + putt.strokesGained, 0);

        console.log(`Grouping by range ${stat.distance}, found ${puttsInRange.length} putts, Total Strokes Gained: ${totalStrokesGained}`);

        return {
            distance: stat.distance,
            strokesGained: totalStrokesGained,
            puttsAttempted: puttsInRange.length
        };
    });
};



const createChartData = (groupedData) => {
    return {
        labels: groupedData.map(item => item.distance),
        datasets: [{
            label: 'Strokes Gained/Lost',
            data: groupedData.map(item => item.strokesGained),
            backgroundColor: groupedData.map(item => 
                item.strokesGained >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
            ),
        }],
    };
};


const formatHolesData = (holes) => {
    return holes.map((hole, index) => {
        const puttsDetails = hole.putts.map((putt, puttIndex) => 
            `Putt ${puttIndex + 1}: Length: ${putt.length}, Level: ${putt.level}, Outcome: ${putt.outcome}, Prepp: ${putt.prepp}, Read: ${putt.read}, Speed: ${putt.speed}, Stroke: ${putt.stroke}, Mental: ${putt.mental}`
        ).join('; ');
        return `Hole ${hole.hole_number}: ${puttsDetails}`;
    }).join(' | ');
};

return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6">Strokes Gained Putting Data</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-4 mb-4">
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            <select value={selectedHcp} onChange={(e) => setSelectedHcp(e.target.value)}>
                <option value="pro">Pro</option>
                <option value="0_hcp">0 HCP</option>
                <option value="5_hcp">5 HCP</option>
                <option value="10_hcp">10 HCP</option>
            </select>
        </div>
        {chartData && (
            <div className="w-full max-w-4xl mb-8">
                <h2 className="text-2xl font-bold mb-4">Strokes Gained/Lost by Distance</h2>
                <Bar data={chartData} options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Strokes Gained/Lost'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Distance (meter)'
                            }
                        }
                    }
                }} />
            </div>
        )}
        <h2 className="text-xl font-bold">Putting Data</h2>
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-400 p-2">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Course</th>
                        <th className="border border-gray-300 p-2">User</th>
                         <th className="border border-gray-300 p-2">Hole Details</th>
                        <th className="border border-gray-300 p-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {puttingData.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{item._id}</td>
                            <td className="border border-gray-300 p-2">{item.course}</td>
                            <td className="border border-gray-300 p-2">{item.user}</td>
                            <td className="border border-gray-300 p-2">{formatHolesData(item.holes)}</td>
                            <td className="border border-gray-300 p-2">{new Date(item.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <h2 className="text-xl font-bold mt-4">Putting Stats Data</h2>
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-400 p-2">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Distance</th>
                        <th className="border border-gray-300 p-2">Pro Average Putts</th>
                        <th className="border border-gray-300 p-2">Pro Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {puttingStats.map((stat, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{stat.distance}</td>
                            <td className="border border-gray-300 p-2">{stat.statistics.pro.average_putts}</td>
                            <td className="border border-gray-300 p-2">{stat.statistics.pro.success_rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
};

export default StrokesGainedPage;
