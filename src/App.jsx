
import { useEffect, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Cloud Cleanser',
    category: 'Cleansers',
    price: 24,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    name: 'Dew Drop Serum',
    category: 'Serums',
    price: 38,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    name: 'Daily Veil Cream',
    category: 'Moisturisers',
    price: 32,
    image:
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 4,
    name: 'Golden Hour SPF',
    category: 'Sun Care',
    price: 29,
    image:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=85',
  },
]

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('glowtheory-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [shippingMethod, setShippingMethod] = useState('standard')

  useEffect(() => {
    localStorage.setItem('glowtheory-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      )

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })

    setCartOpen(true)
    setSelectedProduct(null)
  }

  const changeQuantity = (id, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const shippingCost =
    cart.length === 0
      ? 0
      : shippingMethod === 'express'
        ? 12
        : cartTotal >= 75
          ? 0
          : 5

  const orderTotal = cartTotal + shippingCost

  const categories = [
    'All',
    'Cleansers',
    'Serums',
    'Moisturisers',
    'Sun Care',
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === 'All' ||
      product.category === activeCategory

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="site">
      <div className="announcement">
        YOUR DAILY RITUAL, ELEVATED — FREE SHIPPING OVER $50
      </div>

      <header className="navbar">
        <a
          className="logo"
          href="#home"
          onClick={() => setCheckoutOpen(false)}
        >
          GLOW THEORY<span>.</span>
        </a>

        <nav>
          <a href="#home" onClick={() => setCheckoutOpen(false)}>
            Home
          </a>
          <a href="#shop" onClick={() => setCheckoutOpen(false)}>
            Shop
          </a>
          <a href="#about" onClick={() => setCheckoutOpen(false)}>
            Our philosophy
          </a>
        </nav>

        <button
          className="bag-link"
          onClick={() => setCartOpen(true)}
        >
          MY BAG ({cartCount}) ↗
        </button>
      </header>

      {checkoutOpen ? (
        <section className="checkout-page">
          <button
            className="close-detail"
            onClick={() => setCheckoutOpen(false)}
          >
            ← BACK TO SHOP
          </button>

          <p className="eyebrow">ALMOST YOURS</p>
          <h1>Checkout</h1>
          <p className="checkout-intro">
            Your everyday ritual is just a few steps away.
          </p>

          <div className="checkout-layout">
            <form
              className="checkout-form"
              onSubmit={(event) => {
                event.preventDefault()
                alert(
                  'Payment setup is required before you can place a real order.'
                )
              }}
            >
              <h2>Contact information</h2>

              <label htmlFor="checkout-email">
                Email address
              </label>
              <input
                id="checkout-email"
                type="email"
                placeholder="you@example.com"
                required
              />

              <h2>Delivery address</h2>

              <label htmlFor="checkout-name">Full name</label>
              <input
                id="checkout-name"
                type="text"
                placeholder="Your full name"
                required
              />

              <label htmlFor="checkout-address">
                Street address
              </label>
              <input
                id="checkout-address"
                type="text"
                placeholder="House number and street"
                required
              />

              <label htmlFor="checkout-city">City</label>
              <input
                id="checkout-city"
                type="text"
                placeholder="Your city"
                required
              />

              <label htmlFor="checkout-postal">
                Postal code
              </label>
              <input
                id="checkout-postal"
                type="text"
                placeholder="Postal code"
                required
              />

              <h2>Shipping method</h2>

              <label className="shipping-option">
                <input
                  type="radio"
                  name="shipping"
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                />
                <span>
                  <strong>Standard delivery</strong>
                  <small>
                    Free on orders of $75 or more; otherwise $5
                  </small>
                </span>
              </label>

              <label className="shipping-option">
                <input
                  type="radio"
                  name="shipping"
                  value="express"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                />
                <span>
                  <strong>Express delivery</strong>
                  <small>$12</small>
                </span>
              </label>

              <button
                className="checkout-button"
                type="submit"
              >
                CONTINUE ↗
              </button>

              <p className="checkout-note">
                Online payments are not connected yet.
              </p>
            </form>

            <aside className="checkout-summary">
              <h2>Your order</h2>

              {cart.length === 0 ? (
                <p>Your bag is currently empty.</p>
              ) : (
                cart.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                ))
              )}

              <div className="summary-item">
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <div className="summary-item">
                <span>Shipping</span>
                <strong>
                  {shippingCost === 0
                    ? 'FREE'
                    : `$${shippingCost.toFixed(2)}`}
                </strong>
              </div>

              <div className="summary-total">
                <span>Estimated total</span>
                <strong>${orderTotal.toFixed(2)}</strong>
              </div>

              <p className="checkout-note">
                Taxes are not included.
              </p>
            </aside>
          </div>
        </section>
      ) : (
        <main>
          <section className="hero" id="home">
            <div className="hero-copy">
              <p className="eyebrow">LESS, BUT BETTER.</p>
              <h1>
                Good skin.
                <br />
                No complicated
                <br />
                <em>theories.</em>
              </h1>

              <p className="hero-description">
                Thoughtful skincare for your everyday ritual.
                Simple formulas, feel-good textures, and a
                glow that feels like you.
              </p>

              <a className="primary-button" href="#shop">
                DISCOVER YOUR ROUTINE ↗
              </a>

              <p className="hero-note">
                MADE FOR YOUR EVERYDAY GLOW.
              </p>
            </div>

            <div className="hero-image">
              <img
                src={products[1].image}
                alt="Skincare serum for your daily routine"
              />
              <div className="image-note">
                <span>01 / THE DAILY EDIT</span>
                <span>Simple skin rituals.</span>
              </div>
            </div>

            <span className="hero-decoration">
              GLOW
              <br />
              SLOW.
            </span>
          </section>

          <section className="benefits">
            <span>✳ THOUGHTFUL FORMULAS</span>
            <span>✳ EVERYDAY ESSENTIALS</span>
            <span>✳ LESS, BUT BETTER</span>
          </section>

          <section className="shop-section" id="shop">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR ROUTINE, REFINED</p>
                <h2>
                  The everyday <em>essentials.</em>
                </h2>
              </div>
              <p>
                Four simple steps towards feeling good in your skin.
              </p>
            </div>

            <div className="catalog-tools">
              <input
                className="product-search"
                type="search"
                placeholder="Search skincare products..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
              />

              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-chip ${
                      activeCategory === category ? 'active' : ''
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className="results-count">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}{' '}
                found
              </p>
            </div>

            {selectedProduct && (
              <div className="product-detail">
                <button
                  className="close-detail"
                  onClick={() => setSelectedProduct(null)}
                >
                  ← BACK TO COLLECTION
                </button>

                <div className="detail-layout">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />

                  <div className="detail-copy">
                    <p className="eyebrow">
                      {selectedProduct.category}
                    </p>
                    <h2>{selectedProduct.name}</h2>
                    <p className="detail-price">
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                    <p>
                      A thoughtful everyday skincare essential,
                      designed to make your daily routine feel
                      simple, refreshing, and enjoyable.
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      ADD TO BAG ↗
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <span className="product-tag">
                      {product.category}
                    </span>
                  </div>

                  <div className="product-info">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.category}</p>
                    </div>
                    <span>${product.price.toFixed(2)}</span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="add-button"
                      onClick={() => {
                        setSelectedProduct(product)
                        document
                          .getElementById('shop')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      VIEW DETAILS ↗
                    </button>

                    <button
                      className="add-button"
                      onClick={() => addToCart(product)}
                    >
                      + ADD TO BAG
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="philosophy" id="about">
            <p className="eyebrow">
              A LITTLE LESS, A LOT MORE YOU
            </p>
            <h2>
              Skincare should feel like
              <br />
              <em>self-care, not homework.</em>
            </h2>
            <p>
              We believe in thoughtful essentials, simple routines,
              and making a little time for yourself every day.
            </p>
            <a href="#shop" className="primary-button">
              FIND YOUR ESSENTIALS ↗
            </a>
          </section>
        </main>
      )}

      <footer className="footer">
        <a className="logo" href="#home">
          GLOW THEORY<span>.</span>
        </a>
        <p>Simple rituals. Everyday radiance.</p>
        <span>© 2026 GLOW THEORY</span>
      </footer>

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">
                  YOUR EVERYDAY ESSENTIALS
                </p>
                <h2>Your bag ({cartCount})</h2>
              </div>

              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your bag is waiting for a little glow.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setCartOpen(false)
                    setCheckoutOpen(false)
                    document
                      .getElementById('shop')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  EXPLORE THE COLLECTION
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>${item.price.toFixed(2)}</p>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() =>
                          setCart((currentCart) =>
                            currentCart.filter(
                              (cartItem) => cartItem.id !== item.id
                            )
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>${cartTotal.toFixed(2)}</strong>
                  </div>

                  <p>
                    Shipping and taxes calculated at checkout.
                  </p>

                  <button
                    className="checkout-button"
                    disabled={cart.length === 0}
                    onClick={() => {
                      setCartOpen(false)
                      setCheckoutOpen(true)
                    }}
                  >
                    CONTINUE TO CHECKOUT ↗
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
