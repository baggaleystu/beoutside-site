# Connect the Time Audit to your Google Sheet

This takes about 5 minutes and you only do it once. When it's done, every
participant who presses **Send to Stu** shows up in your Sheet.

## 1. Make the Sheet

1. In Google Drive, choose **New → Google Sheets**.
2. Name it something like **Be Outside Time Audit responses**.

## 2. Add the script

1. In the Sheet, choose **Extensions → Apps Script**.
2. Delete the few lines that are already there.
3. Open `time-audit/sheet/Code.gs` from this folder, copy all of it, and paste it in.
4. Click the save icon. If it asks for a project name, use **Time Audit receiver**.

## 3. Create the tabs (and give permission)

1. In the bar at the top, pick **setup** from the function list, then click **Run**.
2. Google asks for permission. Click **Review permissions** and choose your account.
3. You'll see "Google hasn't verified this app." That's expected, because it's
   your own script. Click **Advanced**, then **Go to Time Audit receiver**, then **Allow**.
4. Go back to the Sheet. It now has three tabs: **Summary**, **Participants** and **Tasks**.
   Until the first participant sends their answers, **Summary** says
   "Waiting for the first response."

## 4. Turn it on

1. Back in Apps Script, click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

"Anyone" only means anyone can *send* an audit to the Sheet. Nobody can read
the Sheet through that address. Opening it in a browser just shows
"The Be Outside Time Audit is connected to this Sheet."

## 5. Put the address in the tool

In `time-audit/config.js`, paste the address between the quotes:

```js
sendTo: {
  url: "https://script.google.com/macros/s/…/exec",
```

The **Send to Stu** button appears once that's saved and the site is updated.

## Test it

Open the Time Audit, add one task, and press **Send to Stu**. A row should
appear in the **Tasks** tab within a few seconds. Delete the test rows
afterward from both **Participants** and **Tasks**.

## Using the Sheet

- **Summary** totals every organization and lists the biggest time drains
  across all your groups. It updates on its own.
- **Participants** has one row per person; **Tasks** has one row per task.
  Use **Data → Create a filter** to look at one organization.
- To chart anything, select a table and choose **Insert → Chart**.
- Sending again from the same device replaces that person's earlier rows,
  so nothing is counted twice.

## Links for each group

Give each group a link that fills in their organization and audience, so
their rows line up in the Sheet:

```
https://beoutside.life/time-audit/?org=Ridgeview%20Elementary&for=school
https://beoutside.life/time-audit/?org=Valley%20Landscaping&for=business
```

Use `%20` for spaces. `for` is `school` or `business`.

## If you change the script later

Paste the new code, save, run **setup** again (your responses are kept),
then **Deploy → Manage deployments**, click the
pencil, set **Version: New version**, and **Deploy**. The address stays the
same, so the tool doesn't need changing.
