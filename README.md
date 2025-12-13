# ⚔️ Ritter der Würfelrunde - Die Tafelrunde

> "In einer Zeit uralter Legenden und heldenhafter Taten..."

Dies ist das offizielle Web-Portal für den **Ritter der Würfelrunde** Tabletop Club in Wiesbaden. Es dient als zentrale Plattform für Mitglieder, um Plätze zu reservieren, Neuigkeiten zu empfangen und ihren Dienst für den Verein zu verwalten.

## 📡 Status

**Live-Betrieb:** [Vercel Deployment](https://hprdw.vercel.app)
**Code:** [GitHub](https://github.com/AnFe89/HP_RdW)

## 🛡️ Funktionen & Bereiche

### 1. Das Tor (Landing)

- **Atmosphäre**: Ein lebendiges, mittelalterliches Erlebnis mit 3D-Würfelanimationen und majesticer Musik.
- **Design**: "Ink on Parchment" (Tinte auf Pergament) - Helle, freundliche Optik mit Holztexturen, goldenen Akzenten und authentischen Schriftarten (`Cinzel` & `Lato`).
- **Funktion**: Das Eingangsportal, das Besucher willkommen heißt.

### 2. Wir über uns

- **Information**: Vorstellung des Vereins, Treffpunkt (Phantasos Studio) und Zeiten (Donnerstags 18:00).
- **Stil**: Persönliche Ansprache ("Du"), die neue Spieler willkommen heißt.

### 3. Die Tafelrunde (Tischreservierung)

- **Interaktive Karte**: Eine interaktive Karte ("TacticalMap"), die den Saal mit 6 Tischen zeigt.
- **Realismus & Taktik**:
  - Tische zeigen dynamisch das aktive Spielsystem an (**Warhammer 40k** Logo oder **Kill Team** Icon).
  - Visuelle Details wie Spielmatten und Würfel auf leeren Tischen.
- **Platzwahl**:
  - **Freie Plätze**: Werden durch leere Stühle symbolisiert.
  - **Belegte Plätze**: Werden durch goldene Markierungen angezeigt.
- **Zugangskontrolle**:
  - **Eingeschränkt**: Nur vereidigte **Mitglieder** und **Admins** können reservieren.
  - **Privilegien**:
    - **Mitglieder** können Plätze an den Tischen reservieren und sehen eine persönliche Begrüßung ("Willkommen, [Name]").
    - **Admins** haben volle Kontrolle über alle Reservierungen via Dashboard.
  - **Partner-System & Gäste**:
    - **Partnerwahl:** Mitglieder können beim Reservieren direkt einen Spielpartner aus der Mitgliederliste auswählen.
    - **Einzelreservierung:** Option, um alleine zu reservieren (z.B. als Nachrücker).
    - **Externer Gast:** Ein spezieller "Gastspieler"-Button ermöglicht das Blocken eines Platzes für nicht-registrierte Gäste (benötigt DB-Trigger).
    - **Einladungssystem (Legacy):** Generierung von Einladungslinks (aktuell deaktiviert zugunsten der direkten Partnerwahl).
  - **Gast-Modus**:
    - Gäste können ihren Status und zugewiesenen Tisch einsehen.
    - Der Zugriff auf die taktische Karte bleibt Gästen verwehrt ("Einblick verwehrt"), um die strategische Integrität zu wahren.

### 3. Der Thronsaal (Admin)

- **Geschützter Bereich**: Nur zugänglich für die Führungsebene (`role: admin`).
- **News-System**:
  - Verfassen von Ankündigungen und Neuigkeiten.
  - Bearbeiten und Löschen von Einträgen.
- **Benutzerverwaltung**:
  - Übersicht aller registrierten Benutzer.
  - Vergabe von Rollen (Gast, Mitglied, Admin).
  - Übersicht aller registrierten Benutzer.
  - Vergabe von Rollen (Gast, Mitglied, Admin).
  - Mobile-Optimierte Tabelle für einfache Verwaltung von unterwegs.
- **Tischreservierungen**:
  - Zentrale Übersicht aller aktiven Reservierungen ("Tafelrunde").
  - Administrative Löschgewalt über alle Einträge.
  - **Zugriff:** Schnellzugriff über den "Admin-Dashboard" Button im Profil-Modal (nur für Admins sichtbar).

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

## 🌐 Domain Einrichtung & Deployment

Falls die Domain geändert werden soll (z.B. auf `www.ritter-wuerfelrunde.de`), sind Anpassungen an 3 Stellen notwendig:

### 1. Vercel (Frontend)

- In den Project Settings > **Domains** die neue Domain hinzufügen.
- Den angezeigten Vercel DNS-Records (A-Record / CNAME) beim Domain-Provider hinterlegen.

### 2. DNS Provider (Domain Host)

- Einloggen beim Anbieter wo die Domain gekauft wurde.
- DNS-Einstellungen öffnen.
- Die von Vercel geforderten Records eintragen (z.B. `A @ 76.76.21.21`).

### 3. Supabase (Auth Redirects) - WICHTIG!

Wenn dies vergessen wird, funktioniert der Login nicht mehr!

- **Dashboard** > **Authentication** > **URL Configuration** öffnen.
- **Site URL**: Auf die neue Domain ändern (z.B. `https://www.ritter-wuerfelrunde.de`).
- **Redirect URLs**: Die neue Domain hinzufügen, am besten mit Wildcard für Unterseiten: `https://www.ritter-wuerfelrunde.de/**`.

## © Copyright

**Ritter der Würfelrunde © 2026**
_Gedanke des Tages: Der Würfel ist gefallen._
