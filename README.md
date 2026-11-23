# beoutside.life

The public website for Be Outside LLC.

- `index.html`: the whole page (text, styles, and the small bit of script).
- `images/`: the photos used on the page.
- `time-audit/`: the Time Audit tool (beoutside.life/time-audit/). To change the scoring percentages, example tasks, or the "What will you do with the time?" choices, edit `time-audit/config.js`. Add `#facilitator` to the address to combine a group's files. Make one group per engagement; **Save group file** downloads the whole group as one file, which is the lasting copy (the browser also remembers groups, but only on that one computer). **Open group file** brings a group back on any computer. Participants finish by pressing **Send to Stu**, which adds their answers to Stu's Google Sheet and clears them from their device; they see their results on screen but get no print or export buttons. The Sheet's script and setup steps are in `time-audit/sheet/`. If `sendTo.url` in `config.js` is ever emptied, the Send button disappears and Print and Export come back.
- `netlify.toml`: tells Netlify to publish this folder as-is (no build step).

Netlify is linked to this repo, so anything saved to the `main` branch goes live on beoutside.life within a minute or two.

The contact form uses Netlify Forms. Submissions appear in Netlify under **Forms**, where you can turn on email notifications.

The learning app (Next.js) lives in its own separate project; it is not part of this site.
