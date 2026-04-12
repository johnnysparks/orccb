# Oregon CCB Exam Curriculum Map (PSI Outline Aligned)

Curriculum map for a **free course site** based on the public PSI Oregon Construction Contractors exam content outline (80 scored items).

## Source snapshot used

- Public bulletin version with Oregon Construction Contractors outline showing 14 subject areas and item counts (total 80 scored items, 70% to pass, 180 minutes).
- Working assumption: item count is the best available proxy for relative exam weight.

## 1) Curriculum table

| Module | PSI exam category | Items | Approx. weight | Suggested lesson order (inside module) | Estimated learner effort | High-weight deep coverage? | Oregon-specific validation beyond PSI outline? |
|---|---|---:|---:|---|---|---|---|
| M1 | Oregon Const. Contractor Laws and Regulations | 18 | 22.5% | (1) License law scope (2) CCB roles/powers (3) Violations & penalties (4) Consumer protection workflows (5) Exam-style scenarios | 3.5-4.5 hrs | **Yes (Tier 1)** | **Yes** - statute/rule details and penalty thresholds must be validated against current ORS/OAR + CCB publications |
| M2 | Contracts | 9 | 11.25% | (1) Contract formation (2) Required terms/disclosures (3) Change orders (4) Breach/remedies (5) Dispute examples | 2.0-2.5 hrs | **Yes (Tier 1)** | **Yes** - required Oregon notices/clauses and current consumer-protection language need primary-source checks |
| M3 | Hiring and Managing Employees | 7 | 8.75% | (1) Worker classification (2) Wage/hour basics (3) Payroll records (4) Safety responsibilities (5) Hiring compliance checklist | 1.75-2.25 hrs | **Yes (Tier 1)** | **Yes** - OR labor, BOLI, and workers' comp rules can change and need source verification |
| M4 | Bidding and Estimating | 6 | 7.5% | (1) Quantity takeoff basics (2) Direct vs indirect cost (3) Markup/profit (4) Contingency (5) Bid risk controls | 1.5-2.0 hrs | **Watchlist** | Maybe - methods are general, but public/private bid-rule examples should be checked for Oregon context |
| M5 | Oregon Lien Law | 5 | 6.25% | (1) Lien purpose/eligibility (2) Preliminary notice concepts (3) Filing timelines (4) Foreclosure basics (5) Priority examples | 1.5-2.0 hrs | **Watchlist** | **Yes** - deadlines, service rules, and owner notice requirements require strict Oregon legal validation |
| M6 | Scheduling and Project Management | 5 | 6.25% | (1) Work breakdown sequencing (2) Critical path basics (3) Delay management (4) Documentation controls | 1.25-1.75 hrs | No | Maybe - mostly universal PM; only local permitting/scheduling assumptions need OR checks |
| M7 | Choosing Your Business Structure | 4 | 5.0% | (1) Entity options (2) Liability/tax tradeoffs (3) Registration steps (4) Practical selection matrix | 1.0-1.5 hrs | No | **Yes** - Oregon filing/licensing/tax touchpoints need current agency references |
| M8 | Oregon Building Codes | 4 | 5.0% | (1) Code system orientation (2) Permit triggers (3) Inspection flow (4) Common code-miss examples | 1.0-1.5 hrs | No | **Yes** - code cycles and local amendments must be validated against current Oregon code resources |
| M9 | Jobsite Safety | 4 | 5.0% | (1) Hazard identification (2) PPE/fall protection fundamentals (3) Documentation/reporting (4) Safety culture practices | 1.0-1.5 hrs | No | **Yes** - Oregon OSHA requirements must be checked; federal-only framing is insufficient |
| M10 | Environmental Factors | 4 | 5.0% | (1) Site/environmental risk scan (2) Erosion/stormwater basics (3) Hazardous material awareness (4) Compliance checkpoints | 1.0-1.5 hrs | No | **Yes** - DEQ/state-local permit and disposal rules require Oregon-source verification |
| M11 | Building Exterior Shell | 4 | 5.0% | (1) Envelope purpose/performance (2) Water management (3) Flashing basics (4) Failure case studies | 1.0-1.5 hrs | No | Maybe - technical principles are general; Oregon climate/code details should be verified |
| M12 | Financial Management | 4 | 5.0% | (1) Job costing (2) Cash flow (3) Financial statements (4) Control metrics | 1.0-1.5 hrs | No | Maybe - accounting principles are general; Oregon contractor-facing compliance examples should be checked |
| M13 | Tax Basics | 4 | 5.0% | (1) Tax entity implications (2) Payroll tax basics (3) Estimated taxes (4) Recordkeeping checklist | 1.0-1.5 hrs | No | **Yes** - tax rates/thresholds/forms are time-sensitive and must be validated to Oregon/federal current guidance |
| M14 | Working with Subcontractors | 2 | 2.5% | (1) Scope packaging (2) Bid leveling (3) Subcontract terms (4) Performance monitoring | 0.75-1.0 hr | No | **Yes** - Oregon licensing/insurance requirements for subs should be validated |

**Estimated total learner effort:** ~20-27 hours (introductory + exam-prep depth for a free course format).

---

## 2) Recommended module order (build/learning sequence)

1. M1 - Oregon Const. Contractor Laws and Regulations  
2. M2 - Contracts  
3. M3 - Hiring and Managing Employees  
4. M5 - Oregon Lien Law  
5. M4 - Bidding and Estimating  
6. M6 - Scheduling and Project Management  
7. M14 - Working with Subcontractors  
8. M7 - Choosing Your Business Structure  
9. M12 - Financial Management  
10. M13 - Tax Basics  
11. M8 - Oregon Building Codes  
12. M9 - Jobsite Safety  
13. M10 - Environmental Factors  
14. M11 - Building Exterior Shell

---

## 3) Rationale for this order

- **Weight-first start**: Launch with the three largest categories (M1, M2, M3) to maximize score impact early.
- **Legal dependency chain**: Lien law follows contracts because lien rights/remedies are easier to understand after contract obligations.
- **Project-flow middle block**: Bidding -> scheduling -> subcontractor coordination mirrors real project execution.
- **Business operations block**: Entity choice, finance, and tax are grouped to reinforce business-system thinking.
- **Technical-compliance finish**: Codes, safety, environmental, and exterior shell close out with applied field examples and checklists.

---

## 4) Module metadata fields (for CMS/LMS)

Use these fields per module:

- `module_id` (e.g., `M1`)
- `module_title`
- `psi_category_name`
- `psi_items`
- `weight_percent`
- `sequence_order`
- `estimated_effort_hours_min`
- `estimated_effort_hours_max`
- `deep_coverage_tier` (`tier_1`, `watchlist`, `standard`)
- `oregon_validation_required` (boolean)
- `oregon_validation_sources` (array: `CCB`, `ORS`, `OAR`, `BOLI`, `Oregon OSHA`, `DCBS`, `DEQ`, `DOR`, etc.)
- `learning_objectives` (array)
- `lesson_outline` (ordered array)
- `practice_question_target`
- `downloadables` (checklists/templates)
- `last_source_reviewed_on`
- `next_validation_due_on`
- `owner`
- `status` (`planned`, `draft`, `review`, `published`)

---

## 5) Recommendation: 3 modules to build first

1. **M1 - Oregon Const. Contractor Laws and Regulations**  
   Highest relative weight and central to most exam scenarios.

2. **M2 - Contracts**  
   High-weight and tightly connected to risk reduction in real contractor operations.

3. **M3 - Hiring and Managing Employees**  
   Strong exam weight plus frequent compliance pitfalls; high learner value.

These three modules represent **34 of 80 scored items (42.5%)**, giving maximum early ROI for a free launch.

---

## Validation priority queue (outside PSI outline)

**Validate first:** M1, M5, M2, M3, M13, M8, M9, M10.  
These modules depend heavily on Oregon statutes/rules/agencies that may change and should be rechecked on a scheduled cadence.
