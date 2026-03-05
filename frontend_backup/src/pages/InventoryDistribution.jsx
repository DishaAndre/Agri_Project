import React, { useState } from 'react';

const InventoryDistribution = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Fungicide A', stock: 100, dispatch: 0 },
    { id: 2, name: 'Insecticide B', stock: 50, dispatch: 0 },
  ]);

  const handleDispatchChange = (id, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, dispatch: value } : p));
  };

  const handleDispatch = (id) => {
    // Mock dispatch
    console.log('Dispatching product', id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory & Distribution</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Product</th>
              <th className="text-left">Stock</th>
              <th className="text-left">Dispatch Quantity</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>
                  <input
                    type="number"
                    value={product.dispatch}
                    onChange={(e) => handleDispatchChange(product.id, e.target.value)}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleDispatch(product.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Dispatch
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDistribution;