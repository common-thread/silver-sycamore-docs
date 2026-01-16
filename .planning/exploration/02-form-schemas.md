# Form Schema Analysis - Silver Sycamore Docs

**Generated:** 2026-01-13
**Total Forms:** 17 form documents across 6 categories

---

## Form Categories Summary

| Category | Count | Description |
|----------|-------|-------------|
| Booking | 3 | Client intake forms for weddings, corporate, showers |
| HR | 2 | Employee time-off and warning forms |
| Operations | 4 | Appointment and vendor coordination forms |
| Planning Checklist | 5 | Timeline-based planning checklists |
| Operations Checklist | 2 | Venue reset checklists |
| Day-Of | 1 | Music selection form |

**Status Breakdown:**
- Active: 2 forms (HR forms)
- Needs Redesign: 15 forms (paper-based, ready for digital conversion)

---

## Detailed Form Analysis

### 1. Booking Forms (3 files)

#### Wedding Booking Form
- **File:** `clients/booking/booking-form-wedding.md`
- **Fields:** Name, Address, Phone, Work Phone/Email, Ceremony, Guest Count, Ceremony Location, Coordinator, Additional Needs, Type of Event, Time, Reception Location, Vendor tracking (After Hours Rental, Caterer, Linens, etc.), Menu Tasting, Flowers/Florist, Anniversary Email, Payment tracking
- **Status:** needs_redesign

#### Corporate Booking Form
- **File:** `clients/booking/booking-form-corporate.md`
- **Fields:** Responsible Party, Company, Address, City, Cell Ph., Email, Payment tracking, Date of Event, Time, Type of Event, Guest Count, Deposit Paid, Event Location, Additional Comments
- **Status:** needs_redesign

#### Shower/Small Party Booking Form
- **File:** `clients/booking/booking-form-shower.md`
- **Fields:** Name of Responsible Party, Guest(s) of Honor, Address, City and Zip Code, Daytime Phone, Cell Phone, Email, Payment tracking, Date of Event, Time, Type of Party, Guest Count, Deposit Paid, Date, Event Location, Cake Info, Bar Info, Menu, Additional Comments
- **Status:** needs_redesign

---

### 2. HR Forms (2 schemas in 1 file)

#### Time-Off Request Form
- **File:** `staff/hr/hr-forms.md`
- **Fields:** Today's Date, Employee Name, Request Type (Days/Hours), Beginning On, Ending On, Reason (Vacation/Personal Leave/Funeral/Jury Duty/Family/Medical/Vote/Other), Employee Signature, Approval Status, Employer Signature
- **Status:** active

#### Employee Warning Form
- **File:** `staff/hr/hr-forms.md`
- **Fields:** Employee Name, Manager Name, Warning Date, Previous Discipline Date, Warning Reasons (multiselect), Warning Details, Corrective Action Required, Employee Signature, Supervisor Signature
- **Status:** active

---

### 3. Operations Forms (4 files)

#### Decor Appointment Form
- **File:** `operations/forms/decor-appointment.docx`
- **Fields:** Client Name, Event Date, Appointment Date, Decor Selections, Notes
- **Status:** needs_redesign

#### Final Appointment Form
- **File:** `operations/forms/final-appointment.docx`
- **Fields:** Client Name, Event Date, Appointment Date, Final Details, Vendor Confirmations, Notes
- **Status:** needs_redesign

#### Vendor Setup Form
- **File:** `operations/forms/vendor-setup.docx`
- **Fields:** Event Name, Event Date, Vendor Name, Vendor Type, Arrival Time, Setup Requirements, Notes
- **Status:** needs_redesign

#### Menu Tasting Form
- **File:** `operations/forms/tasting-form.pdf`
- **Fields:** Client Name, Event Date, Tasting Date, Guest Count, Menu Selections, Dietary Restrictions, Notes
- **Status:** needs_redesign

---

### 4. Planning Checklists (5 files)

| Form ID | Title | File |
|---------|-------|------|
| checklist-9-12-months | Planning Checklist: 9-12 Months Out | `clients/planning/checklist-9-12-months.docx` |
| checklist-7-8-months | Planning Checklist: 7-8 Months Out | `clients/planning/checklist-7-8-months.docx` |
| checklist-4-6-months | Planning Checklist: 4-6 Months Out | `clients/planning/checklist-4-6-months.docx` |
| checklist-1-3-months | Planning Checklist: 1-3 Months Out | `clients/planning/checklist-1-3-months.docx` |
| checklist-pre-wedding | Pre-Wedding To Do List | `clients/planning/pre-wedding-todo.docx` |

All planning checklists contain task items with checkbox fields. Status: needs_redesign

---

### 5. Operations Checklists (2 files)

| Form ID | Title | File |
|---------|-------|------|
| reset-checklist-hall | Hall Reset Checklist | `clients/layouts/hall/reset-checklist.docx` |
| reset-checklist-saloon | Saloon Reset Checklist | `clients/layouts/saloon/reset-checklist.docx` |

Post-event reset checklists for venue spaces. Status: needs_redesign

---

### 6. Day-Of Forms (1 file)

#### Music Selection Form
- **File:** `clients/day-of/music-list.docx`
- **Fields:** Client Name, Event Date, Ceremony Music, Reception Music, Do Not Play List, Special Requests
- **Status:** needs_redesign

---

## JSON Schema Definitions

```json
{
  "forms": [
    {
      "formId": "booking-wedding",
      "title": "Wedding Booking Form",
      "category": "booking",
      "fields": [
        { "name": "name", "type": "text", "required": true },
        { "name": "address", "type": "text", "required": true },
        { "name": "phone", "type": "tel", "required": true },
        { "name": "workPhoneEmail", "type": "text", "required": false },
        { "name": "ceremony", "type": "text", "required": false },
        { "name": "guestCount", "type": "number", "required": true },
        { "name": "ceremonyLocation", "type": "text", "required": false },
        { "name": "coordinator", "type": "text", "required": false },
        { "name": "additionalNeeds", "type": "textarea", "required": false },
        { "name": "eventType", "type": "text", "required": true },
        { "name": "eventTime", "type": "time", "required": true },
        { "name": "receptionLocation", "type": "text", "required": false },
        { "name": "afterHoursRental", "type": "text", "required": false },
        { "name": "caterer", "type": "text", "required": false },
        { "name": "linens", "type": "text", "required": false },
        { "name": "paymentDue", "type": "date", "required": false },
        { "name": "planningApptDate", "type": "date", "required": false },
        { "name": "decorApptDate", "type": "date", "required": false },
        { "name": "twoWeeksOutApptDate", "type": "date", "required": false },
        { "name": "damageDeposit", "type": "number", "required": false },
        { "name": "depositReturned", "type": "checkbox", "required": false },
        { "name": "menuTasting", "type": "text", "required": false },
        { "name": "flowersFlorist", "type": "text", "required": false },
        { "name": "anniversaryEmail", "type": "email", "required": false }
      ],
      "paymentTracking": {
        "type": "repeating",
        "fields": [
          { "name": "paymentDate", "type": "date" },
          { "name": "paymentBy", "type": "text" },
          { "name": "paymentAmount", "type": "number" }
        ]
      },
      "originalFile": "clients/booking/booking-form-wedding.md",
      "status": "needs_redesign"
    },
    {
      "formId": "booking-corporate",
      "title": "Corporate Event Booking Form",
      "category": "booking",
      "fields": [
        { "name": "responsibleParty", "type": "text", "required": true },
        { "name": "company", "type": "text", "required": true },
        { "name": "address", "type": "text", "required": true },
        { "name": "city", "type": "text", "required": true },
        { "name": "cellPhone", "type": "tel", "required": true },
        { "name": "email", "type": "email", "required": true },
        { "name": "dateOfEvent", "type": "date", "required": true },
        { "name": "eventTime", "type": "time", "required": true },
        { "name": "eventType", "type": "text", "required": true },
        { "name": "guestCount", "type": "number", "required": true },
        { "name": "depositPaid", "type": "number", "required": false },
        { "name": "eventLocation", "type": "text", "required": true },
        { "name": "additionalComments", "type": "textarea", "required": false }
      ],
      "paymentTracking": {
        "type": "repeating",
        "fields": [
          { "name": "paymentDate", "type": "date" },
          { "name": "paymentBy", "type": "text" },
          { "name": "paymentAmount", "type": "number" }
        ]
      },
      "originalFile": "clients/booking/booking-form-corporate.md",
      "status": "needs_redesign"
    },
    {
      "formId": "booking-shower",
      "title": "Shower/Small Party Booking Form",
      "category": "booking",
      "fields": [
        { "name": "responsiblePartyName", "type": "text", "required": true },
        { "name": "guestsOfHonor", "type": "text", "required": true },
        { "name": "address", "type": "text", "required": true },
        { "name": "cityAndZip", "type": "text", "required": true },
        { "name": "daytimePhone", "type": "tel", "required": false },
        { "name": "cellPhone", "type": "tel", "required": true },
        { "name": "email", "type": "email", "required": true },
        { "name": "dateOfEvent", "type": "date", "required": true },
        { "name": "eventTime", "type": "time", "required": true },
        { "name": "partyType", "type": "select", "required": true, "options": ["Baby Shower", "Bridal Shower", "Birthday Party", "Anniversary", "Other"] },
        { "name": "guestCount", "type": "number", "required": true },
        { "name": "depositPaid", "type": "number", "required": false },
        { "name": "depositDate", "type": "date", "required": false },
        { "name": "eventLocation", "type": "text", "required": true },
        { "name": "cakeInfo", "type": "textarea", "required": false },
        { "name": "barInfo", "type": "textarea", "required": false },
        { "name": "menu", "type": "textarea", "required": false },
        { "name": "additionalComments", "type": "textarea", "required": false }
      ],
      "paymentTracking": {
        "type": "repeating",
        "fields": [
          { "name": "paymentDate", "type": "date" },
          { "name": "paymentBy", "type": "text" },
          { "name": "paymentAmount", "type": "number" }
        ]
      },
      "originalFile": "clients/booking/booking-form-shower.md",
      "status": "needs_redesign"
    },
    {
      "formId": "hr-time-off-request",
      "title": "Employee Time-Off Request Form",
      "category": "hr",
      "fields": [
        { "name": "todaysDate", "type": "date", "required": true },
        { "name": "employeeName", "type": "text", "required": true },
        { "name": "requestType", "type": "select", "required": true, "options": ["Days", "Hours"] },
        { "name": "beginningOn", "type": "date", "required": true },
        { "name": "endingOn", "type": "date", "required": true },
        { "name": "reason", "type": "select", "required": true, "options": ["Vacation", "Personal Leave", "Funeral / Bereavement", "Jury Duty", "Family Reasons", "Medical Leave", "To Vote", "Other"] },
        { "name": "reasonOther", "type": "text", "required": false },
        { "name": "employeeSignature", "type": "signature", "required": true },
        { "name": "employeeSignatureDate", "type": "date", "required": true },
        { "name": "approvalStatus", "type": "select", "required": false, "options": ["Approved", "Rejected"] },
        { "name": "employerSignature", "type": "signature", "required": false },
        { "name": "employerSignatureDate", "type": "date", "required": false },
        { "name": "employerPrintName", "type": "text", "required": false }
      ],
      "originalFile": "staff/hr/hr-forms.md",
      "status": "active"
    },
    {
      "formId": "hr-employee-warning",
      "title": "Employee Warning Form",
      "category": "hr",
      "fields": [
        { "name": "employeeName", "type": "text", "required": true },
        { "name": "managerName", "type": "text", "required": true },
        { "name": "warningDate", "type": "date", "required": true },
        { "name": "previousDisciplineDate", "type": "date", "required": false },
        { "name": "warningReasons", "type": "multiselect", "required": true, "options": ["Absenteeism", "Failure to follow procedure", "Rudeness", "Tardiness", "Failure to meet performance", "Refusal to work overtime", "Policy violation", "Fighting", "Language", "Other"] },
        { "name": "warningReasonOther", "type": "text", "required": false },
        { "name": "warningDetails", "type": "textarea", "required": true },
        { "name": "correctiveActionRequired", "type": "textarea", "required": true },
        { "name": "employeeSignature", "type": "signature", "required": true },
        { "name": "employeePrintName", "type": "text", "required": true },
        { "name": "employeeSignatureDate", "type": "date", "required": true },
        { "name": "supervisorSignature", "type": "signature", "required": true },
        { "name": "supervisorPrintName", "type": "text", "required": true },
        { "name": "supervisorSignatureDate", "type": "date", "required": true }
      ],
      "originalFile": "staff/hr/hr-forms.md",
      "status": "active"
    },
    {
      "formId": "operations-decor-appointment",
      "title": "Decor Appointment Form",
      "category": "operations",
      "fields": [
        { "name": "clientName", "type": "text", "required": true },
        { "name": "eventDate", "type": "date", "required": true },
        { "name": "appointmentDate", "type": "date", "required": true },
        { "name": "decorSelections", "type": "textarea", "required": false },
        { "name": "notes", "type": "textarea", "required": false }
      ],
      "originalFile": "operations/forms/decor-appointment.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "operations-final-appointment",
      "title": "Final Appointment Form",
      "category": "operations",
      "fields": [
        { "name": "clientName", "type": "text", "required": true },
        { "name": "eventDate", "type": "date", "required": true },
        { "name": "appointmentDate", "type": "date", "required": true },
        { "name": "finalDetails", "type": "textarea", "required": false },
        { "name": "vendorConfirmations", "type": "textarea", "required": false },
        { "name": "notes", "type": "textarea", "required": false }
      ],
      "originalFile": "operations/forms/final-appointment.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "operations-vendor-setup",
      "title": "Vendor Setup Form",
      "category": "operations",
      "fields": [
        { "name": "eventName", "type": "text", "required": true },
        { "name": "eventDate", "type": "date", "required": true },
        { "name": "vendorName", "type": "text", "required": true },
        { "name": "vendorType", "type": "text", "required": true },
        { "name": "arrivalTime", "type": "time", "required": true },
        { "name": "setupRequirements", "type": "textarea", "required": false },
        { "name": "notes", "type": "textarea", "required": false }
      ],
      "originalFile": "operations/forms/vendor-setup.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "operations-tasting",
      "title": "Menu Tasting Form",
      "category": "operations",
      "fields": [
        { "name": "clientName", "type": "text", "required": true },
        { "name": "eventDate", "type": "date", "required": true },
        { "name": "tastingDate", "type": "date", "required": true },
        { "name": "guestCount", "type": "number", "required": true },
        { "name": "menuSelections", "type": "textarea", "required": false },
        { "name": "dietaryRestrictions", "type": "textarea", "required": false },
        { "name": "notes", "type": "textarea", "required": false }
      ],
      "originalFile": "operations/forms/tasting-form.pdf",
      "status": "needs_redesign"
    },
    {
      "formId": "checklist-9-12-months",
      "title": "Planning Checklist: 9-12 Months Out",
      "category": "planning-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/planning/checklist-9-12-months.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "checklist-7-8-months",
      "title": "Planning Checklist: 7-8 Months Out",
      "category": "planning-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/planning/checklist-7-8-months.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "checklist-4-6-months",
      "title": "Planning Checklist: 4-6 Months Out",
      "category": "planning-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/planning/checklist-4-6-months.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "checklist-1-3-months",
      "title": "Planning Checklist: 1-3 Months Out",
      "category": "planning-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/planning/checklist-1-3-months.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "checklist-pre-wedding",
      "title": "Pre-Wedding To Do List",
      "category": "planning-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/planning/pre-wedding-todo.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "reset-checklist-hall",
      "title": "Hall Reset Checklist",
      "category": "operations-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/layouts/hall/reset-checklist.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "reset-checklist-saloon",
      "title": "Saloon Reset Checklist",
      "category": "operations-checklist",
      "fields": [{ "name": "tasks", "type": "checklist", "required": false }],
      "originalFile": "clients/layouts/saloon/reset-checklist.docx",
      "status": "needs_redesign"
    },
    {
      "formId": "day-of-music-list",
      "title": "Music Selection Form",
      "category": "day-of",
      "fields": [
        { "name": "clientName", "type": "text", "required": true },
        { "name": "eventDate", "type": "date", "required": true },
        { "name": "ceremonyMusic", "type": "textarea", "required": false },
        { "name": "receptionMusic", "type": "textarea", "required": false },
        { "name": "doNotPlayList", "type": "textarea", "required": false },
        { "name": "specialRequests", "type": "textarea", "required": false }
      ],
      "originalFile": "clients/day-of/music-list.docx",
      "status": "needs_redesign"
    }
  ],
  "summary": {
    "totalForms": 17,
    "categories": {
      "booking": 3,
      "hr": 2,
      "operations": 4,
      "planning-checklist": 5,
      "operations-checklist": 2,
      "day-of": 1
    },
    "statusBreakdown": {
      "active": 2,
      "needs_redesign": 15
    }
  }
}
```

---

## Recommendations for Digital Forms

1. **High Priority - Booking Forms:** Convert to interactive web forms with real-time validation
2. **Payment Tracking:** Implement repeating field groups for payment history
3. **Checklists:** Convert to dynamic task lists with completion tracking
4. **HR Forms:** Add digital signature support and workflow approval
5. **Operations Forms:** Link to event records for automated pre-population
