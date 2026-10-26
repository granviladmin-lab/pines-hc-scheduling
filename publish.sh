#!/usr/bin/env bash
# Builds index.html (this repo) and the copy on the cca site.
# Prompts for the password so it never lands in shell history.
# Changing the password makes existing schedule data unreadable: restore it
# from a backup (Settings > Data) after rebuilding.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
read -rsp 'Schedule password: ' pw1; echo
read -rsp 'Repeat password: ' pw2; echo
[ "$pw1" = "$pw2" ] || { echo "Passwords don't match." >&2; exit 1; }
[ -n "$pw1" ] || { echo "Empty password." >&2; exit 1; }
HCS_PASSWORD="$pw1" node "$here/build.mjs" "$here/index.html" "$HOME/Work/cca/hc-scheduling/index.html"
