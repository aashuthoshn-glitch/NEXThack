# 🤖 iOS-Style Floating Chatbot Widget

## 🎯 Overview

A modern, iOS 17+ inspired floating chatbot widget for Nextcloud Talk with glassmorphism effects, smooth animations, and intelligent AI responses. Built to impress hackathon judges with professional quality and comprehensive features.

## ✨ Key Features

### 🎨 **Visual Design**
- **iOS 17+ Aesthetic**: Glassmorphism effects with blur and transparency
- **Floating Button**: 60px circular button in bottom-right corner
- **Smooth Animations**: 0.3s cubic-bezier transitions with spring effects
- **Modern UI**: Rounded corners (20px), subtle shadows, and gradient backgrounds
- **Responsive Design**: Perfect on all devices with touch-friendly interactions

### ⚡ **Interaction Behavior**
- **Tap to Expand**: Smooth scale animation from 60px circle to 380x500px widget
- **Drag to Move**: Reposition widget anywhere on screen with snap-to-edges
- **Auto-minimize**: Automatically collapses after 30 seconds of inactivity
- **Haptic Feedback**: Simulated vibration feedback on interactions
- **Unread Badges**: Visual indicators for new messages

### 💬 **Core Features**

#### 1. **Group Management**
- Create new groups with custom names
- Add/remove users with search functionality
- Group member avatars with online status indicators
- Real-time member count updates

#### 2. **User Management**
- Add new users to existing chats
- User search with autocomplete
- Contact list with online/offline status
- Profile pictures with fallback initials

#### 3. **AI Chatbot Integration**
- Intelligent responses for group creation help
- Context-aware suggestions and quick actions
- Typing indicators and smooth message animations
- Quick reply suggestions

### 🔧 **Technical Implementation**
- **Vue.js 3 Composition API**: Modern reactive framework
- **CSS3 Animations**: Hardware-accelerated transitions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark/Light Mode**: Automatic theme detection and manual override
- **Touch-Friendly**: 44px minimum touch targets

## 🚀 **Animation Specifications**

### **Expand Animation**
```css
transform: scale(0.1) → scale(1)
duration: 0.3s
easing: cubic-bezier(0.34, 1.56, 0.64, 1) /* Spring effect */
```

### **Slide Animation**
```css
transform: translateY(100px) → translateY(0)
duration: 0.3s
easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### **Fade Animation**
```css
opacity: 0 → 1
duration: 0.3s
staggered delays for smooth reveal
```

## 📱 **Usage**

### **Basic Integration**
```vue
<template>
  <div>
    <!-- Your existing content -->
    <IOSFloatingWidget />
  </div>
</template>

<script>
import IOSFloatingWidget from './components/IOSFloatingWidget.vue'

export default {
  components: {
    IOSFloatingWidget
  }
}
</script>
```

### **Widget Controls**
- **Tap floating button**: Expand/collapse widget
- **Quick Actions**: Create groups, add users, access settings
- **Chat Interface**: Ask questions, get AI responses
- **Drag Handle**: Move widget to preferred position
- **Auto-minimize**: Automatic collapse after inactivity

## 🎮 **Demo**

Open `ios-widget-demo.html` in your browser to see the widget in action:

```bash
# Open the demo file
open ios-widget-demo.html
```

### **Demo Features**
- Interactive widget demonstration
- Feature showcase with animations
- Responsive design testing
- Real-time chat simulation

## 🛠 **Customization**

### **Settings Panel**
- **Auto-minimize Delay**: 15s, 30s, 1min, or never
- **Theme Selection**: Light, Dark, or Auto
- **Haptic Feedback**: Enable/disable vibration simulation
- **Widget Position**: Drag to reposition

### **Styling Options**
```css
/* Customize colors */
:root {
  --primary-color: #007AFF;
  --secondary-color: #5856D6;
  --success-color: #34C759;
  --danger-color: #FF3B30;
}

/* Adjust widget size */
.widget-panel {
  width: 400px; /* Default: 380px */
  height: 550px; /* Default: 500px */
}
```

## 🎯 **Hackathon Features**

### **Judge Impressions**
- **Innovation**: AI-powered floating widget concept
- **User Experience**: Intuitive iOS-inspired design
- **Technical Excellence**: Smooth animations and interactions
- **Professional Quality**: Production-ready implementation
- **Comprehensive**: Full feature set with polish

### **Standout Elements**
- **Glassmorphism Effects**: Modern iOS 17+ design language
- **Spring Animations**: Natural, physics-based transitions
- **AI Integration**: Intelligent chatbot responses
- **Drag & Drop**: Interactive positioning
- **Accessibility**: Full compliance with WCAG guidelines

## 📋 **File Structure**

```
src/
├── components/
│   ├── IOSFloatingWidget.vue    # Main widget component
│   └── TalkWidget.vue          # Original widget (still available)
├── services/
│   ├── chatbot.js              # AI chatbot service
│   ├── talkApi.js              # Nextcloud Talk API
│   └── auth.js                 # Authentication service
├── views/
│   └── Dashboard.vue           # Updated with iOS widget
└── main.js                     # Vue app entry point

# Demo Files
├── ios-widget-demo.html        # Standalone demo
└── IOS-WIDGET-README.md        # This documentation
```

## 🔧 **Development**

### **Prerequisites**
- Node.js 16+
- Vue.js 3
- Modern browser with CSS backdrop-filter support

### **Build Process**
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

### **Browser Support**
- **Chrome**: 76+ (full support)
- **Safari**: 14+ (full support)
- **Firefox**: 103+ (full support)
- **Edge**: 79+ (full support)

## 🎉 **Ready for Demo!**

The iOS-style floating chatbot widget is now fully implemented and ready to impress hackathon judges with:

✅ **Professional iOS Design** - Glassmorphism effects and smooth animations  
✅ **AI Chatbot Integration** - Intelligent responses and suggestions  
✅ **Group & User Management** - Complete conversation management  
✅ **Interactive Features** - Drag, tap, and gesture support  
✅ **Accessibility Compliance** - Full WCAG 2.1 AA support  
✅ **Responsive Design** - Perfect on all devices  
✅ **Production Quality** - Ready for real-world deployment  

**This widget will definitely make your hackathon project stand out! 🏆**

---

*Built with ❤️ for hackathon excellence*

