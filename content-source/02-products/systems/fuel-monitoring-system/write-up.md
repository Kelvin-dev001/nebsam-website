# NEBSAM FUEL MONITORING SYSTEM

## THE HARDWARE THAT MEASURES WHAT IS IN THE TANK AND WHAT THE ENGINE BURNED

**A fuel monitoring installation combining an IoT fuel level sensor, a DFM fuel flow meter, an in-vehicle IoT gateway and a cloud dashboard, with a GPS layer that records where every refuelling and draining event happened.**

This is the hardware page. It documents the components, what each one measures, and what fitting one involves. The operational case for fuel monitoring — the reports, the alerts, the business argument — is on the **Fuel Monitoring** solution page.

### MEASURE THE FUEL. LOCATE THE EVENT. PROVE WHAT HAPPENED.

---

# LEVEL AND FLOW MEASURE DIFFERENT THINGS

This distinction is the reason the system has two sensing components, and it is worth stating plainly on the public page because most competitors sell only one.

| | Fuel level sensor | DFM fuel flow meter |
|---|---|---|
| Measures | How much fuel is in the tank | How much fuel the engine actually consumed |
| Answers | "Did fuel leave the tank?" | "Did the engine burn it?" |
| Detects | Fill-ups and draining events, continuously | Real consumption against work done |

A level sensor alone tells you fuel left the tank. A flow meter alone tells you what the engine burned. Together they tell you whether the difference between the two is theft.

---

# COMPONENTS

## 01. FUEL LEVEL SENSOR

An IoT-based sensor that automatically recognises the fuel level in the tank. It measures fuel volume precisely and detects tank fill-up and draining volumes **continuously**, which is what makes a siphoning event visible as a discrete event rather than as an unexplained gap between two readings.

`[[NEEDS_VERIFICATION: fuel level sensor model, measurement method, accuracy tolerance and calibration interval]]`

## 02. DFM FUEL FLOW METER

Measures fuel consumed by the engine.

`[[NEEDS_VERIFICATION: DFM flow meter model, flow range, accuracy, and whether it is standard or optional]]`

## 03. IoT GATEWAY

Fitted to the vehicle. Collects data from the sensors and transmits it to the cloud server.

`[[NEEDS_VERIFICATION: IoT gateway model, cellular connectivity, power supply and backup battery]]`

## 04. GPS TRACKER

Locates the vehicle in real time and records the location of refuelling and draining events.

`[[NEEDS_VERIFICATION: which Nebsam tracker is supplied with the fuel monitoring system]]`

## 05. CLOUD SERVER AND KPI DASHBOARD

Receives data through the gateway and presents it in a dashboard with fuel filling and possible theft events, each carrying date, time, location with map markers, initial and final fuel levels, and volume.

---

# DOCUMENTED SPECIFICATIONS

The supplied proposal is a commercial document and states **no component-level specifications**. Every field below is unresolved.

| Specification | Value |
|---|---|
| Fuel level sensor model | Not stated in source — `[[NEEDS_VERIFICATION: fuel level sensor model]]` |
| Measurement accuracy | Not stated in source — `[[NEEDS_VERIFICATION: accuracy tolerance, as a percentage]]` |
| Sensor length / tank depth range | Not stated in source — `[[NEEDS_VERIFICATION: supported tank depths]]` |
| Supported tank types | Not stated in source — `[[NEEDS_VERIFICATION: supported tank shapes and vehicle types]]` |
| DFM flow meter model | Not stated in source — `[[NEEDS_VERIFICATION: DFM model and flow range]]` |
| IoT gateway model | Not stated in source — `[[NEEDS_VERIFICATION: gateway model]]` |
| Connectivity | Not stated in source — `[[NEEDS_VERIFICATION: cellular generation and bands]]` |
| Operating voltage | Not stated in source — `[[NEEDS_VERIFICATION: supply voltage, 12V / 24V]]` |
| IP rating | Not stated in source — `[[NEEDS_VERIFICATION: ingress protection rating for sensor and gateway]]` |
| Operating temperature | Not stated in source — `[[NEEDS_VERIFICATION: operating temperature range]]` |
| Reporting interval | Described as continuous — `[[NEEDS_VERIFICATION: actual sampling and transmission interval]]` |
| Calibration | Not stated in source — `[[NEEDS_VERIFICATION: calibration procedure, who performs it, and interval]]` |

---

# WHAT INSTALLATION INVOLVES

Fitting this system is materially more involved than fitting a tracker, and the page should say so rather than let a buyer discover it.

A fuel level sensor is fitted to the vehicle's tank and calibrated against that tank's shape. A flow meter is fitted into the fuel line. Both are physical interventions in the fuel system of a working vehicle.

`[[NEEDS_VERIFICATION: installation duration, vehicle downtime, whether calibration requires draining the tank, and warranty implications for the vehicle]]`

---

# PRICING AND COST OF OWNERSHIP

| | |
|---|---|
| Price | **Request price** |

No price for the fuel monitoring system appears in any supplied document.

The cloud dashboard implies a recurring platform cost, and SMS alert delivery may carry a per-message cost. Neither is stated — `[[NEEDS_VERIFICATION: recurring platform subscription and SMS costs]]`

Installation is a significant component of the total cost here and must be quoted explicitly — `[[NEEDS_VERIFICATION: installation and calibration cost per vehicle]]`

---

# IDEAL FOR

* Long-haul and regional trucking fleets
* Fuel and hazardous goods transport
* Construction plant and heavy equipment
* Generators and static tanks
* Agriculture and plantation fleets
* Any operation where fuel is a large and unexplained share of operating cost

---

# RELATED

* Solutions → Fuel Monitoring (the operational case, reports and alerts)
* Solutions → Fleet Management, Vehicle Tracking
* Products → the GPS tracker supplied alongside the system
* Industries → Logistics & Transport, Fuel & Hazardous Transport, Construction & Heavy Equipment, Agriculture

### NEBSAM DIGITAL SOLUTIONS (K) LTD

**Vehicle Telematics | Fleet Management | Fuel Monitoring | Vehicle Security**

# WE ARE THE SOLUTION.

---
---

# SOURCE NOTES — NOT FOR PUBLICATION

*Extracted from `_inbox/FUEL MONITORING SOLUTION PROPOSAL.pdf` (9 pages, dated 2023). This block is for the project team and must be deleted before the content is published. Claude Code: read this section, act on it, do not render it.*

## Why this page exists separately from the solution page

`content-source/README.md` records the Fuel Monitoring System as a hardware page "distinct from the fuel monitoring solution page". The split follows the pattern used elsewhere in the taxonomy: the **solution** page sells the outcome and carries the reports, alerts and business case; the **product** page documents the hardware and carries the specification, installation and price.

The two must not duplicate each other's content, or they will compete for the same search intent — the keyword-cannibalisation trap brief PART 8 describes for products and shop pages.

## The claim that must not be carried over

The proposal states that fleet owners "are usually able to decrease fuel thefts in their fleets by **90%**". Unpublishable vendor claim, brief section 4.2 item 4, logged as **C01** in `docs/CONTENT_AUDIT.md`. Absent from this file and not hedged into a softer form.

## Hardware naming — a provenance discrepancy

The proposal never uses the terms "fuel level sensor" or "DFM fuel flow meter". Its own words are *"IoT-based sensors attached to the tanker's surface"*, plus an IoT gateway, a cloud server and a GPS tracker.

The component names on this page come from brief PART 4.3 and `content-source/README.md`. The discrepancy is logged as **C02** in `docs/CONTENT_AUDIT.md`, and the proposal's odd phrase "attached to the tanker's surface" as **C03** — surface attachment is an unusual description for fuel level measurement, which is normally in-tank.

`[[NEEDS_VERIFICATION: confirm the actual bill of materials before any installation copy is written]]`

## The specification gap

**The proposal contains no component-level specifications at all** — no model numbers, no accuracy tolerance, no tank compatibility, no voltage, no IP rating, no operating temperature. Twelve specification fields are open.

The most commercially important is **accuracy**. The proposal says volume is measured "precisely" with no tolerance figure. A fleet manager evaluating fuel monitoring asks for a percentage before anything else, because the entire value of the system rests on whether the measured difference is real. This page should not be published without it.

## Hazards in the source document

- **Unpublished phone number +254 727 727 461 appears twice** in the proposal. Never publish (brief PART 1.5 #8). Not carried into this file. Redact before the proposal is offered as a download. Item C04.
- **Retired addresses** "Kenyatta Ave Near Saba Saba" and "Mombasa Along Kenyatta Avenue". Canonical Mombasa address is Makupa Roundabout, next to Mass Petrol Station. Not carried into this file. Item C05.
- **Third-party platform branding** in the dashboard screenshots — not usable as "the Nebsam platform". Register item V13, audit item C08.
- **Dated 2023** — brief 4.2 item 5. Item C06.
- PDF metadata Title "Copy of Blue and Purple Casual Corporate App Development Startup Marketing Proposal", Author "trapp lord". Strip before publication. Item C09.

## Cross-links this page must carry

- Solutions → Fuel Monitoring — reciprocal link, and the two pages must be clearly differentiated in their titles and meta descriptions so they do not compete
- Products → the GPS tracker supplied with the system, once identified
- Industries → Logistics & Transport, Fuel & Hazardous Transport, Construction & Heavy Equipment, Agriculture
