# ⚔️ Ritter der Würfelrunde - Die Tafelrunde

> "In einer Zeit uralter Legenden und heldenhafter Taten..."

Dies ist das offizielle Web-Portal für den **Ritter der Würfelrunde** Tabletop Club in Wiesbaden. Es dient als zentrale Plattform für Mitglieder, um Plätze zu reservieren, Neuigkeiten zu empfangen und ihren Dienst für den Verein zu verwalten.

## 📡 Status

**Live-Betrieb:** [www.rdw-ev.de](https://www.rdw-ev.de)
**Code:** [GitHub](https://github.com/AnFe89/HP_RdW)

## 🛡️ Funktionen & Bereiche

### 1. Das Tor (Landing)

- **Atmosphäre**: Ein lebendiges, mittelalterliches Erlebnis mit immersiven Hintergründen, 3D-Würfelanimationen und majesticer Musik.
- **Design**: "Ink on Parchment" (Tinte auf Pergament) - Helle, freundliche Optik mit Holztexturen, goldenen Akzenten und authentischen Schriftarten (`Cinzel` & `Lato`).
- **Funktion**: Das Eingangsportal, das Besucher willkommen heißt.

### 2. Wir über uns

- **Information**: Vorstellung des Vereins, Treffpunkt (Phantasos Studio) und Zeiten (Donnerstags 18:00).
- **Stil**: Persönliche Ansprache ("Du") vor dem Hintergrund einer **belebten Taverne**, die neue Spieler willkommen heißt.
- **Social Media**: Direkte Verlinkung zum **Discord Server** und **Instagram Profil** (@rdw_ev).

### 3. Der Rabe (Kontakt)

- **Funktion**: Ein stilvolles Kontaktformular vor dem Hintergrund eines **mystischen Raben-Schreibtischs**.
- **Technik**: Integration via Formspree.
- **Feedback**: Visuelles Feedback beim Senden (Ladeanimation, Erfolgsmeldung).

### 4. Die Tafelrunde (Tischreservierung)

- **Interaktive Karte**: Eine taktische Karte auf einem **Kriegstisch-Hintergrund**, die den Saal mit 6 Tischen zeigt.
- **Realismus & Taktik**:
  - Tische zeigen dynamisch das aktive Spielsystem an (**Warhammer 40k**, **Kill Team** oder **AoS: Spearhead**).
  - **Kill Team & Spearhead Spezial**: Bei Kill Team und Age of Sigmar: Spearhead werden die Plätze paarweise (Säulen) gefüllt. Ein Paar leuchtet grün, sobald sich zwei Spieler gefunden haben (auch wenn der Tisch noch nicht voll ist). Die Paare werden visuell getrennt dargestellt (Links vs. Rechts).
  - **Misch-Tische**: Dank dem neuen modularen System können **Kill Team** und **Age of Sigmar: Spearhead** Partien gleichzeitig an einem Tisch stattfinden. Beide Systeme gelten als "Skirmish"-Systeme und sind kompatibel. Die Logos werden entsprechend dynamisch kombiniert.
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

### 5. Der Herold (News-Feed)

- **Aktuelle Kunde**: Anzeige der neuesten Dekrete auf einer **mittelalterlichen Anschlagtafel**.
- **Organisation**:
  - Zeigt standardmäßig die **5 aktuellsten** Beiträge.
  - **Archiv-Funktion**: Über eine Blätter-Funktion ("Neuere/Ältere Beiträge") können auch vergangene Nachrichten eingesehen werden.

### 6. Der Thronsaal (Admin)

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

### 7. Rechtliches (Footer)

- **Impressum**: Rechtskonformes Impressum nach **§ 5 DDG** (ehemals TMG), eingebettet in einem Pergament-Modal.
- **Datenschutz**: DSGVO-konforme Datenschutzerklärung (inkl. **TDDDG** für Cookies), angepasst an Vercel/Supabase Hosting, ebenfalls als Modal integriert.

### 8. Mitgliederverwaltung

- **Authentifizierung**: Login via Email oder Benutzername.
- **Profilverwaltung**: Mitglieder können ihren Anzeigenamen ("Rufname") direkt im Profil ändern.
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

## 🌐 Domain Konfiguration (Live)

Die Domain `rdw-ev.de` ist bei Netcup registriert und via DNS mit Vercel verbunden.

### DNS Einträge (Netcup CCP)

Folgende DNS-Records sind aktiv, um die Verbindung herzustellen:

| Type      | Host  | Destination / Ziel     | Zweck                         |
| :-------- | :---- | :--------------------- | :---------------------------- |
| **A**     | `@`   | `216.198.79.1`         | Hauptadresse (rdw-ev.de)      |
| **CNAME** | `www` | `cname.vercel-dns.com` | Weiterleitung (www.rdw-ev.de) |

⚠️ **Wichtig:** Alle anderen A/AAAA Einträge für `@` und `www` löschen!

### 3. Supabase (Auth Redirects) - WICHTIG!

Wenn dies vergessen wird, funktioniert der Login nach dem Umzug nicht mehr!

- **Dashboard** > **Authentication** > **URL Configuration** öffnen.
- **Site URL**: Auf die neue Domain ändern (`https://www.rdw-ev.de`).
- **Redirect URLs**: Die neue Domain hinzufügen: `https://rdw-ev.de/**` und `https://www.rdw-ev.de/**`.

## © Copyright

**Ritter der Würfelrunde © 2026**
_Gedanke des Tages: Der Würfel ist gefallen._
