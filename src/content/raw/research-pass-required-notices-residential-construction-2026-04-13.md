# Research Pass: Required Notices for Residential Construction Projects (Oregon)

- **Research pass date:** 2026-04-13
- **Focus area:** Three required owner notices on Oregon residential projects over the written-contract threshold.
- **Scope note:** This dump imports and structures the user-provided CCB chart content, then maps it to existing Tier 1 source IDs already registered in `src/content/metadata/sources/`.

## 1) Source inventory

### Tier 1 (official / primary)
- **[S1]** `ccb-required-notices-chart` — CCB Required Notices for Residential Construction Projects (chart PDF).
- **[S2]** `ors-701-330` — consumer notice + notice of procedure statute.
- **[S3]** `oar-812-001-0200` — rule adopting notice forms.
- **[S4]** `oar-812-012-0130` — delivery timing + proof-of-delivery requirements.
- **[S5]** `ors-701-992` — civil penalty authority.
- **[S6]** `ors-chapter-87` — includes ORS 87.093 (construction lien information notice to owner).
- **[S7]** `ors-701-305` — written residential contract threshold logic (>$2,000 context).

### Tier 2 (explanatory)
- None added in this pass.

## 2) Claim list with citation anchors

> **Method note:** Claims C1–C16 are imported from the user-supplied chart text/image and treated as chart-derived claims pending direct line-by-line reconfirmation against ORS/OAR text in a follow-up pass.

### A. Applicability / who must provide notices
- **C1.** The three notices are required from the contractor with the property-owner contract (prime contractor), not from subcontractors. **[S1]**

### B. Consumer Protection Notice
- **C2.** Timing: deliver on or before contract date when contract exceeds $2,000. **[S1][S2][S4][S7]**
- **C3.** If original price is below $2,000 but later exceeds $2,000, written contract + notice duties attach. **[S1][S4][S7]**
- **C4.** Proof of delivery must be maintained for 2 years from contract date. **[S1][S4]**
- **C5.** Acceptable proof examples: signed notice copy; initialed contract acknowledgment; or contract copy containing full notice text. **[S1][S4]**
- **C6.** Purpose: licensing standards, bond/insurance requirements, project success steps, and problem-resolution direction. **[S1][S2]**
- **C7.** Consequence for violations can include civil penalty up to $5,000. **[S1][S5]**

### C. Notice of Procedure
- **C8.** Timing/proof framework is the same as the Consumer Protection Notice for contracts over $2,000. **[S1][S2][S4][S7]**
- **C9.** Purpose: explains homeowner steps required before arbitration or court action against contractor. **[S1][S2]**
- **C10.** Consequence for violations can include civil penalty up to $5,000. **[S1][S5]**

### D. Information Notice to Owner About Construction Liens
- **C11.** Timing: on/before contract date when contract exceeds $2,000. **[S1][S3][S4][S6][S7]**
- **C12.** If price starts below $2,000 and later exceeds it, contractor may deliver no later than five working days after learning the price exceeded $2,000. **[S1][S4][S6][S7]**
- **C13.** Permitted delivery methods include personal delivery, registered/certified mail, or first-class mail with certificate of mailing. **[S1][S4][S6]**
- **C14.** Purpose: explain lien law and homeowner steps to reduce construction-lien / “pay twice” risk. **[S1][S6]**
- **C15.** Purpose also includes protecting contractor lien rights through compliant notice delivery. **[S1][S6]**
- **C16.** Noncompliance consequences can include civil penalty, potential loss of lien rights, and possible license suspension. **[S1][S5][S6]**

## 3) Exact facts safe to teach (high-confidence extraction)

1. Oregon CCB materials distinguish three owner-facing residential notices in this context: Consumer Protection Notice, Notice of Procedure, and Information Notice to Owner About Construction Liens. **[S1]**
2. The chart ties all three notices to the written-contract-over-$2,000 framework and includes an explicit “goes over $2,000” trigger scenario. **[S1]**
3. The chart repeatedly states contractors must maintain proof of delivery for two years and provides accepted proof examples. **[S1]**
4. The chart cites ORS 701.330, OAR 812-001-0200, OAR 812-012-0130, ORS 701.992(1), and ORS 87.093 as governing authorities across the three notices. **[S1]**

## 4) Unresolved ambiguities / follow-up needed

1. **Exact trigger language harmonization:** Confirm whether each notice’s trigger is strictly “contract exceeds $2,000” or “when ORS 701.305 applies,” and whether wording differs by notice in current rule text. **Needed sources:** [S2][S3][S4][S7]
2. **Penalty phrasing precision:** Chart says “up to $5,000 for several violations”; verify exact statutory/administrative phrasing and whether per-violation or aggregate treatment is specified for each notice type. **Needed sources:** [S5]
3. **Lien-right consequence boundaries:** Verify the precise legal conditions under ORS 87.093 for lien-right loss vs. preservation and how this interacts with late-but-curative delivery scenarios. **Needed sources:** [S6]
4. **Version control check:** Confirm this chart edition (image footer appears as `E:RN-chart 6-10`) against latest posted CCB notice chart revision date. **Needed sources:** [S1]

## 5) Recommended teaching boundaries

- Teach this chart as a **high-level compliance summary**, not as a substitute for statutory text.
- For exam prep, emphasize:
  - notice names;
  - timing around contract date and the >$2,000 threshold;
  - proof-of-delivery retention;
  - broad consequence categories (civil penalty / lien-right risk).
- Avoid over-teaching procedural edge cases (e.g., exact cure windows, litigation sequencing nuance) until direct ORS/OAR text extraction is completed.

## 6) Citation map

- **[S1]** Source ID `ccb-required-notices-chart` (`src/content/metadata/sources/ccb-required-notices-chart.json`)
- **[S2]** Source ID `ors-701-330` (`src/content/metadata/sources/ors-701-330.json`)
- **[S3]** Source ID `oar-812-001-0200` (`src/content/metadata/sources/oar-812-001-0200.json`)
- **[S4]** Source ID `oar-812-012-0130` (`src/content/metadata/sources/oar-812-012-0130.json`)
- **[S5]** Source ID `ors-701-992` (`src/content/metadata/sources/ors-701-992.json`)
- **[S6]** Source ID `ors-chapter-87` (`src/content/metadata/sources/ors-chapter-87.json`)
- **[S7]** Source ID `ors-701-305` (`src/content/metadata/sources/ors-701-305.json`)

## 7) Confidence rating

- **Overall confidence:** **Medium-High** for chart-consistent statements; **Medium** for statute/rule precision until direct text extraction pass is completed.
- **Reason:** Source IDs are already registered as Tier 1 and claims are internally consistent with the provided chart, but this pass did not yet perform line-by-line quoting of ORS/OAR text.
