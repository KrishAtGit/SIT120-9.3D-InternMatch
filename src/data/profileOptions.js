// these are the option lists for the profile form (Task 6.3D fields)
// ContactForm renders every dropdown, radio group and checkbox list from these
// arrays with v-for, and App.vue uses the same lists to turn the submitted values
// back into readable labels on the acknowledgement card

// this is passed down to ContactForm as a prop, so the same form could be reused with a different list of roles 
export const roleOptions = [
  { value: 'software', label: 'Software development' },
  { value: 'data', label: 'Data & analytics' },
  { value: 'cyber', label: 'Cyber security' },
  { value: 'support', label: 'IT support & networking' },
  { value: 'ux', label: 'UX / UI design' },
]

export const visaOptions = [
  { value: '500', label: 'Student visa (subclass 500)' },
  { value: '485', label: 'Temporary Graduate visa (subclass 485)' },
  { value: 'pr', label: 'Permanent resident' },
  { value: 'citizen', label: 'Australian or NZ citizen' },
  { value: 'other', label: 'Other visa with work rights' },
]

export const availabilityOptions = [
  { value: 'full-time', label: 'Full-time (semester break)' },
  { value: 'part-time', label: 'Part-time (during semester)' },
  { value: 'either', label: 'Either' },
]

export const skillOptions = [
  'Python', 'Java', 'JavaScript', 'SQL', 'React',
  'Power BI', 'Excel', 'Git', 'AWS / Azure', 'Networking',
]

export const locationOptions = [
  { value: 'melbourne', label: 'Melbourne VIC' },
  { value: 'sydney', label: 'Sydney NSW' },
  { value: 'brisbane', label: 'Brisbane QLD' },
  { value: 'perth', label: 'Perth WA' },
  { value: 'adelaide', label: 'Adelaide SA' },
  { value: 'remote', label: 'Remote' },
]

// value -> label, works like this: labelFor(visaOptions, '500') -> 'Student visa (subclass 500)'
export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}
