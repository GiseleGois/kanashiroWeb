import React, { useEffect, useState } from "react";
import { Edit } from 'react-feather';
import './style.css';
import { listAllProductType, updateProductType } from '../../service';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    listAllProductType()
      .then(response => {
        setProducts(response);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setNewValue(product.amount.toString());
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setNewValue("");
  };

  const handleInputChange = (event) => {
    setNewValue(event.target.value);
  };

  const updateProductValue = () => {
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, amount: parseFloat(newValue) };
      updateProductType(updatedProduct)
        .then(response => {
          setProducts(prevProducts =>
            prevProducts.map(product =>
              product.type === updatedProduct.type ? updatedProduct : product
            )
          );
          closeModal();
        })
        .catch(error => {
          console.error("Error updating product:", error);
        });
    }
  };

  return (
    <div className="product-page">
      <h1>Editar produtos</h1>
      <div className="product-list">
        {products.map(product => (
          <div
            className="product-card"
            key={product.type}
            onClick={() => openModal(product)}
          >
            <h2>{product.name}</h2>
            <p>Tipo: {product.type}</p>
            <p>Valor: {product.amount}</p>
            <span className="edit-icon">
              <Edit />
            </span>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <div className="product-modal">
          <div className="product-modal-content">
            <h2>{selectedProduct.name}</h2>
            <p>Tipo: {selectedProduct.type}</p>
            <p>
              Novo valor:
              <input
                type="number"
                value={newValue}
                onChange={handleInputChange}
              />
            </p>
            <button onClick={updateProductValue}>Confirmar</button>
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
