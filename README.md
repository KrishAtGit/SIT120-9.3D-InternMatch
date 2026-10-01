# InternMatch: SIT120 Task 9.3D

**Building Your Planned Website as a Modular Vue Application**

InternMatch helps international students in Australia find internships they are actually eligible for. It ranks listings by how well they match the student's skills and shows the skills standing between them and a shortlist.

This project rebuilds the InternMatch website planned in **Task 1.1P** (wireframes and visual style guide) and the form designed in **Task 6.3D** as a responsive, component-based **Vue 3** application built with **Vite**.

> Student project for SIT120 Introduction to Responsive Web Apps, Deakin University. The internship listings are fictional examples.

---

## Running the project

### Requirements
- [Node.js](https://nodejs.org/) **18 or newer** (`node -v` to check)
- npm, which comes with Node.js

### Install and start
`node_modules` is not included in this repository. `npm install` recreates it from `package.json` and `package-lock.json`.

```bash
npm install      # install Vue, Vite and the Vue plugin
npm run dev      # start the dev server
```

Then open **http://localhost:5173** in a browser.

### Production build
```bash
npm run build    # creates the dist/ folder (HTML, CSS, JS and images)
npm run preview  # optional: serve the built dist/ folder locally to check it
```

---

## What was built

### Components (`src/components/`)
| Component | Role |
|---|---|
| `AppHeader.vue` | Logo and main navigation. Collapses into a hamburger menu on small screens (`menuOpen` state, `aria-expanded`). Highlights the current page. |
| `AppFooter.vue` | Contact details, secondary navigation and copyright. |
| `HomeView.vue` | **Page 1, landing page:** hero banner with *Get Started*, the three-step "how it works" row, about section with stats, a skills-in-demand table and features. |
| `DashboardView.vue` | **Page 2, matched internship dashboard:** skill summary, a live filter bar (role type, location, minimum match), a comparison table and internship cards. |
| `DetailView.vue` | **Page 3, internship detail and skill gap:** match-score ring, matched and missing skills, full job description, *Apply* and *Save for later*. |
| `ContactForm.vue` | The **Task 6.3D Profile & Skills Setup form** as a child component (see below). |
| `App.vue` | Puts the header, footer, active view and form together, manages which view is shown, and renders the **Customer Acknowledgement Card**. |

### Data (`src/data/`)
- `internships.js`: the five matched internships. The dashboard cards, the comparison table and every detail page are rendered from this data with `v-for`, so each listing has its own detail page without repeated HTML.
- `profileOptions.js`: the option lists for the form (roles, visas, availability, skills, locations) and a `labelFor()` helper.

### Styles (`src/assets/styles.css`)
The Task 6.3D stylesheet, reused and extended. It is imported once in `main.js` and shared by every component.
- Mobile-first, with two breakpoints: **48rem (768px)** for tablet and **64rem (1024px)** for desktop.
- Flexbox and CSS Grid layouts that stack to one column on phones and expand on larger screens.
- `clamp()` for fluid type and spacing, and relative units (`rem`, `%`) throughout.
- No horizontal scrolling at phone width: wide tables either scroll inside their own wrapper or restack into labelled blocks.

---

## The form: `ContactForm.vue`

| Requirement | How it is done |
|---|---|
| **Props** (`defineProps`) | `App.vue` passes `formTitle`, `formIntro`, `submitLabel`, `roleOptions`, `minHours` and `maxHours` down to the form. |
| **Two-way binding** (`v-model`) | **Text:** full name. **Number:** hours per week with `v-model.number`. **Radio:** availability. **Dropdown with `v-for`:** visa and preferred role type. **Checkbox:** skills and consent. Email, password, phone, date, textarea and a multi-select are bound too. |
| **Validation** | `getErrors()` checks every field (including regular expressions for name, `.edu.au` email and Australian mobile) and returns messages without touching the page. The messages appear under each field with `v-if`. After the first submit, errors clear live as fields are fixed. |
| **Submission** (`@submit.prevent`) | Stops the browser's normal page reload. |
| **Emits** (`defineEmits`) | A valid submit emits `submit-form` with a **shallow copy**: `emit('submit-form', { ...form.value })`. |
| **2-second reset** | A success message and countdown bar appear, the fields are locked, and after 2 seconds the form resets to its initial state. |
| **Responsive inputs** | Full-width fields on phones, two-column groups on wider screens. |

### Why the shallow copy matters
`form.value` is about to be reset. If that same object were emitted, `App.vue` would be holding the object the form clears 2 seconds later. Emitting `{ ...form.value }` gives the parent its own copy. The reset then replaces `form.value` with a brand-new object, so the **acknowledgement card in `App.vue` stays on screen** after the form clears.

---

## View management

The app is a single page, so each view has a hash address:

| Address | View |
|---|---|
| `#/` | Home |
| `#/matches` | Dashboard |
| `#/internship/<id>` | Internship detail |
| `#/sign-up` | Profile form |
| `#/how-it-works`, `#/about`, … | Home, scrolled to that section |

`App.vue` listens for `hashchange` and sets `currentView`. The part after `#` is never sent to the server, so refreshing or bookmarking any view always loads `index.html`. This matters on the Deakin student web server, which cannot redirect unknown paths. The browser's back button also moves between views.

---

## Deployment (Deakin student web server)

`vite.config.js` sets `base: './'`, so the built files use **relative** paths and work from a subfolder:

1. `npm run build`
2. Copy the **contents** of `dist/` (`index.html`, `favicon.svg`, `assets/`) into `public_html/task9-3d/` on the Deakin H: drive.
3. Open `http://personal-sites.deakin.edu.au/~<username>/task9-3d/`.

---

## Project structure

```
my-vue-website/
├── index.html              # page shell, fonts, favicon
├── vite.config.js          # Vue plugin + base: './'
├── package.json            # scripts and dependencies
├── package-lock.json       # exact dependency versions for npm install
├── public/
│   └── favicon.svg
└── src/
    ├── main.js             # creates the app and imports the stylesheet
    ├── App.vue
    ├── assets/
    │   ├── styles.css
    │   └── banner.png
    ├── components/
    │   ├── AppHeader.vue
    │   ├── AppFooter.vue
    │   ├── HomeView.vue
    │   ├── DashboardView.vue
    │   ├── DetailView.vue
    │   └── ContactForm.vue
    └── data/
        ├── internships.js
        └── profileOptions.js
```

`node_modules/` and `dist/` are excluded by `.gitignore`. Both are recreated by `npm install` and `npm run build`.

## Tech
Vue 3 (`<script setup>` Single File Components) · Vite · plain CSS (Flexbox, Grid, media queries) · Google Fonts (Space Grotesk, Exo)
