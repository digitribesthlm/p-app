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
                        <div className="bg-blue-100 p-2 rounded">
                            <label className="block text-sm font-medium text-gray-700">Outcome</label>
                            <select
                                value={putt.outcome}
                                onChange={(e) => handleChange(index, 'outcome', e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select</option>
                                <option value="Short-High">Short / High</option>
                                <option value="Short-Low">Short / Low</option>
                                <option value="Short-Straight-Line">Short / Straight Line (front of the cup)</option>
                                <option value="Past-High">Past / High</option>
                                <option value="Past-Low">Past / Low</option>
                                <option value="Past-Straight-Line">Past / Straight Line (behind the cup)</option>
                                <option value="Success">Success</option>
                            </select>
                        </div>
                        {putt.outcome !== 'Success' && (
                            <>
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
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Prepp</label>
                                    <select
                                        value={putt.prepp}
                                        onChange={(e) => handleChange(index, 'prepp', e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Read</label>
                                    <select
                                        value={putt.read}
                                        onChange={(e) => handleChange(index, 'read', e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Over">Over</option>
                                        <option value="Under">Under</option>
                                    </select>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Speed</label>
                                    <select
                                        value={putt.speed}
                                        onChange={(e) => handleChange(index, 'speed', e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Fast">Fast</option>
                                        <option value="Slow">Slow</option>
                                    </select>
                                </div>
                                <div className="bg-yellow-100 p-2 rounded">
                                    <label className="block text-sm font-medium text-gray-700">Stroke</label>
                                    <select
                                        value={putt.stroke}
                                        onChange={(e) => handleChange(index, 'stroke', e.target.value)}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select</option>
                                        <option value="Face">Face</option>
                                        <option value="Path">Path</option>
                                    </select>
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
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PuttForm;
