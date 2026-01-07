// English translations
export default {
  // Common
  common: {
    app_name: 'Municipal Connect',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    apply: 'Apply',
    reset: 'Reset',
    refresh: 'Refresh',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    done: 'Done',
    skip: 'Skip',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    all: 'All',
    none: 'None',
    select: 'Select',
    selected: 'Selected',
    view_all: 'View All',
    view_more: 'View More',
    see_details: 'See Details',
    no_data: 'No data available',
    no_results: 'No results found',
    required_field: 'This field is required',
    invalid_email: 'Please enter a valid email',
    invalid_phone: 'Please enter a valid phone number',
    min_length: 'Minimum {{count}} characters required',
    max_length: 'Maximum {{count}} characters allowed',
  },

  // Navigation
  nav: {
    home: 'Home',
    complaints: 'Complaints',
    my_complaints: 'My Complaints',
    new_complaint: 'New Complaint',
    explore: 'Explore',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    schedule: 'Schedule',
    dashboard: 'Dashboard',
    admin: 'Admin',
  },

  // Authentication
  auth: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    forgot_password: 'Forgot Password',
    reset_password: 'Reset Password',
    email: 'Email',
    phone: 'Phone Number',
    password: 'Password',
    confirm_password: 'Confirm Password',
    full_name: 'Full Name',
    otp: 'OTP',
    verify_otp: 'Verify OTP',
    resend_otp: 'Resend OTP',
    otp_sent: 'OTP sent to {{destination}}',
    otp_resent: 'OTP resent successfully',
    login_success: 'Login successful',
    register_success: 'Registration successful',
    logout_confirm: 'Are you sure you want to logout?',
    password_mismatch: 'Passwords do not match',
    welcome_back: 'Welcome Back',
    create_account: 'Create Account',
    already_have_account: 'Already have an account?',
    dont_have_account: "Don't have an account?",
    sign_in_with: 'Sign in with',
    or: 'OR',
    terms_agree: 'By registering, you agree to our',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    and: 'and',
  },

  // Onboarding
  onboarding: {
    slide1_title: 'Report Municipal Issues',
    slide1_desc: 'Easily report civic issues like potholes, garbage, water problems, and more with just a few taps.',
    slide2_title: 'Track Your Complaints',
    slide2_desc: 'Get real-time updates on your complaint status and resolution progress.',
    slide3_title: 'Community Engagement',
    slide3_desc: 'Support issues reported by others and make your community better together.',
    slide4_title: 'Quick Resolution',
    slide4_desc: 'Municipal authorities receive your complaints instantly for faster resolution.',
    get_started: 'Get Started',
    skip: 'Skip',
  },

  // Home
  home: {
    welcome: 'Welcome, {{name}}!',
    citizen_subtitle: 'Report and track your municipal complaints',
    employee_subtitle: 'Manage and resolve assigned complaints',
    admin_subtitle: 'Oversee all operations and manage the system',
    quick_actions: 'Quick Actions',
    report_issue: 'Report Issue',
    track_complaint: 'Track Complaint',
    emergency: 'Emergency',
    water_tanker: 'Water Tanker',
    categories: 'Categories',
    recent_complaints: 'Recent Complaints',
    your_complaints: 'Your Complaints',
    assigned_complaints: 'Assigned Complaints',
    trending_issues: 'Trending Issues',
    emergency_alerts: 'Emergency Alerts',
    announcements: 'Announcements',
    events: 'Upcoming Events',
    area_statistics: 'Area Statistics',
    view_all_categories: 'View All Categories',
  },

  // Complaints
  complaints: {
    title: 'Complaints',
    new: 'New Complaint',
    my: 'My Complaints',
    all: 'All Complaints',
    assigned: 'Assigned',
    pending: 'Pending',
    resolved: 'Resolved',
    search_placeholder: 'Search complaints...',
    filter_by_status: 'Filter by Status',
    filter_by_category: 'Filter by Category',
    filter_by_priority: 'Filter by Priority',
    filter_by_date: 'Filter by Date',
    sort_by: 'Sort By',
    
    // Status
    status: {
      submitted: 'Submitted',
      acknowledged: 'Acknowledged',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      rejected: 'Rejected',
      reopened: 'Reopened',
    },
    
    // Priority
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical',
    },
    
    // Categories
    categories: {
      road_damage: 'Road Damage',
      water_supply: 'Water Supply',
      garbage: 'Garbage & Waste',
      streetlight: 'Street Light',
      drainage: 'Drainage & Sewage',
      trees: 'Trees & Parks',
      traffic: 'Traffic Issues',
      health: 'Public Health',
      construction: 'Unauthorized Construction',
      noise: 'Noise Pollution',
      animal: 'Animal Issues',
      other: 'Other',
    },
    
    // Form
    form: {
      step_category: 'Select Category',
      step_location: 'Choose Location',
      step_details: 'Add Details',
      step_media: 'Upload Media',
      step_review: 'Review & Submit',
      
      select_category: 'Select a Category',
      select_subcategory: 'Select Sub-category (Optional)',
      search_category: 'Search categories...',
      
      current_location: 'Use Current Location',
      pick_on_map: 'Pick on Map',
      enter_address: 'Enter Address Manually',
      address: 'Address',
      landmark: 'Landmark (Optional)',
      pin_code: 'PIN Code',
      location_accuracy: 'Location Accuracy: {{accuracy}}m',
      
      title: 'Title',
      title_placeholder: 'Brief title for your complaint',
      description: 'Description',
      description_placeholder: 'Describe the issue in detail...',
      voice_input: 'Voice Input',
      recording: 'Recording...',
      tap_to_record: 'Tap to record voice note',
      
      priority: 'Priority',
      is_recurring: 'This is a recurring issue',
      is_anonymous: 'Submit anonymously',
      is_public: 'Make this complaint public',
      
      add_photos: 'Add Photos',
      take_photo: 'Take Photo',
      choose_gallery: 'Choose from Gallery',
      add_voice_note: 'Add Voice Note',
      photos_limit: 'Maximum {{count}} photos allowed',
      
      review_title: 'Review Your Complaint',
      review_note: 'Please review the details before submitting',
      submit_complaint: 'Submit Complaint',
      submitting: 'Submitting...',
    },
    
    // Detail
    detail: {
      complaint_number: 'Complaint #{{number}}',
      reported_by: 'Reported by',
      reported_on: 'Reported on',
      assigned_to: 'Assigned to',
      department: 'Department',
      location: 'Location',
      sla_deadline: 'SLA Deadline',
      resolution_date: 'Resolved on',
      
      status_timeline: 'Status Timeline',
      upvote: 'Upvote',
      upvoted: 'Upvoted',
      upvotes: '{{count}} upvotes',
      comments: 'Comments',
      add_comment: 'Add Comment',
      share: 'Share',
      report: 'Report',
      
      similar_complaints: 'Similar Complaints Nearby',
      mark_resolved: 'Mark as Resolved',
      reopen: 'Reopen Complaint',
      give_feedback: 'Give Feedback',
      
      update_status: 'Update Status',
      add_notes: 'Add Notes',
      upload_photos: 'Upload Photos',
      escalate: 'Escalate',
      reassign: 'Reassign',
    },
    
    // Empty states
    empty: {
      title: 'No Complaints Yet',
      description: "You haven't submitted any complaints yet.",
      action: 'Submit a Complaint',
      
      assigned_title: 'No Assigned Complaints',
      assigned_description: "You don't have any assigned complaints.",
      
      search_title: 'No Results',
      search_description: 'No complaints match your search criteria.',
    },
    
    // Messages
    messages: {
      submitted: 'Complaint submitted successfully!',
      updated: 'Complaint updated successfully',
      resolved: 'Complaint marked as resolved',
      reopened: 'Complaint has been reopened',
      upvoted: 'You upvoted this complaint',
      upvote_removed: 'Upvote removed',
      comment_added: 'Comment added',
      feedback_submitted: 'Thank you for your feedback!',
    },
  },

  // Service Requests
  services: {
    title: 'Service Requests',
    water_tanker: 'Water Tanker',
    garbage_pickup: 'Special Garbage Pickup',
    street_cleaning: 'Street Cleaning',
    tree_trimming: 'Tree Trimming',
    
    request: 'Request',
    track: 'Track',
    
    form: {
      select_service: 'Select Service Type',
      location: 'Service Location',
      date: 'Preferred Date',
      time_slot: 'Time Slot',
      morning: 'Morning (9 AM - 12 PM)',
      afternoon: 'Afternoon (12 PM - 4 PM)',
      evening: 'Evening (4 PM - 7 PM)',
      quantity: 'Quantity',
      urgency: 'Urgency Level',
      normal: 'Normal',
      urgent: 'Urgent',
      emergency: 'Emergency',
      notes: 'Additional Notes',
      submit_request: 'Submit Request',
    },
    
    status: {
      pending: 'Pending',
      approved: 'Approved',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    },
  },

  // Notifications
  notifications: {
    title: 'Notifications',
    mark_all_read: 'Mark All as Read',
    no_notifications: 'No notifications',
    
    types: {
      complaint_update: 'Complaint Update',
      assignment: 'New Assignment',
      alert: 'Alert',
      announcement: 'Announcement',
      reminder: 'Reminder',
      system: 'System',
    },
  },

  // Profile
  profile: {
    title: 'Profile',
    edit: 'Edit Profile',
    my_statistics: 'My Statistics',
    complaints_submitted: 'Complaints Submitted',
    complaints_resolved: 'Resolved',
    contribution_points: 'Contribution Points',
    badges: 'Badges',
    verified_citizen: 'Verified Citizen',
    
    settings: 'Settings',
    language: 'Language',
    notifications: 'Notifications',
    dark_mode: 'Dark Mode',
    font_size: 'Font Size',
    accessibility: 'Accessibility',
    
    help: 'Help & Support',
    faq: 'FAQ',
    contact_us: 'Contact Us',
    tutorials: 'Tutorials',
    
    about: 'About',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    version: 'Version {{version}}',
    
    logout: 'Logout',
    logout_confirm: 'Are you sure you want to logout?',
  },

  // Employee
  employee: {
    dashboard: 'Dashboard',
    assigned_complaints: 'Assigned Complaints',
    today_tasks: "Today's Tasks",
    workload: 'Current Workload',
    performance: 'Performance',
    attendance: 'Attendance',
    daily_report: 'Daily Report',
    route_planner: 'Route Planner',
    
    mark_attendance: 'Mark Attendance',
    check_in: 'Check In',
    check_out: 'Check Out',
    
    update_progress: 'Update Progress',
    add_resolution: 'Add Resolution',
    before_photo: 'Before Photo',
    after_photo: 'After Photo',
    materials_used: 'Materials Used',
    time_spent: 'Time Spent',
    
    submit_report: 'Submit Daily Report',
    tasks_completed: 'Tasks Completed',
    issues_faced: 'Issues Faced',
  },

  // Department Head
  department: {
    dashboard: 'Department Dashboard',
    all_complaints: 'All Complaints',
    employees: 'Employees',
    analytics: 'Analytics',
    escalations: 'Escalations',
    reports: 'Reports',
    
    sla_compliance: 'SLA Compliance',
    pending_assignments: 'Pending Assignments',
    overdue_complaints: 'Overdue Complaints',
    
    assign_complaint: 'Assign Complaint',
    select_employee: 'Select Employee',
    bulk_assign: 'Bulk Assign',
    auto_assign: 'Auto Assign',
    
    employee_workload: 'Employee Workload',
    department_performance: 'Department Performance',
    generate_report: 'Generate Report',
  },

  // Admin
  admin: {
    dashboard: 'Admin Dashboard',
    users: 'User Management',
    departments: 'Departments',
    employees: 'Employees',
    categories: 'Categories',
    wards: 'Wards',
    analytics: 'Analytics',
    alerts: 'Emergency Alerts',
    announcements: 'Announcements',
    settings: 'System Settings',
    audit_logs: 'Audit Logs',
    
    total_users: 'Total Users',
    total_complaints: 'Total Complaints',
    resolution_rate: 'Resolution Rate',
    avg_resolution_time: 'Avg. Resolution Time',
    citizen_satisfaction: 'Citizen Satisfaction',
    
    create_alert: 'Create Alert',
    create_announcement: 'Create Announcement',
    
    user_management: {
      add_user: 'Add User',
      edit_user: 'Edit User',
      verify_user: 'Verify User',
      suspend_user: 'Suspend User',
      user_type: 'User Type',
      citizen: 'Citizen',
      employee: 'Employee',
      department_head: 'Department Head',
      admin: 'Administrator',
    },
    
    department_management: {
      add_department: 'Add Department',
      edit_department: 'Edit Department',
      assign_head: 'Assign Head',
      set_sla: 'Set SLA',
    },
  },

  // Emergency
  emergency: {
    title: 'Emergency Services',
    ambulance: 'Ambulance',
    fire: 'Fire Service',
    police: 'Police',
    municipal: 'Municipal Emergency',
    disaster: 'Disaster Helpline',
    
    call_now: 'Call Now',
    fast_track: 'Fast Track Complaint',
  },

  // Map
  map: {
    title: 'Explore Issues',
    my_location: 'My Location',
    filter: 'Filter',
    heatmap: 'Show Heatmap',
    clusters: 'Show Clusters',
    search_area: 'Search this area',
  },

  // Feedback
  feedback: {
    title: 'Rate Your Experience',
    overall_rating: 'Overall Rating',
    resolution_quality: 'Resolution Quality',
    response_time: 'Response Time',
    staff_behavior: 'Staff Behavior',
    comments: 'Additional Comments',
    suggestions: 'Suggestions for Improvement',
    submit: 'Submit Feedback',
    thank_you: 'Thank you for your feedback!',
  },

  // Time
  time: {
    just_now: 'Just now',
    minutes_ago: '{{count}} min ago',
    hours_ago: '{{count}} hours ago',
    days_ago: '{{count}} days ago',
    today: 'Today',
    yesterday: 'Yesterday',
  },

  // Errors
  errors: {
    general: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    unauthorized: 'Session expired. Please login again.',
    not_found: 'Resource not found.',
    server: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.',
    location: 'Unable to get your location.',
    camera: 'Unable to access camera.',
    storage: 'Unable to save data.',
  },
};
