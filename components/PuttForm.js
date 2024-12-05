import React from 'react';

const PuttForm = ({ hole, numPutts, formData, handleFormDataChange }) => {
    const handleChange = (index, field, value) => {
        const updatedPutts = [...formData[hole]];
        updatedPutts[index][field] = value;
        handleFormDataChange(hole, updatedPutts);
    };

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Hole {hole}</h2>
            {formData[hole]?.map((putt, index) => (
                <div key={index} className="mb-2">
                    <h3 className="text-lg font-medium">Putt {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-100 p-2 rounded">
                                <label className="block text-sm font-medium text-gray-700">Outcome</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Short-High', 'Short-Low', 'Short-Straight-Line', 'Past-High', 'Past-Low', 'Past-Straight-Line', 'Success'].map((option) => (
                                        <button
                                            key={option}
                                            className={`btn ${putt.outcome === option ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'outcome', option)}
                                        >
                                            {option.replace('-', ' / ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-100 p-2 rounded">
                                <label className="block text-sm font-medium text-gray-700">Length</label>
                                <input
                                    type="number"
                                    value={putt.length}
                                    onChange={(e) => handleChange(index, 'length', e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="bg-blue-100 p-2 rounded">
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <select
                                    value={putt.level}
                                    onChange={(e) => handleChange(index, 'level', e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select</option>
                                    <option value="Up">Up</option>
                                    <option value="Down">Down</option>
                                    <option value="Sidehill">Sidehill</option>
                                    <option value="Flat">Flat</option>
                                </select>
                            </div>
                        </div>
                        {putt.outcome && putt.outcome !== 'Success' && (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Prepp</label>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`btn ${putt.prepp === 'Yes' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'prepp', 'Yes')}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className={`btn ${putt.prepp === 'No' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'prepp', 'No')}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Read</label>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`btn ${putt.read === 'Over' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'read', 'Over')}
                                        >
                                            Over
                                        </button>
                                        <button
                                            className={`btn ${putt.read === 'Under' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'read', 'Under')}
                                        >
                                            Under
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Speed</label>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`btn ${putt.speed === 'Fast' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'speed', 'Fast')}
                                        >
                                            Fast
                                        </button>
                                        <button
                                            className={`btn ${putt.speed === 'Slow' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'speed', 'Slow')}
                                        >
                                            Slow
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Stroke</label>
                                    <div className="flex space-x-2">
                                        <button
                                            className={`btn ${putt.stroke === 'Face' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'stroke', 'Face')}
                                        >
                                            Face
                                        </button>
                                        <button
                                            className={`btn ${putt.stroke === 'Path' ? 'btn-primary' : 'btn-secondary'}`}
                                            onClick={() => handleChange(index, 'stroke', 'Path')}
                                        >
                                            Path
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Mental</label>
                                    <input
                                        type="text"
                                        value={putt.mental}
                                        onChange={(e) => handleChange(index, 'mental', e.target.value)}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PuttForm;
