# Mint


<p align="center">
  <b>Mint</b> is a modern, full-featured platform for conducting programming contests, managing coding problems, and building developer communities.
</p>


---

## ✨ Features

- 🏆 Host and manage programming contests
- 📚 Organize and share coding problems
- 👥 Multi-organization support
- 📊 Real-time monitoring and analytics (Prometheus)
- 🔒 Secure authentication and user management
- 📝 Interactive API documentation (Swagger)
- ⚡ Fast, modern stack (Next.js, Bun, Drizzle, Tailwind CSS)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22.2.0+
- Docker
- [Bun](https://bun.sh) (recommended)

### Setup

```bash
# 1. Clone the repository
bun install

# 2. Copy environment variables
cp .env.example .env

# 3. Start the database
bun pg


# 4. Run migrations and seed data
bun db:migrate
bun db:superuser  # Create an admin user
bun db:seed       # (Optional) Add test data

# 5. Start the development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🛠️ Project Structure

```text
mint/
├── app/            # Next.js app router pages
│   ├── api-doc/    # Swagger API documentation
│   └── api/        # API routes
├── components/     # React components
├── db/             # Database schema and migrations
├── lib/            # Utility functions and shared logic
├── middleware/     # Request middleware (logging, metrics, error handling)
├── public/         # Static assets
└── scripts/        # CLI scripts for development
```

---

## ⚡ Available Commands

```bash
bun dev           # Start development server
bun build         # Build for production
bun start         # Start production server
bun lint          # Run ESLint
bun format        # Format code with Prettier
bun format:check  # Check code formatting

# Database
bun pg            # Start PostgreSQL container
bun pg:stop       # Stop and remove PostgreSQL container
bun pg-admin      # Start pgAdmin web interface
bun pg-admin:stop # Stop and remove pgAdmin container
bun db:migrate    # Generate and apply database migrations
bun db:seed       # Add test data to database
bun db:clear      # Clear all data from database
bun db:superuser  # Create an admin user interactively
```

---

## 🧪 Test Data

Seeding creates:
- 2 Admin users
- 3 Organizer users
- 5 Regular users
- 3 Organizations
- 2 Problems, 2 Contests, 2 Groups per organization

All test users: `password123`

---

## 📊 Monitoring & Metrics

- Built-in Prometheus metrics: HTTP requests, user counts, DB query durations
- Metrics endpoint: [http://localhost:3000/api/metrics](http://localhost:3000/api/metrics)

**Prometheus config:**
```yaml
scrape_configs:
  - job_name: 'mint'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
```

---

## 🩺 Troubleshooting

- **Reset containers:**
  ```bash
  docker stop mint-postgres mint-pgadmin
  docker rm mint-postgres mint-pgadmin
  ```
- **Check ports:**
  ```bash
  sudo lsof -i :5432  # PostgreSQL
  sudo lsof -i :5050  # pgAdmin
  ```
- **Full reset:**
  ```bash
  bun pg:stop && bun pg-admin:stop && bun pg && bun pg-admin && bun db:clear && bun db:migrate && bun db:seed
  ```

> **Note:** You can use `npm run` instead of `bun` if preferred.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

---

## 📚 API Documentation

- Interactive docs at `/api-doc` (dev server)
- Request/response examples
- API endpoint testing interface

**Add docs to API routes:**
```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Endpoint description
 *     responses:
 *       200:
 *         description: Success response
 */
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mint

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_NAME=Mint Platform
SMTP_FROM_EMAIL=noreply@example.com
```

**Gmail setup:**
- Enable 2FA
- Generate an app password
- Use as `SMTP_PASSWORD`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

---

<!-- test ci deploy -->
