# MailFlow

MailFlow is a privacy-focused Gmail client built with React, TypeScript, and Vite. It provides a secure, modern interface for managing your Gmail inbox, composing and scheduling emails, and analyzing email tone and security—all with a strong emphasis on user privacy and compliance with Google’s API policies.

---

## Features

- **Secure Gmail OAuth 2.0 Authentication**
- **Inbox Management**: Read, search, and organize emails
- **Email Composer**: Compose, send, and schedule emails
- **AI Tools**: Tone analyzer, security scanner, and writing assistant
- **Email Scheduling**: Schedule emails to be sent later (via Supabase Edge Functions)
- **Email Analytics**: Visualize email activity and trends
- **Privacy & Security**: No email data is stored on external servers; all processing is client-side
- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly experience
- **Legal & Compliance**: In-app privacy, security, and terms of service pages

---

## Project Structure

```
MailFlow/
├── public/                # Static assets
├── src/
│   ├── App.tsx            # Main application logic and routing
│   ├── main.tsx           # React root renderer
│   ├── components/        # UI components (Header, AuthCard, Dashboard, etc.)
│   ├── hooks/             # Custom React hooks (Gmail API, Auth, etc.)
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── index.css          # Tailwind CSS entry
├── supabase/              # Supabase Edge Functions for scheduling
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
├── tsconfig.json          # TypeScript configuration
└── .env.local             # Local environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Google Cloud Project** with Gmail API enabled and OAuth 2.0 credentials
- (Optional) **Supabase** project for email scheduling

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/mailflow.git
cd mailflow
```

### 2. Install Dependencies

```sh
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following (replace with your values):

```
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Enable the **Gmail API**.
4. Create **OAuth 2.0 Client ID** credentials (type: Web application).
5. Add your local and production URLs to the **Authorized JavaScript origins**.
6. Copy the **Client ID** to your `.env.local` as `VITE_GOOGLE_CLIENT_ID`.

---

## Supabase Setup (for Email Scheduling)

1. [Sign up for Supabase](https://supabase.com/) and create a new project.
2. Set up the database and deploy the SQL in `supabase/`.
3. Deploy the Edge Function in `schedule-email`.
4. Add your Supabase URL and anon key to `.env.local`.

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

---

## Key Components

- `App.tsx`: Main app logic, view switching, authentication
- `Dashboard.tsx`: Main dashboard with tabs (Inbox, Compose, Analytics, etc.)
- `AuthCard.tsx`: Login and authentication UI
- `SecurityPolicy.tsx`: Security policy page
- `PrivacyPolicy.tsx`: Privacy policy page
- `TermsOfService.tsx`: Terms of service page

---

## Security & Privacy

- **OAuth 2.0**: All authentication is handled via Google’s secure OAuth 2.0 flow.
- **No Server Storage**: Email data is never stored on MailFlow servers; all processing is client-side.
- **Minimal Permissions**: Only the necessary Gmail scopes are requested.
- **Compliance**: Adheres to [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy).

---

## Deployment

1. Build the app:

   ```sh
   npm run build
   ```

2. Deploy the `dist/` folder to your preferred static hosting (Vercel, Netlify, Firebase Hosting, etc.).

---

## Live Demo

The product is live at: [https://mail-flow.netlify.app](https://mail-flow.netlify.app)

---

## Constraints

1. **Scheduled Mail**: Currently, automatic scheduling emails is supported only for durations within 1 hour.
2. **OAuth Verification**: Google has not yet verified the application, so you may see a warning during the OAuth login process.
