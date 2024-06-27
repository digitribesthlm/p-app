import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = (href) => {
        setIsOpen(false);
        router.push(href);
    };

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isOpen} onChange={toggleMenu} />
            <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer" className="btn btn-primary drawer-button fixed top-4 right-4 z-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
                    <li>
                        <a onClick={() => handleLinkClick("/")} className="text-xl font-semibold">Home</a>
                    </li>
                    <li>
                        <a onClick={() => handleLinkClick("/strokes-gained")} className="text-xl font-semibold">Strokes Gained</a>
                    </li>
                    <li>
                        <a onClick={() => handleLinkClick("/statistics")} className="text-xl font-semibold">Statistics</a>
                    </li>
                    <li>
                        <a onClick={() => handleLinkClick("/settings")} className="text-xl font-semibold">Settings</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MobileMenu;