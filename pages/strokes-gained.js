// File: /pages/strokes-gained.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const StrokesGainedPage = () => {
    const [puttingData, setPuttingData] = useState([]);
    const [puttingStats, setPuttingStats] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/fetchPuttingData?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
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
    }, [startDate, endDate]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-6">Strokes Gained Putting Data</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex gap-4 mb-4">
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </div>
            <h2 className="text-xl font-bold">Putting Data</h2>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400 p-2">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Course</th>
                            <th className="border border-gray-300 p-2">User</th>
                            <th className="border border-gray-300 p-2">Holes</th>
                            <th className="border border-gray-300 p-2">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puttingData.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">{item._id}</td>
                                <td className="border border-gray-300 p-2">{item.course}</td>
                                <td className="border border-gray-300 p-2">{item.user}</td>
                                <td className="border border-gray-300 p-2">{item.holes.hole_number.putts}</td>
                                <td className="border border-gray-300 p-2">{item.createdAt}</td>
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
