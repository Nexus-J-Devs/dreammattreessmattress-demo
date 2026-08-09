import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MATTRESSES, INITIAL_DISCOUNTS } from './src/data/mattresses';
import { Mattress, QuizAnswers, QuizSubmission, DiscountPromo, WSNotification } from './src/types';

const PORT = 3000;
const app = express();
app.use(express.json());

// Server-side state store
let products: Mattress[] = [...INITIAL_MATTRESSES];
let discounts: DiscountPromo[] = [...INITIAL_DISCOUNTS];
let quizSubmissions: QuizSubmission[] = [
  {
    id: 'qs-101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    answers: {
      sleepPosition: 'side',
      firmnessPreference: 'medium-soft',
      temperature: 'hot',
      painPoints: ['lower_back', 'shoulders'],
      bodyType: 'average',
      budget: 'mid',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.v@example.com',
      customerPhone: '+1 (555) 234-5678'
    },
    recommendedProduct: INITIAL_MATTRESSES[0],
    matchScore: 96,
    status: 'New',
    notes: 'Requested white-glove setup on a Friday morning.'
  },
  {
    id: 'qs-102',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    answers: {
      sleepPosition: 'back',
      firmnessPreference: 'firm',
      temperature: 'neutral',
      painPoints: ['lower_back'],
      bodyType: 'heavy',
      budget: 'luxury',
      customerName: 'Robert Miller',
      customerEmail: 'rmiller1952@example.com',
      customerPhone: '+1 (555) 876-5432'
    },
    recommendedProduct: INITIAL_MATTRESSES[3],
    matchScore: 98,
    status: 'Contacted',
    notes: 'Inquired about orthopedic firmness for lower lumbar back pain.'
  }
];

// Admin session store
const adminSessions = new Set<string>();
const DEMO_ADMIN_TOKEN = 'DH_ADMIN_SECRET_SESSION_2026';
adminSessions.add(DEMO_ADMIN_TOKEN);

// Create HTTP Server & WebSocket Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const wsClients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  wsClients.add(ws);
  
  // Send welcome notification
  const welcomeMsg: WSNotification = {
    id: `ws-${Date.now()}`,
    type: 'SYSTEM',
    title: 'WebSocket Live Feed Connected',
    message: 'Real-time inventory & customer alert channel active.',
    timestamp: new Date().toISOString(),
    severity: 'info'
  };
  ws.send(JSON.stringify(welcomeMsg));

  ws.on('close', () => {
    wsClients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket Error:', err);
    wsClients.delete(ws);
  });
});

// Broadcast helper function
function broadcastNotification(notification: WSNotification) {
  const payload = JSON.stringify(notification);
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Authentication Middleware for Role-Based Access Control (/admin)
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token || (!adminSessions.has(token) && !token.startsWith('DH_ADMIN_') && token !== DEMO_ADMIN_TOKEN)) {
    res.status(403).json({
      error: 'Forbidden: Admin authorization required.',
      message: 'Access to /admin endpoints is strictly reserved for authenticated administrators.'
    });
    return;
  }
  next();
}

// PUBLIC API ROUTES
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  // Demo check: accept email with admin or password 'dreamhaven2026' or admin role request
  if (
    role === 'admin' ||
    email?.includes('admin') ||
    password === 'dreamhaven2026'
  ) {
    const newToken = `DH_ADMIN_SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    adminSessions.add(newToken);
    res.json({
      success: true,
      session: {
        role: 'admin',
        token: newToken,
        email: email || 'admin@dreamhaven.example',
        name: 'Store Administrator'
      }
    });
  } else {
    res.json({
      success: true,
      session: {
        role: 'customer',
        email: email || 'guest@example.com',
        name: 'Valued Customer'
      }
    });
  }
});

// Get Products
app.get('/api/products', (_req, res) => {
  res.json({ products });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product });
});

// Sleep Quiz Submission
app.post('/api/quiz', (req, res) => {
  const answers: QuizAnswers = req.body;
  
  // Quiz matching logic algorithm
  let bestMatch = products[0];
  let highestScore = 85;

  products.forEach(p => {
    let score = 75;
    if (answers.sleepPosition === 'side' && p.category === 'Hybrid') score += 15;
    if (answers.sleepPosition === 'back' && (p.category === 'Orthopedic' || p.category === 'Organic Latex')) score += 18;
    if (answers.firmnessPreference === 'firm' && p.firmness >= 7) score += 12;
    if (answers.firmnessPreference === 'soft' && p.firmness <= 5) score += 12;
    if (answers.temperature === 'hot' && (p.category === 'Cooling Gel' || p.coolingTech.includes('Cooling'))) score += 18;
    if (answers.painPoints?.includes('lower_back') && p.isBestForBackPain) score += 15;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = p;
    }
  });

  if (highestScore > 99) highestScore = 99;

  const newSubmission: QuizSubmission = {
    id: `qs-${Date.now()}`,
    timestamp: new Date().toISOString(),
    answers,
    recommendedProduct: bestMatch,
    matchScore: highestScore,
    status: 'New'
  };

  quizSubmissions.unshift(newSubmission);

  // Broadcast WebSocket notification to Admin Dashboard!
  broadcastNotification({
    id: `notif-${Date.now()}`,
    type: 'QUIZ_SUBMISSION',
    title: 'New Customer Sleep Quiz Lead!',
    message: `${answers.customerName || 'A customer'} submitted the sleep quiz (${answers.sleepPosition} sleeper, prefers ${answers.firmnessPreference} firmness). Recommended: ${bestMatch.name}.`,
    timestamp: new Date().toISOString(),
    severity: 'info',
    data: newSubmission
  });

  res.json({
    submission: newSubmission,
    recommendedProduct: bestMatch,
    matchScore: highestScore
  });
});

// Discounts Public Route
app.get('/api/discounts', (_req, res) => {
  res.json({ discounts: discounts.filter(d => d.isActive) });
});

// PROTECTED ADMIN API ROUTES
app.get('/api/admin/verify', requireAdminAuth, (_req, res) => {
  res.json({ status: 'authenticated', role: 'admin' });
});

app.get('/api/admin/quiz-submissions', requireAdminAuth, (_req, res) => {
  res.json({ submissions: quizSubmissions });
});

app.patch('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const prevStock = products[index].stock;
  const updatedProduct = { ...products[index], ...req.body };
  products[index] = updatedProduct;

  // Broadcast Inventory Update event
  broadcastNotification({
    id: `notif-${Date.now()}`,
    type: 'INVENTORY_UPDATE',
    title: 'Product Details Updated',
    message: `${updatedProduct.name} updated: Price $${updatedProduct.price}, Stock ${updatedProduct.stock} units.`,
    timestamp: new Date().toISOString(),
    severity: 'info',
    data: updatedProduct
  });

  // Check for Low Stock threshold alert! (< 5)
  if (updatedProduct.stock <= 5 && prevStock > 5) {
    broadcastNotification({
      id: `lowstock-${Date.now()}`,
      type: 'LOW_STOCK',
      title: '🚨 CRITICAL LOW STOCK ALERT!',
      message: `${updatedProduct.name} inventory has dropped to ${updatedProduct.stock} unit(s) remaining! Immediate reorder required.`,
      timestamp: new Date().toISOString(),
      severity: 'danger',
      data: { productId: updatedProduct.id, stock: updatedProduct.stock }
    });
  }

  res.json({ product: updatedProduct });
});

app.post('/api/admin/products', requireAdminAuth, (req, res) => {
  const newProduct: Mattress = {
    id: `dh-${Date.now()}`,
    name: req.body.name || 'New Dream Haven Mattress',
    tagline: req.body.tagline || 'Engineered for restorative sleep',
    price: Number(req.body.price) || 999,
    originalPrice: Number(req.body.originalPrice) || 1299,
    rating: 5.0,
    reviewCount: 1,
    firmness: Number(req.body.firmness) || 6,
    firmnessLabel: req.body.firmnessLabel || 'Medium (6/10)',
    stock: Number(req.body.stock) || 10,
    category: req.body.category || 'Hybrid',
    coolingTech: req.body.coolingTech || 'Airflow Gel Foam',
    thickness: req.body.thickness || '12 Inches',
    coilCount: req.body.coilCount || '1,000 Pocket Springs',
    trialPeriod: '100 Nights Risk-Free',
    warranty: '10-Year Warranty',
    image: req.body.image || INITIAL_MATTRESSES[0].image,
    features: req.body.features || ['Premium Support', 'Breathable Fabric'],
    description: req.body.description || 'Custom crafted mattress for maximum comfort.',
    layers: req.body.layers || [
      { title: 'Quilted Upholstery Top', depth: '1.5"', description: 'Ultra soft breathable fabric cover.' },
      { title: 'Supportive Core', depth: '10.5"', description: 'High density pressure relieving base.' }
    ]
  };

  products.unshift(newProduct);

  broadcastNotification({
    id: `notif-${Date.now()}`,
    type: 'INVENTORY_UPDATE',
    title: 'New Product Added',
    message: `${newProduct.name} was added to store inventory ($${newProduct.price}, Stock: ${newProduct.stock}).`,
    timestamp: new Date().toISOString(),
    severity: 'success',
    data: newProduct
  });

  res.json({ product: newProduct });
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const p = products.find(prod => prod.id === id);
  products = products.filter(prod => prod.id !== id);

  broadcastNotification({
    id: `notif-${Date.now()}`,
    type: 'INVENTORY_UPDATE',
    title: 'Product Removed',
    message: `${p ? p.name : id} was removed from the product catalog.`,
    timestamp: new Date().toISOString(),
    severity: 'warning'
  });

  res.json({ success: true });
});

app.post('/api/admin/sales', requireAdminAuth, (req, res) => {
  const newPromo: DiscountPromo = {
    id: `promo-${Date.now()}`,
    code: req.body.code?.toUpperCase() || 'FALLSALE',
    title: req.body.title || 'Seasonal Promo',
    discountType: req.body.discountType || 'fixed',
    discountValue: Number(req.body.discountValue) || 100,
    description: req.body.description || 'Limited time mattress store discount',
    isActive: true,
    validUntil: req.body.validUntil || '2026-12-31'
  };

  discounts.push(newPromo);

  broadcastNotification({
    id: `notif-${Date.now()}`,
    type: 'NEW_SALE',
    title: 'New Discount Campaign Launched',
    message: `Promo code ${newPromo.code} (${newPromo.title}) is now live!`,
    timestamp: new Date().toISOString(),
    severity: 'success',
    data: newPromo
  });

  res.json({ discount: newPromo });
});

app.delete('/api/admin/sales/:id', requireAdminAuth, (req, res) => {
  discounts = discounts.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

// Demo Route: Simulate Low Stock Trigger
app.post('/api/admin/simulate-low-stock', requireAdminAuth, (req, res) => {
  const targetId = req.body.productId || products[1]?.id || products[0]?.id;
  const product = products.find(p => p.id === targetId);

  if (product) {
    product.stock = 2; // drop to critical low stock
    broadcastNotification({
      id: `lowstock-${Date.now()}`,
      type: 'LOW_STOCK',
      title: '🚨 CRITICAL LOW STOCK ALERT!',
      message: `${product.name} inventory has dropped to ${product.stock} unit(s) remaining! Immediate reorder required.`,
      timestamp: new Date().toISOString(),
      severity: 'danger',
      data: { productId: product.id, stock: product.stock }
    });
    res.json({ success: true, message: 'Low stock notification broadcasted over WebSocket.', product });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// START EXPRESS & VITE MIDDLEWARE
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Dream Haven Server running at http://localhost:${PORT}`);
  });
}

startServer();
