import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/24/solid';
import useStore from '../store/useStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentUser = useStore(state => state.currentUser);

  if (!currentUser) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-lightGray px-4 py-2 md:top-0 md:bottom-auto">
      <div className="max-w-2xl mx-auto flex justify-around items-center">
        <Link
          to="/"
          className="flex flex-col items-center text-darkGray hover:text-primary transition-colors"
        >
          {location.pathname === '/' ? (
            <HomeIconSolid className="w-6 h-6" />
          ) : (
            <HomeIcon className="w-6 h-6" />
          )}
          <span className="text-sm">Home</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center text-darkGray hover:text-primary transition-colors"
        >
          {location.pathname === '/profile' ? (
            <UserCircleIconSolid className="w-6 h-6" />
          ) : (
            <UserCircleIcon className="w-6 h-6" />
          )}
          <span className="text-sm">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
