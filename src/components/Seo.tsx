import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const Seo = ({ 
  title = "Ritter der Würfelrunde e.V. - Tabletop Club Wiesbaden", 
  description = "Dein Tabletop Verein in Wiesbaden und Umgebung. Wir spielen Warhammer 40k, Kill Team, Age of Sigmar und mehr. Melde dich an für die nächste Schlacht!",
  image = "/og-image.jpg", // We need to ensure this image exists or use a placeholder
  url = "https://www.rdw-ev.de"
}: SeoProps) => {

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "Ritter der Würfelrunde e.V.",
    "alternateName": "RdW",
    "description": description,
    "url": url,
    "logo": `${url}/logo.png`,
    "foundingDate": "2024", // Approximate based on context
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mainzer Allee 35a",
      "addressLocality": "Taunusstein",
      "postalCode": "65232",
      "addressCountry": "DE"
    },
    // Location for "Where?" questions (Actual meeting point)
    "location": {
        "@type": "Place",
        "name": "Phantasos Studio (Clubheim)",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Schoßbergstraße 11",
            "addressLocality": "Wiesbaden",
            "postalCode": "65201",
            "addressCountry": "DE"
        },
        "url": "https://www.phantasos-studio.de"
    },
    // Regular event: Thursday gaming
    "event": {
        "@type": "Event",
        "name": "Clubtreffen",
        "startDate": "2024-01-01T18:00", 
        "eventSchedule": {
            "@type": "Schedule",
            "byDay": "https://schema.org/Thursday",
            "startTime": "18:00",
            "endTime": "23:00",
            "repeatFrequency": "P1W" // Weekly
        },
        "location": {
            "@type": "Place",
            "name": "Phantasos Studio",
            "address": "Schoßbergstraße 11, 65201 Wiesbaden"
        }
    },
    "knowsAbout": ["Warhammer 40000", "Kill Team", "Tabletop Wargaming", "Age of Sigmar"],
    "sameAs": [
        "https://www.instagram.com/rdw_ev"
    ]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Tabletop, Wiesbaden, Verein, Warhammer 40k, Kill Team, Community, Gaming, Ritter der Würfelrunde" />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook / Discord */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema for GEO/AI */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
