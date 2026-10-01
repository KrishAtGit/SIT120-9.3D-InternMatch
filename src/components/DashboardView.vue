<template>
  <!-- PAGE 2 : matched internship dashboard
       Header -> filter bar [role type] [location] [min match %] -> internship cards -> footer -->
  <div class="dashboard-view">

    <!-- SECTION 1: page intro + skill gap summary -->
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">Signed in as {{ profileName }}</p>
        <h1>Your matched internships</h1>
        <p class="lead">
          We scored 1,840 live listings against the skills on your profile. These
          {{ internships.length }} are the closest fits, and every one of them accepts student
          visa holders.
        </p>

        <div class="summary">
          <div class="summary-block">
            <p class="mock-label">Skills we found on your profile</p>
            <p class="chips">
              <span v-for="skill in profileSkills" :key="skill" class="chip chip-have">{{ skill }}</span>
            </p>
          </div>
          <div class="summary-block">
            <p class="mock-label">Most requested skills you are missing</p>
            <p class="chips">
              <span v-for="skill in topMissingSkills" :key="skill" class="chip chip-miss">{{ skill }}</span>
            </p>
            <p class="summary-hint">
              Adding {{ topMissingSkills[0] }} alone would raise your average match score by roughly 9%.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: filter bar + results -->
    <section class="section results">
      <div class="wrap">

        <!-- the filters are live: v-model updates the reactive filter state and the
             filteredInternships computed list re-renders straight away, so the
             6.3D "Apply filters" button is no longer needed -->
        <form class="filters" aria-label="Filter internships" @submit.prevent>
          <div class="field">
            <label for="filter-role">Role type</label>
            <select id="filter-role" v-model="roleFilter">
              <option v-for="option in roleFilterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="field">
            <label for="filter-location">Location</label>
            <select id="filter-location" v-model="locationFilter">
              <option value="all">All locations</option>
              <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
            </select>
          </div>
          <div class="field">
            <label for="filter-match">Minimum match</label>
            <select id="filter-match" v-model.number="minMatch">
              <option :value="0">Any</option>
              <option :value="50">50% and above</option>
              <option :value="70">70% and above</option>
              <option :value="80">80% and above</option>
            </select>
          </div>
        </form>

        <p class="result-count" aria-live="polite">
          Showing {{ filteredInternships.length }} of {{ internships.length }} internships, ranked by match score.
        </p>

        <div v-if="filteredInternships.length === 0" class="empty-state">
          <p>No matches for those filters yet. Try a lower minimum match or a different location.</p>
          <button type="button" class="btn btn-ghost btn-small" @click="clearFilters">Clear filters</button>
        </div>

        <template v-else>
          <!-- comparison table: on phones each row restacks into a labelled block
               (the .table-stack technique from 5.2C) -->
          <h2 class="table-heading" id="compare-heading">Compare your matches</h2>
          <table class="data-table table-stack" aria-labelledby="compare-heading">
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Employer</th>
                <th scope="col">Location</th>
                <th scope="col">Length</th>
                <th scope="col">Pay</th>
                <th scope="col">Closes</th>
                <th scope="col">Match</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="internship in filteredInternships" :key="internship.id">
                <th scope="row" data-label="Role">{{ internship.role }}</th>
                <td data-label="Employer">{{ internship.company }}</td>
                <td data-label="Location">{{ internship.location }}</td>
                <td data-label="Length">{{ internship.length }}</td>
                <td data-label="Pay">{{ internship.pay }}</td>
                <td data-label="Closes">{{ internship.closes }}</td>
                <td data-label="Match">
                  <span class="badge" :class="`badge-${matchLevel(internship.match)}`">{{ internship.match }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="table-note">Pay is the rate the employer published on Seek. Closing dates are Melbourne time.</p>

          <!-- SECTION 3: internship cards, one per listing -->
          <h2 class="table-heading">The full listings</h2>
          <ul class="card-list">
            <li v-for="internship in filteredInternships" :key="internship.id" class="card">
              <article class="card-article">
                <div class="card-head">
                  <h3>{{ internship.role }}</h3>
                  <span class="badge" :class="`badge-${matchLevel(internship.match)}`">{{ internship.match }}% match</span>
                </div>
                <p class="card-meta">
                  {{ internship.company }} · {{ internship.location }} · {{ internship.length }}, paid · Posted {{ internship.posted }}
                </p>
                <p class="card-body">{{ internship.summary }}</p>
                <p class="mock-label">Matched skills</p>
                <p class="chips">
                  <span v-for="skill in internship.matchedSkills" :key="skill" class="chip chip-have">{{ skill }}</span>
                </p>
                <p class="mock-label">Missing skills</p>
                <p class="chips">
                  <span v-for="skill in internship.missingSkills" :key="skill" class="chip chip-miss">{{ skill }}</span>
                </p>
              </article>
              <a :href="`#/internship/${internship.id}`" class="btn btn-ghost btn-small">
                View details<span class="visually-hidden"> for {{ internship.role }} at {{ internship.company }}</span>
              </a>
            </li>
          </ul>
        </template>

        <div class="cta-band">
          <h2>One skill is blocking two of your matches</h2>
          <p>Power BI is blocking 2 of your top 5 matches. We will email you when a listing drops that skill requirement.</p>
          <a href="#/" class="btn btn-accent">Back to home</a>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { matchLevel } from '../data/internships.js'

const props = defineProps({
  internships: { type: Array, required: true },
  // comes from the submitted profile in App.vue or the demo persona before sign-up
  profileName: { type: String, default: 'Aarav Verma' },
  profileSkills: {
    type: Array,
    default: () => ['Python', 'SQL', 'JavaScript', 'React', 'Git', 'Pandas'],
  },
})

// the three role types we have in the sample data, plus "all" for the default
const roleFilterOptions = [
  { value: 'all', label: 'All roles' },
  { value: 'software', label: 'Software & web' },
  { value: 'data', label: 'Data & analytics' },
]

// reactive filter state bound to the three dropdowns with v-model
const roleFilter = ref('all')
const locationFilter = ref('all')
const minMatch = ref(0)

// unique locations from the listings, so the dropdown never offers an empty option
const locations = computed(() => [...new Set(props.internships.map((internship) => internship.location))])

// this computed list is the one actually rendered in the table and cards
// it reacts to the three filter states and re-sorts by match score
const filteredInternships = computed(() =>
  props.internships
    .filter((internship) => roleFilter.value === 'all' || internship.category === roleFilter.value)
    .filter((internship) => locationFilter.value === 'all' || internship.location === locationFilter.value)
    .filter((internship) => internship.match >= minMatch.value)
    .sort((a, b) => b.match - a.match),
)

// counts how many listings ask for each missing skill and keeps the top three
const topMissingSkills = computed(() => {
  const counts = {}
  props.internships.forEach((internship) => {
    internship.missingSkills.forEach((skill) => {
      counts[skill] = (counts[skill] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill)
})

function clearFilters() {
  roleFilter.value = 'all'
  locationFilter.value = 'all'
  minMatch.value = 0
}
</script>
