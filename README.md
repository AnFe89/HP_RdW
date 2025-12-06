# ⚔️ Ritter der Würfelrunde - Command Center

> "In the grim darkness of the far future, there is only war... and scheduling conflicts."

This is the official web portal for the **Ritter der Würfelrunde** Tabletop Club in Wiesbaden. It serves as a tactical hub for operatives (members) to reserve tables, check mission briefings (news), and manage their service records (accounts).

## 📡 Deployment Status

**Live Operations:** [Vercel Deployment](https://hprdw.vercel.app)
**Repository:** [GitHub](https://github.com/AnFe89/HP_RdW)

## 🛡️ Key Features

### 1. The Command Center (Landing)

- **Tech**: React Three Fiber, Custom Shaders.
- **Visuals**: A procedural 3D wireframe topographic map that reacts to mouse movement.
- **Design**: Modern "Glassmorphism" UI with frosted glass panels, neon accents, and responsive animations.
- **Immersion**: Deep void colors, glitch effects, and military-grade typography.

### 2. The War Room (Reservations)

- **Galaxy Map**: A 2D schematized view of the gaming floor (Galaxy Map) with sector status.
- **Real-time Intel**: Live reservation status fetched from Supabase.
- **Identity Protocol**:
  - **Operatives** (Member) can reserve Sectors.
  - **Commanders** (Admins) override protocols and can reserve any sector.
  - **Guests** can view but not interact with deployment zones.

### 3. The Command Bridge (Admin)

- **Secure Access**: Protected route (`/admin`) visible only to users with `role: admin`.
- **Propaganda Machine**:
  - Full **Rich Text Editor** (Markdown) for news.
  - **Image Upload** via Supabase Storage.
  - Create, Update, and Delete signals.
- **Personnel Files**:
  - Promote recruits (Guests) to Operatives (Members).
  - **Inquisitor Protocol**: Only the designated "Lord Inquisitor" can appoint or remove Commanders (Admins).
- **Mobile Optimized**: Fully tactical ready on smartphones with adaptive UI.

### 4. Operative Management

- **Codename System**: Usernames enforced via database unique constraints.
- **Secure Access**: Passwordless Magic Link & Email login.
- **Right to be Forgotten**: GDPR-compliant "Delete Identity" feature cleans up all traces.

## 🏗️ Tech Stack

- **Core**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D Engine**: React Three Fiber (R3F), Drei
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)

## 🛠️ Setup for Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnFe89/HP_RdW.git
   cd hp-ritter-der-wuerfelrunde
   ```

2. **Install Supply Lines**

   ```bash
   npm install
   ```

3. **Configure Tech-Priest Protocols (.env)**
   Create a `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_KEY=your_supabase_anon_key
   ```

4. **Ignite Engine**
   ```bash
   npm run dev
   ```

## 📜 Development Guidelines

### Mobile First Policy

Every new section or page added to the application **must** be fully optimized for mobile devices. Ensure:

- Components stack vertically on small screens.
- Images scale correctly without overflow.
- Touch targets are accessible.

## © Copyright

**Ritter der Würfelrunde © 2026**
_Imperial Thought of the Day: Victory needs no explanation, defeat allows none._
