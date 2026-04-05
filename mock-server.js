const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

// Helper to read DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
// Helper to write DB
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');

// --- AUTH ---
app.get('/api/v1/auth/me', (req, res) => {
  const db = readDB();
  res.json(db.me);
});

// --- LEADS ---
app.get('/api/v1/leads/:id', (req, res) => {
  const db = readDB();
  const l = db.leads.find(l => l.id === req.params.id);
  if (l) res.json(l);
  else res.status(404).json({ detail: "Not Found" });
});

app.get('/api/v1/leads', (req, res) => {
  const db = readDB();
  res.json({ items: db.leads, total: db.leads.length, page: 1, pages: 1 });
});

app.post('/api/v1/leads', (req, res) => {
  const db = readDB();
  const newLead = {
    ...req.body,
    id: `ld_${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.leads.push(newLead);
  writeDB(db);
  res.status(201).json(newLead);
});

// --- CAMPAIGNS ---
app.get('/api/v1/campaigns/:id', (req, res) => {
  const db = readDB();
  const c = db.campaigns.find(c => c.id === req.params.id);
  if (c) res.json(c);
  else res.status(404).json({ detail: "Not Found" });
});

app.get('/api/v1/campaigns', (req, res) => {
  const db = readDB();
  res.json({ items: db.campaigns, total: db.campaigns.length, page: 1, pages: 1 });
});

app.post('/api/v1/campaigns', (req, res) => {
  const db = readDB();
  const newCampaign = {
    ...req.body,
    id: `cmp_${Date.now()}`,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  db.campaigns.push(newCampaign);
  writeDB(db);
  res.status(201).json(newCampaign);
});

app.put('/api/v1/campaigns/:id', (req, res) => {
  const db = readDB();
  const cid = req.params.id;
  const index = db.campaigns.findIndex(c => c.id === cid);
  if (index !== -1) {
    db.campaigns[index] = { ...db.campaigns[index], ...req.body, updated_at: new Date().toISOString() };
    writeDB(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/v1/campaigns/:id', (req, res) => {
  const db = readDB();
  db.campaigns = db.campaigns.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.status(204).send();
});

app.post('/api/v1/campaigns/:id/activate', (req, res) => {
  const db = readDB();
  const index = db.campaigns.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index].status = 'active';
    writeDB(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/v1/campaigns/:id/pause', (req, res) => {
  const db = readDB();
  const index = db.campaigns.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index].status = 'paused';
    writeDB(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.get('/api/v1/campaigns/:id/stats', (req, res) => {
  const db = readDB();
  const stats = db.stats[req.params.id] || {
    total_sent: 0, delivery_rate: 0, open_rate: 0, click_rate: 0, opt_out_rate: 0
  };
  res.json(stats);
});

app.get('/api/v1/campaigns/:id/leads', (req, res) => {
  const db = readDB();
  // Return some dummy matched leads
  res.json(db.leads.slice(0, 2));
});

// --- EVENTS (matches api.ts) ---
app.post('/signin', (req, res) => {
  res.json({ access_token: "mock_token_123", token_type: "bearer" });
});

app.get('/events', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

function daysFromTimeframe(tf, customDays) {
  switch (tf) {
    case '2_weeks': return 14;
    case '1_month': return 30;
    case '3_months': return 90;
    case 'custom': return Math.min(Math.max(Number(customDays) || 30, 7), 365);
    default: return 30;
  }
}

app.post('/search-events', (req, res) => {
  const db = readDB();
  const body = req.body || {};
  if (body.timeframe) {
    const days = daysFromTimeframe(body.timeframe, body.custom_days);
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);
    let results = db.events.filter((e) => {
      if (!e.start_time) return false;
      const start = new Date(e.start_time);
      return start >= now && start <= end;
    });
    if (body.categories && body.categories.length) {
      const cats = body.categories.map((c) => String(c).toLowerCase());
      results = results.filter((e) =>
        cats.some(
          (c) =>
            (e.category || '').toLowerCase().includes(c) ||
            (e.title || '').toLowerCase().includes(c) ||
            (e.description || '').toLowerCase().includes(c)
        )
      );
    }
    if (results.length === 0) results = db.events.slice(0, Math.min(3, db.events.length));
    return res.json(results);
  }
  const { query, location } = body;
  const q = (query || '').toLowerCase();
  const loc = (location || '').toLowerCase();
  const results = db.events.filter(e =>
    (!q || e.title.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q)) &&
    (!loc || (e.location_name || '').toLowerCase().includes(loc))
  );
  res.json(results);
});

function postEventCampaign(req, res) {
  const db = readDB();
  const { event_id } = req.params;
  const event = db.events.find(e => e.id === event_id);
  if (!event) return res.status(404).json({ detail: 'Event not found' });
  const existing = db.ad_campaigns.filter(c => c.event_id === event_id);
  if (existing.length > 0) return res.json(existing);
  const newCampaign = {
    id: `adc_${Date.now()}`,
    event_id,
    headline: `Don't Miss: ${event.title}`,
    body_text: `Book your stay at Utopia Hotel and experience ${event.title}. Limited availability!`,
    generated_image_url: null,
    target_audience: {},
    ai_rationale: `Generated campaign for event: ${event.title}`,
    status: 'ready',
    created_at: new Date().toISOString()
  };
  db.ad_campaigns.push(newCampaign);
  writeDB(db);
  res.json([newCampaign]);
}

app.post('/events/:event_id/campaigns', postEventCampaign);
app.post('/events/:event_id/campaign', postEventCampaign);

app.get('/campaigns', (req, res) => {
  const db = readDB();
  res.json(db.campaigns);
});

app.get('/campaigns/:campaign_id', (req, res) => {
  const db = readDB();
  const c = db.campaigns.find(x => x.id === req.params.campaign_id);
  if (c) res.json(c);
  else res.status(404).json({ detail: 'Not Found' });
});

app.get('/customers', (req, res) => {
  const db = readDB();
  res.json(db.customers || []);
});

app.post('/customers/import', (req, res) => {
  res.json({ imported: 12, skipped: 0, message: 'Mock import complete' });
});

function smsTemplateResponse(segment) {
  return {
    id: `sms_${Date.now()}`,
    segment,
    message_body: 'Welcome to Utopia — special offer inside.',
    discount_code: 'UT10',
    landing_page_url: 'https://example.com/offer',
    created_at: new Date().toISOString(),
  };
}

app.post('/sms-templates/existing', (req, res) => {
  res.json(smsTemplateResponse('existing'));
});

app.post('/sms-templates/lead', (req, res) => {
  res.json(smsTemplateResponse('lead'));
});

app.post('/sms-templates/:template_id/send', (req, res) => {
  res.json({ sent: 42, template_id: req.params.template_id });
});

// --- AI HUB --- 
app.get('/api/v1/ai/health', (req, res) => {
  res.json({ status: "healthy", version: "1.0.0", active_models: 3, latency_ms: 120 });
});

app.get('/api/v1/ai/usage', (req, res) => {
  res.json({ total_requests: 450, successful_requests: 448, avg_response_time: 1.2, estimated_cost: 0.15 });
});

app.post('/api/v1/ai/recommendations', (req, res) => {
  res.json({
    recommendations: [
      { campaign_type: "Win-back Campaign", target_segment: "Lapsed VIPs", expected_roi: 3.5, confidence: 0.92, reasoning: "VIP guests from 6 months ago show high rebooking propensity when offered incentives.", optional_send_time: "Friday 5pm", estimated_cost: 15, estimated_revenue: 1200 }
    ]
  });
});

app.post('/api/v1/ai/generate', (req, res) => {
  res.json({
    variants: [
      { id: "v1", text: "Hello! We've missed you at Utopia. Enjoy 15% off your next relaxing stay using code WELCOMEBACK. Book now!", confidence_score: 0.95 }
    ]
  });
});

// Catch all
app.use((req, res) => {
  res.status(404).json({ detail: `Endpoint not found: ${req.method} ${req.path}` });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Stateful Mock API Server running on port ${PORT}`);
  console.log(`Writing persistent data to db.json`);
});
