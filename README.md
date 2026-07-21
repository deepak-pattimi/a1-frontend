# A1 Laparoscopy Hospital - Next.js Frontend

Advanced laparoscopic and bariatric surgery hospital website built with Next.js SSR for optimal SEO performance.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` to see the site.

---

## 📊 SEO Schema Implementation

This project includes comprehensive JSON-LD structured data (schema.org) for enhanced search engine visibility and rich results.

### Schema Coverage
- ✅ **Homepage**: Hospital + WebSite + FAQPage schemas
- ✅ **Doctor Profiles**: Physician schemas with credentials
- ✅ **Service Pages**: MedicalProcedure schemas (8 services)
- ✅ **Blog Posts**: MedicalWebPage schemas with dynamic authors

### Documentation
- 📘 **Quick Start**: [`QUICK_START_SEO.md`](QUICK_START_SEO.md) - Get started in 3 steps
- 📗 **Full Guide**: [`SEO_SCHEMA_CONFIG.md`](SEO_SCHEMA_CONFIG.md) - Complete implementation guide
- 📙 **Action Items**: [`SCHEMA_TODO.md`](SCHEMA_TODO.md) - What to do before deployment
- 📕 **Architecture**: [`SCHEMA_ARCHITECTURE.md`](SCHEMA_ARCHITECTURE.md) - Schema structure & relationships
- 📔 **Summary**: [`IMPLEMENTATION_SUMMARY.md`](IMPLEMENTATION_SUMMARY.md) - What was implemented

### Validation
```bash
# Validate all schemas
npm run schema:validate

# Check SEO implementation
npm run seo:check

# Check AI optimization (NEW)
npm run ai:check
```

---

## 🤖 AI Detection & LLM Optimization

This project is optimized for AI crawlers and Large Language Models (LLMs) to ensure better visibility in AI-powered search engines like Perplexity, You.com, and ChatGPT.

### What's Included
- ✅ **AI Crawler Permissions**: robots.txt configured for GPTBot, CCBot, Google-Extended, Claude, etc.
- ✅ **AI Meta Tags**: Author, publisher, content classification tags on all pages
- ✅ **AI Utilities**: Reusable functions for consistent AI optimization
- ✅ **Validation Tools**: Automated checking script for AI readiness

### Documentation
- 📘 **AI Guide**: [`AI_DETECTION_OPTIMIZATION.md`](AI_DETECTION_OPTIMIZATION.md) - Complete AI optimization guide
- 📗 **Quick Reference**: [`AI_SEO_QUICK_REFERENCE.md`](AI_SEO_QUICK_REFERENCE.md) - Quick implementation card

### Adding AI Tags to Pages
```javascript
import { getAIMetaTags, AI_CONTENT_CATEGORIES } from '@/utils/aiOptimization';

<Head>
    {getAIMetaTags({
        author: 'Dr. Naveen Kumar Anem',
        category: AI_CONTENT_CATEGORIES.SERVICE_PAGE,
        contentType: 'surgical-service'
    }).map((tag, idx) => <meta key={idx} {...tag} />)}
</Head>
```

### AI Crawlers Allowed
- **GPTBot** (OpenAI)
- **CCBot** (Common Crawl)
- **Google-Extended** (Google Gemini)
- **anthropic-ai/Claude-Web** (Anthropic Claude)
- **FacebookBot** (Social media)
- And more...

See [`public/robots.txt`](public/robots.txt) for full configuration.

---

## 🏗️ Project Structure

```
frontend-next/
│
├── src/
│   ├── Components/          # React components
│   ├── pages/               # Next.js pages (routes)
│   │   ├── index.js         # Homepage with Hospital schema
│   │   ├── Aboutdr.js       # Dr. Naveen profile
│   │   ├── dr-prathyusha-gynecologist.js
│   │   ├── [service]-*.js   # 8 service pages
│   │   └── page/[slug].js   # Dynamic blog posts
│   ├── styles/              # Global styles
│   └── utils/
│       ├── schemas/         # JSON-LD schema utilities
│       │   ├── hospital.js
│       │   ├── doctors.js
│       │   ├── services.js
│       │   ├── blog.js
│       │   └── index.js
│       └── axiosConfig.js   # API configuration
│
├── public/                  # Static assets
├── scripts/                 # Utility scripts
│   ├── validate-schemas.js  # Schema validation tool
│   └── check-seo.js         # SEO checker
│
├── next.config.js           # Next.js configuration
├── package.json
└── Documentation files (.md)
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run analyze` | Bundle analysis |
| `npm run seo:check` | Check SEO implementation |
| `npm run ai:check` | **Check AI optimization** (NEW) |
| `npm run schema:validate` | Validate JSON-LD schemas |

---

## ⚠️ Before Deployment

### 1. Fill Required Placeholders
Open `src/utils/schemas/hospital.js` and replace:
- GPS coordinates (latitude/longitude)
- Phone number

See [`SCHEMA_TODO.md`](SCHEMA_TODO.md) for detailed instructions.

### 2. Add URL Redirects
Add to `next.config.js`:
```javascript
async redirects() {
  return [
    { source: '/Aboutdr', destination: '/dr-naveen-kumar-anem', permanent: true },
    { source: '/Contact', destination: '/contact', permanent: true },
    // ... more redirects
  ];
}
```

### 3. Test Locally
```bash
npm run build
npm start
# Visit http://localhost:3000
# Right-click → View Page Source
# Search for "application/ld+json"
```

### 4. Validate Online
After deployment:
- [Schema Validator](https://validator.schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## 🎯 Features

### Technical
- ✅ Server-Side Rendering (SSR) for SEO
- ✅ Responsive design (mobile-first)
- ✅ Fast loading with optimized assets
- ✅ API integration with Laravel backend
- ✅ Dynamic routing for blog posts

### SEO
- ✅ Comprehensive JSON-LD schema markup
- ✅ Meta tags on all pages
- ✅ Open Graph & Twitter Cards
- ✅ Canonical URLs
- ✅ Breadcrumb navigation
- ✅ FAQ rich results potential

### Medical Content
- ✅ Doctor profiles with credentials
- ✅ Service pages with procedure details
- ✅ Blog posts with medical authority signals
- ✅ E-A-T optimization (Expertise, Authority, Trust)

---

## 🌐 Deployment

### Supported Platforms
- ✅ VPS (DigitalOcean, Linode, AWS EC2)
- ✅ Platform-as-a-Service (Vercel, Railway, Render)
- ✅ Hostinger VPS/Cloud Hosting with Node.js support

### Not Supported
- ❌ Shared hosting without Node.js
- ❌ Static hosting only (requires SSR)

### Environment Variables
Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/
```

---

## 📈 Expected SEO Benefits

### Timeline
- **Week 1-2**: Google indexes structured data
- **Month 1-3**: Rich results appear in SERPs
- **Month 3-6**: Improved rankings & CTR

### Rich Results
- 🏥 Hospital knowledge panel
- 👨‍⚕️ Doctor profile cards
- ❓ FAQ expandable questions
- 🍞 Breadcrumb navigation
- 📄 Article rich snippets (blogs)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **React**: 19.2
- **Styling**: Bootstrap 5, Material-UI
- **HTTP Client**: Axios
- **Icons**: React Icons, React Bootstrap Icons
- **Animations**: AOS (Animate On Scroll)

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Schema.org Medical](https://schema.org/MedicalEntity)
- [Google Structured Data](https://developers.google.com/search/docs/appearance/structured-data)

### Tools
- [Schema Validator](https://validator.schema.org)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Google Search Console](https://search.google.com/search-console)

---

## 🤝 Contributing

1. Follow existing code patterns
2. Ensure all new pages include appropriate schema
3. Run `npm run schema:validate` before committing
4. Update documentation if adding features

---

## 📞 Support

For questions about:
- **Schema Implementation**: See `SEO_SCHEMA_CONFIG.md`
- **Deployment**: See `DEPLOYMENT.md` (if exists)
- **General Issues**: Check existing documentation files

---

## 📄 License

Private - A1 Laparoscopy Hospital

---

**Last Updated**: 2026-04-28  
**Version**: 1.0.0  
**Status**: Production Ready
