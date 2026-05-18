export const NO_SIGNUP_FAQ = [
  {
    question: "Is this name picker really no-signup?",
    answer:
      "Yes. You open the page, paste your names, and spin. There is no email gate, no &quot;create a free account&quot;, no Google sign-in, no Twitter OAuth. Nothing about the spin requires an identity.",
  },
  {
    question: "Why do other name pickers ask for an account?",
    answer:
      "Some name pickers want to sync class lists across devices (which requires storage on their server, which requires an account) or run ads tied to a teacher identity (more ad revenue per logged-in user). We deliberately don&apos;t do either — your list lives in your browser, not on our server, so there&apos;s nothing to sync and no identity to attach to ads.",
  },
  {
    question: "Where is my class list stored?",
    answer:
      "In your browser&apos;s local storage on this device. Not on our server. Not synced to any cloud. Not visible to us or anyone else. The list reloads automatically when you re-visit the page on the <em>same</em> browser. If you clear cookies and site data, you&apos;ll need to re-paste.",
  },
  {
    question: "Can I move my class list to a different computer?",
    answer:
      "Yes — copy the names out of the textarea and email them to yourself, or paste into a Google Doc and re-paste on the new machine. There is no &quot;sync&quot; button because we don&apos;t store the list on a server; the manual copy step is the privacy trade-off.",
  },
  {
    question: "Is this safe under FERPA / COPPA / state student-data laws?",
    answer:
      "Because no student data leaves the device, no third-party data processing occurs and there&apos;s no PII transfer to evaluate. Most district privacy reviews approve this pattern on first pass. We are not lawyers; if your district requires a vendor data-processing addendum, our answer is &quot;we don&apos;t process student data — there&apos;s nothing for us to sign about.&quot;",
  },
  {
    question: "What about the Google Analytics on the page?",
    answer:
      "We use Google Analytics to count anonymous page views (so we know which tools are getting used). No student identifiers, no class list contents, no microphone audio is sent to GA. If your district disallows GA entirely, an extension like uBlock or Privacy Badger blocks it without affecting the tool.",
  },
  {
    question: "Will this page ever require signup later?",
    answer:
      "No. The free classroom toolkit will stay free and signup-free. We may eventually offer optional paid features for power users (e.g., team-account class-list sync, exportable reports), but the core spin / pick / save-locally flow will remain accountless.",
  },
  {
    question: "Is there a no-signup group generator too?",
    answer:
      "Yes — the same no-signup, no-upload, no-ad policy applies to the <a href=\"/classroom/group-generator\">group generator</a>, the <a href=\"/classroom/noise-meter\">noise meter</a>, and the <a href=\"/classroom/tally-counter\">tally counter</a>. The entire toolkit follows the same principles.",
  },
];
