/**
 * Be Outside Time Audit → Google Sheet
 *
 * This script lives inside Stu's Google Sheet (Extensions → Apps Script).
 * When a participant presses "Send to Stu" in the Time Audit, their answers
 * arrive here and are written into the Sheet:
 *
 *   Participants  one row per person
 *   Tasks         one row per task (same columns as the tool's CSV export)
 *   Summary       live totals by organization and the biggest time drains
 *
 * If the same person sends again, their earlier rows are replaced, not
 * duplicated. The script never sends data back out: opening its web
 * address in a browser only shows a short "connected" message.
 *
 * Setup steps are in SETUP.md next to this file.
 */

var PEOPLE_COLS = [
  "audit_id", "sent_at", "name_or_role", "organization", "audience", "tasks",
  "hours_per_week", "hours_won_back_per_week", "hours_won_back_per_year", "time_plan",
  "email",  // optional: only when the participant asks Stu to follow up
];
var TASK_COLS = [
  "audit_id", "sent_at", "name_or_role", "organization", "audience", "task", "hours_per_week",
  "energy_drain", "repetitive", "human_touch", "ai_fit_score", "verdict",
  "hours_won_back_per_week", "tool_idea", "time_plan",
];
var NUMBER_COLS = {
  tasks: 1, hours_per_week: 1, hours_won_back_per_week: 1, hours_won_back_per_year: 1,
  energy_drain: 1, ai_fit_score: 1,
};
var MAX_BYTES = 100000;  // a real audit is a few KB
var MAX_TASKS = 60;
var MAX_TEXT = 300;

// ── receiving a send ─────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    var body = e && e.postData && e.postData.contents;
    if (!body) return reply({ ok: false, error: "Nothing was sent." });
    if (body.length > MAX_BYTES) return reply({ ok: false, error: "That audit is too large." });

    var data = JSON.parse(body);
    if (!data || data.kind !== "be-outside-time-audit-send") {
      return reply({ ok: false, error: "That isn't a Time Audit." });
    }
    var id = String(data.audit_id || "");
    if (!/^[A-Za-z0-9_-]{4,40}$/.test(id)) return reply({ ok: false, error: "The audit is missing its id." });

    var p = data.participant || {};
    var tasks = Array.isArray(data.tasks) ? data.tasks.slice(0, MAX_TASKS) : [];
    var sentAt = new Date();
    var shared = {
      audit_id: id,
      sent_at: sentAt,
      name_or_role: p.name_or_role,
      organization: p.organization,
      audience: p.audience,
      time_plan: p.time_plan,
    };

    locked = lock.tryLock(20000);
    if (!locked) return reply({ ok: false, error: "The Sheet is busy. Try again in a moment." });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var people = ensureSheet(ss, "Participants", PEOPLE_COLS);
    var taskSheet = ensureSheet(ss, "Tasks", TASK_COLS);
    ensureSummary(ss);

    var replaced = removeRowsWithId(people, id) > 0;
    removeRowsWithId(taskSheet, id);

    var personRow = PEOPLE_COLS.map(function (c) {
      return cell(c, c in shared ? shared[c] : p[c]);
    });
    appendRows(people, [personRow]);

    var taskRows = tasks.map(function (t) {
      t = t || {};
      return TASK_COLS.map(function (c) { return cell(c, c in shared ? shared[c] : t[c]); });
    });
    appendRows(taskSheet, taskRows);

    return reply({ ok: true, replaced: replaced, tasks: taskRows.length });
  } catch (err) {
    return reply({ ok: false, error: "The Sheet couldn't read that audit." });
  } finally {
    if (locked) lock.releaseLock();
  }
}

// Opening the web address in a browser shows this, and nothing else.
function doGet() {
  return ContentService.createTextOutput("The Be Outside Time Audit is connected to this Sheet.");
}

// Run from the Apps Script editor to create the tabs. Running it again
// is safe: it keeps every response and rewrites the Summary formulas.
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheet(ss, "Participants", PEOPLE_COLS);
  ensureSheet(ss, "Tasks", TASK_COLS);
  ensureSummary(ss);
  writeSummary(ss.getSheetByName("Summary"));
  var blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
}

// ── helpers ──────────────────────────────────────────────────
function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Numbers stay numbers. Text is trimmed, capped, and anything that
// starts like a formula (= + - @) is stored as plain text, so nobody
// can slip a formula into the Sheet through the public send address.
function cell(col, v) {
  if (v instanceof Date) return v;
  if (NUMBER_COLS[col]) {
    var n = Number(v);
    return v === "" || v == null || !isFinite(n) ? "" : n;
  }
  var s = String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, MAX_TEXT);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Creates the tab with its header row. If columns were added to the
// script later (like "email"), adds the missing headers at the end.
function ensureSheet(ss, name, cols) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight("bold");
    sh.setFrozenRows(1);
    return sh;
  }
  var head = sh.getRange(1, 1, 1, cols.length).getValues()[0];
  if (head.join("\u0001") !== cols.join("\u0001")) {
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight("bold");
  }
  return sh;
}

function appendRows(sh, rows) {
  if (!rows.length) return;
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

// Deletes every row whose first column is `id`. Returns how many.
function removeRowsWithId(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  var removed = 0;
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) !== id) continue;
    var end = i;
    while (i - 1 >= 0 && String(ids[i - 1][0]) === id) i--;
    sh.deleteRows(i + 2, end - i + 1);
    removed += end - i + 1;
  }
  return removed;
}

function ensureSummary(ss) {
  if (ss.getSheetByName("Summary")) return;
  writeSummary(ss.insertSheet("Summary", 0));
}

// Before the first response, QUERY has no numbers to add up and shows
// #VALUE!, so each table shows a short waiting note instead.
function writeSummary(sh) {
  var waiting = "Waiting for the first response";
  sh.getRange("A1").setValue("By organization").setFontWeight("bold").setFontSize(13);
  sh.getRange("A2").setFormula(
    "=IFERROR(QUERY(Participants!A:J, \"select D, count(A), sum(G), sum(H), sum(I) where A <> '' " +
    "group by D order by sum(H) desc " +
    "label D 'Organization', count(A) 'Participants', sum(G) 'Hours a week listed', " +
    "sum(H) 'Hours a week back', sum(I) 'Hours a year back'\", 1), \"" + waiting + "\")"
  );
  sh.getRange("H1").setValue("Biggest time drains, all groups").setFontWeight("bold").setFontSize(13);
  sh.getRange("H2").setFormula(
    "=IFERROR(QUERY(Tasks!A:O, \"select F, count(A), sum(G), sum(M) where A <> '' " +
    "group by F order by sum(M) desc limit 25 " +
    "label F 'Task', count(A) 'People', sum(G) 'Hours a week', sum(M) 'Hours a week back'\", 1), \"" + waiting + "\")"
  );
  sh.setFrozenRows(2);
}
