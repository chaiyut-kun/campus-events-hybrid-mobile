const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'mock-db.json');

// ── Database Helpers ─────────────────────────────────────────────────────────

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      initDb();
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[mock-server] Error reading database:', err);
    return { users: [], events: [], registrations: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[mock-server] Error writing database:', err);
  }
}

function initDb() {
  const initialData = {
    users: [
      {
        id: 'usr-001',
        email: 'student@campus.ac.th',
        password: 'password123',
        studentId: '65070001',
        name: 'สมชาย ใจดี',
        faculty: 'คณะเทคโนโลยีสารสนเทศ',
        role: 'student',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'usr-002',
        email: 'organizer@campus.ac.th',
        password: 'password123',
        studentId: '64070099',
        name: 'วิภาดา รักเรียน',
        faculty: 'สโมสรนักศึกษา',
        role: 'organizer',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      },
    ],
    events: [
      {
        id: 'evt-001',
        title: 'Campus Hackathon 2026: AI for Good',
        description:
          'Join 48 hours of intense coding, collaboration, and rapid prototyping to solve real-world sustainability challenges using modern mobile and AI technologies.',
        startsAt: '2026-10-15T09:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
        location: {
          name: 'Innovative Learning Hub, 4th Floor',
          latitude: 13.7563,
          longitude: 100.5018,
        },
        category: 'Technology',
      },
      {
        id: 'evt-002',
        title:
          'International Symposium on Next-Generation Cyber-Physical Systems, Autonomous Robotics, and Distributed Ledger Architectures',
        description:
          'This multi-track symposium brings together leading academic researchers, industry innovators, and postgraduate students from over twenty regional universities.',
        startsAt: '2026-10-22T13:30:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
        location: {
          name: 'Grand Auditorium & Exhibition Hall A',
          latitude: 13.758,
          longitude: 100.503,
        },
        category: 'Academic',
      },
      {
        id: 'evt-003',
        title: 'Annual Inter-Faculty Badminton Championship',
        description:
          'Cheer for your faculty team or compete in singles and doubles tournaments. Free entry for all verified university students and alumni.',
        startsAt: '2026-11-05T08:00:00Z',
        location: {
          name: 'University Sports Gymnasium 2',
          latitude: 13.7545,
          longitude: 100.499,
        },
        category: 'Sports',
      },
      {
        id: 'evt-004',
        title: 'Acoustic Sunset & Indie Music Night',
        description:
          'Relax after midterm exams with student indie bands, food trucks, and acoustic performances under the campus lawn trees.',
        startsAt: '2026-11-12T17:00:00Z',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
        location: {
          name: 'Central Garden Lawn Amphitheater',
          latitude: 13.7572,
          longitude: 100.5025,
        },
        category: 'Entertainment',
      },
    ],
    registrations: [],
  };
  writeDb(initialData);
  return initialData;
}

// ── IP Address Detection ─────────────────────────────────────────────────────

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// ── Server Request Handler ───────────────────────────────────────────────────

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function extractBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7).trim();
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${pathname}`);

  try {
    const db = readDb();

    // ── Root / Health ────────────────────────────────────────────────────────
    if (pathname === '/' || pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'campus-events-mock-backend',
        endpoints: [
          '/auth/login',
          '/auth/me',
          '/auth/refresh',
          '/auth/logout',
          '/events',
          '/events/:id',
          '/events/:id/registrations',
        ],
      });
    }

    // ── Authentication Endpoints (Lab 8) ────────────────────────────────────

    // POST /auth/login
    if (pathname === '/auth/login' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { email, password, studentId } = body;

      const user = db.users.find(
        (u) =>
          (u.email.toLowerCase() === (email || '').toLowerCase() ||
            u.studentId === (studentId || email)) &&
          u.password === password,
      );

      if (!user) {
        return sendJson(res, 401, {
          message: 'อีเมล/รหัสนักศึกษา หรือรหัสผ่านไม่ถูกต้อง',
          code: 'INVALID_CREDENTIALS',
        });
      }

      const accessToken = `mock-access-${user.id}-${Date.now()}`;
      const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

      const { password: _, ...userProfile } = user;

      return sendJson(res, 200, {
        accessToken,
        refreshToken,
        user: userProfile,
      });
    }

    // GET /auth/me
    if (pathname === '/auth/me' && method === 'GET') {
      const token = extractBearerToken(req);
      if (!token || token.startsWith('expired-')) {
        return sendJson(res, 401, {
          message: 'Token ไม่ถูกต้องหรือหมดอายุ',
          code: 'UNAUTHORIZED',
        });
      }

      // Extract user id from token (mock format: mock-access-<userId>-<timestamp>)
      const parts = token.split('-');
      const userId = parts[2] ? `usr-${parts[2]}` : null;
      const user = db.users.find((u) => u.id === userId) || db.users[0];

      if (!user) {
        return sendJson(res, 401, {
          message: 'ไม่พบผู้ใช้',
          code: 'USER_NOT_FOUND',
        });
      }

      const { password: _, ...userProfile } = user;
      return sendJson(res, 200, { user: userProfile });
    }

    // POST /auth/refresh
    if (pathname === '/auth/refresh' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { refreshToken } = body;

      if (!refreshToken || refreshToken.startsWith('invalid-')) {
        return sendJson(res, 401, {
          message: 'Refresh token ไม่ถูกต้องหรือหมดอายุ',
          code: 'INVALID_REFRESH_TOKEN',
        });
      }

      const parts = refreshToken.split('-');
      const userId = parts[2] ? `usr-${parts[2]}` : 'usr-001';

      const newAccessToken = `mock-access-${userId}-${Date.now()}`;
      const newRefreshToken = `mock-refresh-${userId}-${Date.now()}`;

      return sendJson(res, 200, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }

    // POST /auth/logout
    if (pathname === '/auth/logout' && method === 'POST') {
      return sendJson(res, 200, {
        message: 'ออกจากระบบสำเร็จ',
      });
    }

    // ── Events Endpoints (Lab 6) ─────────────────────────────────────────────

    // GET /events
    if (pathname === '/events' && method === 'GET') {
      let events = db.events;
      const category = parsedUrl.query.category;
      const search = parsedUrl.query.search;

      if (category) {
        events = events.filter((e) => e.category === category);
      }
      if (search) {
        const query = search.toLowerCase();
        events = events.filter(
          (e) =>
            e.title.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query),
        );
      }

      return sendJson(res, 200, events);
    }

    // GET /events/:id
    const eventMatch = pathname.match(/^\/events\/([^/]+)$/);
    if (eventMatch && method === 'GET') {
      const id = eventMatch[1];
      const event = db.events.find((e) => e.id === id);

      if (!event) {
        return sendJson(res, 404, {
          message: 'ไม่พบกิจกรรมที่ต้องการ',
          code: 'NOT_FOUND',
        });
      }

      return sendJson(res, 200, event);
    }

    // POST /events
    if (pathname === '/events' && method === 'POST') {
      const body = await parseRequestBody(req);
      const newEvent = {
        id: `evt-${Date.now()}`,
        ...body,
      };

      db.events.unshift(newEvent);
      writeDb(db);

      return sendJson(res, 201, newEvent);
    }

    // POST /events/:id/registrations
    const regMatch = pathname.match(/^\/events\/([^/]+)\/registrations$/);
    if (regMatch && method === 'POST') {
      const eventId = regMatch[1];
      const body = await parseRequestBody(req);
      const email = body.email || body.studentId;

      // Duplicate check (Lab 6: 409 Conflict)
      const existing = db.registrations.find(
        (r) => r.eventId === eventId && r.email === email,
      );

      if (existing) {
        return sendJson(res, 409, {
          message: 'คุณได้ลงทะเบียนกิจกรรมนี้ไปแล้ว',
          code: 'ALREADY_REGISTERED',
        });
      }

      const registration = {
        id: `reg-${Date.now()}`,
        eventId,
        ...body,
        registeredAt: new Date().toISOString(),
      };

      db.registrations.push(registration);
      writeDb(db);

      return sendJson(res, 201, {
        success: true,
        registrationId: registration.id,
      });
    }

    // POST /dev/reset
    if (pathname === '/dev/reset' && method === 'POST') {
      const freshData = initDb();
      return sendJson(res, 200, {
        message: 'รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว',
        eventsCount: freshData.events.length,
      });
    }

    // 404 Not Found for any other route
    return sendJson(res, 404, {
      message: `ไม่พบ Endpoint: ${method} ${pathname}`,
      code: 'ROUTE_NOT_FOUND',
    });
  } catch (err) {
    console.error('[mock-server] Internal Server Error:', err);
    return sendJson(res, 500, {
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์จำลอง',
      error: err.message,
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log('\n======================================================');
  console.log('🚀 Campus Events Mock REST API Server is running!');
  console.log('======================================================');
  console.log(`📡 Localhost:     http://localhost:${PORT}`);
  ips.forEach((ip) => {
    console.log(`📱 LAN Network:   http://${ip}:${PORT}`);
  });
  console.log('------------------------------------------------------');
  console.log('💡 เพื่อทดสอบบนมือถือจริง (Expo Go):');
  if (ips.length > 0) {
    console.log(`   เพิ่มในไฟล์ .env:  EXPO_PUBLIC_API_URL=http://${ips[0]}:${PORT}`);
  } else {
    console.log(`   เพิ่มในไฟล์ .env:  EXPO_PUBLIC_API_URL=http://localhost:${PORT}`);
  }
  console.log('------------------------------------------------------');
  console.log('👤 บัญชีทดสอบ (Demo Accounts):');
  console.log('   1. นักศึกษา:    student@campus.ac.th   / password123');
  console.log('   2. ผู้จัดงาน:   organizer@campus.ac.th / password123');
  console.log('======================================================\n');
});
