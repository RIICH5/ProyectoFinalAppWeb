import React from "react";

export const Item = ({ name, price, description }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-4">
      <div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div>
        <span className="text-gray-600">${price}</span>
      </div>
    </div>
  );
};
