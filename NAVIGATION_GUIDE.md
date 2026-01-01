# 🗺️ Navigation & Routing Guide

## Overview
This app uses Expo Router for file-based navigation. Each file in the `app/` directory automatically becomes a route.

## 📍 Route Structure

### Authentication Routes
```
app/(auth)/_layout.tsx          → Auth stack navigation
app/(auth)/index.tsx            → Auth landing/login
app/(auth)/login.tsx            → Login screen
app/(auth)/register.tsx         → Registration
app/(auth)/forgot-password.tsx  → Password recovery
app/(auth)/otp-verification.tsx → OTP input
app/reset-password.tsx          → New password setup
app/splash.tsx                  → App splash screen
app/onboarding.tsx              → Onboarding slides
```

### Main App Routes (Citizens)
```
app/(tabs)/_layout.tsx          → Main tab navigation
app/(tabs)/index.tsx            → Home/Dashboard
app/(tabs)/complaints.tsx       → My complaints
app/(tabs)/notifications.tsx    → Notifications
app/(tabs)/profile.tsx          → User profile
app/(tabs)/schedule.tsx         → Schedule view

app/category-selection.tsx      → Select complaint type
app/complaints/new.tsx          → New complaint form
app/complaints/[id].tsx         → Complaint details
app/complaints/[id]/chat.tsx    → Complaint chat
app/complaints/track.tsx        → Track all complaints
app/complaint-confirmation.tsx  → Submission success

app/camera.tsx                  → Camera capture
app/location-picker.tsx         → Map location picker
app/user-profile.tsx            → Full profile screen
```

### Employee Routes
```
app/employee/dashboard.tsx      → Employee home
app/employee/assigned-tasks.tsx → All assigned tasks
app/employee/task-completion.tsx→ Complete task form
app/employee/schedule.tsx       → Work schedule
app/employee/route.tsx          → Route map
app/employee/performance.tsx    → Stats and performance
```

### Department Routes
```
app/department/dashboard.tsx    → Department overview
app/department/assign-complaints.tsx → Assign work
app/department/employees.tsx    → Manage employees
app/department/reports.tsx      → View reports
app/department/review.tsx       → Review completed work
```

### Admin Routes
```
app/admin/dashboard.tsx         → Admin overview
app/admin/user-management.tsx   → Manage users
app/admin/employees/index.tsx   → Employee management
app/admin/departments.tsx       → Department config
app/admin/categories.tsx        → Category management
app/admin/areas.tsx             → Area/ward config
app/admin/settings.tsx          → System settings
app/analytics/index.tsx         → Analytics dashboard
```

### Shared/Utility Routes
```
app/search.tsx                  → Universal search
app/map-view.tsx                → Map with all complaints
app/image-viewer.tsx            → Full screen image viewer
app/feedback.tsx                → Feedback/rating form
app/chat.tsx                    → Chat interface
app/filter.tsx                  → Advanced filters

app/settings/index.tsx          → Settings home
app/settings/about.tsx          → About app
app/settings/privacy-policy.tsx → Privacy policy
app/settings/terms.tsx          → Terms & conditions
```

## 🔀 Navigation Flow

### Initial Flow
```
Splash → Onboarding → Auth Landing → Login/Register → OTP → Main App
```

### Citizen Flow
```
Home → Category Selection → Complaint Form → Camera/Location → Confirmation
     → My Complaints → Complaint Detail → Chat
     → Profile → Settings
```

### Employee Flow
```
Employee Dashboard → Assigned Tasks → Task Detail → Start Work → Upload Progress → Complete
                   → Schedule → Route Map → Performance
```

### Department Flow
```
Department Dashboard → Unassigned Complaints → Select Employee → Assign
                     → Employee Management → Reports → Review
```

### Admin Flow
```
Admin Dashboard → User Management → Employee Management → Department Config
                → Analytics → Settings → Audit Logs
```

## 🎯 Navigation Patterns

### Stack Navigation
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Push new screen
router.push('/complaints/new');

// Replace current screen
router.replace('/(tabs)');

// Go back
router.back();

// Navigate with params
router.push({
  pathname: '/complaints/[id]',
  params: { id: 'CMP-123' }
});
```

### Tab Navigation
```typescript
// Defined in app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Home' }} />
  <Tabs.Screen name="complaints" options={{ title: 'Complaints' }} />
  <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
  <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
</Tabs>
```

### Modal Navigation
```typescript
// app/modal.tsx for modal screens
// Navigate: router.push('/modal')
```

## 🔐 Protected Routes

Routes are protected based on user role:

### Role-Based Access
```typescript
// Citizen routes: app/(tabs)/*
// Employee routes: app/employee/*
// Department routes: app/department/*
// Admin routes: app/admin/*
```

### Navigation Guards
Implemented in `app/_layout.tsx`:
```typescript
- Check authentication state
- Redirect to login if not authenticated
- Route to appropriate dashboard based on role
```

## 📱 Deep Linking

### URL Schemes
```
myapp://complaints/CMP-123
myapp://employee/task/TASK-456
myapp://chat/CONV-789
```

### Configuration
```typescript
// app.json
"scheme": "myapp"
```

## 🎨 Screen Options

### Common Options
```typescript
screenOptions={{
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
}}
```

### Custom Headers
Most screens use custom headers for better design control.

## 🔄 State Persistence

Navigation state is persisted using:
- AsyncStorage for navigation state
- Zustand stores for app state
- Expo SecureStore for sensitive data

## 📊 Analytics Integration

Track navigation events:
```typescript
useEffect(() => {
  // Log screen view
  analytics.logScreenView(routeName);
}, [routeName]);
```

## 🎯 Best Practices

1. **Use Typed Routes**: Define route types for better type safety
2. **Lazy Loading**: Components loaded on demand
3. **Error Boundaries**: Each major section has error handling
4. **Loading States**: Show loaders during navigation
5. **Gestures**: Swipe back enabled on iOS
6. **Deep Links**: Support all major flows
7. **Modals**: Use sparingly for focused tasks

## 🚀 Performance

- **Code Splitting**: Routes loaded on demand
- **Prefetching**: Critical routes preloaded
- **Caching**: Route data cached when appropriate
- **Transitions**: Hardware accelerated
