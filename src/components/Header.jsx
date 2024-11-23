import React, { useState } from "react";
import { logoutUser } from "../services/auth";

export const Header = ({
  isAdmin,
  setIsAdmin,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const handleUser = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">Restaurant</a>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={handleUser}
                className="bg-white text-gray-800 px-2 py-1 rounded"
              >
                {isAdmin ? "Admin" : "User"}
              </button>
            </li>
            {isAuthenticated && (
              <li>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setIsAuthenticated(false);
                  }}
                  className="bg-white text-gray-800 px-2 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
