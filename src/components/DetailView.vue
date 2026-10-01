<template>
  <!-- PAGE 3 : internship detail and skill gap page.
       Back to Dashboard -> company/role header -> match score ring + matched skills -> skill gap -> job description -> Apply Now | Save For Later -> footer -->
  <div class="detail-view">

    <!-- SECTION 1: back link + role header -->
    <section class="page-head">
      <div class="wrap">
        <a href="#/matches" class="back-link">&larr; Back to Dashboard</a>
        <p class="eyebrow">Internship detail</p>
        <h1>{{ internship.role }}</h1>
        <p class="lead">
          {{ internship.company }} &middot; {{ internship.location }} &middot; {{ internship.length }}, paid
          &middot; {{ internship.pay }} &middot; Posted {{ internship.posted }} &middot; Closes {{ internship.closes }}
        </p>
      </div>
    </section>

    <!-- SECTION 2: match score ring + matched / missing skills -->
    <section class="section match-section">
      <div class="wrap">
        <div class="match-grid">
          <div class="match-score-panel">
            <!-- css-only ring -->
            <div
              class="score-ring"
              :style="{ 
                '--pct': internship.match 
                }"
              role="img"
              :aria-label="`${internship.match} percent match score`"
            >
              <span class="score-num">{{ internship.match }}%</span>
            </div>
            <p class="mock-label">Match score</p>
          </div>

          <div class="skills-panel">
            <p class="mock-label">Matched skills</p>
            <p class="chips">
              <span v-for="skill in internship.matchedSkills" :key="skill" class="chip chip-have">{{ skill }}</span>
            </p>

            <p class="mock-label">Skill gap &mdash; missing for this role</p>
            <p class="chips">
              <span v-for="skill in internship.missingSkills" :key="skill" class="chip chip-miss">{{ skill }}</span>
            </p>
            <p class="summary-hint">{{ internship.gapHint }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: full job description as a self-contained article -->
    <section class="section description-section">
      <div class="wrap">
        <article class="job-description">
          <header class="section-head">
            <p class="eyebrow">Full job description</p>
            <h2>About the role</h2>
          </header>

          <p>{{ internship.description }}</p>

          <!-- responsibilities and requirements sit side by side on desktop -->
          <div class="description-columns">
            <div>
              <h3>Responsibilities</h3>
              <ul class="plain-list">
                <li v-for="item in internship.responsibilities" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div>
              <h3>Requirements</h3>
              <ul class="plain-list">
                <li v-for="item in internship.requirements" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <h3>Eligibility</h3>
          <p>{{ internship.eligibility }}</p>
        </article>
      </div>
    </section>

    <!-- SECTION 4: "Apply Now Save For Later"  -->
    <section class="section actions-section">
      <div class="wrap actions-row">
        <a href="https://www.seek.com.au" class="btn btn-primary" target="_blank" rel="noopener">Apply on Seek</a>
        <button
          type="button"
          class="btn btn-ghost"
          :class="{ 'is-saved': isSaved }"
          :aria-pressed="isSaved"
          @click="isSaved = !isSaved"
        >
          {{ isSaved ? 'Saved for later' : 'Save for later' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // the listing chosen on the dashboard, looked up by App.vue from the URL
  internship: { type: Object, required: true },
})

const isSaved = ref(false)

// moving to a different listing starts it unsaved again
watch(() => props.internship.id, () => {
  isSaved.value = false
})
</script>
