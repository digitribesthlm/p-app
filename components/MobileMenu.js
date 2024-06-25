import React, { useState } from 'react';
import Link from 'next/link';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button onClick={toggleMenu} className="p-2 bg-gray-800 text-white rounded-md">
                {isOpen ? 'Close' : 'Menu'}
            </button>
            {isOpen && (
                <div className="absolute top-12 left-0 w-full bg-white shadow-md">
                    <ul className="flex flex-col p-4">
                        <li className="mb-2">
                            <Link href="/">
                                <a className="text-gray-800">Home</a>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/about">
                                <a className="text-gray-800">About</a>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href="/contact">
                                <a className="text-gray-800">Contact</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MobileMenu;
