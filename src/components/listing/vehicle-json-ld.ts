import type { Listing, ListingImage } from "@/data/listings";
import { formatKm } from "@/lib/format";
import { canonicalUrl } from "@/lib/seo";

export function vehicleJsonLd(
  listing: Listing,
  listingImages: ListingImage[],
  path: string,
) {
  const url = canonicalUrl(path);
  const name = `${listing.brand} ${listing.model} ${listing.year}`;
  const description =
    listing.description ??
    `${listing.brand} ${listing.model}, Jahrgang ${listing.year}, ${formatKm(
      listing.mileage,
    )}, ${listing.rangeKm} km WLTP-Reichweite, Standort ${listing.location}.`;
  const images = Array.from(
    new Set([listing.image, ...listingImages.map((image) => image.url)].filter(Boolean)),
  );
  const vehicleId = `${url}#vehicle`;
  const offerId = `${url}#offer`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "de-CH",
        mainEntity: { "@id": vehicleId },
      },
      {
        "@type": "Car",
        "@id": vehicleId,
        url,
        name,
        sku: listing.id,
        brand: {
          "@type": "Brand",
          name: listing.brand,
        },
        manufacturer: {
          "@type": "Organization",
          name: listing.brand,
        },
        model: listing.model,
        vehicleModelDate: String(listing.year),
        productionDate: String(listing.year),
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: listing.mileage,
          unitCode: "KMT",
        },
        vehicleConfiguration: "Elektroauto",
        fuelType: "Electric",
        itemCondition: "https://schema.org/UsedCondition",
        image: images,
        description,
        offers: { "@id": offerId },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Batteriekapazität",
            value: listing.batteryKwh,
            unitText: "kWh",
          },
          {
            "@type": "PropertyValue",
            name: "WLTP-Reichweite",
            value: listing.rangeKm,
            unitText: "km",
          },
          {
            "@type": "PropertyValue",
            name: "DC-Ladeleistung",
            value: listing.chargingKw,
            unitText: "kW",
          },
          {
            "@type": "PropertyValue",
            name: "Schnellladefähig",
            value: listing.fastCharging ? "Ja" : "Nein",
          },
          ...(listing.batteryHealth
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Batteriezustand",
                  value: listing.batteryHealth,
                  unitText: "% SoH",
                },
              ]
            : []),
          ...(listing.warrantyMonths
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Garantie",
                  value: listing.warrantyMonths,
                  unitText: "Monate",
                },
              ]
            : []),
        ],
      },
      {
        "@type": "Offer",
        "@id": offerId,
        url,
        price: listing.price,
        priceCurrency: "CHF",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/UsedCondition",
        areaServed: {
          "@type": "Country",
          name: "CH",
        },
        availableAtOrFrom: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: listing.location,
            addressCountry: listing.country,
          },
        },
        seller: {
          "@type": listing.sellerType === "Dealer" ? "AutoDealer" : "Person",
          name: listing.sellerName,
        },
        itemOffered: { "@id": vehicleId },
      },
    ],
  };
}
