import React, { useState } from 'react';
import Layout from '../components/Layout';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  preparationTime: number;
  customizations: Customization[];
  tags: string[];
}

interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  isRequired: boolean;
}

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'appetizers', 'main-course', 'desserts', 'beverages'];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
      price: 300,
      category: 'main-course',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      preparationTime: 20,
      customizations: [
        {
          id: 'size',
          name: 'Size',
          isRequired: true,
          options: [
            { id: 'small', name: 'Small (8")', price: 0 },
            { id: 'medium', name: 'Medium (10")', price: 50 },
            { id: 'large', name: 'Large (12")', price: 100 }
          ]
        },
        {
          id: 'extra-toppings',
          name: 'Extra Toppings',
          isRequired: false,
          options: [
            { id: 'mushrooms', name: 'Mushrooms', price: 30 },
            { id: 'olives', name: 'Olives', price: 25 },
            { id: 'pepperoni', name: 'Pepperoni', price: 40 }
          ]
        }
      ],
      tags: ['vegetarian', 'popular']
    },
    {
      id: '2',
      name: 'Chicken Burger',
      description: 'Juicy grilled chicken patty with lettuce, tomato, and special sauce',
      price: 180,
      category: 'main-course',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      preparationTime: 15,
      customizations: [
        {
          id: 'spice-level',
          name: 'Spice Level',
          isRequired: true,
          options: [
            { id: 'mild', name: 'Mild', price: 0 },
            { id: 'medium', name: 'Medium', price: 0 },
            { id: 'hot', name: 'Hot', price: 0 }
          ]
        }
      ],
      tags: ['non-vegetarian', 'spicy']
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese, croutons, and caesar dressing',
      price: 150,
      category: 'appetizers',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      preparationTime: 10,
      customizations: [],
      tags: ['vegetarian', 'healthy']
    },
    {
      id: '4',
      name: 'Chocolate Brownie',
      description: 'Rich chocolate brownie served with vanilla ice cream',
      price: 120,
      category: 'desserts',
      image: '/api/placeholder/300/200',
      isAvailable: false,
      preparationTime: 5,
      customizations: [],
      tags: ['vegetarian', 'sweet']
    },
    {
      id: '5',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 80,
      category: 'beverages',
      image: '/api/placeholder/300/200',
      isAvailable: true,
      preparationTime: 3,
      customizations: [
        {
          id: 'size',
          name: 'Size',
          isRequired: true,
          options: [
            { id: 'small', name: 'Small (250ml)', price: 0 },
            { id: 'large', name: 'Large (500ml)', price: 30 }
          ]
        }
      ],
      tags: ['vegetarian', 'fresh']
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'appetizers':
        return 'Appetizers';
      case 'main-course':
        return 'Main Course';
      case 'desserts':
        return 'Desserts';
      case 'beverages':
        return 'Beverages';
      default:
        return 'All Items';
    }
  };

  const toggleItemAvailability = (itemId: string) => {
    // In a real app, this would make an API call
    console.log(`Toggling availability for item ${itemId}`);
  };

  const MenuItemModal = ({ item, onClose, isEdit = false }: { item?: MenuItem; onClose: () => void; isEdit?: boolean }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  defaultValue={item?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  defaultValue={item?.category || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="main-course">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                defaultValue={item?.description || ''}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  defaultValue={item?.price || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (mins)</label>
                <input
                  type="number"
                  defaultValue={item?.preparationTime || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  defaultValue={item?.isAvailable ? 'true' : 'false'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {['vegetarian', 'non-vegetarian', 'spicy', 'sweet', 'healthy', 'popular', 'fresh'].map(tag => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={item?.tags.includes(tag)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-food-primary text-white rounded-lg hover:bg-food-secondary transition-colors"
              >
                {isEdit ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h2>
            <p className="text-gray-600">Manage your restaurant menu items</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-food-primary text-white px-4 py-2 rounded-lg hover:bg-food-secondary transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-food-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-food-primary focus:border-transparent"
              />
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Item Image */}
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {item.preparationTime} mins
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-lg font-bold text-food-primary">₹{item.price}</span>
          </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                      </div>

                {/* Customizations */}
                {item.customizations.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Customizations available</p>
                    <div className="flex flex-wrap gap-1">
                      {item.customizations.map(customization => (
                        <span
                          key={customization.id}
                          className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded"
                        >
                          {customization.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                    Duplicate
                    </button>
                  <button className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
            </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first menu item.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-food-primary text-white px-4 py-2 rounded-lg hover:bg-food-secondary transition-colors"
                >
                  Add Menu Item
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add Item Modal */}
        {isAddModalOpen && (
          <MenuItemModal
            onClose={() => setIsAddModalOpen(false)}
            isEdit={false}
          />
        )}

        {/* Edit Item Modal */}
        {isEditModalOpen && selectedItem && (
          <MenuItemModal
            item={selectedItem}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }}
            isEdit={true}
          />
        )}
      </div>
    </Layout>
  );
};

export default Menu;