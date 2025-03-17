# GSC Health Dashboard

A simple dashboard application for managing partners and events in GSC Health.

## What's Inside?

### Pages

1. **Login Page**
   - Simple login form with email and password
   - "Remember me" option
   - Google login button (coming soon)
   - Link to registration page

2. **Register Page**
   - New user registration form
   - Basic validation for email and password

3. **Partners Page**
   - List of all partners in a grid layout
   - Search partners by name
   - Add new partners
   - Edit existing partners
   - Delete partners
   - Copy contact details with one click

4. **Events Page**
   - List of upcoming and past events
   - Search events
   - Add new events with date picker
   - Edit existing events
   - Delete events
   - Status indicators for expired/upcoming events

### Components We Use

1. **Shared Components**
   - `SnackBar`: Shows success/error messages
   - `ConfirmDialog`: Asks for confirmation before deleting
   - `AddPartnerDialog`: Form for adding/editing partners
   - `AddEventDialog`: Form for adding/editing events with date picker

2. **Dashboard Layout**
   - Sidebar navigation (collapsible on mobile)
   - Company logo and branding
   - Logout button
   - Mobile-friendly design

### Cool Features

- **Search**: Quick search in partners and events
- **Responsive Design**: Works well on both desktop and mobile
- **Form Validation**: Prevents invalid data entry
- **Loading States**: Shows loading spinners during operations
- **Error Handling**: Clear error messages when something goes wrong
- **Notifications**: Feedback for all user actions
- **Date Picker**: Easy date and time selection for events

### Technical Details

- Built with Vue 3
- Uses Vue Router for navigation
- Bootstrap for styling
- Bootstrap Icons for icons
- Custom components for dialogs and forms
- Responsive design for all screen sizes

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Run for development:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Coming Soon

- Training section
- Meetings section
- Google authentication
- Advanced filtering options
