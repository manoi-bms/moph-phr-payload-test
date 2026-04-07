const managingOrganization = {
  type: "Organization",
  identifier: {
    use: "official",
    system: "https://bps.moph.go.th/hcode/5",
    value: "00000"
  },
  display: "โรงพยาบาลทดสอบระบบ"
}

const patientBlock = {
  identifier: [
    {
      use: "official",
      system: "https://www.dopa.go.th",
      type: "CID",
      value: "0000000000001"
    }
  ],
  active: true,
  name: [
    {
      use: "official",
      text: "นายทดสอบ ระบบ",
      languageCode: "TH",
      family: "ระบบ",
      given: ["ทดสอบ"],
      prefix: ["นาย"],
      suffix: []
    }
  ],
  gender: "male",
  birthDate: "1990-01-01",
  deceasedBoolean: false,
  maritalStatus: {
    text: "โสด",
    coding: [
      {
        system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
        code: "S",
        display: "Never Married"
      }
    ]
  },
  address: [
    {
      use: "home",
      type: "both",
      text: "ที่อยู่",
      line: [
        "บ้านเลขที่ 123",
        "หมู่ 1",
        "ถนน ทดสอบ"
      ],
      city: "เมืองนนทบุรี",
      district: "บางกระสอ",
      state: "นนทบุรี",
      postalCode: "11000",
      country: "TH",
      period: {
        start: "1990-01-01T00:00:00Z"
      },
      address_code: 120102
    }
  ],
  telecom: [
    {
      system: "phone",
      value: "0888888888",
      use: "mobile"
    }
  ],
  nationality: {
    text: "ไทย",
    coding: [
      {
        system: "https://phr1.moph.go.th/api/CodingSystem?System=nationality",
        code: "099",
        display: "ไทย"
      }
    ]
  }
}

const retrievalTemplate = {
  cid: "0000000000001",
  otp: "AA999999"
}

export const templates = {
  // ===== Upload APIs =====
  "update-phr-v1": {
    managingOrganization: {
      ...managingOrganization,
      agent: "HIS Test v1.0"
    },
    Patient: {
      ...patientBlock,
      maritalStatus: {
        text: "โสด",
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
            code: "S",
            display: "Never Married"
          }
        ]
      }
    },
    AllergyIntolerance: [],
    CarePlan: [],
    Encounter: [
      {
        identifier: [
          {
            use: "official",
            system: "https://bps.moph.go.th/hcode/5",
            value: "00000:VN00001"
          }
        ],
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "AMB",
          display: "ambulatory"
        },
        type: [
          {
            coding: [
              {
                system: "https://phr1.moph.go.th/api/CodingSystem?System=encounter_type",
                code: "1",
                display: "มาเอง (ห้องบัตร)"
              }
            ]
          }
        ],
        period: {
          start: "2024-01-15T08:30:00.000Z",
          end: "2024-01-15T12:00:00.000Z"
        },
        Coverage: [
          {
            class_group: {
              value: "UCS",
              name: "สิทธิหลักประกันสุขภาพแห่งชาติ"
            }
          }
        ],
        vital_signs: {
          body_weight_kg: 65,
          body_height_cm: 170,
          body_temp_cel: 36.5,
          bp_systolic_mmhg: 120,
          bp_diastolic_mmhg: 80,
          body_mass_index: 22.5,
          respiratory_rate: 18,
          pulse: 72
        },
        Observation: [
          {
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "2345-7",
                  display: "Glucose"
                }
              ]
            },
            valueQuantity: {
              value: 100,
              unit: "mg/dL"
            },
            effectiveDateTime: "2024-01-15T09:00:00.000Z"
          }
        ],
        Condition: [
          {
            clinicalStatus: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                  code: "active",
                  display: "Active"
                }
              ]
            },
            code: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10",
                  code: "E11.9",
                  display: "Type 2 diabetes mellitus without complications"
                }
              ]
            }
          }
        ],
        Medication: [
          {
            code: {
              coding: [
                {
                  system: "https://www.this.or.th/tmt/gp",
                  code: "811043",
                  display: "METFORMIN 500 mg."
                }
              ]
            },
            status: "active",
            category: "Outpatient"
          }
        ],
        Claim: [],
        Appointment: [],
        Immunization: [],
        DiagnosticReport: []
      }
    ]
  },

  "allergy-v1": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    AllergyIntolerance: [
      {
        managingOrganization: { ...managingOrganization },
        identifier: [
          {
            system: "http://acme.com/ids/patients/risks",
            value: "49476535"
          }
        ],
        clinicalStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: "active",
              display: "Active"
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: "confirmed",
              display: "Confirmed"
            }
          ]
        },
        type: "allergy",
        category: ["medication"],
        criticality: "high",
        code: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=tmt_substance",
              code: "579224",
              display: "PENICILLIN G SODIUM"
            }
          ]
        },
        recordedDate: "2024-01-15T10:00:00+07:00",
        recordOfficer: {
          reference: "Practitioner/ว000099",
          identifier: "ว000099",
          display: "นพ.ทดสอบ ระบบ"
        },
        reaction: [
          {
            manifestation: [
              {
                coding: [
                  {
                    system: "http://snomed.info/sct",
                    code: "247472004",
                    display: "Hives"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  "chronic-register-v1": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    ChronicDiseaseRegister: [
      {
        managingOrganization: { ...managingOrganization },
        code: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=chronic_disease",
              code: "001",
              display: "DM"
            }
          ]
        },
        clinicalStatus: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active",
              display: "Active"
            }
          ]
        },
        registerDate: "2024-01-15",
        chronic_ref_code: "00000:CHR00001",
        clinicalText: "NIDDM Type 2",
        description: ["โรคเบาหวานชนิดที่ 2"]
      }
    ]
  },

  "immunization-v1": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    Immunization: [
      {
        managingOrganization: { ...managingOrganization },
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=vaccine_code",
              code: "COVID-19",
              display: "COVID-19 Vaccine"
            }
          ],
          text: "Covid 19 - CoronaVac"
        },
        encounterRefCode: "00000:VN00001",
        occurrenceDateTime: "2024-01-15T10:00:00+07:00",
        primarySource: true,
        location: "โรงพยาบาลทดสอบระบบ",
        manufacturer: "Sinovac Life Sciences",
        lotNumber: "BATCH001",
        expirationDate: "2025-12-31",
        site: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActSite",
              code: "LA",
              display: "Left Arm"
            }
          ]
        },
        route: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
              code: "IM",
              display: "Injection, intramuscular"
            }
          ]
        },
        doseQuantity: {
          value: 0.5,
          system: "http://unitsofmeasure.org",
          code: "mL"
        },
        performer: {
          license_no: "ว000099",
          name: "นพ.ทดสอบ ระบบ"
        }
      }
    ]
  },

  "referral-request": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    ReferralRequest: [
      {
        managingOrganization: { ...managingOrganization },
        recipientOrganization: {
          type: "Organization",
          identifier: {
            use: "official",
            system: "https://bps.moph.go.th/hcode/5",
            value: "11111"
          },
          display: "โรงพยาบาลปลายทาง"
        },
        encounterRefCode: "00000:VN00001",
        referralRefCode: "00000:REF00001",
        status: "active",
        intent: "proposal",
        type: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=referral_type",
              code: "1",
              display: "ส่งต่อเพื่อรักษา"
            }
          ],
          text: "ส่งต่อเพื่อรักษา"
        },
        priority: "routine",
        occurrenceDateTime: "2024-01-15T10:00:00.000Z",
        authoredOn: "2024-01-15",
        requester: {
          agent: {
            reference: "Practitioner/ว000099",
            display: "นพ.ทดสอบ ระบบ"
          }
        },
        serviceRequested: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "172676009",
              display: "Myringotomy and insertion of tympanic ventilation tube"
            }
          ],
          text: "Insertion of grommets"
        }
      }
    ]
  },

  "self-observation": {
    system_name: "Application Test v1.0",
    location_gis: {
      latitude: "13.756331",
      longitude: "100.501765"
    },
    observation_ref_code: "{00000-OBS00-00001-TEST-00001}",
    person: {
      cid: "0000000000001",
      prefix: "นาย",
      first_name: "ทดสอบ",
      last_name: "ระบบ",
      birth_date: "1990-01-01",
      gender: "M"
    },
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
  },

  "caregiver": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    CareGiver: [
      {
        identifier: [
          {
            use: "official",
            system: "https://www.dopa.go.th",
            type: "CID",
            value: "0000000000001"
          }
        ],
        active: true,
        intent: "directive",
        name: {
          use: "official",
          text: "นางสาวดูแล ผู้ป่วย",
          languageCode: "TH",
          family: "ผู้ป่วย",
          given: ["ดูแล"],
          prefix: ["นางสาว"],
          suffix: [],
          period: {
            start: "1995-01-01T00:00:00.000Z"
          }
        },
        telecom_phone: "0999999999",
        care_giver_name: "นางสาวดูแล ผู้ป่วย",
        qualification: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=caregiver_type",
              code: "1",
              display: "บุคคลในครอบครัวเดียวกัน"
            }
          ]
        }
      }
    ]
  },

  "medication-request": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    MedicationRequest: [
      {
        identifier: [
          {
            use: "official",
            system: "https://phr1.moph.go.th/eprescription",
            value: "00000:MED00001"
          }
        ],
        status: "active",
        intent: "order",
        medication: {
          coding: [
            {
              system: "https://www.this.or.th/tmt/gp",
              code: "811043",
              display: "METFORMIN 500 mg."
            }
          ]
        },
        encounter_ref_code: "00000:VN00001",
        authoredOn: "2024-01-15T10:00:00+07:00",
        requester: {
          reference: "Practitioner/ว000099",
          display: "นพ.ทดสอบ ระบบ"
        },
        dosageInstruction: [
          {
            text: "รับประทานครั้งละ 1 เม็ด วันละ 2 ครั้ง หลังอาหาร",
            timing: {
              repeat: {
                frequency: 2,
                period: 1,
                periodUnit: "d"
              }
            },
            route: {
              coding: [
                {
                  system: "http://snomed.info/sct",
                  code: "26643006",
                  display: "Oral route"
                }
              ]
            }
          }
        ],
        dispenseRequest: {
          quantity: {
            value: 60,
            unit: "tablets"
          },
          expectedSupplyDuration: {
            value: 30,
            unit: "days"
          }
        }
      }
    ]
  },

  "encounter-summary": {
    managingOrganization: { ...managingOrganization },
    EncounterSummary: [
      {
        period_start: "2024-01-01",
        period_end: "2024-01-31",
        opd_count: 150,
        ipd_count: 25
      }
    ]
  },

  "drug-related-problem": {
    managingOrganization: { ...managingOrganization },
    Patient: { ...patientBlock },
    DrugRelatedProblem: [
      {
        drp_ref_code: "00000:DRP00001",
        medication: {
          coding: [
            {
              system: "https://www.this.or.th/tmt/gp",
              code: "811043",
              display: "METFORMIN 500 mg."
            }
          ]
        },
        category: {
          coding: [
            {
              system: "https://phr1.moph.go.th/api/CodingSystem?System=drp_category",
              code: "1",
              display: "Drug Interaction"
            }
          ]
        },
        description: "พบปฏิกิริยาระหว่างยา",
        recordedDate: "2024-01-15T10:00:00+07:00"
      }
    ]
  },

  // ===== Retrieval APIs =====
  "patient-summary": { ...retrievalTemplate },
  "encounter": { ...retrievalTemplate },
  "vital-sign": { ...retrievalTemplate },
  "condition": { ...retrievalTemplate },
  "condition-encounter": { ...retrievalTemplate },
  "observation": { ...retrievalTemplate },
  "observation-detail": { ...retrievalTemplate },
  "observation-encounter": { ...retrievalTemplate },
  "medication": { ...retrievalTemplate },
  "medication-encounter": { ...retrievalTemplate },
  "coverage": { ...retrievalTemplate },
  "coverage-detail": { ...retrievalTemplate },
  "appointment": { ...retrievalTemplate },
  "immunization-detail": { ...retrievalTemplate },
  "allergy": { ...retrievalTemplate },
  "ncd": { ...retrievalTemplate },
  "referral": { ...retrievalTemplate },
  "self-observation-read": { ...retrievalTemplate },
  "caregiver-read": { ...retrievalTemplate },
  "pregnancy": { ...retrievalTemplate },
  "profile-image": { ...retrievalTemplate },
  "diagnostic-report": { ...retrievalTemplate },
  "report-encounter": { ...retrievalTemplate },

  // ===== Utility APIs =====
  "update-agent-status": {
    hospital_code: "00000",
    agent_status: "processing ...",
    agent_computer_name: "Agent-PC",
    most_client_version: "1.0.0.0",
    agent_version: "Agent v1.0"
  },

  "update-agent-status-error": {
    hospital_code: "00000",
    agent_status: "Error: connection timeout"
  },

  "get-agent-computer": {
    hospital_code: "00000"
  },

  "org-summary-daily": null,
  "org-summary-monthly": null,
  "remove-encounter": null,
  "paste-json-get": null,

  "paste-json-post": {
    data: "test payload"
  },

  "mask-encounter-set": {
    cid: "0000000000001",
    encounter_ref_code: "00000:VN00001"
  },

  "mask-encounter-get": {
    cid: "0000000000001",
    encounter_ref_code: "00000:VN00001"
  },

  "phr-setting-set": {
    cid: "0000000000001",
    share_phr: true
  },

  "phr-setting-get": {
    cid: "0000000000001"
  },

  "request-token-v1": {
    cid: "0000000000001"
  },

  "validate-otp": {
    cid: "0000000000001",
    otp: "AA999999"
  },

  "get-phr-otp": {
    cid: "0000000000001",
    access_token: "xxxxxxxxxxxx"
  },

  "check-ekyc": {
    cid: "0000000000001"
  },

  "report-encounter-add": {
    cid: "0000000000001",
    encounter_ref_code: "00000:VN00001",
    reason_text: "ข้อมูลไม่ถูกต้อง"
  },

  "report-encounter-delete": {
    cid: "0000000000001",
    encounter_ref_code: "00000:VN00001"
  },

  "report-encounter-list": {
    cid: "0000000000001"
  },
}
