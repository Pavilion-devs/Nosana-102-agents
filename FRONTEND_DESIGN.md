# NEXUS IoT - Frontend Design Specification

## 🎨 Visual Overview

The frontend is a **dark-themed real-time dashboard** with a split-screen layout combining device monitoring and AI chat.

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  NEXUS                                        [User Avatar] [Logout]│
│  AI IoT Dashboard                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐│
│  │    DEVICES GRID (70%)        │  │   AI CHAT PANEL (30%)        ││
│  │                              │  │                              ││
│  │  ┌────────┐  ┌────────┐     │  │  💬 NEXUS AI Assistant       ││
│  │  │ Temp   │  │ Fan    │     │  │  ─────────────────────       ││
│  │  │ 🌡️     │  │ 🌀     │     │  │                              ││
│  │  │ 25.4°C │  │ Speed:2│     │  │  [Chat Messages]             ││
│  │  │ Online │  │ Off    │     │  │                              ││
│  │  └────────┘  └────────┘     │  │                              ││
│  │                              │  │  You: List devices           ││
│  │  ┌────────┐  ┌────────┐     │  │  NEXUS: Here are all...      ││
│  │  │ Humid  │  │ AC     │     │  │                              ││
│  │  │ 💧     │  │ ❄️     │     │  │  ─────────────────────       ││
│  │  │ 52%    │  │ 24°C   │     │  │                              ││
│  │  │ Online │  │ Off    │     │  │  [Type your message...]  [→] ││
│  │  └────────┘  └────────┘     │  │                              ││
│  │                              │  └──────────────────────────────┘│
│  │  [More devices...]           │                                  │
│  │                              │                                  │
│  └──────────────────────────────┘                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  📊 TELEMETRY CHARTS                                          │ │
│  │  [Temperature Graph] [Power Consumption] [Humidity Graph]     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Main Components

### 1. **Device Cards** (Left Side - 70% width)

Each device card shows:

```
┌─────────────────────────────┐
│ 🌡️  Living Room Temp        │ ← Icon + Name
│                             │
│     25.4°C                  │ ← Large primary value
│                             │
│ Status: ● Online            │ ← Status indicator (green dot)
│ Location: Living Room       │
│ Last Update: 2 sec ago      │ ← Real-time countdown
│                             │
│ [View Details]              │ ← Expands telemetry
└─────────────────────────────┘
```

**Device Card Variants by Type:**

#### Temperature Sensor
```
┌─────────────────────────────┐
│ 🌡️  Living Room Temp        │
│     27.6°C                  │
│     ● Online                │
│     Updated: 1s ago         │
└─────────────────────────────┘
```

#### Fan (Controllable)
```
┌─────────────────────────────┐
│ 🌀  Ceiling Fan              │
│     Speed: 2 / RPM: 1600    │
│     ⚫ Off                   │
│                             │
│  [Turn On] [Speed ▲] [▼]   │ ← Control buttons
└─────────────────────────────┘
```

#### Air Conditioner (Controllable)
```
┌─────────────────────────────┐
│ ❄️  Air Conditioner          │
│     Target: 24°C            │
│     Current: 27.3°C         │
│     ⚫ Off                   │
│                             │
│  [Turn On] [Temp: 24°C ▲▼] │ ← Temp controls
└─────────────────────────────┘
```

#### Smart Light (Controllable)
```
┌─────────────────────────────┐
│ 💡  Living Room Light        │
│     Brightness: 80%         │
│     ● On                    │
│                             │
│  [Toggle] [Brightness: ▬▬▬▬▬▬━━━━] │ ← Slider
└─────────────────────────────┘
```

#### Power Monitor
```
┌─────────────────────────────┐
│ ⚡  Power Monitor            │
│     150.2W                  │
│     Voltage: 230V           │
│     ● Online                │
│     💰 $0.15/hr             │ ← Cost estimate
└─────────────────────────────┘
```

---

### 2. **AI Chat Panel** (Right Side - 30% width)

```
┌────────────────────────────────┐
│  💬 NEXUS AI Assistant         │
│  Your intelligent IoT helper   │
├────────────────────────────────┤
│                                │
│  [Chat message history]        │
│                                │
│  User (You):                   │
│  ┌──────────────────────────┐ │
│  │ What's the temperature   │ │
│  │ in the living room?      │ │
│  └──────────────────────────┘ │
│  2 min ago                     │
│                                │
│  NEXUS:                        │
│  ┌──────────────────────────┐ │
│  │ The current temperature  │ │
│  │ in the living room is    │ │
│  │ 25.4°C.                  │ │
│  │                          │ │
│  │ Would you like me to     │ │
│  │ turn on the fan?         │ │
│  └──────────────────────────┘ │
│  2 min ago                     │
│                                │
│  [Typing indicator...]         │ ← Shows when agent is thinking
│                                │
├────────────────────────────────┤
│  Type your message...      [→]│
└────────────────────────────────┘
```

**Chat Features:**
- Auto-scroll to latest message
- Typing indicator when agent is responding
- Message timestamps
- Markdown rendering for formatted responses
- Tool execution indicators

---

### 3. **Device Control Confirmation Modal** ⚠️

**This is the KEY component you asked about!**

When user tries to control a device (via button OR AI chat), show:

```
┌───────────────────────────────────────────┐
│  ⚠️  Confirm Device Action                │
├───────────────────────────────────────────┤
│                                           │
│  You are about to:                        │
│                                           │
│  🌀 Turn ON                               │
│     Ceiling Fan (device_fan_001)          │
│     Location: Living Room                 │
│                                           │
│  Current State: Off                       │
│  New State: On (Speed: 2)                 │
│                                           │
│  ⚡ Estimated Power: 60W                  │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │ ⚠️ This action will be executed     │ │
│  │   immediately and may affect        │ │
│  │   connected devices.                │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  [Cancel]         [✓ Confirm Action]     │
│                                           │
└───────────────────────────────────────────┘
```

**Confirmation Modal - Different Scenarios:**

#### Scenario 1: Turn On Fan
```
┌────────────────────────────────────┐
│  ⚠️  Confirm Device Action         │
├────────────────────────────────────┤
│  Action: Turn ON                   │
│  Device: 🌀 Ceiling Fan            │
│  ID: device_fan_001                │
│                                    │
│  Changes:                          │
│  • State: Off → On                 │
│  • Speed: Will start at level 2    │
│  • Power: ~60W                     │
│                                    │
│  [Cancel]  [Confirm]               │
└────────────────────────────────────┘
```

#### Scenario 2: Adjust AC Temperature
```
┌────────────────────────────────────┐
│  ⚠️  Confirm Device Action         │
├────────────────────────────────────┤
│  Action: Set Temperature           │
│  Device: ❄️ Air Conditioner        │
│  ID: device_ac_001                 │
│                                    │
│  Changes:                          │
│  • Temperature: 24°C → 22°C        │
│  • Mode: Cool (unchanged)          │
│  • Power: ~1200W (increased)       │
│                                    │
│  💡 Lower temperature = higher     │
│     energy consumption             │
│                                    │
│  [Cancel]  [Confirm]               │
└────────────────────────────────────┘
```

#### Scenario 3: AI Agent Initiated Action
```
┌────────────────────────────────────┐
│  🤖 AI Action Request              │
├────────────────────────────────────┤
│  NEXUS wants to:                   │
│                                    │
│  Turn ON Ceiling Fan               │
│  Reason: Room temperature is       │
│  27.6°C, above your comfort        │
│  threshold of 26°C.                │
│                                    │
│  Device: 🌀 device_fan_001         │
│  Location: Living Room             │
│                                    │
│  This action was suggested by the  │
│  AI based on current conditions.   │
│                                    │
│  [Deny]  [Approve]                 │
│                                    │
│  [✓] Don't ask again for this      │
│      automation                    │
└────────────────────────────────────┘
```

---

### 4. **Telemetry Charts** (Bottom Section)

```
┌────────────────────────────────────────────────────────┐
│  📊 Real-Time Telemetry                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Temperature (Last 1 hour)          Power (Last 1 hour)│
│  30°C ┤                             200W ┤            │
│       │    ╱╲                            │    ╱╲      │
│  25°C ┤   ╱  ╲╱                    150W ┤   ╱  ╲     │
│       │  ╱                              │  ╱    ╲╱   │
│  20°C ┼──────────────────         100W ┼────────────  │
│       0h    30m    60m                  0h   30m   60m│
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Chart Features:**
- Live updating every 5 seconds
- Smooth animations (Framer Motion)
- Hover to see exact values
- Zoom/pan controls
- Time range selector (1h, 6h, 24h)

---

## 🎨 Color Scheme (Dark Theme)

### Primary Colors
```css
Background:     #0a0a0a (almost black)
Cards:          #1a1a1a (dark gray)
Borders:        #2a2a2a (lighter gray)
Text Primary:   #ededed (off-white)
Text Secondary: #999999 (gray)
```

### Status Colors
```css
Online:   #10b981 (green)
Offline:  #ef4444 (red)
Warning:  #f59e0b (amber)
Info:     #3b82f6 (blue)
```

### Interactive Colors
```css
Primary Button:   #6366f1 (indigo)
Hover:            #4f46e5 (darker indigo)
Success:          #10b981 (green)
Danger:           #ef4444 (red)
```

### Device Type Colors
```css
Temperature:  #f59e0b (orange)
Humidity:     #3b82f6 (blue)
Power:        #eab308 (yellow)
Fan:          #06b6d4 (cyan)
AC:           #8b5cf6 (purple)
Light:        #f59e0b (amber)
```

---

## 🔄 Real-Time Features

### WebSocket Integration

**Connection Status Indicator:**
```
┌────────────────────────┐
│ ● Connected to NEXUS   │ ← Green dot when connected
│ Last update: 2s ago    │
└────────────────────────┘
```

**Live Updates:**
1. **Device State Changes** - Instant UI update
2. **Telemetry Data** - Update every 5 seconds
3. **AI Messages** - Stream as they're generated
4. **Connection Status** - Show reconnecting state

**Update Animations:**
```
When telemetry updates:
  1. Fade out old value (200ms)
  2. Fade in new value (200ms)
  3. Pulse green border (500ms)
  4. Update "last updated" time
```

---

## 🎭 User Interactions

### Device Card Interactions

**Click on card:**
```
Collapsed → Expanded View

┌─────────────────────────────┐
│ 🌡️  Living Room Temp        │
│     25.4°C                  │
│     ● Online                │
│                             │
│ ▼ Details                   │ ← Expand/Collapse toggle
│                             │
│ 📊 Last 10 Readings:        │
│ • 25.4°C (now)              │
│ • 25.6°C (5s ago)           │
│ • 25.3°C (10s ago)          │
│ ...                         │
│                             │
│ 📍 Location: Living Room    │
│ 🔌 Status: Online           │
│ 🕐 Created: 2 hours ago     │
│                             │
│ [View Full History]         │
└─────────────────────────────┘
```

**Control Buttons:**
```
Normal:    [Turn On]          ← Gray button
Hover:     [Turn On]          ← Blue highlight
Clicked:   [⏳ Processing...] ← Loading state
Success:   [✓ Turned On]      ← Green, then revert
```

---

## 🤖 AI Chat Interactions

### Chat Flow Example

**User types:** "What's the temperature?"

**UI shows:**
```
You: What's the temperature?
[Sent 0s ago]

NEXUS: [Typing...] 💭
```

**Agent responds:**
```
NEXUS:
The current temperature in the living room is 25.4°C.

🔧 Used tools:
• DeviceManagerTool (list)
• TelemetryTool (get_latest)

Would you like me to adjust the temperature?

[Yes, turn on AC] [No, thanks]
```

### Chat Command Recognition

**Quick Actions Panel:**
```
┌────────────────────────────┐
│  💡 Suggested Commands:    │
├────────────────────────────┤
│  • "List all devices"      │
│  • "What's the temp?"      │
│  • "Turn on the fan"       │
│  • "Show power usage"      │
│  • "Create automation"     │
└────────────────────────────┘
```

---

## 📱 Responsive Design

### Desktop (> 1024px)
- Side-by-side layout (70/30 split)
- 4-column device grid
- Full charts visible

### Tablet (768px - 1024px)
- Side-by-side layout (60/40 split)
- 3-column device grid
- Condensed charts

### Mobile (< 768px)
- Stack layout (chat overlays as bottom drawer)
- 1-column device grid
- Swipeable charts
- Floating chat button

---

## 🎬 Animation & Transitions

### Device Cards
```javascript
// Framer Motion variants
cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }
}
```

### Status Changes
```javascript
// Pulse animation when device state changes
statusVariants = {
  updated: {
    scale: [1, 1.1, 1],
    backgroundColor: ["#10b981", "#34d399", "#10b981"],
    transition: { duration: 0.5 }
  }
}
```

### Chat Messages
```javascript
// Slide in from bottom
messageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
}
```

---

## 🔐 Confirmation Flow (Detailed)

### Step 1: User Action
```
User clicks [Turn On] on Fan card
       ↓
Show confirmation modal with animation
```

### Step 2: Confirmation Modal
```
Modal appears with:
1. Device details
2. Current vs new state
3. Estimated impact (power, cost)
4. Warning message
5. Action buttons
```

### Step 3: User Confirms
```
User clicks [Confirm]
       ↓
1. Send POST to /api/agent/chat with confirmation
2. Show loading state on button
3. Wait for response
```

### Step 4: Execute & Update
```
Backend executes command
       ↓
1. Update device state in store
2. Broadcast via WebSocket
3. Frontend receives update
4. Close modal
5. Show success toast
6. Update device card state
7. Animate status change
```

### Step 5: Success Feedback
```
┌────────────────────────────┐
│  ✅ Device Controlled      │
│  Fan turned on successfully│
└────────────────────────────┘
     ↓ (fades out after 3s)
```

---

## 🎯 Key UX Principles

1. **Safety First** - Always confirm control actions
2. **Real-time Feedback** - Show live updates instantly
3. **Clear Status** - Use colors and icons consistently
4. **Conversational AI** - Natural language in chat
5. **Progressive Disclosure** - Show details on demand
6. **Smooth Animations** - Polished, not distracting
7. **Error Recovery** - Clear error messages with retry

---

## 📊 Component Hierarchy

```
App
├── Layout
│   ├── Header (Logo, User menu)
│   ├── MainContent
│   │   ├── DeviceGrid (70%)
│   │   │   ├── DeviceCard x8
│   │   │   │   ├── DeviceIcon
│   │   │   │   ├── DeviceName
│   │   │   │   ├── PrimaryValue
│   │   │   │   ├── StatusIndicator
│   │   │   │   ├── ControlButtons (if controllable)
│   │   │   │   └── ExpandedDetails (on click)
│   │   │   └── DeviceCardSkeleton (loading)
│   │   └── ChatPanel (30%)
│   │       ├── ChatHeader
│   │       ├── MessageList
│   │       │   ├── UserMessage
│   │       │   ├── AgentMessage
│   │       │   └── TypingIndicator
│   │       └── ChatInput
│   ├── TelemetrySection
│   │   ├── TemperatureChart
│   │   ├── PowerChart
│   │   └── HumidityChart
│   └── Footer
└── Modals
    ├── ConfirmationModal ⚠️
    ├── DeviceDetailsModal
    └── ErrorModal
```

---

## 🎨 Example Screenshots (Text-based)

### Main Dashboard View
```
═══════════════════════════════════════════════════════════════
  NEXUS AI IoT Dashboard                        👤 User ⚙️
═══════════════════════════════════════════════════════════════

DEVICES                                      AI ASSISTANT
───────────────────────────────────         ────────────────

🌡️  Living Room     🌀  Ceiling Fan        💬 How can I help?
    25.4°C              Speed: 2
    ● Online            ⚫ Off              You: List devices
    1s ago              [Turn On]
                                            NEXUS: Here are
💧  Humidity        ❄️  Air Conditioner      all 8 devices...
    52%                 24°C
    ● Online            ⚫ Off              [Type message...]
    2s ago              [Turn On]

💡  Light           🔌  Smart Plug
    80%                 150W
    ● On                ● On
    [Toggle]            5s ago

═══════════════════════════════════════════════════════════════
📊 TELEMETRY CHARTS
───────────────────────────────────────────────────────────────
Temperature (1h)         Power Usage (1h)      Humidity (1h)
[Line chart]             [Area chart]          [Line chart]
═══════════════════════════════════════════════════════════════
```

---

## 🚀 Summary

The frontend is a **modern, real-time IoT dashboard** with:

✅ **Dark theme** with glassmorphism effects
✅ **Live device cards** with status indicators
✅ **AI chat panel** for natural interactions
✅ **Confirmation modals** for ALL control actions (safety!)
✅ **Real-time charts** for telemetry visualization
✅ **WebSocket integration** for instant updates
✅ **Smooth animations** for professional feel
✅ **Responsive design** for all screen sizes

**The confirmation modal ensures user safety by:**
- Showing exactly what will change
- Requiring explicit approval
- Displaying estimated impact (power, cost)
- Working for both button clicks AND AI suggestions

Ready to build this? 🎨🚀
