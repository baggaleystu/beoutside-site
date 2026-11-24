// ─────────────────────────────────────────────────────────────
// Be Outside Time Audit: settings
//
// This is the one file to edit when you want to change how tasks
// are scored, what the example tasks are, or the "What will you do
// with the time?" choices. Save it and the tool picks up the change.
// ─────────────────────────────────────────────────────────────

window.TIME_AUDIT_CONFIG = {

  // ── Scoring ────────────────────────────────────────────────
  // AI-fit score = repetitive + human touch + energy drain (0–6).
  scoring: {
    repetitive: { yes: 2, somewhat: 1, no: 0 },
    humanTouch: { yes: 0, somewhat: 1, no: 2 },
    // Energy drain 1–5, scaled to 0–2 points.
    energy: { 1: 0, 2: 1, 3: 1, 4: 2, 5: 2 },

    // Checked top to bottom: the first band whose `min` the score
    // reaches is the one used. `winBack` is the share of the task's
    // hours we estimate AI could give back (0.5 = 50%).
    bands: [
      { min: 5, key: "great",    label: "Great AI candidate", winBack: 0.50 },
      { min: 3, key: "possible", label: "Possible",           winBack: 0.25 },
      { min: 0, key: "human",    label: "Keep it human",      winBack: 0.00 },
    ],
  },

  // ── Audiences ──────────────────────────────────────────────
  // Changes only the example tasks and wording.
  audiences: {
    school: {
      label: "School / District",
      yearLabel: "school year",
      weeksPerYear: 36,
      rolePlaceholder: "e.g. 4th grade teacher",
      orgPlaceholder: "e.g. Ridgeview Elementary",
      examples: [
        { task: "Grading writing",                              idea: "Feedback tool for student writing" },
        { task: "Building reading groups from screener data",   idea: "Reading-group builder from screener scores" },
        { task: "Parent emails and newsletters",                idea: "Newsletter and parent-email drafter" },
        { task: "Lesson planning",                              idea: "Lesson plan starter from your standards and materials" },
        { task: "Data reports",                                 idea: "Report writer that turns your data into a summary" },
        { task: "IEP/504 paperwork",                            idea: "IEP/504 paperwork helper that drafts from your notes" },
        { task: "Making materials",                             idea: "Materials maker for leveled passages and practice pages" },
      ],
    },
    business: {
      label: "Business / Team",
      yearLabel: "work year",
      weeksPerYear: 48,
      rolePlaceholder: "e.g. office manager",
      orgPlaceholder: "e.g. Valley Landscaping",
      examples: [
        { task: "Client follow-ups",              idea: "Follow-up email drafter from your call notes" },
        { task: "Quotes and proposals",           idea: "Proposal builder from your past quotes" },
        { task: "Weekly reports",                 idea: "Weekly report writer from your numbers" },
        { task: "Scheduling",                     idea: "Scheduling helper that drafts invites and reminders" },
        { task: "Onboarding new staff",           idea: "Onboarding guide and checklist builder" },
        { task: "Inventory or sales summaries",   idea: "Sales and inventory summary from your spreadsheet" },
        { task: "Social posts",                   idea: "Social post drafter in your own voice" },
      ],
    },
  },

  // ── Tool ideas for tasks people type themselves ───────────
  // If a task's name contains any of these words, it gets this idea.
  // Checked top to bottom; the first match wins.
  ideaRules: [
    { words: ["grade", "grading", "feedback", "essay", "rubric"],      idea: "Feedback tool for student writing" },
    { words: ["reading group", "screener", "dibels", "acadience"],     idea: "Reading-group builder from screener scores" },
    { words: ["newsletter", "parent", "family", "families"],           idea: "Newsletter and parent-email drafter" },
    { words: ["lesson", "unit plan", "curriculum"],                    idea: "Lesson plan starter from your standards and materials" },
    { words: ["iep", "504"],                                           idea: "IEP/504 paperwork helper that drafts from your notes" },
    { words: ["material", "worksheet", "passage", "slides", "practice"], idea: "Materials maker for leveled passages and practice pages" },
    { words: ["follow-up", "follow up", "followup"],                   idea: "Follow-up email drafter from your call notes" },
    { words: ["quote", "proposal", "bid", "estimate"],                 idea: "Proposal builder from your past quotes" },
    { words: ["schedul", "calendar", "booking", "appointment"],        idea: "Scheduling helper that drafts invites and reminders" },
    { words: ["onboard", "training", "new hire", "new staff"],         idea: "Onboarding guide and checklist builder" },
    { words: ["inventory", "sales"],                                   idea: "Sales and inventory summary from your spreadsheet" },
    { words: ["social", "instagram", "facebook", "post"],              idea: "Social post drafter in your own voice" },
    { words: ["report", "data", "spreadsheet"],                        idea: "Report writer that turns your data into a summary" },
    { words: ["email", "inbox", "message"],                            idea: "Email drafter for the replies you write most" },
    { words: ["meeting", "minutes", "notes"],                          idea: "Meeting notes and next-steps summarizer" },
  ],

  // ── Sending results to your Google Sheet ──────────────────
  // Paste the web app address from Apps Script between the quotes
  // (see time-audit/sheet/SETUP.md). Leave it empty and the Send
  // button stays hidden; participants can still export files.
  sendTo: {
    url: "https://script.google.com/macros/s/AKfycbwjgUEv7mT_EcN8xutxUiqZhVwWloudoFkXQv8Ux4r-L1ZhUuRznVTDnGbuSl6icA/exec",
    buttonLabel: "Send to Stu",
    who: "Stu at Be Outside",
  },

  // ── "What will you do with the time?" ─────────────────────
  timeChoices: [
    "A walk outside",
    "Time with my people",
    "A few quiet minutes to breathe",
  ],
};
