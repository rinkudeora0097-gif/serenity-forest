# Security Specification - Serenity Forest Secure Safeguards

This specification outlines the attribute-based, zero-trust security invariants for the Firestore database of **Serenity Forest**, preventing state-corruption, spoofing, and privilege-escalation.

## 1. Core Data Invariants

1. **Strict Owner Isolation**: Users can only read, write, create, or delete records that align to their own authenticated user ID (`request.auth.uid`). No user can view or alter another user's profile, mood logs, gratitude scrolls, focus times, or meditation history.
2. **Stat Aggregations**: Aggregated totals (such as `streak` or `totalFocusMinutes`) can only be modified by the matching authenticated owner under strict key validation.
3. **Temporal Protection**: Creation and modification timestamps (`createdAt`, `updatedAt`, `timestamp`) must always sync to `request.time` (the Firestore-enforced server clock) rather than client-supplied strings.
4. **ID Character Hardening**: Document IDs must conform to alphanumeric characters and dashes (`^[a-zA-Z0-9_\-]+$`) with a maximum length of 128 characters to thwart injection attacks.

---

## 2. The "Dirty Dozen" Threat Payloads (Blocked via Rules)

These 12 scenarios simulate attacks aimed at breaking the application's data boundaries:

1. **Alien Owner Hijacking**: User `alice_12` attempts to write layout settings directly into `/users/bob_99`.
2. **Ghost Keys Injection**: A client attempts to patch `/users/alice_12` with extra administrative flags like `{"isAdmin": true, "vipStatus": true}`.
3. **Gratitude Espionage**: An unauthorized actor tries to search or `list` another individual's personal gratitude entries stored in `/users/some_victim_id/journal_entries`.
4. **Retroactive Timestamp Spoofing**: An attacker transmits a manually crafted historical or future ISO-string (`"2040-01-01T00:00:00Z"`) to forge long streak histories.
5. **Junk Character Path Radiation**: An exploit payload with massive, 2048-character corrupted strings trying to write into `/users/alice_12/mood_logs/MALICIOUS_OVERFLOW_STRING...`.
6. **Self-Appointed Streaks**: A user attempts to write a streak value exceeding limits (`{"streak": 999999}`) without performing actual daily session logs.
7. **Negative Timeline Focus**: An attacker passes a negative focus session duration (`{"duration": -1500}`) to break statistical dashboards.
8. **Malicious Empty Scroll**: Attempting to post an empty gratitude journal scroll (`{"text": "", "timestamp": "request.time"}`) or a text blob exceeding 10,000 characters.
9. **Meditation Spoofing**: Overwriting historical guided meditations with a corrupted duration value type.
10. **Terminal State Corruptions**: Trying to update or erase unchangeable history logs that are immutable once registered.
11. **Anonymity Privilege Bypass**: A user who is not authenticated attempts to query list documents or register profiles.
12. **Double Action key bypass**: An attacker skips schema validation in a nested action update block by omitting required values.

---

## 3. Threat Assessment Matrix

| Vector | Threat Target | Prevention Logic Gate |
| :--- | :--- | :--- |
| **Identity Spoofing** | Setting `userId` or owner fields to other users | Enforced `userId == request.auth.uid` check |
| **State Escalation** | Artificially increasing streaking or minute data | Restricting update schemas with `keys().hasAll()` & `affectedKeys()` |
| **Resource Exhaustion** | Flooding IDs with junk characters or massive payload | Enforcing `.size()` bounds, `isValidId()` patterns, and character regexes |
| **PII Data Leakage**| Reading private profile info of arbitrary emails | Blocking public read capability of user folders completely |
