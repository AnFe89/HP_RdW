# ⚔️ Ritter der Würfelrunde - Die Tafelrunde

> "In einer Zeit uralter Legenden und heldenhafter Taten..."

Dies ist das offizielle Web-Portal für den **Ritter der Würfelrunde** Tabletop Club in Wiesbaden. Es dient als zentrale Plattform für Mitglieder, um Plätze zu reservieren, Neuigkeiten zu empfangen und ihren Dienst für den Verein zu verwalten.

## 📡 Status

**Live-Betrieb:** [Vercel Deployment](https://hprdw.vercel.app)
**Code:** [GitHub](https://github.com/AnFe89/HP_RdW)

## 🛡️ Funktionen & Bereiche

### 1. Das Tor (Landing)

- **Atmosphäre**: Ein lebendiges, mittelalterliches Erlebnis mit 3D-Würfelanimationen und majestätischer Musik.
- **Design**: "Ink on Parchment" (Tinte auf Pergament) - Helle, freundliche Optik mit Holztexturen, goldenen Akzenten und authentischen Schriftarten (`Cinzel` & `Lato`).
- **Funktion**: Das Eingangsportal, das Besucher willkommen heißt und den Weg in die inneren Bereiche weist.

### 2. Die Tafelrunde (Reservierungen)

- **Interaktive Karte**: Eine interaktive Karte ("TacticalMap"), die den Saal mit 6 massiven Eichentischen zeigt.
- **Platzwahl**:
  - **Freie Plätze**: Werden durch leere Stühle symbolisiert.
  - **Belegte Plätze**: Werden durch goldene Siegel oder gefüllte Kelche markiert.
- **Zugangskontrolle**:
  - **Eingeschränkt**: Nur vereidigte **Mitglieder** und **Admins** können reservieren.
  - **Gast-Ansicht**: Nicht eingeloggte Besucher sehen einen vereinfachten Login-Prompt statt einer "Zugriff verweigert"-Warnung.
  - **Privilegien**:
    - **Mitglieder** können Plätze an den Tischen reservieren.
    - **Admins** verwalten die Sitzordnung.

### 3. Der Thronsaal (Admin)

- **Geschützter Bereich**: Nur zugänglich für die Führungsebene (`role: admin`).
- **News-System**:
  - Verfassen von Ankündigungen und Neuigkeiten.
  - Bearbeiten und Löschen von Einträgen.
- **Benutzerverwaltung**:
  - Übersicht aller registrierten Benutzer.
  - Vergabe von Rollen (Gast, Mitglied, Admin).
  - Mobile-Optimierte Tabelle für einfache Verwaltung von unterwegs.

### 4. Mitgliederverwaltung

- **Authentifizierung**: Login via Email oder Benutzername.
- **Flexibler Zugang**: Passwortloser Zugang via Magic Link möglich.
- **Recht auf Vergessen**: Vollständige Löschung des Accounts auf Wunsch (DSGVO-konform).

## 🏗️ Das Fundament (Tech Stack)

- **Kern**: React (Vite), TypeScript
- **Stil**: Tailwind CSS (Custom Wood/Parchment/Gold Theme), Framer Motion
- **3D-Kunst**: React Three Fiber (R3F), Drei, GLSL Shaders
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)

## 🛠️ Installation (Lokal)

1. **Repository klonen**

   ```bash
   git clone https://github.com/AnFe89/HP_RdW.git
   cd hp-ritter-der-wuerfelrunde
   ```

2. **Abhängigkeiten installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen (.env)**
   Erstelle eine `.env` Datei mit den Schlüsseln zum Supabase-Projekt:

   ```env
   VITE_SUPABASE_URL=deine_supabase_url
   VITE_SUPABASE_KEY=dein_supabase_anon_key
   ```

4. **Starten**
   ```bash
   npm run dev
   ```

## 📜 Entwickler-Richtlinien

### "Mobile First" Doktrin

Jede neue Funktion muss primär auf mobilen Geräten funktionieren.

- Inhalte müssen sich vertikal stapeln.
- Bilder dürfen den Rahmen nicht sprengen.
- Schaltflächen müssen groß genug für Touch-Bedienung sein.

## © Copyright

**Ritter der Würfelrunde © 2026**
_Gedanke des Tages: Der Würfel ist gefallen._
