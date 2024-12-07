import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase.js';

const AddProduct = () => {
  const [categorie, setCategorie] = useState('');
  const [description, setDescription] = useState('');
  const [nomProduit, setNomProduit] = useState('');
  const [prix, setPrix] = useState(0);
  const [stock, setStock] = useState(true);
  const [imageBase64, setImageBase64] = useState(null);
  const [userID, setUserID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.email);
        setErrorMessage('');
      } else {
        setErrorMessage('You must be logged in to add a product.');
      }
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!userID) {
      setErrorMessage('You need to be logged in to add a product.');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        categorie,
        description,
        nomProduit,
        prix,
        stock,
        imageBase64,
        userID,
      });

      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      setCategorie('');
      setDescription('');
      setNomProduit('');
      setPrix(0);
      setStock(true);
      setImageBase64(null);
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage('Error adding product. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Category"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={nomProduit}
          onChange={(e) => setNomProduit(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={prix}
          onChange={(e) => setPrix(Number(e.target.value))}
          required
        />
        <label>
          In Stock:
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
          />
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
        />
        <button type="submit">Add Product</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AddProduct;

