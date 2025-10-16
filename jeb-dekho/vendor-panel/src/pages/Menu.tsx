import React, { useState } from 'react';
import Layout from '../components/Layout';

const Menu: React.FC = () => {
  const [categories] = useState([
    { id: 1, name: 'Starters', items: 8 },
    { id: 2, name: 'Main Course', items: 15 },
    { id: 3, name: 'Desserts', items: 6 },
    { id: 4, name: 'Beverages', items: 12 },
  ]);

  const [menuItems] = useState([
    { id: 1, name: 'Paneer Tikka', category: 'Starters', price: 250, available: true },
    { id: 2, name: 'Chicken Biryani', category: 'Main Course', price: 350, available: true },
    { id: 3, name: 'Gulab Jamun', category: 'Desserts', price: 120, available: false },
    { id: 4, name: 'Masala Chai', category: 'Beverages', price: 50, available: true },
    { id: 5, name: 'Veg Manchurian', category: 'Starters', price: 200, available: true },
    { id: 6, name: 'Dal Makhani', category: 'Main Course', price: 280, available: true },
  ]);

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h2>
            <p className="text-gray-600">Menu Screen Ready</p>
          </div>
          <button className="bg-food-secondary text-white px-4 py-2 rounded-md hover:bg-food-primary">
            Add New Item
          </button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.items} items</p>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">All Menu Items</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-lg"></div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    <p className="text-lg font-medium text-gray-900">₹{item.price}</p>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.available}
                          onChange={() => {}}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-food-secondary"></div>
                      </label>
                      <span className="ml-2 text-sm text-gray-500">
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <button className="text-food-secondary hover:text-food-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Menu;