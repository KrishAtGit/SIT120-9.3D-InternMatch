<template>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <div class="footer-brand">
        <span class="logo-mark" aria-hidden="true">IM</span>
        <p>InternMatch - internships you are actually eligible for.</p>
      </div>

      <!-- secondary navigation, as planned in the 1.1P wireframe footer (About | Privacy) -->
      <nav class="footer-nav" aria-label="Footer navigation">
        <ul>
          <li v-for="link in footerLinks" :key="link.href">
            <a :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <!-- contact details: address is the semantic element for contact information -->
      <address class="footer-contact">
        <p>
          <strong>Contact us:</strong> <a href="mailto:hello@internmatch.com.au">hello@internmatch.com.au</a>
        </p>
        <p>Student support Mon-Fri, 9am-5pm AEST · Melbourne, Victoria</p>
      </address>

      <p class="copyright">
        &copy; {{ currentYear }} InternMatch. A student project for SIT120. Listings shown are fictional examples.
      </p>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const footerLinks = [
  { label: 'Home', href: '#/' },
  { label: 'Matched Internships', href: '#/matches' },
  { label: 'Create Profile', href: '#/sign-up' },
  { label: 'About', href: '#/about' },
  { label: 'Privacy', href: '#/features' },
]
</script>
