<template>
  <!-- PAGE 1 : landing page.
       Header -> web banner with Get Started -> three steps -> content -> footer -->
  <div class="home-view">

    <!-- SECTION 1: hero / web banner -->
    <section class="hero" id="hero">
      <div class="wrap hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">For international students in Australia</p>
          <h1>Stop scrolling job boards you were never eligible for.</h1>
          <p class="lead">
            InternMatch reads your resume, compares it against internships pulled from Seek every
            morning, and ranks them by how close you already are to being shortlisted. Visa
            conditions and required experience are checked before a listing ever reaches you.
          </p>
          <div class="hero-actions">
            <a href="#/sign-up" class="btn btn-primary">Get Started</a>
            <a href="#/how-it-works" class="btn btn-ghost">See how it works</a>
          </div>
        </div>

        <!-- decorative preview built from the two best matches in the data file -->
        <div class="hero-panel" aria-hidden="true">
          <div
            v-for="(internship, index) in previewCards"
            :key="internship.id"
            class="mock-card"
            :class="{ 
              'mock-card-back': index === 1 
              }"
          >
            <div class="mock-top">
              <span class="mock-role">{{ internship.role }}</span>
              <span class="badge" :class="`badge-${matchLevel(internship.match)}`">{{ internship.match }}% match</span>
            </div>
            <p class="mock-meta">{{ internship.company }} · {{ internship.location }} · Posted {{ internship.posted }}</p>
            <p class="mock-label">You already have</p>
            <p class="chips">
              <span v-for="skill in internship.matchedSkills" :key="skill" class="chip chip-have">{{ skill }}</span>
            </p>
            <template v-if="index === 0">
              <p class="mock-label">Missing</p>
              <p class="chips">
                <span v-for="skill in internship.missingSkills" :key="skill" class="chip chip-miss">{{ skill }}</span>
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: how it works (the STEP 1 / 2 / 3 row from the wireframe) -->
    <section class="section how" id="how-it-works">
      <div class="wrap">
        <header class="section-head">
          <p class="eyebrow">The process</p>
          <h2>Three steps, about four minutes</h2>
          <p class="section-lead">
            Aarav uploaded his resume on a Sunday night and had a shortlist before his first lecture
            on Monday. The whole flow is built to be finished in one sitting.
          </p>
        </header>

        <ol class="steps">
          <li v-for="step in steps" :key="step.title" class="step">
            <div class="step-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" aria-hidden="true" v-html="step.icon"></svg>
            </div>
            <h3><span class="step-num">Step {{ step.number }}</span> {{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- SECTION 3: about -->
    <section class="section about" id="about">
      <div class="wrap about-inner">
        <div class="about-copy">
          <p class="eyebrow">Why we built it</p>
          <h2>Built by an international student who wasted a semester applying blind</h2>
          <p>
            InternMatch started in 2024 after its founder sent 74 applications in one trimester and
            heard back from three employers. Almost every rejection came down to the same two
            things: a required skill that was never mentioned in the ad's title, and work rights the
            listing quietly assumed you already had.
          </p>
          <p>
            So we built the tool backwards. Instead of showing you everything and letting you sort
            through it, InternMatch filters out what you cannot get, then explains what you would
            need to close the gap on the roles you actually want. Around 6,200 students across
            Australian universities now use it.
          </p>
        </div>
        <ul class="stats">
          <li v-for="stat in stats" :key="stat.label">
            <strong>{{ stat.value }}</strong><span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- SECTION 4: skills in demand. the wrapper scrolls sideways on a phone
         instead of the whole page -->
    <section class="section demand" id="demand">
      <div class="wrap">
        <header class="section-head">
          <p class="eyebrow">September 2026 snapshot</p>
          <h2>Skills in demand this month</h2>
          <p class="section-lead">
            Counted across the 1,840 internships currently live on InternMatch. If you are deciding
            what to learn over the break, the last column is the one worth reading.
          </p>
        </header>

        <div class="table-scroll">
          <table class="data-table">
            <caption>Skill demand across live listings. Scroll sideways to see every column.</caption>
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Listings asking for it</th>
                <th scope="col">Share of listings</th>
                <th scope="col">Typical role</th>
                <th scope="col">Students who have it</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in skillDemand" :key="row.skill">
                <th scope="row">{{ row.skill }}</th>
                <td>{{ row.listings }}</td>
                <td>{{ row.share }}</td>
                <td>{{ row.role }}</td>
                <td>{{ row.students }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="table-note">
          The widest gaps, Power BI, Docker and AWS, are all short courses. That is why they sit at
          the top of the suggestions on your dashboard.
        </p>
      </div>
    </section>

    <!-- SECTION 5: features + call to action -->
    <section class="section features" id="features">
      <div class="wrap">
        <header class="section-head">
          <p class="eyebrow">Included free</p>
          <h2>What you get</h2>
        </header>
        <div class="feature-grid">
          <article v-for="feature in features" :key="feature.title" class="feature">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </article>
        </div>

        <div class="cta-band">
          <h2>Your resume already qualifies you for more than you think.</h2>
          <p>Create your profile once and find out which internships those are.</p>
          <a href="#/sign-up" class="btn btn-accent">Create my profile</a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { internships, matchLevel } from '../data/internships.js'

const previewCards = internships.slice(0, 2)

// the three wireframe steps
const steps = [
  {
    number: 1,
    title: 'Upload',
    text: 'Drop in your resume as a PDF. Our skill extraction reads it and pulls out every tool, language and framework you have listed. You never tag anything by hand.',
    icon: '<rect x="10" y="6" width="28" height="36" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="18" r="4.5" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16 29h16M16 34h11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
  },
  {
    number: 2,
    title: 'Match',
    text: 'Every listing scraped from Seek is scored against your profile. You get a match percentage and a plain-English list of the skills standing between you and an interview.',
    icon: '<circle cx="18" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 17.5a10 10 0 0 0 0 13" stroke="currentColor" stroke-width="2.5" fill="none"/>',
  },
  {
    number: 3,
    title: 'Apply',
    text: "Save listings to review on the train, or jump straight to the employer's application form. Your analysis is stored, so returning next week takes one tap.",
    icon: '<path d="M10 25l9 9 19-20" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
]

const stats = [
  { value: '6,200+', label: 'students matched' },
  { value: '1,840', label: 'live internships' },
  { value: 'Daily', label: 'listing refresh from Seek' },
]

const skillDemand = [
  { skill: 'SQL', listings: '1,102', share: '60%', role: 'Data & analytics', students: '68%' },
  { skill: 'Python', listings: '968', share: '53%', role: 'Data & ML', students: '71%' },
  { skill: 'Power BI', listings: '604', share: '33%', role: 'Business intelligence', students: '19%' },
  { skill: 'React', listings: '541', share: '29%', role: 'Frontend engineering', students: '44%' },
  { skill: 'Docker', listings: '487', share: '26%', role: 'Platform & DevOps', students: '15%' },
  { skill: 'AWS', listings: '452', share: '25%', role: 'Cloud & backend', students: '12%' },
]

const features = [
  {
    title: 'Eligibility filtering first',
    text: 'Roles requiring permanent residency, a security clearance, or three years of industry experience are removed before you ever scroll past them.',
  },
  {
    title: 'A real skill gap summary',
    text: 'For each internship you see the skills you have and the ones you are missing, so "not enough experience" turns into a list you can actually work through.',
  },
  {
    title: 'Match score before you click',
    text: 'A percentage on every card means you can prioritise the six listings worth your evening instead of opening forty tabs.',
  },
  {
    title: 'Accessible anywhere, anytime',
    text: "Save a listing between classes and it's waiting for you that night. Your matches and scores stay identical on every screen you open them on.",
  },
]
</script>
