import React from "react";

function Header() {
  return (
    <div className="w-full px-16 pt-12 pb-6">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        InSight AI
      </h1>

      <p className="text-gray-300 mt-2 text-sm">
        AI-powered news bias analysis and aggregation
      </p>
    </div>
  );
}

export default Header;