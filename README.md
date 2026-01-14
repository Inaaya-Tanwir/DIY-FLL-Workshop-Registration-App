# FLL DIY STEM Workshop Registration App

A synchronized, multi-device registration system for distributing free DIY STEM kits at the Oregon FLL State Championship 2026.

## 🎯 Overview

This app manages the registration and distribution of three types of DIY STEM kits (Arduino Vibe Coding Kit, DIY Robot Kit, and DIY STEM Gadget) to 62 FLL teams participating in the Oregon State Championship. The system ensures fair distribution with one kit per team through random assignment.

## ✨ Features

### For Participants
- **Simple Registration**: Teams enter their FLL team number to register
- **Team Verification**: Confirms team identity before registration
- **Random Kit Assignment**: Fair distribution across three kit types
- **Real-time Availability**: See how many kits are left for each type
- **Duplicate Prevention**: Alerts if a team has already registered

### For Administrators
- **Live Dashboard**: View all registrations in real-time
- **Collection Tracking**: Mark kits as collected/not collected
- **Multiple Views**: Toggle between registered teams, non-registered teams, and all teams
- **Search Functionality**: Quickly find teams by number or name
- **Data Export**: Visual table format for easy monitoring
- **Secure Reset**: Protected data reset functionality

### Technical Features
- **Real-time Synchronization**: All devices auto-sync every 2 seconds
- **Shared Storage**: Data persists across sessions and devices
- **No Database Required**: Uses Claude's persistent storage API
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during data operations

## 🚀 Getting Started

### Prerequisites
- React 18+
- Tailwind CSS
- lucide-react icons
- Access to Claude's persistent storage API (window.storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Inaaya-Tanwir/AI-FLL-DIY-.git
cd AI-FLL-DIY-
```

2. Install dependencies:
```bash
npm install react lucide-react
# or
yarn add react lucide-react
```

3. Ensure Tailwind CSS is configured in your project

4. Import and use the component:
```jsx
import WorkshopApp from './WorkshopApp';

function App() {
  return <WorkshopApp />;
}
```

## 📱 Usage

### For Teams (Participants)

1. **Open the app** on any device
2. **Enter your FLL team number** (numbers only, e.g., 70511)
3. **Confirm your team** when prompted
4. **Receive your kit assignment** - note which kit you've been assigned
5. **Pick up your kit** at the workshop table

### For Administrators

1. **Click "Admin Login"** at the bottom of the registration screen
2. **Enter password**: `STEM20FOREVER26`
3. **Access the dashboard** with full controls:
   - View all registrations
   - Toggle between different views (Registered, Not Registered, All Teams)
   - Search for specific teams
   - Mark kits as collected
   - Reset all data (requires confirmation code)

## 🔐 Security

### Admin Access
- **Password**: `STEM20FOREVER26`
- **Reset Confirmation Code**: `RESET2026`

⚠️ **Important**: Change these credentials before deployment in a production environment!

## 🎁 Available Kits

| Kit Type | Emoji | Provided By | Quantity |
|----------|-------|-------------|----------|
| Arduino Vibe Coding Kit | 💡 | Team 70511 | 20 |
| DIY Robot Kit | 🤖 | Team 70695 | 20 |
| DIY STEM Gadget | ⚙️ | Team 71076 | 20 |

**Total Kits**: 60 (for 62 teams - random assignment ensures fair distribution)

## 👥 Participating Teams

62 FLL teams from the Oregon State Championship, including:
- Team 16188 - Archers
- Team 70511 - FLL Computer Cookies
- Team 70695 - The Wild Kings
- Team 71076 - Unearthed Rising Legends
- And 58 more amazing teams!

## 🔄 How Synchronization Works

The app uses Claude's persistent storage API for real-time multi-device synchronization:

1. **Shared Storage**: All data stored with `shared: true` flag
2. **Auto-polling**: Every device checks for updates every 2 seconds
3. **Instant Updates**: Changes made on any device appear on all devices
4. **No Backend Required**: Storage handled by Claude's infrastructure

## 🛠️ Technical Details

### Storage Structure
```javascript
{
  teamNumber: "70511",
  teamName: "FLL Computer Cookies",
  kitId: "arduino",
  timestamp: "2026-01-13T10:30:00.000Z",
  collected: false
}
```

### Key Functions
- `loadRegistrations()`: Fetches data from shared storage
- `saveRegistrations()`: Saves data to shared storage
- `assignKit()`: Randomly assigns available kit
- `toggleCollected()`: Updates collection status

## 📊 Data Management

### Viewing Registrations
- **Registered View**: Shows all teams that have registered
- **Not Registered View**: Shows teams that haven't registered yet
- **All Teams View**: Complete list with registration status

### Resetting Data
1. Click "Reset Data" in admin dashboard
2. Type confirmation code: `RESET2026`
3. Click "Confirm Reset"

⚠️ This action cannot be undone!

## 🎨 Design Philosophy

- **Gracious Professionalism**: Embodying FLL core values
- **Fair Distribution**: Random assignment ensures equity
- **User-Friendly**: Simple, intuitive interface for all ages
- **Real-time Feedback**: Immediate confirmation and updates
- **Mobile-First**: Optimized for on-the-go registration

## 🤝 Contributors

Created by **Inaaya Tanwir & Ivan Samanta**  
Friends of FLL teams 70511 FLL Computer Cookies, 70695 The Wild Kings, 71076 Unearthed Rising Legends

## 📝 License

This project is created for the Oregon FLL State Championship 2026 community.

## 🐛 Troubleshooting

### Common Issues

**Problem**: Data not syncing  
**Solution**: Check internet connection; wait for next auto-sync (2 seconds)

**Problem**: Can't register  
**Solution**: Verify team number is correct; check if team already registered

**Problem**: Admin login not working  
**Solution**: Ensure password is typed correctly (case-sensitive)

## 📞 Support

For issues or questions about this registration system, please contact the workshop organizers at the FLL State Championship event.

## 🎉 Event Information

**Event**: Oregon FLL State Championship 2026  
**Workshop**: DIY STEM Kit Distribution  
**Total Teams**: 62  
**Total Kits**: 60 (distributed randomly)

---

**Built with ❤️ for the FLL community**  
*Demonstrating Gracious Professionalism through technology*
