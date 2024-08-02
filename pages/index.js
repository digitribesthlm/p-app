import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import puttingImage from '../public/images/GreenGenius_Logo.png';
import Cookies from 'js-cookie';
import PuttForm from '../components/PuttForm';
import axios from 'axios';
import ThemeSelector from '../components/ThemeSelector';


const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/login');
    }
  }, []);
    const [holes, setHoles] = useState(0);
    const [currentHole, setCurrentHole] = useState(1);
    const [numPutts, setNumPutts] = useState(1);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Load form data from session-based cookie if available.
        const savedFormData = Cookies.get('formData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);
    const [selectedCourse, setSelectedCourse] = useState('');

    // Statistics and Notifications
    const [totalPutts, setTotalPutts] = useState(0);
    const [shortPutts, setShortPutts] = useState(0);
    const [totalLastPuttMeters, setTotalLastPuttMeters] = useState(0);
    const [totalPuttMeters, setTotalPuttMeters] = useState(0);
    const [notification, setNotification] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        // Load form data from session-based cookie if available
        const savedFormData = Cookies.get('formData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    useEffect(() => {
        // Calculate statistics and save formData to session-based cookie whenever formData changes.
        let puttCount = 0;
        let shortCount = 0;
        let lastPuttMeters = 0;
        let totalMeters = 0;

        Object.values(formData).forEach(holeData => {
            puttCount += holeData.length;
            shortCount += holeData.filter(putt => putt.outcome === 'Short').length;
            if (holeData.length > 0) {
                lastPuttMeters += parseFloat(holeData[holeData.length - 1].length) || 0;
                holeData.forEach(putt => {
                    totalMeters += parseFloat(putt.length) || 0;
                });
            }
        });

        setTotalPutts(puttCount);
        setShortPutts(shortCount);
        setTotalLastPuttMeters(lastPuttMeters);
        setTotalPuttMeters(totalMeters);

        // Save form data to session-based cookie.
        Cookies.set('formData', JSON.stringify(formData), { expires: 1 });

        // Check for notifications
        if (shortCount > 5) {
            setNotification('You have more than 5 short putts!');
        } else {
            setNotification('');
        }
        // Save form data to session-based cookie
        Cookies.set('formData', JSON.stringify(formData), { expires: 1 });
    }, [formData]);

    useEffect(() => {
        // Load form data from cookies if available
        const savedFormData = Cookies.get('formData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
    }, []);

    const handleHoleSelection = (num) => {
        setHoles(num);
        setCurrentHole(1);
        setShowResults(false); // Reset results display
        // Initialize form data for the first hole
        handleFormDataChange(1, Array.from({ length: numPutts }, () => ({
            length: '',
            level: '',
            outcome: '',
            prepp: '',
            read: '',
            speed: '',
            stroke: '',
            mental: ''
        })));
    };

    const handleNumPuttsChange = (e) => {
        const num = Number(e.target.value);
        setNumPutts(num);
        // Initialize form data for the current hole with the selected number of putts
        handleFormDataChange(currentHole, Array.from({ length: num }, () => ({
            length: '',
            level: '',
            outcome: '',
            prepp: '',
            read: '',
            speed: '',
            stroke: '',
            mental: ''
        })));
    };

    const handleFormDataChange = (hole, data) => {
        const sanitizedData = data.map(putt => ({
            ...putt,
            length: putt.length.toString(),
            level: putt.level.toString(),
            outcome: putt.outcome.toString(),
            prepp: putt.prepp.toString(),
            read: putt.read.toString(),
            speed: putt.speed.toString(),
            stroke: putt.stroke.toString(),
            mental: putt.mental.toString()
        }));
    
        setFormData(prevFormData => ({
            ...prevFormData,
            [hole]: sanitizedData
        }));
    };

    const handleNextHole = () => {
        if (currentHole < holes) {
            setCurrentHole(currentHole + 1);
            // Ensure form data for the next hole is initialized
            if (!formData[currentHole + 1]) {
                handleFormDataChange(currentHole + 1, Array.from({ length: numPutts }, () => ({
                    length: '',
                    level: '',
                    outcome: '',
                    prepp: '',
                    read: '',
                    speed: '',
                    stroke: '',
                    mental: ''
                })));
            }
        } else {
            alert("All holes completed!");
        }
    };

    const handleSave = async () => {
        const dataToSave = {
            course: selectedCourse,
            holes: Object.entries(formData).map(([holeNumber, putts]) => ({
                hole_number: parseInt(holeNumber, 10),
                putts: putts.map(putt => ({
                    length: putt.length,
                    level: putt.level,
                    outcome: putt.outcome,
                    prepp: putt.prepp,
                    read: putt.read,
                    speed: putt.speed,
                    stroke: putt.stroke,
                    mental: putt.mental
                }))
            })),
            statistics: {
                total_putts: totalPutts,
                short_putts: shortPutts,
                total_last_putt_meters: totalLastPuttMeters,
                total_putt_meters: totalPuttMeters
            }
        };
    
        try {
            const token = Cookies.get('token');
            const response = await axios.post('/api/save-putting-data', dataToSave, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("Response from server:", response.data);
            if (response.status === 201) {
                alert("Data saved successfully!");
                setFormData({}); // Clear form data after successful save
                sessionStorage.removeItem('formData'); // Clear session storage
                setHoles(0); // Reset hole selection
                setSelectedCourse(''); // Reset selected course
                sessionStorage.removeItem('formData'); // Clear session storage
            } else {
                alert("Failed to save data.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving data. Status:", error.response.data);
        }
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handlePrint = () => {
        setShowResults(true);
    };

    const categorizePuttLength = (length) => {
        if (length <= 1) return 'Short';
        if (length > 10) return 'Long';
        return 'Medium';
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">GREEN GENIUS 1</h1>
            <p>Conquer the Golf Green</p>
            <ThemeSelector />
            {holes === 0 ? (
                <div className="flex flex-col gap-4 mb-8">
                    <div className="mb-4 flex justify-center">
                        <Image src={puttingImage} alt="Putting" width={500} height={300} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700">Select Course:</label>
                        <select
                            id="course"
                            name="course"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Course</option>
                            <option value="Sollentuna">Sollentuna</option>
                            <option value="Grindslanten">Grindslanten</option>
                            <option value="Växjö GK">Växjö GK</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => handleHoleSelection(9)} className="btn btn-primary">Play 9 Holes</button>
                        <button onClick={() => handleHoleSelection(18)} className="btn btn-primary">Play 18 Holes</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <label htmlFor="numPutts" className="block text-sm font-medium text-gray-700">Number of Putts:</label>
                        <select
                            id="numPutts"
                            name="numPutts"
                            value={numPutts}
                            onChange={handleNumPuttsChange}
                            className="select select-bordered w-full"
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                    <PuttForm hole={currentHole} numPutts={numPutts} formData={formData} handleFormDataChange={handleFormDataChange} />
                    <div className="flex gap-4">
                        <button onClick={handleNextHole} className="btn btn-secondary">Next Hole</button>
                        {currentHole === holes && (
                            <>
                                <button onClick={handleSave} className="btn btn-success">Save</button>
                                <button onClick={handlePrint} className="btn btn-info">Print</button>
                            </>
                        )}
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-bold">Statistics</h2>
                        <p>Total Putts: {totalPutts}</p>
                        <p>Short Putts: {shortPutts}</p>
                        <p>Total Meters of Last Putts per Hole: {totalLastPuttMeters} meters</p>
                        <p>Total Meters of All Putts: {totalPuttMeters} meters</p>
                        {notification && <p className="text-red-500">{notification}</p>}
                    </div>
                    {Object.entries(formData).map(([hole, putts], holeIndex) => (
                        <div key={holeIndex} className="mt-4">
                            <h2 className="text-xl font-bold mb-2">Hole {hole}</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-compact w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-20">Putt</th>
                                            <th className="w-20">Length</th>
                                            <th className="w-20">Length Category</th>
                                            <th className="w-20 bg-gray-100">Level</th>
                                            <th className="w-20 bg-gray-100">Outcome</th>
                                            <th className="w-20 bg-yellow-100">Prepp</th>
                                            <th className="w-20 bg-yellow-100">Read</th>
                                            <th className="w-20 bg-yellow-100">Speed</th>
                                            <th className="w-20 bg-yellow-100">Stroke</th>
                                            <th className="w-20 bg-yellow-100">Mental</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {putts.map((putt, puttIndex) => (
                                            <tr key={`${hole}-${puttIndex}`}>
                                                <td className="w-20">{puttIndex + 1}</td>
                                                <td className="w-20">{putt.length}</td>
                                                <td className="w-20">{categorizePuttLength(putt.length)}</td>
                                                <td className="w-20 bg-gray-100">{putt.level}</td>
                                                <td className="w-20 bg-gray-100">{putt.outcome}</td>
                                                <td className="w-20 bg-yellow-100">{putt.prepp}</td>
                                                <td className="w-20 bg-yellow-100">{putt.read}</td>
                                                <td className="w-20 bg-yellow-100">{putt.speed}</td>
                                                <td className="w-20 bg-yellow-100">{putt.stroke}</td>
                                                <td className="w-20 bg-yellow-100">{putt.mental}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    {showResults && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">Summary!</h2>
                            <p className="mb-4">Course: {selectedCourse}</p>
                            <div className="overflow-x-auto">
                                <table className="table table-compact w-full">
                                    <thead>
                                        <tr>
                                            <th className="w-20">Hole</th>
                                            <th className="w-20">Putt</th>
                                            <th className="w-20">Length</th>
                                            <th className="w-20">Length Category</th>
                                            <th className="w-20 bg-gray-100">Level</th>
                                            <th className="w-20 bg-gray-100">Outcome</th>
                                            <th className="w-20 bg-yellow-100">Prepp</th>
                                            <th className="w-20 bg-yellow-100">Read</th>
                                            <th className="w-20 bg-yellow-100">Speed</th>
                                            <th className="w-20 bg-yellow-100">Stroke</th>
                                            <th className="w-20 bg-yellow-100">Mental</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(formData).map(([hole, putts], holeIndex) => (
                                            putts.map((putt, puttIndex) => (
                                                <tr key={`${hole}-${puttIndex}`}>
                                                    <td className="w-20">{hole}</td>
                                                    <td className="w-20">{puttIndex + 1}</td>
                                                    <td className="w-20">{putt.length}</td>
                                                    <td className="w-20">{categorizePuttLength(putt.length)}</td>
                                                    <td className="w-20 bg-gray-100">{putt.level}</td>
                                                    <td className="w-20 bg-gray-100">{putt.outcome}</td>
                                                    <td className="w-20 bg-yellow-100">{putt.prepp}</td>
                                                    <td className="w-20 bg-yellow-100">{putt.read}</td>
                                                    <td className="w-20 bg-yellow-100">{putt.speed}</td>
                                                    <td className="w-20 bg-yellow-100">{putt.stroke}</td>
                                                    <td className="w-20 bg-yellow-100">{putt.mental}</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
