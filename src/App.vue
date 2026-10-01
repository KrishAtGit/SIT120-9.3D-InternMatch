<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Skip to content</a>

  <AppHeader :current-view="currentView" :top-match-id="internships[0].id" />

  <main id="main" ref="mainElement" tabindex="-1">
    <!-- VIEW MANAGEMENT: only the active view is rendered. currentView changes
         when a link updates the #/ address -->
    <HomeView v-if="currentView === 'home'" />

    <DashboardView
      v-else-if="currentView === 'dashboard'"
      :internships="internships"
      :profile-name="submittedProfile?.fullName"
      :profile-skills="submittedProfile?.skills.length ? submittedProfile.skills : undefined"
    />

    <DetailView v-else-if="currentView === 'detail'" :internship="selectedInternship" />

    <!-- sign-up view: the 6.3D form page -->
    <template v-else-if="currentView === 'signup'">
      <section class="page-head">
        <div class="wrap">
          <a href="#/" class="back-link">&larr; Back to Homepage</a>
          <p class="eyebrow">Profile &amp; skills setup</p>
          <h1>Create your InternMatch profile</h1>
          <p class="lead">
            Tell us what you can already do and what you are allowed to do. We use it to hide
            internships you are not eligible for and rank the rest by how close you are to being
            shortlisted.
          </p>
        </div>
      </section>

      <section class="section form-section">
        <div class="wrap signup-layout">
          <!-- props go down (title, intro, button text, role list, hours range);
               the submit-form event comes back up with a copy of the form data -->
          <ContactForm
            form-title="Your details"
            form-intro="It takes about three minutes. You can change anything later from your dashboard."
            submit-label="Create Profile"
            :role-options="roleOptions"
            :min-hours="8"
            :max-hours="40"
            @submit-form="handleSubmitForm"
          />

          <!-- CUSTOMER ACKNOWLEDGEMENT CARD
               It lives in App.vue, not in the form so it stays on screen when the form clears itself 2 seconds later -->
          <aside class="ack-area" aria-label="Profile confirmation">
            <article
              v-if="submittedProfile"
              ref="ackCard"
              class="ack-card"
              tabindex="-1"
              aria-live="polite"
            >
              <p class="eyebrow">Profile received</p>
              <h3>Thank you, {{ submittedProfile.fullName }}!</h3>
              <p>
                <strong>Your InternMatch profile is ready.</strong> We will match you against
                every live listing overnight and email {{ submittedProfile.email }} when your
                shortlist is waiting.
              </p>
              <ul class="ack-list">
                <li v-for="item in acknowledgementItems" :key="item.label">
                  <strong>{{ item.label }}:</strong> {{ item.value }}
                </li>
              </ul>
              <p class="ack-time">Submitted at {{ submittedAt }}</p>
              <a href="#/matches" class="btn btn-primary">See my matched internships</a>
            </article>

            <div v-else class="ack-placeholder">
              <h3>What happens next</h3>
              <p>
                When you submit, a summary of your profile appears here. We then rank every live
                internship by how closely it matches your skills and visa conditions.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </template>
  </main>

  <AppFooter />
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HomeView from './components/HomeView.vue'
import DashboardView from './components/DashboardView.vue'
import DetailView from './components/DetailView.vue'
import ContactForm from './components/ContactForm.vue'

import { internships, findInternship } from './data/internships.js'
import { roleOptions, visaOptions, availabilityOptions, locationOptions, labelFor } from './data/profileOptions.js'

/* VIEW MANAGEMENT:
   this site is one page, so the address uses a hash (#/matches, #/internship/<id>,
   #/sign-up)
   -> a hash never reaches the server, which matters on the Deakin server: when
   refreshing on any view or bookmarking it still loads index.html, also meaning the
   browser's back button moves between views */
const currentView = ref('home')
const selectedInternshipId = ref(null)
const mainElement = ref(null)

// sections of the home page that the header and footer link to directly
const HOME_SECTIONS = ['how-it-works', 'about', 'demand', 'features']

const selectedInternship = computed(() => findInternship(selectedInternshipId.value))

// function to read the current #/ address and update currentView and selectedInternshipId
// the # lets a one-page Vue app have separate addresses for each view but the deakin server only ever has to serve index.html
async function readLocation() {
  const [first = '', second = ''] = window.location.hash.replace(/^#\/?/, '').split('/')
  let sectionId = null


  if (first === 'matches') {
    currentView.value = 'dashboard'
  } 
  else if (first === 'sign-up') {
    currentView.value = 'signup'
  } 
  else if (first === 'internship' && findInternship(second)) {
    currentView.value = 'detail'
    selectedInternshipId.value = second
  } 
  else if (first === 'internship') {
    // unknown listing id: fall back to the dashboard rather than a blank page
    currentView.value = 'dashboard'
  } 
  else {
    currentView.value = 'home'
    if (HOME_SECTIONS.includes(first)) sectionId = first
  }

  // wait for the new view to render then jump to the section or the top
  await nextTick()
  const section = sectionId && document.getElementById(sectionId)
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0 })
}

function focusMain() {
  mainElement.value.focus()
}

onMounted(() => {
  readLocation()
  window.addEventListener('hashchange', readLocation)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', readLocation))

/* customer acknowledgement */
const submittedProfile = ref(null)
const submittedAt = ref('')
const ackCard = ref(null)

// listener for ContactForm's submit-form event + payload is the shallow copy it emitted
async function handleSubmitForm(payload) {
  submittedProfile.value = payload
  submittedAt.value = new Date().toLocaleString('en-AU', {
    hour: 'numeric', 
    minute: '2-digit', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
  })

  // bring the card into view (on a phone it sits under the form)
  await nextTick()
  ackCard.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function formatStartDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(
    'en-AU', {
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
  })
}

// the submitted values turned into readable lines
//  the password is deliberately left out
const acknowledgementItems = computed(() => {
  const profile = submittedProfile.value
  if (!profile) return []
  return [
    { label: 'Email', value: profile.email },
    { label: 'Mobile', value: profile.phone || 'Not provided' },
    { label: 'Resume', value: profile.resumeName || 'Not uploaded' },
    { label: 'Skills', value: profile.skills.length ? profile.skills.join(', ') : 'Read from resume' },
    { label: 'Visa', value: labelFor(visaOptions, profile.visa) },
    { label: 'Role type', value: labelFor(roleOptions, profile.roleType) },
    { label: 'Locations', value: profile.locations.map((value) => labelFor(locationOptions, value)).join(', ') },
    { label: 'Availability', value: labelFor(availabilityOptions, profile.availability) },
    { label: 'Start date', value: formatStartDate(profile.startDate) },
    { label: 'Hours per week', value: `${profile.hours} hours` },
  ]
})
</script>
