# Debugging Guide: Lead-Based AI Template Generation

## Overview
The Messages page now generates AI templates based on:
1. **Lead Source** (PMS, CSV, Meta Ads, Data Broker, Manual)
2. **Loyalty Type** (VIP, Loyal, New, Dormant)

## How to Debug

### 1. Enable Debug Panel
1. Navigate to `/messages` page
2. Select any campaign from the sidebar
3. Click the **"Debug"** button in the top-right header
4. The debug panel will slide in from the left

### 2. Debug Panel Features

#### **Selected Lead Info**
Shows details of the currently selected lead:
- Name
- Source (PMS, CSV, Meta Ads, etc.)
- Total Bookings
- Total Revenue
- Segment (hot/warm/cold/unqualified)

#### **AI Strategy**
Shows how the AI determines the template:
- **Loyalty Type**: Calculated based on booking history
  - `VIP`: 5+ bookings
  - `Loyal`: 2+ bookings, last booking < 90 days ago
  - `New`: 1 booking only
  - `Dormant`: 1 booking, last booking > 180 days ago

- **Campaign Goal**: Auto-selected based on loyalty type
  - VIP → `loyalty` (reward program)
  - Loyal → `upsell` (premium offers)
  - Dormant → `re_engagement` (win-back)
  - New → `booking` (conversion)

- **Tone**: Auto-selected based on source + loyalty
  - VIP → `professional`
  - PMS leads → `friendly`
  - Meta Ads → `casual`
  - Default → `professional`

#### **Audience Stats**
- Total leads in campaign
- Average bookings per lead
- Average revenue per lead

#### **Source Distribution**
Visual bar chart showing lead breakdown by source:
- PMS Integration
- CSV Upload
- Meta Ads
- Data Broker
- Manual Entry

#### **Loyalty Distribution**
Visual bar chart showing lead breakdown by loyalty type:
- VIP (purple)
- Loyal (green)
- New (blue)
- Dormant (orange)

### 3. Testing Different Lead Types

#### **Select Different Leads**
In the "Active Contacts" sidebar (right side):
- Click on any lead to select it
- Selected lead will have:
  - Pink/utopia background
  - Pink border
  - Pink indicator dot
- The debug panel updates instantly
- Click "AI Template" to generate message for that specific lead

#### **Lead Card Shows**
- Name
- Loyalty badge (VIP/Loyal/New/Dormant) with color coding
- Phone number
- Source
- Number of bookings

### 4. AI Template Generation Flow

```
User clicks "AI Template"
    ↓
System analyzes selected lead:
  - Checks booking history → determines loyalty type
  - Checks source → determines tone
  - Maps loyalty type → campaign goal
    ↓
Sends request to AI with:
  - lead_id
  - campaign_goal (loyalty/upsell/re_engagement/booking)
  - tone (professional/friendly/casual)
  - channel (sms)
  - language (from lead profile)
  - personalization_data (name, bookings, source, loyalty_type)
    ↓
AI generates personalized message
    ↓
Message appears in preview area
    ↓
User can click to apply to broadcast
```

## Testing Scenarios

### Scenario 1: VIP Guest
**Setup:**
- Lead with 5+ bookings
- High revenue
- PMS source

**Expected:**
- Loyalty Type: `VIP`
- Campaign Goal: `loyalty`
- Tone: `professional`
- Message: Exclusive rewards, premium treatment

### Scenario 2: New Guest
**Setup:**
- Lead with 1 booking
- Recent booking date
- Meta Ads source

**Expected:**
- Loyalty Type: `New`
- Campaign Goal: `booking`
- Tone: `casual`
- Message: Welcome offer, first-time discount

### Scenario 3: Dormant Guest
**Setup:**
- Lead with 1 booking
- Last booking > 180 days ago
- PMS source

**Expected:**
- Loyalty Type: `Dormant`
- Campaign Goal: `re_engagement`
- Tone: `friendly`
- Message: "We miss you", win-back offer

### Scenario 4: Loyal Guest
**Setup:**
- Lead with 2-4 bookings
- Recent activity (< 90 days)
- CSV source

**Expected:**
- Loyalty Type: `Loyal`
- Campaign Goal: `upsell`
- Tone: `professional`
- Message: Premium room upgrade, special amenities

## Console Debugging

### Check Lead Analysis
Open browser console and type:
```javascript
// The leadAnalysis object is calculated in useMemo
// You can inspect it by adding console.log in the component
```

### Check API Request
When you click "AI Template", check Network tab:
- Look for POST to `/api/v1/ai/generate-message`
- Inspect request payload:
  ```json
  {
    "lead_id": "uuid",
    "campaign_goal": "loyalty",
    "tone": "professional",
    "channel": "sms",
    "language": "en",
    "max_length": 160,
    "personalization_data": {
      "first_name": "John",
      "last_name": "Doe",
      "total_bookings": 5,
      "source": "pms",
      "loyalty_type": "vip"
    }
  }
  ```

## Common Issues

### Issue 1: No leads showing
**Cause:** Campaign has no target leads
**Fix:** 
1. Go to Campaigns page
2. Edit campaign
3. Set target segments or filters
4. Ensure leads match the criteria

### Issue 2: AI template not generating
**Cause:** No lead selected or API error
**Fix:**
1. Check debug panel shows selected lead
2. Check browser console for errors
3. Verify backend is running
4. Check API endpoint is accessible

### Issue 3: Wrong loyalty type calculated
**Cause:** Lead data incomplete
**Fix:**
1. Check lead has `total_bookings` field
2. Check lead has `last_booking_date` field
3. Update lead data in database or via API

### Issue 4: Debug panel not showing
**Cause:** No campaign selected
**Fix:**
1. Select a campaign from left sidebar
2. Wait for leads to load
3. Click "Debug" button

## Data Requirements

For proper functionality, leads must have:
- ✅ `id` (UUID)
- ✅ `first_name`
- ✅ `last_name`
- ✅ `phone`
- ✅ `source` (pms/csv/meta_ads/data_broker/manual)
- ✅ `total_bookings` (number, default 0)
- ✅ `total_revenue` (number, default 0)
- ✅ `last_booking_date` (ISO date string or null)
- ✅ `segment` (hot/warm/cold/unqualified or null)
- ✅ `language` (en/am, default 'en')

## Visual Indicators

### Loyalty Type Colors
- 🟣 **VIP**: Purple badge
- 🟢 **Loyal**: Green badge
- 🔵 **New**: Blue badge
- 🟠 **Dormant**: Orange badge

### Segment Colors
- 🔴 **Hot**: Red background
- 🟠 **Warm**: Orange background
- 🔵 **Cold**: Blue background
- ⚪ **Unqualified**: Gray background

### Selection State
- Selected lead: Pink/utopia border and background
- Unselected lead: Gray border and background

## Next Steps

1. **Test with real data**: Import leads with varied booking histories
2. **Monitor AI responses**: Check if messages match loyalty types
3. **A/B test**: Compare conversion rates by loyalty segment
4. **Refine logic**: Adjust loyalty type thresholds based on results
5. **Add more factors**: Consider seasonality, room preferences, etc.

## API Endpoints Used

- `GET /api/v1/campaigns` - List campaigns
- `GET /api/v1/campaigns/{id}/leads` - Get target leads
- `POST /api/v1/ai/generate-message` - Generate AI template
- `POST /api/v1/campaigns/{id}/execute` - Send broadcast

## Performance Notes

- Lead analysis runs in `useMemo` - only recalculates when leads change
- Debug panel is conditionally rendered - no performance impact when hidden
- Lead selection is instant - no API calls
- AI generation is async - shows loading state

---

**Happy Debugging! 🐛✨**
