# Future Analytics (Version 2 Roadmap)

This document outlines the proposed telemetry, data model enhancements, and visualization widgets planned for the **Version 2 Analytics Release** of Shortly. These features are strictly out of scope for the Phase 1 MVP.

---

## 1. Planned Data Model Enhancements
To support granular analytics, the database schema will transition from simple aggregated click numbers to a dedicated `Click` log collection:
*   **Time-series collection**: Logging individual redirect event documents.
*   **Attributes to capture**:
    *   `linkId`: Reference to the parent Link document.
    *   `timestamp`: Exact date and time of redirect.
    *   `referrer`: HTTP Referer header value.
    *   `userAgent`: User-agent string to be parsed into browser, OS, OS version, and device type.
    *   `ipAddress`: Used for hashing and unique visitor identification.
    *   `location`: IP-based country, region, and city resolution.

---

## 2. Planned Analytics UI Features

### A. Dynamic Time-Series Charts
*   **Daily Click History**: Interactive bar or area charts showing daily redirect volume over select periods (24 hours, 7 days, 30 days).
*   **Peak Traffic Hours**: Visual heatmap displaying click density across hours of the day and days of the week to pinpoint user engagement.

### B. Segment Breakdowns
*   **Referrer Tracking**: Table listing the top source domains sending traffic (e.g., Twitter/X, LinkedIn, Direct/Email).
*   **Device & OS Analytics**: Doughnut charts segmenting clicks into Desktop, Mobile, and Tablet categories, alongside browser details (Chrome, Safari, Firefox).
*   **Geographic Breakdowns**: Map-based breakdown highlighting user location density by country and city.

### C. Advanced Event Timelines
*   **Redirection Timeline Logs**: Live scrolling event log showing click events in real-time.
*   **First Click vs. Last Click**: Detailed operational timing diagnostics mapping the velocity of redirection campaigns from creation.
*   **QR Scan Statistics**: Separation of traffic generated via shared digital links vs scanned physical QR codes.
