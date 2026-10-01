<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="#/">
        <span class="logo-mark" aria-hidden="true">IM</span>
        <span class="logo-text">InternMatch</span>
      </a>

      <!-- toggle for small screens. in 6.3D this was a hidden checkbox
           now menuOpen is reactive state and the button tells screen readers
           whether the menu is open with aria-expanded -->
      <button
        type="button"
        class="nav-burger"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="burger-bars" :class="{ 'is-open': menuOpen }" aria-hidden="true"></span>
        <span class="burger-text">{{ menuOpen ? 'Close' : 'Menu' }}</span>
      </button>

      <nav id="site-nav" class="site-nav" :class="{ 'is-open': menuOpen }" aria-label="Main navigation">
        <ul>
          <li v-for="link in navLinks" :key="link.href">
            <a
              :href="link.href"
              :class="{ 'is-current': link.view === currentView, 'nav-cta': link.cta }"
              :aria-current="link.view === currentView ? 'page' : null"
              @click="menuOpen = false"
            >{{ link.label }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // which view App.vue is showing, used to highlight the matching link
  currentView: { type: String, required: true },
  // the top-ranked internship, so "Top Match" always points at a real listing
  topMatchId: { type: String, required: true },
})

const menuOpen = ref(false)

// the three pages planned in Task 1.1P (landing, dashboard, detail) + the "How It Works" section + the 6.3D sign-up form as the call to action
const navLinks = [
  { label: 'Home', href: '#/', view: 'home' },
  { label: 'Matched Internships', href: '#/matches', view: 'dashboard' },
  { label: 'Top Match', href: `#/internship/${props.topMatchId}`, view: 'detail' },
  { label: 'How It Works', href: '#/how-it-works', view: null },
  { label: 'Sign Up', href: '#/sign-up', view: 'signup', cta: true },
]

// close the mobile menu whenever the page changes (e.g. via the back button)
watch(() => props.currentView, () => {
  menuOpen.value = false
})
</script>
