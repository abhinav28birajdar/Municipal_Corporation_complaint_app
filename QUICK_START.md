# ⚡ Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
```bash
✅ Node.js 18+ installed
✅ npm or yarn installed
✅ Expo CLI (npm install -g expo-cli)
✅ Android Studio or Xcode (optional, for emulators)
```

### 1. Install Dependencies
```bash
cd municipal_corporation_application
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device
Choose one:
- **📱 Scan QR code** with Expo Go app (iOS/Android)
- **🤖 Press 'a'** to open Android emulator
- **🍎 Press 'i'** to open iOS simulator

## 🗺️ Navigate the App

### Entry Points by User Role

#### As Citizen (Default)
1. Splash → Onboarding → Login
2. Default credentials: citizen@example.com / password
3. Lands on: Home Dashboard (`app/(tabs)/index.tsx`)

**Try These Flows:**
- Tap "New Complaint" → Select Category → Fill Form → Take Photo → Pick Location → Submit
- Go to "Complaints" tab → View your complaints
- Tap any complaint → See details and timeline

#### As Employee
1. Login with: employee@example.com / password
2. Lands on: Employee Dashboard (`app/employee/dashboard.tsx`)

**Try These Flows:**
- View "Assigned Tasks"
- Accept a task
- Start work → Upload progress photos
- Mark as complete with before/after photos

#### As Department
1. Login with: department@example.com / password
2. Lands on: Department Dashboard (`app/department/dashboard.tsx`)

**Try These Flows:**
- View unassigned complaints
- Assign to employee
- Monitor progress
- Review completed work

#### As Admin
1. Login with: admin@example.com / password
2. Lands on: Admin Dashboard (`app/admin/dashboard.tsx`)

**Try These Flows:**
- View system metrics
- Manage users
- Configure departments
- View analytics

## 📂 Key Files to Know

### Main Entry Points
```
app/_layout.tsx          → Root navigation config
app/(tabs)/_layout.tsx   → Tab navigation setup
app/(auth)/_layout.tsx   → Auth stack config
```

### Core Screens
```
app/(tabs)/index.tsx     → Home dashboard
app/category-selection.tsx → Start complaint flow
app/complaints/new.tsx   → Complaint form (existing)
app/employee/dashboard.tsx → Employee home
app/admin/dashboard.tsx  → Admin home
```

### State Management
```
store/auth-store.ts      → User authentication
store/complaint-store.ts → Complaint data
store/theme-store.ts     → App theme
```

### UI Components
```
components/ui/           → Reusable components
components/complaints/   → Complaint-specific components
components/home/         → Home screen components
```

## 🎨 Customize Quickly

### Change Primary Color
```typescript
// In your tailwind.config.js or directly in className
className="bg-blue-600"  // Change to bg-purple-600, bg-green-600, etc.
```

### Update App Name
```json
// app.json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Modify Mock Data
```typescript
// All mock data files are in mocks/ directory
mocks/complaints.ts
mocks/users.ts
mocks/events.ts
```

## 🔧 Common Tasks

### Add a New Screen
```bash
# Create file in app/ directory
touch app/new-screen.tsx

# File will auto-register as route
# Access via: router.push('/new-screen')
```

### Add a New Tab
```typescript
// Edit app/(tabs)/_layout.tsx
<Tabs.Screen 
  name="new-tab" 
  options={{
    title: 'New Tab',
    tabBarIcon: ({ color }) => <Icon name="star" color={color} />
  }} 
/>
```

### Connect to Real API
```typescript
// Update store files, example:
// store/complaint-store.ts

fetchComplaints: async () => {
  const { data } = await supabase
    .from('complaints')
    .select('*');
  set({ complaints: data });
}
```

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start --reset-cache
```

### Dependencies Not Installing
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Navigation Not Working
```bash
# Clear Expo cache
expo start -c
```

### Camera Not Working
```bash
# Make sure you've requested permissions
# Check app.json for camera plugin config
```

## 📱 Test on Physical Device

### Using Expo Go (Easiest)
1. Download Expo Go from App Store/Play Store
2. Scan QR code from terminal
3. App loads on your device

### Using Development Build
```bash
# Build for Android
npx expo run:android

# Build for iOS
npx expo run:ios
```

## 🎯 Focus Areas for Integration

### Priority 1: Authentication
- Connect login to Supabase Auth
- Store user session
- Handle token refresh

### Priority 2: Complaints
- Create complaint endpoint
- Upload images to storage
- Fetch user complaints

### Priority 3: Real-time
- Setup Supabase subscriptions
- Update UI on complaint status changes
- Show new messages instantly

## 📚 Learn More

- **Expo Router**: https://docs.expo.dev/router/introduction/
- **NativeWind**: https://www.nativewind.dev/
- **Supabase**: https://supabase.com/docs
- **Zustand**: https://github.com/pmndrs/zustand

## 🆘 Need Help?

1. Check `SCREENS_DOCUMENTATION.md` for screen details
2. Read `NAVIGATION_GUIDE.md` for routing help
3. Follow `IMPLEMENTATION_GUIDE.md` for backend integration
4. Review `BUILD_SUMMARY.md` for project overview

## ✅ Checklist: Ready to Start

- [x] Dependencies installed
- [x] Development server running
- [x] App opens on device/emulator
- [x] Can navigate between screens
- [x] Forms are working
- [x] Camera opens (on physical device)
- [x] Maps display (with API key)

## 🎉 You're All Set!

The complete UI is ready. Start exploring the app, test all flows, and when ready, begin backend integration following the `IMPLEMENTATION_GUIDE.md`.

---

**Next Steps**:
1. Explore all screens and flows
2. Configure Supabase project
3. Connect backend APIs
4. Add real data
5. Test thoroughly
6. Deploy to stores

**Happy Coding! 🚀**
