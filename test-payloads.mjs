// Test all upload API preset payloads against UAT endpoint
// Using fixed token: 00000:{F5168AEE-5F6E-4479-8514-988FBB167155}

const TOKEN = '00000:{F5168AEE-5F6E-4479-8514-988FBB167155}'
const BASE = 'https://203.150.143.180'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const managingOrganization = {
  type: "Organization",
  identifier: { use: "official", system: "https://bps.moph.go.th/hcode/5", value: "00000" },
  display: "โรงพยาบาลทดสอบระบบ"
}

const patientBlock = {
  identifier: [{ use: "official", system: "https://www.dopa.go.th", type: "CID", value: "0000000000001" }],
  active: true,
  name: [{ use: "official", text: "นายทดสอบ ระบบ", languageCode: "TH", family: "ระบบ", given: ["ทดสอบ"], prefix: ["นาย"], suffix: [] }],
  gender: "male",
  birthDate: "1990-01-01",
  deceasedBoolean: false,
  maritalStatus: { text: "โสด", coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus", code: "S", display: "Never Married" }] },
  address: [{ use: "home", type: "both", text: "ที่อยู่", line: ["บ้านเลขที่ 123", "หมู่ 1", "ถนน ทดสอบ"], city: "เมืองนนทบุรี", district: "บางกระสอ", state: "นนทบุรี", postalCode: "11000", country: "TH", period: { start: "1990-01-01T00:00:00Z" }, address_code: 120102 }],
  telecom: [{ system: "phone", value: "0888888888", use: "mobile" }],
  nationality: { text: "ไทย", coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=nationality", code: "099", display: "ไทย" }] }
}

const uploadEndpoints = [
  {
    name: "UpdatePHRv1",
    path: "/api/UpdatePHRv1",
    payload: {
      managingOrganization: { ...managingOrganization, agent: "HIS Test v1.0" },
      Patient: {
        ...patientBlock,
        maritalStatus: { text: "โสด", coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus", code: "S", display: "Never Married" }] }
      },
      AllergyIntolerance: [],
      CarePlan: [],
      Encounter: [{
        managingOrganization: { ...managingOrganization },
        identifier: [{ use: "official", system: "https://bps.moph.go.th/vn", type: "VN", value: "VN00001" }],
        status: "finished",
        class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB", display: "ambulatory" },
        type: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=encounter_type", code: "1", display: "มาเอง (ห้องบัตร)" }], text: "มาเอง (ห้องบัตร)" },
        priority: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ActPriority", code: "0", display: "ปกติ" }], text: "ปกติ" },
        period: { start: "2024-01-15T08:30:00.000Z", end: "2024-01-15T12:00:00.000Z" },
        subject: { reference: "Patient/0000000000001", display: "นายทดสอบ ระบบ" },
        participant: [],
        reason: ["ตรวจสุขภาพทั่วไป"],
        Coverage: [{ class_group: { value: "UCS", name: "สิทธิหลักประกันสุขภาพแห่งชาติ" } }],
        vital_signs: { body_weight_kg: 65, body_height_cm: 170, body_temp_cel: 36.5, bp_systolic_mmhg: 120, bp_diastolic_mmhg: 80, body_mass_index: 22.5, respiratory_rate: 18, pulse: 72 },
        Observation: [{ status: "final", issued: "2024-01-15T09:00:00.000Z", code: { coding: [{ system: "http://loinc.org", code: "2345-7", display: "Glucose" }], text: "Glucose" }, valueQuantity: { value: 100, unit: "mg/dL" }, effectiveDateTime: "2024-01-15T09:00:00.000Z" }],
        Condition: [{ clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active", display: "Active" }] }, verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed", display: "Confirmed" }] }, category: [{ coding: [{ system: "http://snomed.info/sct", code: "439401001", display: "Diagnosis" }] }], severity: { coding: [{ system: "http://snomed.info/sct", code: "24484000", display: "Severe" }] }, code: { coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: "E119", display: "Type 2 diabetes mellitus without complications" }] } }],
        Medication: [{ code: { coding: [{ system: "https://www.this.or.th/tmt/gp", code: "811043", display: "METFORMIN 500 mg." }], text: "METFORMIN 500 mg." }, statement: { status: "active", category: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/medication-statement-category", code: "outpatient", display: "Outpatient" }] }, effectiveDateTime: "2024-01-15T08:30:00.000Z", dosage: [{ sequence: 1, text: "รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง หลังอาหาร", patientInstruction: "รับประทานหลังอาหาร เช้า-เย็น", timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } } }] }, category: "medication" }],
        Claim: [], Appointment: [], Immunization: [], DiagnosticReport: []
      }]
    }
  },
  {
    name: "AllergyIntolerancev1",
    path: "/api/AllergyIntolerancev1",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      AllergyIntolerance: [{
        managingOrganization: { ...managingOrganization },
        identifier: [{ system: "http://acme.com/ids/patients/risks", value: "49476535" }],
        clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: "active", display: "Active" }] },
        verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", code: "confirmed", display: "Confirmed" }] },
        type: "allergy", category: ["medication"], criticality: "high",
        code: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=tmt_substance", code: "579224", display: "PENICILLIN G SODIUM" }] },
        recordedDate: "2024-01-15T10:00:00+07:00",
        recordOfficer: { reference: "Practitioner/ว000099", identifier: "ว000099", display: "นพ.ทดสอบ ระบบ" },
        reaction: [{ manifestation: [{ coding: [{ system: "http://snomed.info/sct", code: "247472004", display: "Hives" }] }] }]
      }]
    }
  },
  {
    name: "PatientChronicRegisterv1",
    path: "/api/PatientChronicRegisterv1",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      ChronicDiseaseRegister: [{
        managingOrganization: { ...managingOrganization },
        code: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=chronic_disease", code: "001", display: "DM" }] },
        clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active", display: "Active" }] },
        registerDate: "2024-01-15",
        chronic_ref_code: "00000:CHR00001",
        clinicalText: "NIDDM Type 2",
        description: ["โรคเบาหวานชนิดที่ 2"]
      }]
    }
  },
  {
    name: "ImmunizationRegisterv1",
    path: "/api/ImmunizationRegisterv1",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      Immunization: [{
        managingOrganization: { ...managingOrganization },
        status: "completed",
        vaccineCode: { coding: [{ system: "https://refcode.moph.go.th/vaccine", code: "C19", display: "COVID1" }], text: "Covid 19 - CoronaVac" },
        doseQuantity: { value: 0.5, system: "http://unitsofmeasure.org", code: "mL" },
        note: [{ text: "Notes on administration of vaccine" }],
        reasonCode: [{ coding: [{ system: "http://snomed.info/sct", code: "429060002" }] }],
        performer: { license_no: "ว000099", name: "นพ.ทดสอบ ระบบ" },
        encounterRefCode: "00000:VN00001",
        occurrenceDateTime: "2024-01-15T10:00:00+07:00",
        primarySource: true,
        location: "โรงพยาบาลทดสอบระบบ",
        manufacturer: "Sinovac Life Sciences",
        lotNumber: "BATCH001",
        expirationDate: "2025-12-31",
        site: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ActSite", code: "LA", display: "Left Arm" }] },
        route: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration", code: "IM", display: "Injection, intramuscular" }] }
      }]
    }
  },
  {
    name: "ReferralRequest",
    path: "/api/ReferralRequest",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      ReferralRequest: [{
        managingOrganization: { ...managingOrganization },
        recipientOrganization: { type: "Organization", identifier: { use: "official", system: "https://bps.moph.go.th/hcode/5", value: "11111" }, display: "โรงพยาบาลปลายทาง" },
        encounterRefCode: "00000:VN00001", referralRefCode: "00000:REF00001",
        status: "active",
        intent: "proposal",
        type: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=referral_type", code: "1", display: "ส่งต่อเพื่อรักษา" }], text: "ส่งต่อเพื่อรักษา" },
        priority: "routine",
        occurrenceDateTime: "2024-01-15T10:00:00.000Z",
        authoredOn: "2024-01-15",
        requester: { agent: { reference: "Practitioner/ว000099", display: "นพ.ทดสอบ ระบบ" } },
        serviceRequested: { coding: [{ system: "http://snomed.info/sct", code: "172676009", display: "Myringotomy and insertion of tympanic ventilation tube" }], text: "Insertion of grommets" },
        context: { display: "ผู้ป่วยนอก" },
        specialty: { coding: [{ system: "http://orionhealth.com/fhir/apps/specialties", code: "ent", display: "ENT" }], text: "แผนกอายุรกรรม" },
        description: "", note: ""
      }]
    }
  },
  {
    name: "SelfObservation",
    path: "/api/SelfObservation",
    payload: {
      system_name: "Application Test v1.0",
      location_gis: { latitude: "13.756331", longitude: "100.501765" },
      observation_ref_code: "{00000-OBS00-00001-TEST-00001}",
      person: { cid: "0000000000001", prefix: "นาย", first_name: "ทดสอบ", last_name: "ระบบ", birth_date: "1990-01-01", gender: "M" },
      observation: {
        reference_id: "{00000-REF00-00001-TEST-00001}",
        loinc_code: "15074-8",
        loinc_display: "Glucose [Moles/volume] in Blood",
        effective_datetime: "2024-01-15T08:00:00.000",
        device_display: "Blood Glucose Monitor : 123456",
        performer_display: "นายทดสอบ ระบบ",
        observation_value: "155",
        observation_unit: "mg/dL"
      }
    }
  },
  {
    name: "CareGiver",
    path: "/api/CareGiver",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      CareGiver: [{
        identifier: [{ use: "official", system: "https://www.dopa.go.th", type: "CID", value: "0000000000001" }],
        active: true, intent: "directive",
        name: { use: "official", languageCode: "TH", text: "นางสาวดูแล ผู้ป่วย", prefix: ["นางสาว"], given: ["ดูแล"], family: "ผู้ป่วย", suffix: [""] },
        care_giver_name: { use: "official", languageCode: "TH", text: "นายทดสอบ ระบบ", prefix: ["นาย"], given: ["ทดสอบ"], family: "ระบบ", suffix: [""] },
        telecom_phone: "0999999999",
        qualification: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=caregiver_type", code: "1", display: "บุคคลในครอบครัวเดียวกัน" }] }
      }]
    }
  },
  {
    name: "MedicationRequest",
    path: "/api/MedicationRequest",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      MedicationRequest: [{
        identifier: [{ use: "official", system: "https://phr1.moph.go.th/eprescription", value: "00000:MED00001" }],
        status: "active", intent: "order",
        medication: { coding: [{ system: "https://www.this.or.th/tmt/gp", code: "811043", display: "METFORMIN 500 mg." }] },
        encounter_ref_code: "00000:VN00001",
        authoredOn: "2024-01-15T10:00:00+07:00",
        requester: { reference: "Practitioner/ว000099", display: "นพ.ทดสอบ ระบบ" },
        dosageInstruction: [{ text: "รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง หลังอาหาร", timing: { repeat: { frequency: 2, period: 1, periodUnit: "d" } }, route: { coding: [{ system: "http://snomed.info/sct", code: "26643006", display: "Oral route" }] } }],
        dispenseRequest: { quantity: { value: 60, unit: "tablets" }, expectedSupplyDuration: { value: 30, unit: "days" } }
      }]
    }
  },
  {
    name: "OrgEncounterSummary",
    path: "/api/OrgEncounterSummary",
    payload: {
      managingOrganization: { ...managingOrganization },
      EncounterSummary: [{ period_start: "2024-01-01", period_end: "2024-01-31", opd_count: 150, ipd_count: 25 }]
    }
  },
  {
    name: "DrugRelatedProblem",
    path: "/api/DrugRelatedProblem",
    payload: {
      managingOrganization: { ...managingOrganization },
      Patient: { ...patientBlock },
      DrugRelatedProblem: [{
        drp_ref_code: "00000:DRP00001",
        medication: { coding: [{ system: "https://www.this.or.th/tmt/gp", code: "811043", display: "METFORMIN 500 mg." }] },
        category: { coding: [{ system: "https://phr1.moph.go.th/api/CodingSystem?System=drp_category", code: "1", display: "Drug Interaction" }] },
        description: "พบปฏิกิริยาระหว่างยา",
        recordedDate: "2024-01-15T10:00:00+07:00"
      }]
    }
  }
]

console.log('=== Testing Upload API Payloads against UAT ===\n')

let passed = 0
let failed = 0

for (const ep of uploadEndpoints) {
  try {
    const res = await fetch(BASE + ep.path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      },
      body: JSON.stringify(ep.payload)
    })

    let body
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('json')) {
      body = await res.json()
    } else {
      body = await res.text()
    }

    const ok = res.status >= 200 && res.status < 300
    const icon = ok ? 'PASS' : 'FAIL'
    console.log(icon + ' [' + res.status + '] ' + ep.name + ' (' + ep.path + ')')
    console.log('     Response: ' + JSON.stringify(body).substring(0, 300))
    console.log()

    if (ok) passed++
    else failed++
  } catch (err) {
    console.log('ERR  ' + ep.name + ' (' + ep.path + ')')
    console.log('     Error: ' + err.message)
    console.log()
    failed++
  }
}

console.log('=== Results: ' + passed + ' passed, ' + failed + ' failed out of ' + uploadEndpoints.length + ' ===')
