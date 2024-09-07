import React from 'react';
import ShortGameForm from '../components/ShortGameForm';
import ThemeSelector from '../components/ThemeSelector';

const ShortGamePage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Short Game Tracker</a>
        </div>
        <div className="flex-none">
          <ThemeSelector />
        </div>
      </div>
      <div className="mt-8">
        <ShortGameForm />
      </div>
    </div>
  );
};

export default ShortGamePage;
