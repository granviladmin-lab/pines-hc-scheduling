# The Pines HC Scheduling

Staff scheduling for the nursing department: a single web page, no server.

- **Schedule**: pay-period grid (1, 2 or 4 weeks) by role, with click or keyboard entry (shift codes such as D/E/N, O = off, P = PTO, C = call-out, Delete = clear), hours vs. target, overtime and short-rest warnings, and coverage rows against staffing targets. Copy the previous period, CSV export, print.
- **Day Sheet**: who's on each shift for a day, with phone numbers and shortages. Printable for the nurses' station.
- **Open Shifts**: every shift below target, with ranked suggestions (available, rested, no time-off request, under their hours, no overtime first) and one-click auto-fill.
- **Staff**: roster with role, employment type, home unit and hours per pay period.
- **Time Off**: requests, approve/deny; approved PTO fills the schedule.
- **Settings**: shift types, staffing targets per unit, units, roles, pay period, overtime and rest rules, backups, change log.

## Privacy

The schedule is stored in `data/schedule.enc`, encrypted in the browser with AES-256-GCM. The key comes from the department password (PBKDF2-SHA256, 600,000 iterations); this repository never holds the password or any readable schedule data. Anyone with the password can view. Editing also needs a GitHub fine-grained token with Contents read/write on this repository only, kept in that browser.

## Build

`app.html` is the source. `./publish.sh` asks for the password and writes `index.html` here and in the cca site (`cca/hc-scheduling/`). `salt.txt` must stay the same, or existing data can't be decrypted. Changing the password means restoring a backup (Settings > Data) afterwards.
