import './App.css';
import React, { Component, lazy, Suspense } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app, auth } from './firebase.js';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Lazy-loaded components
const SignUp = lazy(() => import('./SignUp.js'));
const Login = lazy(() => import('./Login.js'));
const AddProduct = lazy(() => import('./AddProduct.js'));
const Cart = lazy(() => import('./cart.js'));
const Home = lazy(() => import('./Home.js'));
const ModifyUser = lazy(() => import('./ModifyUser.js'));
const PaymentPage = lazy(() => import('./PaymentPage.js'));
const Dashboard = lazy(() => import('./Dashboard.js'));
const ProductDetails = lazy(() => import('./ProductDetails.js'));

// Navbar Component
const Navbar = ({ user, onLogout }) => (
  <nav>
    <ul>
      {user ? (
        <>
          <li><a href="/">Home</a></li>
          <li><a href="/cart">Cart</a></li>
          <li><a href="/add-product">Add Product</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><button onClick={onLogout}>Logout</button></li>
        </>
      ) : (
        <>
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Sign Up</a></li>
        </>
      )}
    </ul>
  </nav>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      filteredProducts: [],
      user: null,
      cart: [],
      loading: false,
      error: null,
      categories: [],
      selectedCategory: 'All',
    };
    this.auth = getAuth(app);
  }

  // Fetch products from Firestore
  async refreshProducts() {
    if (this.state.user) {
      this.setState({ loading: true, error: null });
      try {
        const db = getFirestore(app);
        const productsCol = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCol);
        const productList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categories = ['All', ...new Set(productList.map((product) => product.categorie))];
        this.setState({
          products: productList,
          filteredProducts: productList,
          categories,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        this.setState({ error: 'Error fetching products.' });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  // Component lifecycle: Monitor authentication and fetch initial data
  componentDidMount() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.setState({ user }, this.refreshProducts);
      } else {
        this.setState({
          user: null,
          products: [],
          filteredProducts: [],
          cart: [],
        });
      }
    });
  }

  // Calculate total cart amount
  calculateTotal = () =>
    this.state.cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);

  // Handle category filtering
  handleCategoryChange = (category) => {
    const { products } = this.state;
    const filteredProducts =
      category === 'All'
        ? products
        : products.filter((product) => product.categorie === category);
    this.setState({ selectedCategory: category, filteredProducts });
  };

  // Handle product search
  handleSearch = (query) => {
    const { products } = this.state;
    const filteredProducts = products.filter(
      (product) =>
        product.nomProduit.toLowerCase().includes(query.toLowerCase()) ||
        product.categorie.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({ filteredProducts });
  };

  // Add product to cart
  addToCart = (product) => {
    this.setState((prevState) => {
      const existingProduct = prevState.cart.find((item) => item.id === product.id);
      if (existingProduct) {
        return {
          cart: prevState.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { cart: [...prevState.cart, { ...product, quantity: 1 }] };
    });
  };

  // Remove product from cart
  removeFromCart = (productId) => {
    this.setState((prevState) => ({
      cart: prevState.cart.filter((item) => item.id !== productId),
    }));
  };

  // Update cart item quantity
  updateCartQuantity = (productId, newQuantity) => {
    this.setState((prevState) => ({
      cart: prevState.cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ),
    }));
  };

  // Handle user logout
  handleLogout = () => {
    signOut(this.auth).then(() => {
      this.setState({
        user: null,
        products: [],
        filteredProducts: [],
        cart: [],
      });
    });
  };

  // Handle payment success
  handlePaymentSuccess = () => {
    this.setState({ cart: [] });
    alert('Payment successful! Thank you for your purchase.');
  };

  render() {
    const { filteredProducts, user, loading, error, categories, selectedCategory, cart } =
      this.state;

    return (
      <div className="App">
        <Router>
          <Navbar user={user} onLogout={this.handleLogout} />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/add-product"
                element={user ? <AddProduct /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/profile"
                element={user ? <ModifyUser /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cart}
                    onUpdateQuantity={this.updateCartQuantity}
                    onRemoveItem={this.removeFromCart}
                    totalAmount={this.calculateTotal()}
                  />
                }
              />
              <Route
                path="/payment"
                element={
                  user ? (
                    <PaymentPage
                      cartItems={cart}
                      totalAmount={this.calculateTotal()}
                      onPaymentSuccess={this.handlePaymentSuccess}
                      userEmail={user?.email}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/product/:productId"
                element={
                  <ProductDetails
                    addToCart={this.addToCart}
                    user={user}
                    onLogout={this.handleLogout}
                  />
                }
              />
              <Route
                path="/"
                element={
                  user ? (
                    <Home
                      user={user}
                      onLogout={this.handleLogout}
                      products={filteredProducts}
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onCategoryChange={this.handleCategoryChange}
                      addToCart={this.addToCart}
                      onSearch={this.handleSearch}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </div>
    );
  }
}

export default App;
