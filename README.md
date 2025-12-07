# Sierra Leone Student Information System (SIS)

A comprehensive Student Information System built for Sierra Leone featuring **blockchain-based academic credential verification**. This system solves the critical problem of fake certificates by allowing universities to issue tamper-proof digital credentials that employers can verify instantly.

## 🎯 The Problem We Solve

> **"How can an employer be sure that a job applicant's certificate is real without waiting weeks for the university to respond?"**

Verifying academic credentials is traditionally:
- **Slow**: Takes weeks to get confirmation from universities
- **Manual**: Requires emails, phone calls, and paperwork
- **Unreliable**: Easy to forge paper certificates
- **Costly**: Universities spend resources on verification requests

## ✅ Our Solution

A **blockchain-based credential verification system** where:
1. **Universities issue digital certificates** stored on Solana blockchain
2. **Each certificate gets a unique verification code** and QR code
3. **Employers verify instantly** by scanning QR or entering the code
4. **Fake certificates are immediately detected** - invalid codes return "Not Found"
5. **Revoked certificates are clearly marked** with the reason

## 🚀 Features

### 🔐 Blockchain Credential Verification
- **Tamper-proof certificates** stored on Solana blockchain
- **Instant verification** via QR code or 9-character code
- **Public verification portal** - no login required for employers
- **Revocation support** with audit trail
- **Verification logging** for analytics

### 🎓 University Academic Management
- **Student enrollment** and program management
- **Course/module management** with credit system
- **Results entry by lecturers** with auto-grade calculation
- **Bulk results upload** for efficiency
- **CGPA calculation** and class of degree determination
- **Graduation processing** workflow

### 📜 Certificate Management
- **Issue certificates** with blockchain storage
- **Generate printable PDFs** with QR codes
- **Revoke certificates** with reason tracking
- **Download and print** professional certificates

### 📊 Dashboards
- **Admin Dashboard**: System-wide management
- **Lecturer Dashboard**: Results entry and management
- **Institution Dashboard**: Certificate issuance
- **Public Verification Portal**: For employers

## 🛠 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icons
- **jsPDF + html2canvas** - PDF generation

### Backend
- **Next.js API Routes** - Server-side endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication

### Blockchain
- **Solana** - Fast, low-cost blockchain (~$0.00025 per transaction)
- **@solana/web3.js** - Solana JavaScript SDK
- **Memo Program** - On-chain data storage via memo transactions
- **QR Code Generation** - For instant certificate verification

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

# Solana Blockchain
SOLANA_NETWORK="devnet"
SOLANA_RPC_URL="https://api.devnet.solana.com"
SOLANA_PRIVATE_KEY="your-base58-private-key"
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

## ⛓️ Solana Blockchain Integration

The system uses **Solana blockchain** for tamper-proof credential storage:

### Environment Variables
```env
# Solana Configuration
SOLANA_NETWORK=devnet                    # devnet, testnet, or mainnet-beta
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your-base58-private-key
```

### Blockchain API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blockchain/status` | GET | Check wallet balance and network status |
| `/api/blockchain/store` | POST | Store certificate hash on-chain |
| `/api/blockchain/verify` | POST | Verify a blockchain transaction |
| `/api/blockchain/tx/[signature]` | GET | Get transaction details |
| `/api/blockchain/airdrop` | POST | Request devnet SOL (devnet only) |

### How It Works
1. When a certificate is issued, a SHA-256 hash is created
2. The hash is stored on Solana via a **memo transaction**
3. The transaction signature is saved with the certificate
4. Anyone can verify the certificate by checking the on-chain data

### Cost
- **Devnet**: Free (use airdrop endpoint)
- **Mainnet**: ~$0.00025 per certificate (~4000 certs per $1)

## 🔐 Demo Accounts

For testing purposes, use these demo accounts:

### System Accounts
- **System Admin**: `admin@sis.gov.sl` / `password123`
- **District Admin**: `district@sis.gov.sl` / `password123`
- **School Admin**: `school@sis.gov.sl` / `password123`
- **Student**: `student@sis.gov.sl` / `password123`

### Institution Accounts (Certificate Verification)
- **USL Registrar**: `registrar@usl.edu.sl` / `admin123`

### Demo Verification Codes
Test the public verification portal at `/verify` with these codes:
- `ABC123XYZ` - Valid BSc Computer Science certificate
- `DEF456GHI` - Valid BA Economics certificate
- `JKL789MNO` - Valid BSc Nursing certificate
- `REV999XXX` - Revoked certificate (for testing)

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
- `POST /api/results` - Record new results. Optional: include `storeOnChain: true` to also write a hash of the result to the blockchain and save a `BlockchainRecord` reference.

### Blockchain API
- `GET /api/blockchain/status` - Check Solana wallet and network status
- `POST /api/blockchain/store` - Store certificate hash on Solana
- `POST /api/blockchain/verify` - Verify blockchain transaction
- `GET /api/blockchain/tx/[signature]` - Get transaction details
- `POST /api/blockchain/airdrop` - Request devnet SOL

### Certificate Verification API
- `POST /api/certificates` - Issue new certificate
- `GET /api/certificates` - List institution certificates
- `POST /api/certificates/[id]/revoke` - Revoke a certificate
- `POST /api/verify` - Verify certificate by code
- `GET /api/verify?code=XXX` - Verify certificate (GET for QR codes)
- `GET/POST /api/institutions` - Manage institutions

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

### Phase 2 (Completed ✅)
- ✅ Solana blockchain integration
- ✅ Certificate verification system
- ✅ Public verification portal
- ✅ QR code generation
- ✅ Institution management
- 🔄 Advanced analytics
- 🔄 Mobile responsiveness

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

---

## 📚 Related Repositories

- **[College Portal](https://github.com/PeeapDev/college)** - Multi-tenant college management system
