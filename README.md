# ChegaraMap

Measure land boundaries on a map before buying, selling, or comparing property.

ChegaraMap is a web application that lets users draw a land polygon directly on an interactive map, calculate the approximate area, perimeter, and side lengths, and compare the results with the seller's claimed dimensions.

It is designed for people who need a fast visual estimate before making a real-world land decision.

## Why This Project Exists

Buying land is risky when the boundary size is unclear. ChegaraMap helps users:

- draw a property boundary on a map
- calculate approximate size in square meters and sotix
- compare the result with a seller's claimed measurements
- save and share measurements
- make a faster, better-informed decision

## Features

- Interactive map drawing
- Geodesic area and perimeter calculations
- Side-length measurement for each segment
- Comparison between user-drawn measurement and seller claim
- Save and reload measurements in the browser
- Share measurements using Web Share API or clipboard
- English and Uzbek language support
- Standard and satellite map views
- Mobile-first responsive design

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 |
| Build Tool | Vite |
| Styling | SCSS |
| Map | Leaflet + React-Leaflet |
| Geometry | Turf.js |
| State Management | React Context |
| Persistence | Browser localStorage |

## Project Structure

```text
src/
├── main.jsx
├── App.jsx
├── App.scss
├── context/
│   └── AppContext.jsx
├── i18n/
│   └── translations.js
├── utils/
│   ├── geometry.js
│   └── storage.js
├── data/
│   └── locations.js
├── styles/
│   └── global.scss
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── HowItWorks/
│   ├── Features/
│   ├── TrustCard/
│   ├── CtaBand/
│   ├── Footer/
│   ├── Home/
│   ├── Settings/
│   ├── Toast/
│   ├── ConfirmModal/
│   └── Measure/
│       ├── Measure.jsx
│       ├── MapCanvas.jsx
│       ├── SearchBar.jsx
│       ├── MapControls.jsx
│       └── ResultPanel.jsx
```

## How the Calculation Works

1. Each clicked point is stored as a latitude/longitude coordinate.
2. When the user finishes the polygon, the points are closed and processed.
3. Turf.js calculates the area using geodesic geometry.
4. Perimeter and each side length are calculated using distance formulas.
5. The tool estimates the land size in square meters and converts it to sotix.

## Installation

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

## Security and Usage Note

⚠️ This app is a map-based estimation tool and is not an official cadastral measurement system.

It should be used for preliminary analysis only. Real estate boundaries, land ownership, and legal transactions must be verified through official land records and certified professionals.

### Safety Notes

- The app stores user measurement data in browser `localStorage`
- There is no backend authentication yet
- There is no payment or sensitive personal data flow in the current version
- The app does not replace legal land documentation

### Monetization Safety

Advertising integration is safe for this product because there is no financial transaction or sensitive user data processing in the current front-end flow. However, if the product eventually includes user accounts, storage, or real property records, a secure backend and privacy policy will be necessary.

## Registration Flow

The app includes a lightweight registration flow for users who click the main action button. If a user is not yet registered, they are asked for a name and email without a password.

This is intentionally simple and is currently browser-local only. It is designed as a demo flow and can later be replaced with a real backend authentication system.

## Roadmap

- [ ] Replace demo locations with real geocoding service
- [ ] Add backend-based user registration and admin panel
- [ ] Add cross-device sync for saved measurements
- [ ] Add official cadastral integration
- [ ] Add PDF report export
- [ ] Add mobile app version

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Temur Alisherov

GitHub: [@TemurbekCode](https://github.com/TemurbekCode)
