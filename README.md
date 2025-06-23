# Business Nexus - Professional Networking Platform

Business Nexus is a full-stack web application that connects entrepreneurs with investors, facilitating collaboration and communication in the startup ecosystem.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Dual User Types**: Separate dashboards and features for entrepreneurs and investors
- **Profile Management**: Comprehensive profile creation and editing for both user types
- **Search & Discovery**: Advanced filtering by industry, location, and user type
- **Collaboration Requests**: Send, accept, and manage collaboration requests
- **Real-time Chat**: Socket.io powered messaging system with typing indicators
- **Email Notifications**: Automated email alerts for requests and messages
- **Admin Dashboard**: Analytics and user management for platform administrators

### Technical Features
- **Responsive Design**: Mobile-first approach with dark/light mode support
- **Real-time Updates**: Live messaging and notifications
- **Database Integration**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer integration for notifications
- **Modern UI**: shadcn/ui components with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks and Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Email**: Nodemailer

### DevOps & Deployment
- **Deployment**: Vercel (recommended)
- **Database**: MongoDB Atlas
- **Version Control**: Git

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd business-nexus
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=Business Nexus <noreply@businessnexus.com>
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Seed the database (Optional)**
   \`\`\`bash
   node scripts/seed-database.js
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Usage

### For Entrepreneurs
1. **Register** as an entrepreneur
2. **Complete your profile** with startup details, pitch summary, and funding needs
3. **Browse investors** and send collaboration requests
4. **Manage requests** from your dashboard
5. **Chat** with connected investors

### For Investors
1. **Register** as an investor
2. **Set up your profile** with investment interests and portfolio
3. **Discover startups** using search and filters
4. **Send connection requests** to entrepreneurs
5. **Communicate** through the messaging system

### Sample Login Credentials
After running the seed script, you can use these credentials:

**Entrepreneurs:**
- alice@startup.com / password123
- bob@healthtech.com / password123
- emma@greentech.com / password123

**Investors:**
- carol@venture.com / password123
- david@angelinvest.com / password123
- sarah@impactcapital.com / password123

## 🏗️ Project Structure

\`\`\`
business-nexus/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   ├── chat/              # Chat functionality
│   ├── dashboard/         # User dashboards
│   ├── profile/           # Profile pages
│   └── search/            # Search and discovery
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx
├── lib/                   # Utility functions
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # Authentication helpers
│   └── email.ts          # Email service
├── models/               # MongoDB schemas
│   ├── User.ts
│   ├── Request.ts
│   └── Message.ts
├── scripts/              # Database scripts
└── server.js            # Socket.io server
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Database Setup**
   - Create a MongoDB Atlas cluster
   - Update `MONGODB_URI` in Vercel environment variables

### Environment Variables for Production
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/business-nexus
JWT_SECRET=your_production_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_production_email@gmail.com
SMTP_PASS=your_production_app_password
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

## 📊 Features Overview

### Week 1 Deliverables ✅
- [x] Project setup with Next.js and TypeScript
- [x] Authentication system (login/register)
- [x] Role-based routing and dashboards
- [x] Basic UI components and layouts
- [x] MongoDB integration

### Week 2 Deliverables ✅
- [x] Investor and entrepreneur dashboards
- [x] Profile viewing and management
- [x] Collaboration request system
- [x] Search and filtering functionality
- [x] Profile editing capabilities

### Week 3 Deliverables ✅
- [x] Real-time chat with Socket.io
- [x] Email notifications
- [x] Admin dashboard with analytics
- [x] Responsive design and UI polish
- [x] Deployment configuration

### Advanced Features ✅
- [x] Advanced search with multiple filters
- [x] Typing indicators in chat
- [x] Notification system
- [x] Admin analytics dashboard
- [x] Email templates and automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/entrepreneurs` - Get all entrepreneurs
- `GET /api/investors` - Get all investors

### Collaboration Requests
- `POST /api/request` - Send collaboration request
- `GET /api/requests` - Get user's requests
- `PATCH /api/request/:id` - Update request status

### Messaging
- `GET /api/chat/:userId` - Get chat messages
- `POST /api/chat` - Send message

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify `MONGODB_URI` is correct
   - Check network access in MongoDB Atlas
   - Ensure IP whitelist includes your deployment IP

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check Gmail app password setup
   - Ensure less secure app access is enabled

3. **Socket.io Connection Issues**
   - Check server.js is running
   - Verify port configuration
   - Check firewall settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Socket.io](https://socket.io/) for real-time functionality
- [MongoDB](https://www.mongodb.com/) for database solutions

---

**Business Nexus** - Connecting entrepreneurs and investors for a better future 🚀
