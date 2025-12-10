# ⚔️ Ritter der Würfelrunde - Die Tafelrunde

> "In einer Zeit uralter Legenden und heldenhafter Taten..."

Dies ist das offizielle Web-Portal für den **Ritter der Würfelrunde** Tabletop Club in Wiesbaden. Es dient als zentrale Halle für Ritter (Mitglieder), um Plätze an der Tafel zu reservieren, Neuigkeiten vom Herold zu empfangen und ihren Dienst für den Orden zu verwalten.

## 📡 Status des Königreichs

**Live-Betrieb:** [Vercel Deployment](https://hprdw.vercel.app)
**Schatzkammer (Code):** [GitHub](https://github.com/AnFe89/HP_RdW)

## 🛡️ Die Hallen des Ordens

### 1. Das Tor (Landing)

- **Atmosphäre**: Ein lebendiges, mittelalterliches Erlebnis mit 3D-Würfelanimationen und majestätischer Musik.
- **Design**: "Ink on Parchment" (Tinte auf Pergament) - Helle, freundliche Optik mit Holztexturen, goldenen Akzenten und authentischen Schriftarten (`Cinzel` & `Lato`).
- **Funktion**: Das Eingangsportal, das Besucher willkommen heißt und den Weg in die inneren Hallen weist.

### 2. Die Tafelrunde (Reservierungen)

- **Königssaal**: Eine interaktive Karte ("TacticalMap"), die den Großen Saal mit 6 massiven Eichentischen zeigt.
- **Platzwahl**:
  - **Freie Plätze**: Werden durch leere Stühle symbolisiert.
  - **Belegte Plätze**: Werden durch goldene Siegel oder gefüllte Kelche markiert.
- **Zugangskontrolle**:
  - **Zutritt Verwehrt**: Nur vereidigte **Ritter** (Mitglieder) und die **Königsgarde** (Admins) haben Zutritt. Unbefugte (Gäste) werden abgewiesen.
  - **Privilegien**:
    - **Ritter** können Plätze an den Tischen für sich beanspruchen.
    - **Königsgarde** verwaltet die Sitzordnung mit absoluter Autorität.

### 3. Der Thronsaal (Admin)

- **Geschützter Bereich**: Nur zugänglich für die Führungsebene (`role: admin`).
- **Herold-System (News)**:
  - Verfassen von Dekreten und Neuigkeiten mittelsMarkdown-Editor.
  - Hochladen von Illustrationen und Kartenmaterial.
- **Heeresschau (User Management)**:
  - Beförderung von **Knechten** (Gästen) zu **Rittern** (Mitgliedern).
  - **Großmeister-Protokoll**: Nur der "Großmeister" kann Mitglieder in die Königsgarde berufen.

### 4. Mitgliederverwaltung

- **Wappen-Name**: Eindeutige Identifikation durch Nutzernamen.
- **Flexibler Zugang**: Einlass gewährt durch **Email** oder **Wappen-Name**.
- **Sicherer Briefverkehr**: Passwortloser Zugang via Magic Link.
- **Recht auf Vergessen**: Vollständige Löschung der Akte auf Wunsch (DSGVO-konform).

## 🏗️ Das Fundament (Tech Stack)

- **Kern**: React (Vite), TypeScript
- **Stil**: Tailwind CSS (Custom Wood/Parchment/Gold Theme), Framer Motion
- **3D-Kunst**: React Three Fiber (R3F), Drei, GLSL Shaders
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)

## 🛠️ Aufbau der Schmiede (Lokal)

1. **Die Pläne beschaffen**

   ```bash
   git clone https://github.com/AnFe89/HP_RdW.git
   cd hp-ritter-der-wuerfelrunde
   ```

2. **Werkzeuge sammeln**

   ```bash
   npm install
   ```

3. **Geheimnisse der Alchemisten (.env)**
   Erstelle eine `.env` Datei mit den Schlüsseln zum Supabase-Reich:

   ```env
   VITE_SUPABASE_URL=deine_supabase_url
   VITE_SUPABASE_KEY=dein_supabase_anon_key
   ```

4. **Das Feuer entfachen**
   ```bash
   npm run dev
   ```

## 📜 Kodex der Erbauer

### "Mobile First" Doktrin

Jede neue Halle oder Kammer muss auch auf kleinen Schriftrollen (Smartphones) lesbar sein.

- Inhalte müssen sich vertikal stapeln.
- Bilder dürfen den Rahmen nicht sprengen.
- Schaltflächen müssen groß genug für einen Daumen sein.

## © Siegel

**Ritter der Würfelrunde © 2026**
_Gedanke des Tages: Der Würfel ist gefallen._
