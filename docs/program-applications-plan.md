# Program applications with payout details: engineering plan

**Goal:** citizens can apply to any open program, including payout details
(account name, bank, account number) so approved beneficiaries can be paid.
Admins can review, decide, and pay out, with every applicant able to track
their status.

**Principle:** bank details are the most sensitive data this platform will
hold. A leak, misuse, or even the appearance of politically tied payments
would be far more damaging than any feature gap. So the design is:
**collect as little as possible, encrypt it, show it to as few people as
possible, log every access, and delete it when it's no longer needed.**

## Status (October 2026)

**Built and tested locally:** phases 1–6, using the recommended defaults.
- Bank details are collected **after acceptance** by default, with an
  "at application" option per program.
- Super Admin can reveal and export.
- Stored details are deleted 90 / 180 days after the outcome.

Collection is **off for every program** until it's switched on in the
program form, and it can't be switched on until `PAYOUT_ENCRYPTION_KEY` and
`PAYOUT_HASH_KEY` are set.

**Still to do before enabling on production:**
- legal sign-off (§2.1);
- a Privacy Policy section on payout data;
- production keys and `CRON_SECRET`;
- optionally `PAYSTACK_SECRET_KEY`, to turn on account-name checks;
- a real-device test.

**Known limits:**
- Rate limits are in-memory per server instance (the app's existing
  pattern), so on Vercel they're per instance, not global.
- Announcement push fan-out runs after the response within one function
  invocation. Very large audiences will need a queue.

---

## 1. What exists today

| Piece | State |
|---|---|
| `ProgramApplication` model | `fullName`, `phone`, `email`, `details`, `status`; one per user per program (DB unique constraint) |
| `ApplicationStatus` | `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `ACCEPTED`, `REJECTED` |
| Apply flow | `ProgramApplyDialog` → `applyToProgram` server action (sign-in required) |
| Admin | `/admin/programs` lists every application inline under each program, with a status dropdown |
| Permissions | `programs.manage_applications` (Super Admin, Program Manager) |

**Gaps to fix regardless of payout details:**
- The server doesn't enforce program status, publish state or deadline.
  Only the UI hides the button, and `UPCOMING` programs accept applications.
- No rate limiting on applying.
- Applicants can't see or withdraw their applications, and get no
  notification when the status changes.
- The admin view loads all applications at once: no paging, filters,
  search or history of decisions.

## 2. Before building: two decisions to make

### 2.1 Legal review (blocking)
- **Electoral law:** collecting citizens' bank details on a candidate's
  platform during a campaign, then paying money into those accounts, can
  be read as inducement under the Electoral Act 2022 (s. 121, vote
  buying), whatever the intent. Get the campaign's lawyer to sign off.
  Strong recommendations:
  - run disbursing programs through the **AB Haske Foundation** with
    published eligibility criteria;
  - never ask for voter card / PVC / polling unit data or political
    affiliation on an application;
  - never make support a condition of anything.
- **Data protection:** bank details are personal data under the
  **Nigeria Data Protection Act 2023**. Needed:
  - a short Data Protection Impact Assessment;
  - explicit consent with a stated purpose;
  - a retention period;
  - an updated Privacy Policy (`/privacy`);
  - a named person responsible for the data.

### 2.2 When to collect payout details (recommendation)
| Option | Pros | Cons |
|---|---|---|
| **A. At application** (as requested) | One step for applicants | Holds bank data for *every* applicant, including the majority who are rejected |
| **B. After acceptance (recommended default)** | Far less sensitive data held; fewer fake applications farming accounts | A second, short step for accepted applicants |

**Recommendation:** support both, chosen per program (`payoutDetailsStage`),
with **B as the default**. Use A only for programs that pay everyone who
qualifies (e.g. a fixed relief grant). The rest of this plan works for both.

## 3. Data model

```prisma
model Program {
  // ...existing fields
  requiresPayoutDetails Boolean            @default(false)
  payoutDetailsStage    PayoutDetailsStage @default(AFTER_ACCEPTANCE)
}

enum PayoutDetailsStage { AT_APPLICATION  AFTER_ACCEPTANCE }

enum ApplicationStatus {
  SUBMITTED  UNDER_REVIEW  SHORTLISTED  ACCEPTED  REJECTED
  WAITLISTED  WITHDRAWN  PAID            // new
}

model ProgramApplication {
  // ...existing fields
  lga            String?
  reviewedById   String?
  reviewedAt     DateTime?
  decisionNote   String?        @db.Text   // internal; never shown to applicant
  withdrawnAt    DateTime?
  payout         ApplicationPayoutDetails?
  events         ApplicationEvent[]
  @@index([programId, createdAt])
}

/// Kept in its own table so ordinary queries never load it.
model ApplicationPayoutDetails {
  id                 String   @id @default(cuid())
  applicationId      String   @unique
  accountName        String           // as entered by the applicant
  bankCode           String           // CBN/NIBSS code, e.g. "058"
  bankName           String
  accountNumberEnc   String           // AES-256-GCM ciphertext, "v1:<iv>:<tag>:<data>"
  accountNumberLast4 String           // for masked display: ****1234
  accountNumberHash  String           // HMAC-SHA256: duplicate detection without decrypting
  verifiedName       String?          // name returned by the bank's name enquiry
  nameMatch          NameMatch @default(UNVERIFIED)
  consentVersion     String           // which consent text they agreed to
  consentAt          DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  application        ProgramApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  @@index([accountNumberHash])
}

enum NameMatch { UNVERIFIED  MATCH  PARTIAL  MISMATCH  FAILED }

/// Append-only history: status changes, reveals, edits, exports.
model ApplicationEvent {
  id            String   @id @default(cuid())
  applicationId String
  actorId       String?            // null = applicant/system
  type          String             // STATUS_CHANGED, PAYOUT_REVEALED, PAYOUT_UPDATED, EXPORTED...
  fromStatus    ApplicationStatus?
  toStatus      ApplicationStatus?
  note          String?  @db.Text
  createdAt     DateTime @default(now())
  application   ProgramApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  @@index([applicationId, createdAt])
}
```

Migration note: generate SQL with `prisma migrate diff`, **read it before
applying**, and confirm it only adds things. (The schema now models every
table, so it shouldn't propose drops; check anyway.)

## 4. Security design

**Encryption at rest:**
- The account number is encrypted in the app with **AES-256-GCM** before it
  reaches the database. Key: `PAYOUT_ENCRYPTION_KEY` (32 random bytes,
  base64), set in Vercel and never in the repo. The ciphertext is prefixed
  with a key version (`v1:`), so the key can be rotated by re-encrypting in
  a script.
- Supabase backups and anyone with database access see only ciphertext.

**Duplicate detection without decrypting:**
- Store `HMAC-SHA256(PAYOUT_HASH_KEY, accountNumber)`.
- The same hash across *different* users flags possible fraud (one
  account farming many applications).

**Least privilege (new permissions):**

| Permission | Who | Can |
|---|---|---|
| `programs.manage_applications` (existing) | Program Manager, Super Admin | Review, change status; sees **masked** `****1234` only |
| `programs.view_payout_details` (new) | Super Admin + named finance officer | Reveal one full account number, with a typed reason |
| `programs.export_payouts` (new) | Super Admin only | Export `ACCEPTED` beneficiaries for bank bulk transfer |

**Every reveal and export is logged:** who, when, which application, and why
(`ApplicationEvent` + the existing `AuditLog`). Reveals are rate-limited.

**Never:**
- log plaintext (no `console.log` of inputs; Prisma query logging stays off
  in production);
- return the full number in page props or list queries;
- collect BVN, card numbers, PINs, OTPs or internet-banking passwords.

The form says so explicitly: *"We will never ask for your BVN, PIN or
password."* This also defends against scammers impersonating the
programme.

**Abuse controls:**
- Applying requires a verified email (the existing `emailVerified`).
- Rate limit: `apply:{userId}`.
- The server enforces program `status`, `contentStatus` and
  `applicationDeadline`.

## 5. Validation and verification
- **Bank:** chosen from a fixed list of CBN banks and microfinance banks
  (code + name), stored as a static, reviewed list. Never free text.
- **Account number:** exactly 10 digits (NUBAN). Store digits only;
  keep leading zeros.
- **Account name:** 2–100 characters, letters/spaces/`.'-`.
- **Name enquiry (strongly recommended):** call a provider's account
  resolve API server-side (e.g. Paystack *Resolve Account Number*) to get
  the name the bank holds. Compare it with the entered name and the
  applicant's name:
  - **MATCH:** proceed.
  - **PARTIAL / MISMATCH:** allow submission, but flag for review. Don't
    hard-block: name order and initials vary.
  - **FAILED:** usually a typo; show *"We couldn't confirm this account,
    please check the number."*

  This needs `PAYSTACK_SECRET_KEY` (or equivalent) and catches most typos
  before money is sent.

## 6. Applicant experience
- **Apply flow:** a 3-step form (replaces the current dialog).
  1. **About you:** name, phone, email (prefilled from the account), LGA,
     the program's questions.
  2. **Payout details:** only when the program collects them at this
     stage. Shows the bank list, account number and account name, a live
     name check, and a clear purpose statement.
  3. **Review and consent:** a summary with the account masked, plus a
     consent checkbox linking the privacy policy (versioned as
     `consentVersion`).
- **My applications** (new): lists each application with a status
  timeline, plus:
  - **Withdraw** while `SUBMITTED`;
  - **Update payout details** until the application is `ACCEPTED`. After
    that, changes go through support, since changing bank details right
    before payment is the classic fraud move.
- **After acceptance (option B):** the applicant gets a notification and
  push: *"You've been accepted. Add your payout details."* This links to
  the same step 2 + 3 form.
- **Notifications:** every status change notifies the applicant through
  the existing `notify()`, so push works automatically.

## 7. Admin experience
New page **`/admin/programs/[id]/applications`**, replacing the inline list:
- **Table:**
  - paged, searchable by name/email/phone;
  - filters for status, LGA, name check (MATCH / MISMATCH / …), duplicate
    account and "payout details missing";
  - **bulk** status changes, which ask for a note.
- **Detail drawer:**
  - applicant answers;
  - payout details masked: *Bank · ****1234 · name check result*;
  - **Reveal** (permission + reason; logged);
  - the full event history;
  - a decision note.
- **Export** (Super Admin only): CSV of `ACCEPTED` beneficiaries in the
  bank's bulk-transfer format, logged. After payment, mark rows `PAID`
  (bulk), which notifies the applicants.
- **Dashboard:** applications per program and status, mismatches and
  duplicates needing review.

## 8. Retention and deletion
- Payout details are deleted automatically:
  - **90 days after `REJECTED`/`WITHDRAWN`;**
  - **180 days after `PAID`** (to cover payment queries).

  Exact periods depend on legal advice. The rest of the application is
  kept, minus bank data.
- Implemented as a daily **Vercel Cron** route protected by
  `CRON_SECRET`, logged in the audit log.
- Deleting a user account cascades to their applications and payout
  details (already `onDelete: Cascade`).

## 9. Delivery plan

| Phase | Scope | Size |
|---|---|---|
| 0 | Legal sign-off (§2.1), DPIA, Privacy Policy update, choose name-enquiry provider | owner: campaign/legal |
| 1 | Harden existing flow: server-side status/deadline checks, rate limit, verified email, new statuses, notifications, **My applications**, admin paging | 1–2 days |
| 2 | Data layer: migration, `src/lib/crypto/payout.ts` (encrypt/decrypt/hash + tests), bank list, validation | 1–2 days |
| 3 | Applicant form (3 steps, consent, both collection stages), "add payout details" for accepted applicants | 2 days |
| 4 | Admin console: table, filters, drawer, masked view, reveal + audit, bulk actions, export, `PAID` | 2–3 days |
| 5 | Name enquiry integration + duplicate and mismatch flags | 1 day |
| 6 | Retention cron, end-to-end tests, security review, runbook (key rotation, incident response) | 1–2 days |

Each phase ships on its own; phases 2–6 sit behind `requiresPayoutDetails`
(off for every program until the legal review is done).

## 10. Testing
- **Unit:**
  - encryption round-trip, tamper detection (GCM tag) and key-version
    parsing;
  - the HMAC is stable;
  - account number validation;
  - name-match scoring.
- **Integration:**
  - applying to closed / past-deadline / draft programs is rejected;
  - duplicate application is rejected;
  - payout details never appear in list queries or page props (assert on
    serialized output);
  - each permission boundary;
  - every reveal writes an event.
- **End-to-end (Playwright, phone width):** apply → admin accepts →
  applicant adds payout details → export → mark paid → applicant notified.
- **Security review** before enabling on any program.

## 11. Configuration

| Variable | Purpose |
|---|---|
| `PAYOUT_ENCRYPTION_KEY` | AES-256 key (base64, 32 bytes). Losing it makes stored numbers unreadable: keep a copy in the password manager |
| `PAYOUT_HASH_KEY` | HMAC key for duplicate detection |
| `PAYSTACK_SECRET_KEY` | Name enquiry (or equivalent provider) |
| `CRON_SECRET` | Protects the retention job |

## 12. Decisions needed from you
1. Collect payout details **at application** or **after acceptance**
   (recommended), or per program?
2. Who should be able to **reveal** full account numbers and **export**?
   (Recommended: Super Admin plus one named finance officer.)
3. Name enquiry provider: Paystack, Flutterwave, or none for now?
4. Retention periods after legal review (proposed: 90 days rejected, 180
   days paid).
5. Are disbursing programs run by the campaign or by the **AB Haske
   Foundation**?
