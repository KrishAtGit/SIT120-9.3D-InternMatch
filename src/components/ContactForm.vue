<template>
  <!-- here, the Task 6.3D "Profile & Skills Setup" form is refactored into a Vue child component
       Same three fieldsets as the 6.2C wireframe: 
       Account details -> Skill profile -> Eligibility & preferences -> Reset + Create Profile.

       novalidate turns off the browser's own popups so the inline v-if messages below
       are the only validation the user sees -->
  <form ref="formElement" class="profile-form" novalidate @submit.prevent="handleSubmit">

    <header class="form-header">
      <h2>{{ formTitle }}</h2>
      <p v-if="formIntro" class="section-lead">{{ formIntro }}</p>
      <p class="form-note"><span class="req" aria-hidden="true">*</span> Required field</p>
    </header>

    <!-- success message, shown for the 2 seconds before the fields reset -->
    <div v-if="successMessage" class="form-success" role="status">
      <p>{{ successMessage }}</p>
      <div v-if="isResetting" class="reset-progress" aria-hidden="true"><span></span></div>
    </div>

    <!-- FIELDSET 1: Account details. every fieldset is disabled during the 2-second
         wait, so nothing can be edited while the success message is showing -->
    <fieldset class="form-group" :disabled="isResetting">
      <legend>1. Account details</legend>
      <p class="group-hint">Used to sign you in and send match alerts. We never share these with employers.</p>

      <div class="form-grid">
        <!-- REQUIRED TYPE 1 of 5: TEXT input (v-model) -->
        <div class="form-field" :class="{ 'has-error': errors.fullName }">
          <label for="full-name">Full name <span class="req" aria-hidden="true">*</span></label>
          <input
            id="full-name" v-model.trim="form.fullName" type="text" autocomplete="name"
            aria-required="true" :aria-invalid="Boolean(errors.fullName)"
            :aria-describedby="errors.fullName ? 'full-name-error' : 'full-name-hint'"
          >
          <p v-if="errors.fullName" id="full-name-error" class="field-error">{{ errors.fullName }}</p>
          <small v-else id="full-name-hint" class="hint">As it appears on your resume.</small>
        </div>

        <!-- email input (v-model) -->
        <div class="form-field" :class="{ 'has-error': errors.email }">
          <label for="email">University email <span class="req" aria-hidden="true">*</span></label>
          <input
            id="email" v-model.trim="form.email" type="email" autocomplete="email"
            placeholder="you@deakin.edu.au"
            aria-required="true" :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'email-error' : 'email-hint'"
          >
          <p v-if="errors.email" id="email-error" class="field-error">{{ errors.email }}</p>
          <small v-else id="email-hint" class="hint">Must end in .edu.au so we can confirm you are a current student.</small>
        </div>

        <!-- password input (v-model) -->
        <div class="form-field" :class="{ 'has-error': errors.password }">
          <label for="password">Password <span class="req" aria-hidden="true">*</span></label>
          <input
            id="password" v-model="form.password" type="password" autocomplete="new-password"
            aria-required="true" :aria-invalid="Boolean(errors.password)"
            :aria-describedby="errors.password ? 'password-error' : 'password-hint'"
          >
          <p v-if="errors.password" id="password-error" class="field-error">{{ errors.password }}</p>
          <small v-else id="password-hint" class="hint">At least 8 characters, with a letter and a number.</small>
        </div>

        <!-- phone input (v-model) -->
        <div class="form-field" :class="{ 'has-error': errors.phone }">
          <label for="phone">Mobile number</label>
          <input
            id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel"
            placeholder="0412 345 678" :aria-invalid="Boolean(errors.phone)"
            :aria-describedby="errors.phone ? 'phone-error' : 'phone-hint'"
          >
          <p v-if="errors.phone" id="phone-error" class="field-error">{{ errors.phone }}</p>
          <small v-else id="phone-hint" class="hint">Optional. Australian mobile, for interview reminders by SMS.</small>
        </div>
      </div>
    </fieldset>

    <!-- FIELDSET 2: Skill profile ("Upload resume OR add skills manually") -->
    <fieldset class="form-group" :disabled="isResetting">
      <legend>2. Skill profile</legend>
      <p class="group-hint">Upload your resume, tick your skills, or both. We need at least one of the two.</p>

      <div class="form-grid">
        <!-- file inputs can't use v-model as their value is read-only, so the chosen
             file's name is copied into the form state by onResumeChange -->
        <div class="form-field span-2" :class="{ 'has-error': errors.resumeName }">
          <label for="resume">Upload your resume</label>
          <input
            id="resume" ref="resumeInput" type="file" accept=".pdf,.docx"
            :aria-invalid="Boolean(errors.resumeName)"
            :aria-describedby="errors.resumeName ? 'resume-error' : 'resume-hint'"
            @change="onResumeChange"
          >
          <p v-if="errors.resumeName" id="resume-error" class="field-error">{{ errors.resumeName }}</p>
          <small v-else id="resume-hint" class="hint">PDF or Word document. We read the skills from it automatically.</small>
        </div>

        <!-- REQUIRED TYPE 5 of 5: CHECKBOX group (v-model on an array collects every ticked value).
             the options are rendered with v-for from profileOptions.js -->
        <fieldset
          class="form-field span-2 choice-group" :class="{ 'has-error': errors.skills }"
          :aria-describedby="errors.skills ? 'skills-error' : null"
        >
          <legend>Or tick the skills you already have</legend>
          <div class="choice-list">
            <label v-for="skill in skillOptions" :key="skill" class="choice">
              <input v-model="form.skills" type="checkbox" :value="skill"> {{ skill }}
            </label>
          </div>
          <p v-if="errors.skills" id="skills-error" class="field-error">{{ errors.skills }}</p>
        </fieldset>

        <div class="form-field span-2" :class="{ 'has-error': errors.otherSkills }">
          <label for="other-skills">Anything else we should know?</label>
          <textarea
            id="other-skills" v-model="form.otherSkills" rows="4"
            placeholder="e.g. Built a Flask app for my capstone, Tableau certificate, fluent in Hindi and Punjabi"
            :aria-invalid="Boolean(errors.otherSkills)"
            :aria-describedby="errors.otherSkills ? 'other-skills-error' : 'other-skills-count'"
          ></textarea>
          <p
            id="other-skills-count" class="char-counter"
            :class="{ 'is-over': form.otherSkills.length > OTHER_SKILLS_MAX }"
          >{{ form.otherSkills.length }} / {{ OTHER_SKILLS_MAX }} characters</p>
          <p v-if="errors.otherSkills" id="other-skills-error" class="field-error">{{ errors.otherSkills }}</p>
        </div>
      </div>
    </fieldset>

    <!-- FIELDSET 3: eligibility & preferences -->
    <fieldset class="form-group" :disabled="isResetting">
      <legend>3. Eligibility &amp; preferences</legend>
      <p class="group-hint">We use these to hide roles you can't legally take or don't want, before ranking the rest.</p>

      <div class="form-grid">
        <!-- REQUIRED TYPE 4 of 5: DROPDOWN populated with v-for (v-model) -->
        <div class="form-field" :class="{ 'has-error': errors.visa }">
          <label for="visa">Visa / work rights <span class="req" aria-hidden="true">*</span></label>
          <select
            id="visa" v-model="form.visa" aria-required="true" :aria-invalid="Boolean(errors.visa)"
            :aria-describedby="errors.visa ? 'visa-error' : null"
          >
            <option value="" disabled>Select your visa status</option>
            <option v-for="option in visaOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="errors.visa" id="visa-error" class="field-error">{{ errors.visa }}</p>
        </div>

        <!-- the role list arrives as a prop from App.vue and is looped with v-for -->
        <div class="form-field" :class="{ 'has-error': errors.roleType }">
          <label for="role-type">Preferred role type <span class="req" aria-hidden="true">*</span></label>
          <select
            id="role-type" v-model="form.roleType" aria-required="true" :aria-invalid="Boolean(errors.roleType)"
            :aria-describedby="errors.roleType ? 'role-type-error' : null"
          >
            <option value="" disabled>Select a role type</option>
            <option v-for="option in roleOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="errors.roleType" id="role-type-error" class="field-error">{{ errors.roleType }}</p>
        </div>

        <div class="form-field" :class="{ 'has-error': errors.locations }">
          <label for="locations">Preferred locations <span class="req" aria-hidden="true">*</span></label>
          <select
            id="locations" v-model="form.locations" multiple size="6"
            aria-required="true" :aria-invalid="Boolean(errors.locations)"
            :aria-describedby="errors.locations ? 'locations-error' : 'locations-hint'"
          >
            <option v-for="option in locationOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
          <p v-if="errors.locations" id="locations-error" class="field-error">{{ errors.locations }}</p>
          <small v-else id="locations-hint" class="hint">Hold Ctrl (Cmd on Mac) to choose more than one.</small>
        </div>

        <!-- REQUIRED TYPE 3 of 5: RADIO buttons (v-model) -->
        <fieldset
          class="form-field choice-group" :class="{ 'has-error': errors.availability }"
          aria-required="true" :aria-describedby="errors.availability ? 'availability-error' : null"
        >
          <legend>Availability <span class="req" aria-hidden="true">*</span></legend>
          <div class="choice-list choice-list-stack">
            <label v-for="option in availabilityOptions" :key="option.value" class="choice">
              <input v-model="form.availability" type="radio" name="availability" :value="option.value"> {{ option.label }}
            </label>
          </div>
          <p v-if="errors.availability" id="availability-error" class="field-error">{{ errors.availability }}</p>
        </fieldset>

        <div class="form-field" :class="{ 'has-error': errors.startDate }">
          <label for="start-date">Earliest start date <span class="req" aria-hidden="true">*</span></label>
          <input
            id="start-date" v-model="form.startDate" type="date"
            aria-required="true" :aria-invalid="Boolean(errors.startDate)"
            :aria-describedby="errors.startDate ? 'start-date-error' : null"
          >
          <p v-if="errors.startDate" id="start-date-error" class="field-error">{{ errors.startDate }}</p>
        </div>

        <!-- REQUIRED TYPE 2 of 5: NUMERIC input with v-model.number, so form.hours is stored as a real
             number (20) rather than the text "20" -->
        <div class="form-field" :class="{ 'has-error': errors.hours }">
          <label for="hours">Hours available per week <span class="req" aria-hidden="true">*</span></label>
          <input
            id="hours" v-model.number="form.hours" type="number"
            aria-required="true" :aria-invalid="Boolean(errors.hours)"
            :aria-describedby="errors.hours ? 'hours-error' : 'hours-hint'"
          >
          <p v-if="errors.hours" id="hours-error" class="field-error">{{ errors.hours }}</p>
          <small v-else id="hours-hint" class="hint">{{ minHours }} to {{ maxHours }}. Student visa holders can work 48 hours a fortnight during semester.</small>
        </div>
      </div>
    </fieldset>

    <!-- consent: a single checkbox bound to a true/false value (v-model) -->
    <div class="form-field consent-field" :class="{ 'has-error': errors.consent }">
      <label class="choice consent">
        <input
          v-model="form.consent" type="checkbox" :disabled="isResetting"
          aria-required="true" :aria-invalid="Boolean(errors.consent)"
          :aria-describedby="errors.consent ? 'consent-error' : null"
        >
        <span>I agree to InternMatch storing my resume and skills to match me with internships. <span class="req" aria-hidden="true">*</span></span>
      </label>
      <p v-if="errors.consent" id="consent-error" class="field-error">{{ errors.consent }}</p>
    </div>

    <!-- Reset + Create Profile side by side -->
    <div class="form-actions">
      <button type="button" class="btn btn-ghost" :disabled="isResetting" @click="resetForm">Reset</button>
      <button type="submit" class="btn btn-primary" :disabled="isResetting">
        {{ isResetting ? 'Profile created ✓' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { 
  ref, 
  watch, 
  nextTick, 
  onBeforeUnmount 
} from 'vue'

import {
  visaOptions, availabilityOptions, skillOptions, locationOptions,
} from '../data/profileOptions.js'

/*  props: configuration passed down from App.vue  */
const props = defineProps({
  formTitle: { type: String, default: 'Create your profile' },
  formIntro: { type: String, default: '' },
  submitLabel: { type: String, default: 'Create Profile' },
  // the role dropdown's options, looped with v-for
  roleOptions: { type: Array, required: true },
  minHours: { type: Number, default: 8 },
  maxHours: { type: Number, default: 40 },
})

/*  emits: the custom event sent up to App.vue  */
const emit = defineEmits(['submit-form'])

const OTHER_SKILLS_MAX = 300
const RESET_DELAY_MS = 2000

/*  regular expressions  */
// full name: starts and ends with a letter in any language (\p{L}, needs the u flag),
// with spaces, apostrophes, hyphens or full stops in between
const NAME_PATTERN = /^\p{L}[\p{L}' .-]*\p{L}$/u
// university email: anything without spaces or @, then @, then domain parts ending in .edu.au
const UNI_EMAIL_PATTERN = /^[^\s@]+@(?:[a-z0-9-]+\.)+edu\.au$/i
// Australian mobile: 04 or +61 4, then 8 more digits, single spaces allowed
const AU_MOBILE_PATTERN = /^(?:04\d{2}|\+61 ?4\d{2}) ?\d{3} ?\d{3}$/
// resume file must be a .pdf or .docx
const RESUME_PATTERN = /\.(?:pdf|docx)$/i

/*  local reactive form state  */
// a function, not a constant, so every reset gets brand-new arrays
function initialForm() {
  return {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    resumeName: '',
    skills: [],
    otherSkills: '',
    visa: '',
    roleType: '',
    locations: [],
    availability: '',
    startDate: '',
    hours: '',
    consent: false,
  }
}

const form = ref(initialForm())
const errors = ref({})
const hasTriedSubmit = ref(false)
const isResetting = ref(false)
const successMessage = ref('')
const formElement = ref(null)
const resumeInput = ref(null)
let resetTimer = null

// function to update the resumeName in form state when a file is chosen
function onResumeChange(event) {
  const file = event.target.files[0]
  form.value.resumeName = file ? file.name : ''
}

/*  VALIDATION 
   getErrors only reads values and returns messages. It never touches the page,
   so the rules stay separate from the template that displays them. */
function getErrors(values) {
  const found = {}

  // check each field in turn, and add a message to the found object if it fails
  //full name
  if (!values.fullName){
    found.fullName = 'Please enter your full name.'
  }
  else if (values.fullName.length < 2 || !NAME_PATTERN.test(values.fullName)) {
    found.fullName = 'Use letters only, with spaces, hyphens or apostrophes between names.'
  }

  // checking email
  if (!values.email) {
    found.email = 'Please enter your university email address.'
  }
  else if (!UNI_EMAIL_PATTERN.test(values.email)) {
    found.email = 'This must be a university address ending in .edu.au, e.g. you@deakin.edu.au.'
  }

  // checking password
  if (!values.password) {
    found.password = 'Please create a password.'
  }
  else if (values.password.length < 8) {
    found.password = `Your password needs at least 8 characters (currently ${values.password.length}).`
  }
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    found.password = 'Your password needs at least one letter and one number.'
  }

  // checking phone
  if (values.phone && !AU_MOBILE_PATTERN.test(values.phone)) {
    found.phone = 'Enter an Australian mobile starting with 04 or +61 4, e.g. 0412 345 678.'
  }

  // checking resume file name and skills
  if (values.resumeName && !RESUME_PATTERN.test(values.resumeName)) {
    found.resumeName = `"${values.resumeName}" is not a PDF or Word (.docx) file.`
  }

  // the wireframe's "resume OR skills" rule: if neither is given, show a message under the skills
  if (!values.resumeName && values.skills.length === 0) {
    found.skills = 'Upload your resume above or tick at least one skill, so we have something to match.'
  }

  // other skills text area: max 300 characters
  if (values.otherSkills.length > OTHER_SKILLS_MAX) {
    found.otherSkills = `Please shorten this by ${values.otherSkills.length - OTHER_SKILLS_MAX} characters.`
  }

  // eligibility & preferences
  if (!values.visa) {
    found.visa = 'Please choose your visa or work rights.'
  }
  if (!values.roleType) {
    found.roleType = 'Please choose the kind of role you are looking for.'
  }
  if (values.locations.length === 0) {
    found.locations = 'Please choose at least one location (or Remote).'
  }
  if (!values.availability) {
    found.availability = 'Please tell us when you can work.'
  }

  // start date: must be a real date, and not in the past
  if (!values.startDate) {
    found.startDate = 'Please choose the earliest date you could start.'
  }
  else {
    const [year, month, day] = values.startDate.split('-').map(Number)
    const start = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      found.startDate = 'Your start date cannot be in the past.'
    }
  }

  // v-model.number gives a Number once something numeric is typed, or '' when empty
  const hours = values.hours
  if (hours === '' || hours === null) {
    found.hours = 'Please enter how many hours a week you could work.'
  }
  else if (!Number.isInteger(hours)) {
    found.hours = 'Please enter a whole number of hours, e.g. 20.'
  }
  else if (hours < props.minHours || hours > props.maxHours) {
    found.hours = `Please enter between ${props.minHours} and ${props.maxHours} hours.`
  } else if (values.visa === '500' && values.availability === 'part-time' && hours > 24) {
    found.hours = 'On a student visa you can work up to 24 hours a week during semester (48 a fortnight).'
  }

  if (!values.consent) {
    found.consent = 'Please tick this box so we are allowed to store and match your profile.'
  }

  return found
}

// validate() runs getErrors and updates the reactive errors object
function validate() {
  errors.value = getErrors(form.value)
  return Object.keys(errors.value).length === 0
}

// after the first submit attempt, re-check on every change so a message disappears the moment its field is fixed
watch(form, () => {
  if (hasTriedSubmit.value && !isResetting.value) validate()
}, { deep: true })

/*  SUBMIT  */
async function handleSubmit() {
  hasTriedSubmit.value = true

  if (!validate()) {
    // move keyboard focus to the first field with a problem
    await nextTick()
    formElement.value.querySelector('[aria-invalid="true"]')?.focus()
    return
  }

  // send a SHALLOW COPY up to the parent. if form.value itself were emitted, App.vue
  // would hold the same object this component is about to reset, and the
  // acknowledgement card would be wiped along with the form. the reset below
  // replaces form.value with a brand-new object (and brand-new arrays), so the
  // copy App.vue keeps is never touched
  emit('submit-form', { ...form.value })

  const firstName = form.value.fullName.split(' ')[0]
  successMessage.value = `Thanks, ${firstName}! Your profile has been created. This form will clear in 2 seconds.`
  isResetting.value = true
  resetTimer = setTimeout(finishReset, RESET_DELAY_MS)
}

// runs 2 seconds after a successful submit
function finishReset() {
  resetForm()
  successMessage.value = 'Form cleared. Your details are saved in the acknowledgement card.'
}

// also used by the Reset button
function resetForm() {
  clearTimeout(resetTimer)
  form.value = initialForm()
  errors.value = {}
  hasTriedSubmit.value = false
  isResetting.value = false
  successMessage.value = ''
  // the file input isn't bound with v-model, so it's cleared by hand
  if (resumeInput.value) {
    resumeInput.value.value = ''
  }
}

// if the user navigates away during the 2-second wait, don't leave a timer running
onBeforeUnmount(() => clearTimeout(resetTimer))
</script>
