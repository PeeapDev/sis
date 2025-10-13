# Sierra Leone School Information System (SIS)

A comprehensive School Information System built for Sierra Leone with modern web technologies, featuring data visualization, interactive maps, blockchain integration, and inter-school data exchange capabilities.

## 🚀 Features

### Core Functionality
- **Multi-Dashboard System**: Separate dashboards for administrators, schools, and students
- **Data Visualization**: Interactive charts and analytics for educational data
- **Interactive Maps**: Geographic visualization of schools across Sierra Leone
- **Advanced Search**: Powerful search functionality across all educational records
- **Blockchain Integration**: Permanent, tamper-proof storage of educational certificates
- **Inter-School API**: Secure data exchange between different school systems

### User Roles
- **System Administrators**: National and district-level oversight
- **School Administrators**: School-level management and reporting
- **Students**: Access to personal academic records and history

### Key Features
- Student enrollment and management
- Academic results tracking and analysis
- Teacher and staff management
- School performance analytics
- Certificate generation and verification
- Attendance tracking
- Multi-school student history
- Blockchain-verified credentials

## 🛠 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Framer Motion** - Smooth animations and transitions
- **Chart.js/Recharts** - Data visualization
- **React Leaflet** - Interactive maps

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma** - Database ORM and migrations
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication and authorization

### Blockchain
- **Web3.js** - Ethereum/Polygon blockchain integration
- **Smart Contracts** - Solidity contracts for record storage
- **IPFS** - Decentralized file storage (planned)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn package manager
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SIS
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Copy the example environment file and configure your settings:
```bash
cp .env.example .env.local
```

Configure the following environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sierra_leone_sis"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Blockchain (Optional)
WEB3_PROVIDER_URL="https://polygon-mainnet.g.alchemy.com/v2/your-api-key"
BLOCKCHAIN_PRIVATE_KEY="your-private-key-here"
SMART_CONTRACT_ADDRESS="your-contract-address-here"

# Maps (Optional)
MAPBOX_ACCESS_TOKEN="your-mapbox-token-here"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Demo Accounts

For testing purposes, use these demo accounts:

- **System Admin**: `admin@sis.gov.sl` / `password123`
- **District Admin**: `district@sis.gov.sl` / `password123`
- **School Admin**: `school@sis.gov.sl` / `password123`
- **Student**: `student@sis.gov.sl` / `password123`

## 📊 Database Schema

The system uses a comprehensive database schema including:

- **Users & Authentication**: Multi-role user management
- **Schools**: School information and metadata
- **Students**: Student profiles and enrollment history
- **Teachers**: Staff management and subject assignments
- **Results**: Academic performance tracking
- **Subjects**: Curriculum and subject management
- **Blockchain Records**: Immutable record references

## 🔗 API Endpoints

### Schools API
- `GET /api/schools` - List schools with filtering
- `POST /api/schools` - Create new school
- `GET /api/schools/[id]` - Get school details

### Students API
- `GET /api/students` - List students with filtering
- `POST /api/students` - Enroll new student
- `GET /api/students/[id]` - Get student details

### Results API
- `GET /api/results` - Get academic results
- `POST /api/results` - Record new results

### Blockchain API
- `POST /api/blockchain/store` - Store record on blockchain
- `POST /api/blockchain/verify` - Verify blockchain record
- `GET /api/blockchain/status` - Check blockchain status

## 🌍 Sierra Leone Context

This system is specifically designed for Sierra Leone's educational landscape:

### Geographic Coverage
- **Western Area**: Freetown and surrounding areas
- **Northern Province**: Makeni, Port Loko, Kambia, etc.
- **Southern Province**: Bo, Kenema, Pujehun, etc.
- **Eastern Province**: Kailahun, Kono, etc.

### Educational Levels
- Pre-Primary Education
- Primary Education (Classes 1-6)
- Junior Secondary School (JSS 1-3)
- Senior Secondary School (SSS 1-3)
- Technical and Vocational Education

### Local Features
- Sierra Leone phone number validation
- Local currency support (Leone - SLL)
- District and chiefdom organization
- Local language support (planned)

## 🔐 Security Features

- **Role-based Access Control**: Granular permissions system
- **Data Encryption**: Sensitive data encryption at rest
- **Blockchain Verification**: Tamper-proof record storage
- **Audit Trails**: Comprehensive activity logging
- **API Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment (Planned)
```bash
docker build -t sierra-leone-sis .
docker run -p 3000:3000 sierra-leone-sis
```

### Environment Variables for Production
Ensure all environment variables are properly configured for production, including:
- Database connection strings
- Blockchain provider URLs
- API keys and secrets
- Domain configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core dashboard functionality
- ✅ User authentication and authorization
- ✅ Basic data visualization
- ✅ School and student management
- ✅ Results tracking

### Phase 2 (In Progress)
- 🔄 Blockchain integration
- 🔄 Advanced analytics
- 🔄 Mobile responsiveness
- 🔄 API documentation

### Phase 3 (Planned)
- 📋 Mobile applications
- 📋 Offline functionality
- 📋 Advanced reporting
- 📋 Integration with Ministry systems
- 📋 Multi-language support

## 📈 System Requirements

### Minimum Requirements
- 2GB RAM
- 10GB storage
- Modern web browser
- Internet connection

### Recommended Requirements
- 4GB+ RAM
- 50GB+ storage
- High-speed internet
- Modern server infrastructure

---

**Built with ❤️ for Sierra Leone's Education System**
# sis
