# โครงสร้างมาตรฐานข้อมูลสุขภาพ
**เพื่อใช้ส่งข้อมูลเข้าระบบ MOPH-PHR**

## ประวัติการปรับปรุงเอกสาร
- **Version 1.0:** 9 ธ.ค. 2564  
- **Version 1.1:** 26 ธ.ค. 2564  
- **Version 1.2:** 14 ม.ค. 2565  
- **Version 1.3:** 1 มี.ค. 2565  
- **Version 1.4:** 10 มี.ค. 2565  
- **Version 1.5:** 3 ก.ค. 2565  
- **Version 1.6:** 7 ก.ย. 2565  
- **Version 1.7:** 13 ธ.ค. 2565  
- **Version 1.8:** 31 ต.ค. 2566  
- **Version 1.9:** 12 ธ.ค. 2566  
- **Version 2.0:** 2 ต.ค. 2567  
- **Version 2.1:** 12 ธ.ค. 2567
    - ปรับปรุงรูปแบบเอกสารเป็น Markdown
    - ปรับปรุง Spec 
- **Version 2.2:** 16 ก.ย. 2568
    - ปรับปรุง Spec API แจ้งข้อมูลไม่ถูกต้อง'
- **Version 2.3:** 7 เม.ย. 2569
    - เพิ่มภาคผนวก จ. การสร้าง token อายุ 1 ปี สำหรับส่งข้อมูล PHR เข้าระบบ ผ่าน /api/UpdatePHRv1


---

## คำนำ
เอกสารฉบับนี้จัดทำขึ้นเพื่อใช้อ้างอิงในการพัฒนาระบบการส่งข้อมูลจากระบบ HIS เข้าสู่ระบบ **MOPH-PHR Center** ของกระทรวงสาธารณสุข ผ่าน **API Endpoint** ที่กำหนดไว้  

วันที่: 9 ธันวาคม 2564  
ผู้จัดทำ: **ชัยพร สุรเตมีย์กุล**

---

## โครงสร้างข้อมูล Version 1.0
### วัตถุประสงค์
ใช้สำหรับแลกเปลี่ยนข้อมูลและทดสอบการส่งข้อมูลจากระบบ HIS หรือระบบ Health Data Center ของหน่วยงานที่เข้าร่วมโครงการ เพื่อส่งข้อมูลเข้าระบบ MOPH-PHR

### ประเภทข้อมูล
1. **ข้อมูลหน่วยงาน**
2. **ข้อมูลส่วนบุคคล**
   - เลขบัตรประชาชน
   - ชื่อ-นามสกุล, เพศ, วันเกิด, เชื้อชาติ, สัญชาติ, ศาสนา, หมู่เลือด
   - สถานภาพสมรส
   - หมายเลขโทรศัพท์
   - การแพ้ยา
   - ที่อยู่ปัจจุบัน
   - ชื่อ-ที่อยู่ ผู้ที่สามารถติดต่อได้
3. **สิทธิการรักษา**
   - สิทธิการรักษา ณ ปัจจุบัน
4. **โรคประจำตัว**
   - กลุ่มโรค NCD

5. **ข้อมูลการเข้ารับบริการ**
   - หน่วยให้บริการ
   - วันที่/เวลาที่เข้ารับบริการ
   - สาเหตุของการเข้ารับบริการ
   - สิทธิการรักษา
   - สัญญาณชีพ:
     - น้ำหนัก
     - ส่วนสูง
     - อุณหภูมิ
     - ความดันโลหิต
   - อาการสำคัญ
   - ผลการวินิจฉัยในกลุ่ม NCD (เช่น ICD10)
   - ผลตรวจทางห้องปฏิบัติการในกลุ่ม NCD:
     - FBS
     - Cholesterol
     - TG
     - HDL
     - LDL
     - HbA1c

---

## โครงสร้างข้อมูล (Structure)
### รูปแบบข้อมูล
ในการส่งข้อมูลนั้น รูปแบบของข้อมูลจะเป็นข้อมูลที่สมบูรณ์ของบุคคล ประกอบไปด้วย ข้อมูลส่วนบุคคล และ ข้อมูลของการเข้ารับบริการ โดยจะต้องประกอบไปด้วยข้อมูล ส่วนบุคคล และ ข้อมูลของการเข้ารับบริการอย่างน้อย 1 รายการ  

โครงสร้างข้อมูลใช้โครงสร้างที่ปรับปรุงมาจาก HL7 FHIR นำมาปรับปรุงให้สะดวกต่อการ รับส่งข้อมูล ในช่วงทดสอบระบบเข้า endpoint ซึ่งอาจจะมีการปรับปรุงโครงสร้างในรุ่นต่อไป ให้มีความเข้ากันได้กับ HL7 FHIR หลังจากที่ทดสอบระบบเสร็จแล้ว

โดยการส่งข้อมูลจะส่งด้วยรูปแบบข้อมูลที่ถูกจัดเก็บในรูปแบบของ JSON โดยมีโครงสร้างดังนี้


```json
{
  "managingOrganization": {},
  "Patient": {},
  "AllergyIntolerance": [],
  "CarePlan": [],
  "Encounter": [
    {
      "identifier": [],
      "Coverage": [],
      "vital_signs": {},
      "Observation": [],
      "Condition": [],
      "Medication": [],
      "Claim": [],
      "Appointment": [],
      "Immunization": [],
      "DiagnosticReport": []
    }
  ]
}
```

#### ส่วนของ managingOrganization (ข้อมูลหน่วยงาน)
ตัวอย่าง Object ของ managingOrganization

```json
{
  	"type":"Organization",
  	"identifier":{
     	"use":"official",
     	"system":"https://bps.moph.go.th/hcode/5",
     	"value":"99999"
  	},
  	"display":"โรงพยาบาลทดสอบระบบ",	  
	  "agent" : "HIS ABC v1.0"
   }
```


#### ส่วนของ Patient มีรายละเอียดดังนี้
- identifier : เป็นรายการรหัสอ้างอิง โดยจะต้องระบุ เลขที่บัตรประชาชนใน system : https://www.dopa.go.th
- name : เป็นชื่อของผู้รับบริการ กรณีมีชื่อ ไทย และ อังกฤษ ให้ใช้ languageCode ระบุแยกกัน
--	prefix : คำนำ
--	given : ชื่อ
--	family : นามสกุล
- telecom : เป็นข้อมูลที่ใช้ติดต่อผ่าน โทรศัทพ์ หรือช่องทางอื่นๆ
- gender : เพศ ต้องระบุเป็น male หรือ female
- birthDate : วันเกิด ต้องระบุในรูปแบบ yyyy-mm-dd (ปี. ค.ศ.)
- deceasedBoolean : การเสียชีวิต
- nationality : ข้อมูลสัญชาติ
- maritalStatus : สถานภาพ
- address : ข้อมูลที่อยู่
- contact : ข้อมูลผู้ติดต่อ

#### โครงสร้าง payload ที่ส่งเข้า UpdatePHRv1 มีรายละเอียดดังนี้

[ตัวอย่างชุดข้อมูลแบบเต็ม](/moph-phr/moph-phr-sample-UpdatePHRv1)

## การส่งข้อมูลเข้าสู่ระบบ MOPH-PHR
### Base URL
- production : https://phr1.moph.go.th/api
- uat : https://203.150.143.180/api
### api UpdatePHRv1
เป็น api สำหรับ upload ข้อมูลตามโครงสร้ามาตรฐานเข้าระบบ โดยใช้ Method POST กำหนด Authorization Header Bearer เป็น JWT ที่ได้รับจาก MOPH Account Center ของผู้ใช้งานที่มีสิทธิ MOPH_PHR_HIE 

โดยสามารถส่งข้อมูลไปที่ url 

- {BASEURL}/UpdatePHRv1

ตัวอย่างการส่งข้อมูลด้วยคำสั่ง curl (run ใน Linux)

```bash
#!/bin/bash

i="0"

export tmpjson='{"user":"cvp_user","password_hash":"FFFFFFFFFFFFFFFF","hospital_code":"00000"}'

jwt=$(curl -X POST -k "https://cvp1.moph.go.th/token?Action=get_moph_access_token" -d $tmpjson)

echo "$jwt"

for filename in ./json_moph_phr/*.json
do

  echo $filename
  printf '%s\n' "Upload PHR json : $filename"
  json=$(<$filename)
  curl -m 500 -k -H "Authorization: Bearer $jwt" -X POST -H "Content-Type:application/json" --data @<( sed '1 s/\xEF\xBB\xBF//' < $filename ) "https://203.150.143.180/api/UpdatePHRv1" | python -m json.tool --no-ensure-ascii | jq

done;

```
### api AllergyIntolerancev1

สามารถส่งข้อมูลเข้าระบบได้ที่ url 

- {BASEURL}/AllergyIntolerancev1


ใช้สำหรับส่งข้อมูลรายการการแพ้ยาเข้าระบบ PHR
โครงสร้างของข้อมูล
```json
{
 "managingOrganization" : {},
 "Patient" : {},
 "AllergyIntolerance" : []  
}

```
ตัวอย่าง object ใน AllergyIntolerance array
```json
{

"managingOrganization":{
  		"type":"Organization",
  		"identifier":{
     		"use":"official",
     		"system":"https://bps.moph.go.th/hcode/5",
     		"value":"99999"
  		},
  		"display":"โรงพยาบาลทดสอบระบบ"
   	},

   "identifier":[
  	{
     	"system":"http://acme.com/ids/patients/risks",
     	"value":"49476535"
  	}
   ],
   "clinicalStatus":{
  	"coding":[
     	{
        	"system":"http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
        	"code":"active",
        	"display":"Active"
     	}
  	]
   },
   "verificationStatus":{
  	"coding":[
     	{
        	"system":"http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
        	"code":"confirmed",
        	"display":"Confirmed"
     	}
  	]
   },
   "type":"allergy",
   "category":[  // กรณีแพ้อาหาร ระบุเป็น "food"
  	"medication"
   ],
   "criticality":"high",
   "code":{
  	"coding":[
     	{
        	"system":"https://phr1.moph.go.th/api/CodingSystem?System=tmt_substance",
        	"code":"579224",
        	"display":"PENICILLIN G SODIUM"
     	}
  	]
   },
  "seriousness" : {
  	"coding":[
     	{
        	"system":"https://phr1.moph.go.th/api/CodingSystem?System=allergy_seriousness",
        	"code":"1",
        	"display":"ไม่ร้ายแรง"
     	}
  	]
   },


"allergyGroup" : {
  	"coding":[
     	{
        	"system":"https://phr1.moph.go.th/api/CodingSystem?System=allergy_group",
        	"code":"1",
        	"display":"Cardiovascular diaorder"
     	}
  	]
   },

"allergyInformationSource" : {
  	"coding":[
     	{
        	"https://phr1.moph.go.th/api/CodingSystem?System=allergy_source",
        	"code":"1",
        	"display":"มาโรงพยาบาล"
     	}
  	]
   },


"allergyResult" : {
  	"coding":[
     	{
        	"https://phr1.moph.go.th/api/CodingSystem?System=allergy_result",
        	"code":"1",
        	"display":"หายเป็นปกติ"
     	}
  	]
   },

"naranjoResult" : {
  	"coding":[
     	{
        	"https://phr1.moph.go.th/api/CodingSystem?System=allergy_naranjo_result",
        	"code":"1",
        	"display":"Definite - ใช่แน่"
     	}
  	]
   },

  "preventable" : false,
 "preventableScore" : 1,


   "recordedDate":"2015-08-06T15:37:31-06:00",
   "recordOfficer" : {
              	"reference":"Practitioner/ว000099",
              	"identifier":"ว000099",
              	"display":"นพ.ทดสอบ ระบบ 2"
           	}
   "reaction":[
  	{
     	"manifestation":[
        	{
           	"coding":[
              	{
                 	"system":"http://snomed.info/sct",
                 	"code":"247472004",
                 	"display":"Hives"
              	}
           	]
        	}
     	]
  	}
   ]
}

```

### api PatientChronicRegisterv1


สามารถส่งข้อมูลเข้าระบบได้ที่ url 

- {BASEURL}/PatientChronicRegisterv1

สำหรับส่งข้อมูลการขึ้นทะเบียนผู้ป่วยโรคเรื้อรังในหน่วยให้บริการ
โครงสร้างของข้อมูล
```json
{
 "managingOrganization" : {},
 "Patient" : {},
 "ChronicDiseaseRegister" : []  
}

```

ตัวอย่าง object ใน ChronicDiseaseRegister array
```json
{

"managingOrganization":{
  		"type":"Organization",
  		"identifier":{
     		"use":"official",
     		"system":"https://bps.moph.go.th/hcode/5",
     		"value":"99999"
  		},
  		"display":"โรงพยาบาลทดสอบระบบ"
   	},


  "code":{
  	"coding":[
     	{
        	"system":"http://terminology.hl7.org/CodeSystem/code",
        	"code":"001",
        	"display":"โรคเบาหวาน"
     	}
  	]
   },
"clinicalStatus":{
  	"coding":[
     	{
        	"system":"http://terminology.hl7.org/CodeSystem/code",
        	"code":"3",
        	"display":"ยังรักษาอยู่"
     	}
  	]
   },
"chronic_ref_code" : "123456", // รหัส unique reference code จากระบบ HIS

 "clinicalText" : "NIDDM Type 2",

   
   "registerDate" : "2001-01-01",
   "dischargeDate" : "2011-01-01",
  
   "recordedDate":"2015-08-06T15:37:31-06:00",
   "description":[
  	"xxx"
   ]

"condition" : [
  {
        	  "system":"https://phr1.moph.go.th/api/CodingSystem?System=ncd_condition",
        	"code":"ckd_gfr_category",
        	"display":"Normal or high",
	"text" : "G1"
     	}

  

]


}


```

กรณีที่ต้องการตรวจสอบข้อมูลใน NCD Registry ว่ามีกี่รายการสามารถใช้ api นี้เพื่อนำข้อมูลออกไปตรวจสอบได้

https://phr1.moph.go.th/api/OrganizationSummary?&data=patient_chronic_registry&hospital_code=xxxxx&cd_code=001
method : GET
จะได้รับ array ของรายการ chronic_ref_code ที่ส่งเข้ามา

หากต้องการลบข้อมูลให้ส่ง array ของ chronic_ref_code เข้ามาที่ url 
https://phr1.moph.go.th/api/PatientChronicRegisterv1?mode=remove&cd_code=xxxx
method : POST
หากส่ง array ว่างเข้ามาจะเป็นการลบข้อมูลทั้งหมดออกจาก Chronic Register ที่รหัส cd_code ตรงกัน

### api ImmunizationRegisterv1

```
/api/ImmunizationRegisterv1
```

เป็น api ที่ข้อมูลการได้รับ vaccine ข้อมูลที่ส่งเข้าต้องเป็นข้อมูลทั้งหมดของผู้รับบริการแต่ละรายที่รับบริการฉีดวัคซีนที่หน่วยให้บริการ หากส่งมาไม่ครบทั้งหมด รายการก่อนหน้านี้ของบุคคลนั้นๆที่ส่งเข้ามาจะถูกลบออก (ใช้ encounterRefCode เป็นตัวตรวจสอบ) 
vaccineCode ใช้รหัสมาตรฐาน 43 แฟ้ม

โครงสร้างของข้อมูล
```json
{
 "managingOrganization" : {},
 "Patient" : {},
 "Immunization" : []  
}

```
ตัวอย่าง object ใน Immunization array
```json
{
  "managingOrganization":{
  		"type":"Organization",
  		"identifier":{
     		"use":"official",
     		"system":"https://bps.moph.go.th/hcode/5",
     		"value":"99999"
  		},
  		"display":"โรงพยาบาลทดสอบระบบ"
   	},

   "status": "completed",
   "vaccineCode": {
    "coding": [
      {
        "system": "https://refcode.moph.go.th/vaccine",
        "code": "C19",
	   "display" : "COVID1"
      }
    ],
    "text": "Covid 19 - CoronaVac"
   },
  "encounterRefCode" : "6666666666666",
  "occurrenceDateTime": "2013-01-10T09:00:00.000Z",
  "primarySource": true,
  "location": "โรงพยาบาลสนาม",
  "manufacturer" : "Sinovac Life Sciences",
  "lotNumber": "AAJN11K",
  "expirationDate": "2015-02-15",
  "site": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActSite",
        "code": "LA",
        "display": "left arm"
      }
    ]
  },
  "route": {
    "coding": [
      {
        "system": "http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
        "code": "IM",
        "display": "Injection, intramuscular"
      }
    ]
  },
  "doseQuantity": {
    "value": 5,
    "system": "http://unitsofmeasure.org",
    "code": "mg"
  },
"note": [
    {
      "text": "Notes on adminstration of vaccine"
    }
  ],
  "reasonCode": [
    {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "429060002"
        }
      ]
    }
  ],
"performer": {
  "license_no" : "A000000",
  "name" : "Dr.Test Test"
}





 }

```

### api ReferralRequest
เป็น api สำหรับส่งข้อมูลการส่งต่อผู้ป่วยระหว่างหน่วยให้บริการ
https://phr1.moph.go.th/api/ReferralRequest
โครงสร้างของข้อมูล
```json
{
 "managingOrganization" : {},
 "Patient" : {},
 "ReferralRequest" : []  
}

```

ตัวอย่าง object ใน ReferralRequest array
```json
{
   "managingOrganization":{
  		"type":"Organization",
  		"identifier":{
     		"use":"official",
     		"system":"https://bps.moph.go.th/hcode/5",
     		"value":"99999"
  		},
  		"display":"โรงพยาบาลทดสอบระบบ"
   	},

   "recipientOrganization":{
  		"type":"Organization",
  		"identifier":{
     		"use":"official",
     		"system":"https://bps.moph.go.th/hcode/5",
     		"value":"99999"
  		},
  		"display":"โรงพยาบาลทดสอบระบบ"
   	},


   "encounterRefCode" : "6666666666666",
   "referralRefCode" : "11111",


   "status": "active",
   "intent": "proposal",
   "type": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "710915002",
	   "display" : "Referral to community service"
      }
    ],
    "text": "Referral to community service"
   },

   "priority": "routine",

   "serviceRequested": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "172676009",
          "display": "Myringotomy and insertion of tympanic ventilation tube"
        }
      ],
      "text": "Insertion of grommets"
      }
    ,

   "context": {
    "display": "ผู้ป่วยใน Admit เมื่อ xxx ตึก xxx จำหน่าย เมื่อ xxx ด้วย xxx"
  },

   "occurrenceDateTime": "2013-01-10T09:00:00.000Z",
   "occurrencePeriod": {
    "end": "2014-03-14"
     },
   "authoredOn": "2014-02-14",
   "requester": {
    "agent": {
      "reference": "https://fhir.orionhealth.com/blaze/fhir/Practitioner/77272",
      "display": "Serena Shrink"
    }
  },
   
   "specialty": {
    "coding": [
      {
        "system": "http://orionhealth.com/fhir/apps/specialties",
        "code": "ent",
        "display": "ENT"
      }
    ],
    "text" : "แผนกอายุรกรรม"
  },
   "description" : "",
   "note" : "",
   "supporting_info_diagnosis" : "",
   "supporting_info_vital_sign" : "",
   "supporting_info_medication" : "",
   "supporting_info_observation" : "",
   "supporting_info_social_problem" : "",
   "supporting_info_present_illness" : ""
   
 }


```
### api QuickObservation
เป็น api สำหรับส่งข้อมูลการตรวจ vital sign จากระบบดูแลผู้ป่วยที่บ้าน หรือ terminal ตรวจอัตโนมัติ
https://phr1.moph.go.th/api/SelfObservation

ตัวอย่าง โครงสร้างข้อมูล

```json
{  
"system_name" : "Application A v1.0",
 "location_gis" : {
  "latitude" : "20.34343434343434",
  "longitude" : "110.3040340340"
},
observation_ref_code : "{aaaaaa-bbbbbb-ccccc-ddddd-eeeee}",
 "person" : {
   "cid" : "0000000000001",
   "prefix" : "นาย",
   "first_name" : "ทดสอบ",
   "last_name" : "ระบบ",
   "birth_date" : "1999-01-01",
   "gender" : "M"
  },
 "observation" : 
   {
     "reference_id" : "{aaaaa-bbbbb-ccccc-ddddd}"
     "loinc_code" : "15074-8",
     "loinc_display" : "Glucose [Moles/volume] in Blood",
     "effective_datetime" : "2000-01-01T01:01:01.000",    
     "device_display" : "Blood Glucose Monitor : 123456",
     "performer_display" : "นายทดสอบ ระบบ",
     "observation_value" : "155",
     "observation_unit" : "mg/dL"
   }
  
}

```
### api CareGiver
เป็น api สำหรับส่งข้อมูลการเป็นผู้ดูแลผู้ป่วย โดยการส่งจะต้องมีการพิสูจน์ด้วยเจ้าหน้าที่และส่งผ่านระบบ HIS
https://phr1.moph.go.th/api/CareGiver
ตัวอย่าง โครงสร้างข้อมูล

```json
{
   "managingOrganization":{
 	 
   },
   "Patient":{
 	 
   },
   "CareGiver":[
  	{
     	"identifier":[
        	     {
           	"use":"official",
           	"system":"https://www.dopa.go.th",
           	"type":"CID",
           	"value":"0000000000001"
           	     }
     	],
     	"active":true,
     	"intent":"directive",
     	"name":
        	{
           	"use":"official",
           	"text":"นายทดสอบ ระบบ",
           	"languageCode":"TH",
           	"family":"ระบบ",
           	"given":[
              	"ทดสอบ"
           	],
           	"prefix":[
              	"นาย"
           	],
           	"suffix":[
             	 
           	],
           	"period":{
              	"start":"1999-01-01T00:00:00.000Z"
           	}
        	}
         ,
         "telecom_phone" : "088-8888888",
     	,
     	"qualification" : {
              	"coding":[
                 	{
                    	"system":"https://phr1.moph.go.th/api/CodingSystem?System=caregiver_type",
                    	"code":"1",
                    	"display":"บุคคลในครอบครัวเดียวกัน"
                 	}
              	]
           	}
        	
     	
  	}
   ]
} 

```

### api MedicationRequest
เป็น api ที่ใช้ส่งข้อมูลการเขียนใบสั่งยาโดยแพทย์เพื่อใช้นำไปแสดงเป็นหลักฐานแสดงในการรับยาที่หน่วยงานอื่น
https://phr1.moph.go.th/api/MedicationRequest
ตัวอย่าง โครงสร้างข้อมูล

```json
{
   "managingOrganization":{
 	 
   },
   "Patient":{
 	 
   },
   "MedicationRequest":[
  	{
          "identifier" : [{
	        "use" : "official",
	        "system" : "https://phr1.moph.go.th/eprescription",
	        "value" : "12345689"
           }],
     	"status":"active",
     	"intent":"order",
     	"medication":{
        	"coding":[
           	{
              	"system":"https://www.this.or.th/tmt/gp",
              	"code":"811043",
              	"display":"AMOXICILLIN (เภสัชกรรมทหาร) (amoxicillin 500 mg) capsule, hard"
           	}
        	]
     	},
     	"encounter_ref_code": "hcode:vn"
     	,
     	"authoredOn":"2023-03-12",
     	"requester":{
        	   "reference":"Practitioner/licenseno",
        	   "display":"Dr. Jane Smith",
             "providerToken" : "FDFDFDFDF" // access token จาก providerID
     	},
     	"note":{
        	"text":"Patient is allergic to penicillin. Please use with caution and monitor for any adverse reactions."
     	},
     	"dosageInstruction":[
        	{
           	"sequence":1,
               "text":"PO 2 TID PC",
               "patientInstruction":"ทานครั้งละ 2 เม็ด วันละ 3 ครั้ง หลังอาหาร เช้า เที่ยง เย็น",
           	"timing":{
              	"repeat":{
                 	"frequency":3,
                 	"period":1,
                 	"periodUnit":"d"
              	}
           	},
           	"route":{
              	"coding":[
                 	{
                    	"system":"http://terminology.hl7.org/CodeSystem/v3-RouteOfAdministration",
                    	"code":"PO",
                    	"display":"Swallow, oral"
                 	}
              	]
           	},
           	"doseAndRate":[
              	{
                 	"doseQuantity":{
                    	"value":2,
                    	"unit":"CAP",
                    	"system":"http://terminology.hl7.org/CodeSystem/v3-orderableDrugForm",
                    	"code":"CAP"
                 	}
              	}
           	]
        	}
     	],
     	"dispenseRequest":{
        	"validityPeriod":{
           	"start":"2023-03-12",
           	"end":"2023-03-19"
        	},
        	"numberOfRepeatsAllowed":0,
        	"quantity":{
           	"value":21,
           	"unit":"capsule",
           	"system":"http://unitsofmeasure.org",
           	"code":"caps"
        	},
        	"expectedSupplyDuration":{
           	"value":7,
           	"unit":"days",
           	"system":"http://unitsofmeasure.org",
           	"code":"d"
        	}
     	}
  	}
   ]
}

```
### api PHRSetting
เป็น api ที่ใช้กำหรับกำหนดค่า Individual Sharing Preferences ของข้อมูลในระบบ PHR , การใช้งาน api นี้ต้องส่ง HealthID Token มาเป็น authorization header
https://phr1.moph.go.th/api/PHRSetting?mode=xxx

#### การกำหนดค่า
method : POST
https://phr1.moph.go.th/api/PHRSetting?mode=set
payload (body) : 
```json
{
  "cid" : "xxxxxxxxxxx",
  "share_phr" : true // false
}
```

#### การตรวจสอบการตั้งค่า
https://phr1.moph.go.th/api/PHRSetting?mode=get
payload (body) : 
```json
{
  "cid" : "xxxxxxxxxxx"
}
```

output payload 
```json
{
  "cid" : "xxxxxxxxxxx", // encrypted cid
  "share_phr" : true // false
}
```


### api OrgEncounterSummary

เพื่อให้การตรวจสอบการส่งข้อมูลเข้าระบบ PHR สามารถตรวจสอบจำนวน Encounter จากฝั่งต้นทาง (HIS) เปรียบเทียบกับฝั่งปลายทาง (MOPH-PHR)  ว่ามีจำนวนข้อมูลต่างกันเท่าไหร่ และนำมาประเมินเป็น % ความสำเร็จในการส่งข้อมูลได้ ฝั่งระบบ HIS สามารถส่งข้อมูลเข้ามาที่ Path นี้เพื่อ Update ข้อมูลดังนี้

สามารถส่งข้อมูลใน array เข้ามาพร้อมๆ กันได้มากกว่าครั้งละ 1 วัน (ไม่ควรเกิน 1 เดือน)

https://phr1.moph.go.th/api/OrgEncounterSummary

ตัวอย่างโครงสร้างข้อมูลที่ส่งเข้าระบบ

```json
{
   "managingOrganization":{
 	 
   },
   "EncounterSummary":[
  	{
       "period_start" : "2022-01-01",
       "opd_encounter_count" : 100,
       "ipd_encounter_count" : 10,
       "ipd_discharge_count" : 20
     }
    ]
}

```

### api DrugRelatedProblem

เป็น api ที่ใช้ส่งข้อมูลปัญหาที่เกิดจากการใช้ยา ที่ถูกบันทึกโดยเภสัชกร

https://phr1.moph.go.th/api/DrugRelatedProblem

ตัวอย่างโครงสร้างข้อมูลที่ส่งเข้าระบบ

```json
{
   "managingOrganization":{
 	 
   },
   "Patient":{
 	 
   },
   "DrugRelatedProblem":[
  	{
       "drp_ref_code" : "xxxx-yyyy-zzzzz",
       "active":true,
       "intent":"directive",
       "medication":{
        	  "coding":[
               {
              	"system":"https://www.this.or.th/tmt/gp",
              	"code":"811043",
              	"display":"AMOXICILLIN (เภสัชกรรมทหาร) (amoxicillin 500 mg) capsule, hard"
               }
        	  ]
     	 },
     }
    ]
}

```

## api สำหรับขอ OTP เพื่อเข้าถึงข้อมูลในระบบ PHR

ในการเข้าถึงข้อมูลสุขภาพจาก api endpoint  สามารถเข้าถึงได้ 3 วิธี ได้แก่
1.    ใช้ otp ในการขอข้อมูล ซึ่ง ต้องขอให้ระบบส่ง otp ไปให้เจ้าของข้อมูลผ่านหมอพร้อม application หรือ หมอพร้อม line oa ผ่าน api /api/RequestTokenv1 ด้วย url นี้ otp ที่ได้รับจะมีอายุการใช้งาน 1 ชั่วโมง
2.    ใช้บัตรประจำตัวประชนของเจ้าของข้อมูล อ่านในเครื่องอ่านบัตรในระบบ OAuth2.0 จะได้รับ otp กลับมาและนำมาใช้เข้าถึงข้อมูลได้
3.    ให้เจ้าของข้อมูลทำการ  Login ด้วย หมอพร้อม HealthID (OAuth 2.0) หลังจากนั้นให้ใช้ JWT ของ HelthID มาใช้ในส่วนของ Header bearer เพื่อเข้าถึงข้อมูลโดยไม่ต้องใช้ otp

### ขั้นตอนวิธีการที่ 1

url path ที่ต้องใช้งาน
https://phr1.moph.go.th/api/RequestTokenv1 
method : POST
payload (body) : 
```json
{"cid" : "xxxxxxxxxxx"}
```

เมื่อเจ้าของข้อมูลได้รับ otp แล้ว สามารถนำ otp มาตรวจสอบผ่าน api /api/WebApp?Action=ValidateOTP ด้วย url นี้ (ต้องส่ง authorization header jwt  moph account center ที่ได้สิทธิ MOPH_PHR_HIE เข้ามาด้วย)

https://phr1.moph.go.th/api/WebApp?Action=RequestOTP
สำหรับส่ง IDP JWT เข้ามาขอ otp สำหรับเข้าถึงข้อมูลสุขภาพ (เฉพาะระบบที่มีระบบ Login ด้วย หมอพร้อม ID)
method : POST
payload (body) : 
```json
{"idp_jwt" : "xxxxxxxxxxx" }
```

https://phr1.moph.go.th/api/WebApp?Action=ValidateOTP
method : POST
payload (body) : 
```json
{"cid" : "xxxxxxxxxxx" , "otp" : "AA999999"}
```


สามารถนำ otp ที่ได้รับมาใช้ตรวจสอบข้อมูลต่างๆ ได้ดังนี้

ด้วย method POST และ payload ที่ระบุ cid และ otp ดังนี้
```json
{"cid" : "xxxxxxxxxxx" , "otp" : "AA999999"}
```


**Diagram แสดงขั้นตอนวิธีที่ 1**

```kroki
mermaid
sequenceDiagram
    participant C as Client
    participant P as PHR API
    participant M as หมอพร้อม App/Line OA
    participant U as User

    C->>P: POST /api/RequestTokenv1<br>{cid: "xxxxx"}<br>Header: MOPH AccountCenter JWT
    P->>M: Send OTP request
    M->>U: Display OTP
    U->>C: Provide OTP
    
    C->>P: POST /api/WebApp?Action=ValidateOTP<br>{cid: "xxxxx", otp: "AA999999"}<br>Header: MOPH AccountCenter JWT
    P->>C: Validate OTP
    
    Note over C,P: After successful validation
    C->>P: POST API requests with<br>{cid: "xxxxx", otp: "AA999999"}
    P->>C: Return requested data


```

### ขั้นตอนวิธีการที่ 2

สามารถขอ OTP ด้วยบัตรประชาชน โดยใช้ Url นี้เพื่อเปิดระบบ OAuth2.0 
https://phr1.moph.go.th/oauth2/auth?response_type=code&client_id=client-id&redirect_uri=http://127.0.0.1:8080&scope=Administrator&state=xxxxxxxxxyyyyyyyyyyyzzzzzzzzzz

และ ใช้ url นี้ เพื่อ ขอ token

https://phr1.moph.go.th/oauth2/token

หลังจากได้ OTP มาแล้วสามารถนำไปใช้ตามขั้นตอนข้อ 1 ได้

(รายละเอียดอยู่ในภาคผนวก ข.)

**Diagram แสดงขั้นตอนวิธีที่ 2**
```kroki
mermaid
sequenceDiagram
    participant C as Client
    participant P as PHR OAuth
    participant U as Card Reader Agent

    C->>P: GET /oauth2/auth<br>with client_id, redirect_uri
    P->>U: Request ID card reading
    U->>P: Provide ID card data
    P->>C: Return authorization code
    
    C->>P: POST /oauth2/token
    P->>C: Return OTP
    
    Note over C,P: Continue with Method 1 flow<br>using received OTP
    C->>P: POST API requests with<br>{cid: "xxxxx", otp: "AA999999"}
    P->>C: Return requested data

```

### ขั้นตอนวิธีการที่ 3

เป็นการใช้ Token ของ HealthID เพื่อขอข้อมูลจาก PHR API  (กรุณาติดต่อ สำนักสุขภาพดิจิทัล กระทรวงสาธารณสุข เพื่อขอ ClientID / Secret Key ในการใช้งาน HealthID OAuth 2.0)

หลังจากที่เปิด URL https://moph.id.th/oauth/redirect?response_type=code&client_id=xxxx..... ด้วย web browser และได้รับการ callback ส่ง code กลับมาและนำไปขอ profile จาก HealthID จะได้ payload กลับมาดังตัวอย่างนี้

```json
{
   "status":"success",
   "data":{
  	"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.xxx.yyy",
  	"token_type":"Bearer",
  	"expires_in":7862399,
  	"account_id":"zzzzzzzzzzzzzzzz"
   },
   "message":"You logged in successfully",
   "status_code":200
}
```

สามารถ นำ access_token ที่ได้รับ (**eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.xxx.yyy**) มาแนบไว้ในส่วนของ Authorization ของ request เพื่อขอข้อมูลกลับมาจาก PHR Endpoint ได้ (cid ต้องตรงกันกับข้อมูลใน jwt ) ดังตัวอย่างคำสั่ง curl ด้านล่างนี้


ตัวอย่าง Method GET
```bash
curl -X GET 'https://phr1.moph.go.th/api/WebApp?Action=Encounter&cid=zzzzzzzzzzzzz' \
-H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.xxx.yyy'
```
ตัวอย่าง Method POST
```bash
curl -X POST 'https://phr1.moph.go.th/api/WebApp?Action=Encounter' \
-H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.xxx.yyy' \
-H 'Content-Type: application/json' \
-d '{"cid": "zzzzzzzzzzzzz"}'
```

**Diagram แสดงขั้นตอนวิธีที่ 3**

```kroki
mermaid
sequenceDiagram
    participant C as Client
    participant H as HealthID OAuth
    participant P as PHR API
    participant U as User

    C->>H: GET moph.id.th/oauth/redirect<br>with client_id
    H->>U: Request login
    U->>H: Authenticate
    H->>C: Return authorization code
    
    C->>H: Exchange code for token
    H->>C: Return access_token<br>and account details
    
    Note over C,P: Use token for API requests
    C->>P: GET/POST API requests<br>Header: Bearer {access_token}
    P->>C: Return requested data
```

## api ที่ใช้ดึงข้อมูล PHR เพื่อนำมาใช้งาน
การดึงข้อมูลจากระบบ PHR ต้องใช้ cid และ otp  
โดยการเรียกใช้ api ด้วย method POST และ payload body ที่ระบุ cid และ otp ตามตัวอย่าง
```json
{"cid" : "xxxxxxxxxxx" , "otp" : "AA999999"}
```
รายการข้อมูลที่สามารถเข้าถึงจาก PHR API มีดังนี้

### PatientSummary
- {BASEURL}/**WebApp**?Action=**PatientSummary**
ใช้แสดงข้อมูลภาพรวมสรุปข้อมูลของบุคคล 
ตัวอย่างข้อมูลที่ได้จะได้รับกลับมา

```json
{
  "result": {
    "patient": {
      "RowID": "XXXXX",
      "cid": "XXXXXXXXXXXXX",
      "birth_date": "XXXX-XX-XX",
      "create_datetime": 135733379243,
      "update_datetime": 135868255179,
      "gender": "F",
      "marital_status": "M",
      "marital_status_name": "คู่",
      "deceased_boolean": false,
      "deceased_date": "1970-01-01",
      "nationality_code": "099",
      "nationality_name": "ไทย",
      "last_organization_code": "XXXXX",
      "encounter_count": 78,
      "organization_count": 2,
      "cd_count": 0,
      "cd_text": "",
      "patient_name_text": "XXXXXXXXXXXXX",
      "allergy_intolerance_text": "AMLODIPINE",
      "coverage_text": "สิทธิหลักประกันสุขภาพแห่งชาติ",
      "observation_count": 108,
      "region_id": 8,
      "blood_group": "",
      "blood_group_display": "",
      "pregnancy": false,
      "last_rcv_data": 0,
      "last_gen_data": 0,
      "gender_text": "หญิง",
      "birth_date_long_text": "XXXXXXXXXXXXX",
      "birth_date_short_text": "XXXXXXXXXXXXX",
      "full_age_text": "XXXXXXXXXXXXX",
      "full_name_th": "XXXXXXXXXXXXX"
    },
    "patient_names_th": [
      {
        "RowID": "XXXXX",
        "prefix": "XXX",
        "first_name": "XXXXXXXXXXXXX",
        "middle_name": "",
        "last_name": "XXXXXXXXXXXXX",
        "display_name": "XXXXXXXXXXXXX",
        "cid": "XXXXXXXXXXXXX",
        "language_code": "TH",
        "create_datetime": 135733379243,
        "update_datetime": 135868255179,
        "organization_code": "XXXXX",
        "is_mark": true,
        "region_id": 0
      }
    ],
    "patient_names_en": []
  },
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:09:36.388Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15009,
  "processing_time_ms": 5735
}
```
### Address
- {BASEURL}/**WebApp**?Action=**Address**
ใช้แสดงข้อมูลที่อยู่ของบุคคล 

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "address_use": "home",
      "text": "ที่อยู่อาศัย",
      "line1": "XXXXXXXXXXXXX",
      "line2": "XXXXXXXXXXXXX",
      "line3": "XXXXX",
      "city": "XXXXXXXXXXXXX",
      "district": "XXXXXXXXXXXXX",
      "state": "XXXXXXXXXXXXX",
      "postal_code": "XXXXX",
      "country_code": "TH",
      "address_code": "XXXXXX",
      "date_start": "XXXX-XX-XX",
      "date_end": null,
      "cid": "XXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "is_mark": true,
      "create_datetime": 135733379243,
      "update_datetime": 135743976718,
      "region_id": 8
    },
    {
      "address_use": "home",
      "text": "ที่อยู่อาศัย",
      "line1": "XXXXXXXXXXXXX",
      "line2": "XXXXXXXXXXXXX",
      "line3": "XXXXX",
      "city": "XXXXXXXXXXXXX",
      "district": "XXXXXXXXXXXXX",
      "state": "XXXXXXXXXXXXX",
      "postal_code": "XXXXX",
      "country_code": "TH",
      "address_code": "XXXXXX",
      "date_start": "XXXX-XX-XX",
      "date_end": null,
      "cid": "XXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "is_mark": true,
      "create_datetime": 135840190743,
      "update_datetime": 135840190743,
      "region_id": 8
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:36:01.293Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15048,
  "processing_time_ms": 0
}
```
### Telecom
- {BASEURL}/**WebApp**?Action=**Telecom**
ใช้แสดงข้อมูลการติดต่อของบุคคล 

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "telecom_system": "phone",
      "telecom_use": "home",
      "value": "XXXXXXXXXX",
      "date_start": null,
      "date_end": null,
      "cid": "XXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "is_mark": true,
      "create_datetime": 135733379243,
      "update_datetime": 135733379243,
      "region_id": 0
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:36:55.347Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15015,
  "processing_time_ms": 15
}
```
### Coverage
- {BASEURL}/**WebApp**?Action=**Coverage**
ใช้แสดงข้อมูลสรุปการใช้สิทธิการรักษา

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "class_group_name": "สิทธิหลักประกันสุขภาพแห่งชาติ",
      "total": 42200.5
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:38:19.282Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15034,
  "processing_time_ms": 16
}
```

- {BASEURL}/**WebApp**?Action=**Coverage&mode=Detail**
ใช้แสดงข้อมูลรายละเอียดสิทธิการรักษาแยกตาม Encounter
ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "_id": "XXXXX",
      "period_start": "XXXX-XX-XX",
      "payer": "สำนักงานหลักประกันสุขภาพแห่งชาติ",
      "class_group_value": "UCS",
      "class_group_name": "สิทธิหลักประกันสุขภาพแห่งชาติ",
      "class_subgroup_value": "77",
      "class_subgroup_name": "ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "contract_main_identifier": "XXXXX",
      "contract_main_display": "XXXXXXXXXXXXX",
      "contract_sub_identifier": "XXXXX", 
      "contract_sub_display": "XXXXXXXXXXXXX",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "reimbursement_amount": 813,
      "paid_amount": 0
    },
    {
      "_id": "XXXXX",
      "period_start": "XXXX-XX-XX",
      "payer": "สำนักงานหลักประกันสุขภาพแห่งชาติ",
      "class_group_value": "UCS",
      "class_group_name": "สิทธิหลักประกันสุขภาพแห่งชาติ",
      "class_subgroup_value": "77",
      "class_subgroup_name": "ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "contract_main_identifier": "XXXXX",
      "contract_main_display": "XXXXXXXXXXXXX",
      "contract_sub_identifier": "XXXXX",
      "contract_sub_display": "XXXXXXXXXXXXX",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "reimbursement_amount": 500,
      "paid_amount": 0
    },
    {
      "_id": "XXXXX",
      "period_start": "",
      "payer": "สำนักงานหลักประกันสุขภาพแห่งชาติ",
      "class_group_value": "UCS",
      "class_group_name": "สิทธิหลักประกันสุขภาพแห่งชาติ",
      "class_subgroup_value": "77",
      "class_subgroup_name": "ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "contract_main_identifier": "",
      "contract_main_display": "",
      "contract_sub_identifier": "",
      "contract_sub_display": "",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "reimbursement_amount": 100,
      "paid_amount": 0
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:40:57.081Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15001,
  "processing_time_ms": 625
}
```

### Encounter
- {BASEURL}/**WebApp**?Action=**Encounter**
ใช้แสดงข้อมูลประวัติการเข้ารับบริการในหน่วยให้บริการ

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "cid": "XXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "organization_name": "XXXXXXXXXXXXX",
      "period_start": "2017-11-14T08:15:17",
      "period_end": "2017-11-14T11:15:17",
      "status": "finished",
      "class_code": "AMB",
      "class_display": "ambulatory",
      "subclass_code": "",
      "subclass_display": "",
      "priority_code": "0",
      "priority_display": "ปกติ",
      "subject_display": "XXXXXXXXXXXXX",
      "type_code": "1",
      "type_display": "มาเอง (ห้องบัตร)",
      "vital_sign_body_weight_kg": 65,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": 37,
      "vital_sign_bp_systolic_mmhg": 110,
      "vital_sign_bp_diastolic_mmhg": 70,
      "vital_sign_body_mass_index": null,
      "vital_sign_respiratory_rate": null,
      "vital_sign_pulse": null,
      "screen_allergy_code": "N",
      "screen_allergy_text": "ปฏิเสธการแพ้",
      "screen_smoking_code": "1", 
      "screen_smoking_text": "ไม่สูบ",
      "screen_drinking_code": "1",
      "screen_drinking_text": "ไม่ดื่ม (ไม่ดื่มในรอบ 12 เดือนที่ผ่านมา)",
      "lab_fbs": null,
      "lab_dtx": null,
      "lab_hba1c": null,
      "lab_tg": null,
      "lab_tc": null,
      "lab_hdl": null,
      "lab_ldl": null,
      "lab_glucurine": null,
      "lab_bun": null,
      "lab_creatinine": null,
      "lab_ast": null,
      "lab_alt": null,
      "lab_cholesterol": null,
      "lab_sodium": null,
      "lab_chloride": null,
      "lab_potassium": null,
      "lab_tco2": null, 
      "lab_spo2": null,
      "lab_o2sat": null,
      "lab_egfr": null,
      "lab_urine_albumin": null,
      "lab_urine_creatinine": null,
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "division_code": "01",
      "division_display": "อายุรกรรม",
      "encounter_cc_text": "ไอมีเสมหะปนเลือดมา2วัน",
      "encounter_hpi_text": "ไอมีเสมหะปนเลือดมา2วัน\r\n",
      "encounter_diagnosis_text": "Bronchiectasis",
      "encounter_coverage_text": "สิทธิหลักประกันสุขภาพแห่งชาติ ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "encounter_diagnosis_icd": "",
      "encounter_medication_text": "",
      "encounter_observation_text": "",
      "condition_count": 4,
      "coverage_count": 1,
      "medication_count": 5,
      "observation_count": 1,
      "diagnostic_report_count": 0,
      "finance_reimbursement_amount": 496,
      "finance_paid_amount": 0,
      "finance_total_amount": 496,
      "period_start_ymd": 2017,
      "period_start_ym": 0,
      "period_start_y": 0,
      "pass_phr_filter": true,
      "phr_filter_note": "",
      "is_mark": true,
      "create_datetime": 135733379275,
      "update_datetime": 135733379277,
      "region_id": 8,
      "hn": "",
      "processing_note": "",
      "last_rcv_data": 0,
      "last_gen_data": 0,
      "vital_sign_bps_text": "110/70",
      "period_start_text": "14 พฤศจิกายน 2560 08:15"
    },
    {
      "cid": "XXXXXXXXXXXXX", 
      "organization_code": "XXXXX",
      "organization_name": "XXXXXXXXXXXXX",
      "period_start": "2017-12-04T07:55:39",
      "period_end": "2017-12-04T10:55:39",
      "status": "finished",
      "class_code": "AMB",
      "class_display": "ambulatory",
      "subclass_code": "",
      "subclass_display": "",
      "priority_code": "0",
      "priority_display": "ปกติ",
      "subject_display": "XXXXXXXXXXXXX",
      "type_code": "1",
      "type_display": "มาเอง (ห้องบัตร)",
      "vital_sign_body_weight_kg": 64,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": null,
      "vital_sign_bp_systolic_mmhg": 108,
      "vital_sign_bp_diastolic_mmhg": 60,
      "vital_sign_body_mass_index": null,
      "vital_sign_respiratory_rate": null,
      "vital_sign_pulse": null,
      "screen_allergy_code": "N",
      "screen_allergy_text": "ปฏิเสธการแพ้",
      "screen_smoking_code": "1",
      "screen_smoking_text": "ไม่สูบ",
      "screen_drinking_code": "1", 
      "screen_drinking_text": "ไม่ดื่ม (ไม่ดื่มในรอบ 12 เดือนที่ผ่านมา)",
      "lab_fbs": 138,
      "lab_dtx": null,
      "lab_hba1c": null,
      "lab_tg": null,
      "lab_tc": null,
      "lab_hdl": null,
      "lab_ldl": null,
      "lab_glucurine": null,
      "lab_bun": null,
      "lab_creatinine": null,
      "lab_ast": null,
      "lab_alt": null,
      "lab_cholesterol": null,
      "lab_sodium": null,
      "lab_chloride": null,
      "lab_potassium": null,
      "lab_tco2": null,
      "lab_spo2": null,
      "lab_o2sat": null,
      "lab_egfr": null,
      "lab_urine_albumin": null,
      "lab_urine_creatinine": null,
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "division_code": "01",
      "division_display": "อายุรกรรม",
      "encounter_cc_text": "f/u DM HTDLP มาผิดนัด อาการปกติ",
      "encounter_hpi_text": "3 วันก่อนมาผืดนัดอาการปกติ\r\n",
      "encounter_diagnosis_text": "Type 2 diabetes mellitus - Non-insulin-dependent diabetes mellitus, without complications, Disorders of lipoprotein metabolism and other lipidaemias - Disorder of lipoprotein metabolism, unspecified, Essential (primary) hypertension",
      "encounter_coverage_text": "สิทธิหลักประกันสุขภาพแห่งชาติ ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "encounter_diagnosis_icd": "",
      "encounter_medication_text": "",
      "encounter_observation_text": "",
      "condition_count": 6,
      "coverage_count": 1,
      "medication_count": 9,
      "observation_count": 1,
      "diagnostic_report_count": 0,
      "finance_reimbursement_amount": 813,
      "finance_paid_amount": 0,
      "finance_total_amount": 813,
      "period_start_ymd": 2017,
      "period_start_ym": 0,
      "period_start_y": 0,
      "pass_phr_filter": true,
      "phr_filter_note": "",
      "is_mark": true,
      "create_datetime": 135733379274,
      "update_datetime": 135733379275,
      "region_id": 8,
      "hn": "",
      "processing_note": "",
      "last_rcv_data": 0,
      "last_gen_data": 0,
      "vital_sign_bps_text": "108/60",
      "period_start_text": "4 ธันวาคม 2560 07:55"
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "organization_code": "XXXXX", 
      "organization_name": "XXXXXXXXXXXXX",
      "period_start": "2018-02-08T07:13:01",
      "period_end": "2018-02-08T10:13:01",
      "status": "finished",
      "class_code": "AMB",
      "class_display": "ambulatory", 
      "subclass_code": "",
      "subclass_display": "",
      "priority_code": "0",
      "priority_display": "ปกติ",
      "subject_display": "XXXXXXXXXXXXX",
      "type_code": "1",
      "type_display": "มาเอง (ห้องบัตร)",
      "vital_sign_body_weight_kg": 60,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": null,
      "vital_sign_bp_systolic_mmhg": 134,
      "vital_sign_bp_diastolic_mmhg": 56,
      "vital_sign_body_mass_index": null,
      "vital_sign_respiratory_rate": null,
      "vital_sign_pulse": null,
      "screen_allergy_code": "N",
      "screen_allergy_text": "ปฏิเสธการแพ้",
      "screen_smoking_code": "1",
      "screen_smoking_text": "ไม่สูบ",
      "screen_drinking_code": "1",
      "screen_drinking_text": "ไม่ดื่ม (ไม่ดื่มในรอบ 12 เดือนที่ผ่านมา)",
      "lab_fbs": 121,
      "lab_dtx": null,
      "lab_hba1c": null,
      "lab_tg": null,
      "lab_tc": null,
      "lab_hdl": null,
      "lab_ldl": null,
      "lab_glucurine": null,
      "lab_bun": null,
      "lab_creatinine": null,
      "lab_ast": null,
      "lab_alt": null,
      "lab_cholesterol": null,
      "lab_sodium": null,
      "lab_chloride": null,
      "lab_potassium": null,
      "lab_tco2": null,
      "lab_spo2": null,
      "lab_o2sat": null,
      "lab_egfr": null,
      "lab_urine_albumin": null,
      "lab_urine_creatinine": null,
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "division_code": "01",
      "division_display": "อายุรกรรม",
      "encounter_cc_text": "F/U DM ,HT DLP  มาตามนัด 3 เดือน",
      "encounter_hpi_text": "1 เดือนก่อนมาไอ มีเสมหะ\r\n",
      "encounter_diagnosis_text": "Type 2 diabetes mellitus - Non-insulin-dependent diabetes mellitus, without complications, Disorders of lipoprotein metabolism and other lipidaemias - Disorder of lipoprotein metabolism, unspecified, Essential (primary) hypertension",
      "encounter_coverage_text": "สิทธิหลักประกันสุขภาพแห่งชาติ ผู้มีอายุเกิน 60 ปีบริบูรณ์",
      "encounter_diagnosis_icd": "",
      "encounter_medication_text": "",
      "encounter_observation_text": "",
      "condition_count": 6,
      "coverage_count": 1,
      "medication_count": 9,
      "observation_count": 1,
      "diagnostic_report_count": 0,
      "finance_reimbursement_amount": 813,
      "finance_paid_amount": 0,
      "finance_total_amount": 813,
      "period_start_ymd": 2018,
      "period_start_ym": 0,
      "period_start_y": 0,
      "pass_phr_filter": true,
      "phr_filter_note": "",
      "is_mark": true, 
      "create_datetime": 135733379273,
      "update_datetime": 135733379274,
      "region_id": 8,
      "hn": "",
      "processing_note": "",
      "last_rcv_data": 0,
      "last_gen_data": 0,
      "vital_sign_bps_text": "134/56",
      "period_start_text": "8 กุมภาพันธ์ 2561 07:13"
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:51:29.661Z", 
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15003,
  "processing_time_ms": 16
}
```
### VitalSign
- {BASEURL}/**WebApp**?Action=**VitalSign**
ใช้แสดงข้อมูลผลการวัด vital sign แบบย่อ

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "period_start": "2024-01-01T08:00:00",
      "period_y": 2024,
      "period_m": 1,
      "period_d": 1,
      "vital_sign_body_weight_kg": 65,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": 37,
      "vital_sign_bp_systolic_mmhg": 110,
      "vital_sign_bp_diastolic_mmhg": 70
    },
    {
      "period_start": "2024-01-02T08:00:00",
      "period_y": 2024,
      "period_m": 1,
      "period_d": 2,
      "vital_sign_body_weight_kg": 64,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": 0,
      "vital_sign_bp_systolic_mmhg": 108,
      "vital_sign_bp_diastolic_mmhg": 60
    },
    {
      "period_start": "2024-01-03T08:00:00",
      "period_y": 2024,
      "period_m": 1,
      "period_d": 3,
      "vital_sign_body_weight_kg": 60,
      "vital_sign_body_height_cm": 148,
      "vital_sign_body_temp_cel": 0,
      "vital_sign_bp_systolic_mmhg": 134,
      "vital_sign_bp_diastolic_mmhg": 56
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:53:11.040Z",
  "EndpointIP": "0.0.0.0",
  "EndpointPort": 0,
  "processing_time_ms": 0
}
```

### Condition
- {BASEURL}/**WebApp**?Action=**Condition**
ใช้แสดงข้อมูลผล Condition แบบสรุป

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "code_display_text": "Type 2 diabetes mellitus - Type 2 diabetes mellitus, without complications",
      "code_text": "E11.9",
      "total": 25
    },
    {
      "code_display_text": "Chornic renal failure - Chronic kidney disease, stage 3",
      "code_text": "N18.3",
      "total": 12
    },
    {
      "code_display_text": "OTH INJ/INF THERAP SUBST - Inject tranquilizer",
      "code_text": "992.6",
      "total": 10
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:55:14.587Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15049,
  "processing_time_ms": 0
}
```

- {BASEURL}/**WebApp**?Action=**Condition&mode=Encounter&Code=xxxx**
ใช้แสดงข้อมูลผล Condition แยกตาม Encounter Ref Code

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "cid": "XXXXXXXXXXXXX",
      "is_mark": true,
      "onset_datetime": "1970-01-01",
      "recorded_datetime": "2017-11-14T08:15:17",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "condition_key_md5": "40595DA3B0A5B59418174AC43C02E985",
      "clinical_status_text": "Active",
      "clinical_verification_text": "Confirmed",
      "clinical_severity_text": "Severe",
      "clinical_category_text": "Diagnosis",
      "code_text": "J47",
      "code_display_text": "Bronchiectasis",
      "asserter_reference": "",
      "asserter_display": "",
      "organization_code": "XXXXX",
      "region_id": 0
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "is_mark": true,
      "onset_datetime": "1970-01-01",
      "recorded_datetime": "2017-11-14T10:22:30",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "condition_key_md5": "C5EA57505033A07A1ADE407772355968",
      "clinical_status_text": "Active",
      "clinical_verification_text": "Confirmed",
      "clinical_severity_text": "-",
      "clinical_category_text": "Diagnosis",
      "code_text": "diagtext",
      "code_display_text": "R/O infected bronchiectasis",
      "asserter_reference": "",
      "asserter_display": "",
      "organization_code": "XXXXX",
      "region_id": 0
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "is_mark": true,
      "onset_datetime": "1970-01-01",
      "recorded_datetime": "2017-11-14T08:15:17",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "condition_key_md5": "4DF56006751FF894D536C679AAED91AC",
      "clinical_status_text": "Inactive",
      "clinical_verification_text": "Confirmed",
      "clinical_severity_text": "-",
      "clinical_category_text": "History of present illness",
      "code_text": "hpi",
      "code_display_text": "[Clinical history redacted]",
      "asserter_reference": "",
      "asserter_display": "",
      "organization_code": "XXXXX",
      "region_id": 0
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:56:34.734Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15033,
  "processing_time_ms": 78
}
```

### Appointment
- {BASEURL}/**WebApp**?Action=**Appointment**
ใช้แสดงข้อมูลการนัดหมายแบบสรุป

- {BASEURL}/**WebApp**?Action=**Appointment&mode=Detail**
ใช้แสดงข้อมูลการนัดหมายแบบมีรายละเอียด

### Observation
- {BASEURL}/**WebApp**?Action=**Observation**
ใช้แสดงข้อมูลผลตรวจทางห้องปฏิบัติการ (สรุป)

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "display": "Glucose",
      "total": "1",
      "min": 161,
      "max": 161,
      "avg": 161,
      "observation_unit": "mg/dl"
    },
    {
      "display": "Creatinine",
      "total": "1",
      "min": 0.85,
      "max": 0.85,
      "avg": 0.85,
      "observation_unit": "mg/dl"
    },
    {
      "display": "K",
      "total": "1",
      "min": 4.27,
      "max": 4.27,
      "avg": 4.27,
      "observation_unit": "mmol/L"
    },
    {
      "display": "Cholesterol",
      "total": "1",
      "min": 149,
      "max": 149,
      "avg": 149,
      "observation_unit": "mg/dL"
    },
    {
      "display": "Triglyceride",
      "total": "1",
      "min": 128,
      "max": 128,
      "avg": 128,
      "observation_unit": "mg/dL"
    },
    {
      "display": "HDL",
      "total": "1",
      "min": 33,
      "max": 33,
      "avg": 33,
      "observation_unit": "mg/dl"
    },
    {
      "display": "LDL-C",
      "total": "1",
      "min": 90.4,
      "max": 90.4,
      "avg": 90.4,
      "observation_unit": "mg/dl"
    },
    {
      "display": "HbA1C",
      "total": "1",
      "min": 10.77,
      "max": 10.77,
      "avg": 10.77,
      "observation_unit": "%"
    },
    {
      "display": "RBC",
      "total": "1",
      "min": 4.26,
      "max": 4.26,
      "avg": 4.26,
      "observation_unit": "Million Cells/cu.mm"
    },
    {
      "display": "Urine Microalbunin",
      "total": "1",
      "min": 17.5,
      "max": 17.5,
      "avg": 17.5,
      "observation_unit": "mg/L"
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T10:58:15.419Z",
  "EndpointIP": "XXX.XXX.XX.X",
  "EndpointPort": 15008,
  "processing_time_ms": 16
}
```

- {BASEURL}/**WebApp**?Action=**Observation&mode=Detail**
ใช้แสดงข้อมูลผลตรวจทางห้องปฏิบัติการ (แยกตามผลตรวจ)

- {BASEURL}/**WebApp**?Action=**Observation&mode=Encounter&Code=xxxx**
ใช้แสดงข้อมูลผลตรวจทางห้องปฏิบัติการ (แยกตาม Encounter Ref Code)

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "cid": "XXXXXXXXXXXXX",
      "issued": "2024-09-12T12:30:59",
      "display": "Glucose SerPl-mCnc",
      "display_text": "Glucose",
      "profile_group_text": "",
      "value_quantity": 161,
      "value_string": "161",
      "interpretation": "",
      "note": "",
      "body_site": "",
      "specimen": "",
      "is_mark": true,
      "category_code": "",
      "tmlt_code": "",
      "loinc_code": "2345-7",
      "observation_unit": "mg/dl",
      "reference_range_normal_low": null,
      "reference_range_normal_high": null,
      "reference_range_text": "",
      "asserter_reference": "",
      "asserter_display": "",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "display_md5": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "organization_name": "Hospital A",
      "create_datetime": 135863362327,
      "update_datetime": 135863362327,
      "region_id": 0
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "issued": "2024-09-12T12:30:59",
      "display": "CKD Stage",
      "display_text": "CKD Stage",
      "profile_group_text": "Creatinine",
      "value_quantity": null,
      "value_string": "ระดับที่ 2 (GFR 60 - 89)",
      "interpretation": "",
      "note": "",
      "body_site": "",
      "specimen": "",
      "is_mark": true,
      "category_code": "",
      "tmlt_code": "",
      "loinc_code": "",
      "observation_unit": "",
      "reference_range_normal_low": null,
      "reference_range_normal_high": null,
      "reference_range_text": "",
      "asserter_reference": "",
      "asserter_display": "",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "display_md5": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "organization_name": "Hospital A",
      "create_datetime": 135863362328,
      "update_datetime": 135863362328,
      "region_id": 0
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "issued": "2024-09-12T12:30:59",
      "display": "Creat SerPl-mCnc",
      "display_text": "Creatinine",
      "profile_group_text": "Creatinine",
      "value_quantity": 0.85,
      "value_string": "0.85",
      "interpretation": "",
      "note": "",
      "body_site": "",
      "specimen": "",
      "is_mark": true,
      "category_code": "",
      "tmlt_code": "",
      "loinc_code": "2160-0",
      "observation_unit": "mg/dl",
      "reference_range_normal_low": null,
      "reference_range_normal_high": null,
      "reference_range_text": "",
      "asserter_reference": "",
      "asserter_display": "",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "display_md5": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "organization_name": "Hospital A",
      "create_datetime": 135863362329,
      "update_datetime": 135863362329,
      "region_id": 0
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T11:04:44.270Z",
  "EndpointIP": "xxx.xxx.xxx.xxx",
  "EndpointPort": 15007,
  "processing_time_ms": 16
}
```

### DiagnosticReport
- {BASEURL}/**WebApp**?Action=**DiagnosticReport&mode=Encounter&Code=xxxx**
ใช้แสดงข้อมูลผลการอ่านฟิลม์รังสี (แยกตาม Encounter Ref Code) กรณีไม่ระบุ mode และ Code จะแสดงข้อมูลผลการอ่านฟิลม์ทั้งหมด

### Medication
- {BASEURL}/**WebApp**?Action=**Medication**
ใช้แสดงข้อมูลสรุปรายการยาที่ได้รับ

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "code_text": "MFM_METFORMIN 500 mg.",
      "total": 2780
    },
    {
      "code_text": "GPZ_GLIPIZIDE 5 mg.",
      "total": 2170
    },
    {
      "code_text": "SIMVASTATIN 20 mg.",
      "total": 1320
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T11:06:29.766Z",
  "EndpointIP": "xxx.xxx.xxx.xxx",
  "EndpointPort": 15024,
  "processing_time_ms": 26297
}
```

- {BASEURL}/**WebApp**?Action=**Medication&mode=Encounter&Code=xxxx**
ใช้แสดงข้อมูลสรุปรายการยาที่ได้รับ ตาม Encounter Ref Code ที่ระบุ

ตัวอย่างข้อมูล
```json
{
  "result": [
    {
      "cid": "XXXXXXXXXXXXX",
      "code_text": "DIMENHYDRINATE 50 mg.",
      "code_text_md5": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "is_mark": true,
      "statement_status": "active",
      "statement_category": "Outpatient",
      "statement_effective_datetime": "2022-02-07T07:33:18",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "category": "medication",
      "finance_qty": 10,
      "finance_unit_price": 0.5,
      "finance_total_price": 5,
      "ref_md_code": "",
      "ref_md_note_text": "",
      "ref_md_statement_text": "13pt(1เม็ด*3pc) รับประทานครั้งละ  1  เม็ด",
      "ref_md_patient_instruction": "รับประทานครั้งละ  1  เม็ด\r\nวันละ  3  ครั้ง   หลังอาหาร\r\nเช้า     กลางวัน     เย็น",
      "create_datetime": 135733379243,
      "update_datetime": 135841803242,
      "region_id": 0
    },
    {
      "cid": "XXXXXXXXXXXXX",
      "code_text": "BETAHISTINE MESILATE 6 mg.",
      "code_text_md5": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "is_mark": true,
      "statement_status": "active",
      "statement_category": "Outpatient",
      "statement_effective_datetime": "2022-02-07T07:33:18",
      "encounter_ref_code": "XXXXX:XXXXXXXXXXXX",
      "organization_code": "XXXXX",
      "category": "medication",
      "finance_qty": 10,
      "finance_unit_price": 1,
      "finance_total_price": 10,
      "ref_md_code": "",
      "ref_md_note_text": "",
      "ref_md_statement_text": "13pt(1เม็ด*3pc) รับประทานครั้งละ  1  เม็ด",
      "ref_md_patient_instruction": "รับประทานครั้งละ  1  เม็ด\r\nวันละ  3  ครั้ง   หลังอาหาร\r\nเช้า     กลางวัน     เย็น",
      "create_datetime": 135733379243,
      "update_datetime": 135841803239,
      "region_id": 0
    }
  ],
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2024-12-19T11:09:21.495Z",
  "EndpointIP": "xxx.xxx.xxx.xxx",
  "EndpointPort": 15005,
  "processing_time_ms": 94
}
```

- {BASEURL}/**WebApp**?Action=**ProfileImage**
ใช้แสดงข้อมูลรูป profile

- {BASEURL}/**WebApp**?Action=**Immunization&mode=Detail**
ใช้แสดงข้อมูลวัคซีนที่ได้รับ

- {BASEURL}/**WebApp**?Action=**Allergy**
ใช้แสดงข้อมูลการแพ้ยาที่มีการรายงานจากหน่วยให้บริการ

- {BASEURL}/**WebApp**?Action=**NCD**
ใช้แสดงข้อมูลโรคเรื้อรังที่ถูกลงทะเบียนไว้ที่หน่วยให้บริการ

- {BASEURL}/**WebApp**?Action=**Referral**
ใช้แสดงข้อมูลโรคเรื้อรังที่ถูกลงทะเบียนไว้ที่หน่วยให้บริการ

- {BASEURL}/**WebApp**?Action=**SelfObservation**
ใช้แสดงข้อมูลผลการวัด Self Observation

- {BASEURL}/**WebApp**?Action=**CareGiver**&mode=2
**คำอธิบาย:**
ใช้สำหรับแสดงข้อมูล **ผู้ดูแล (CareGiver)** โดยสามารถกำหนดค่า `mode` เพื่อเลือกมุมมองของข้อมูลได้ดังนี้
* `mode=1`  แสดงรายชื่อ **ผู้ที่เป็น CareGiver ของบุคคลนั้น** (ตาม `cid` ที่ระบุ)
* `mode=2` *(ค่าเริ่มต้น)*  แสดงรายชื่อว่า **บุคคลนั้น (ตาม cid)** เป็น CareGiver ให้กับใครบ้าง

- {BASEURL}/**WebApp**?Action=**Pregnancy**
ใช้แสดงข้อมูลการตั้งครรภ์ที่ถูกลงทะเบียนไว้ที่หน่วยให้บริการ

- {BASEURL}/**WebApp**?Action=**ReportEncounter**
ใช้แสดงข้อมูลการกำหนดค่าการแจ้งข้อมูลไม่ถูกต้อง

- {BASEURL}/**CodingSystem**
ใช้แสดงข้อมูล Coding System ที่ใช้อ้างอิงในระบบ (อยู่ในระหว่างการปรับปรุงข้อมูล)

- {BASEURL}/**CodingSystem**?System=xxx
ใช้แสดงข้อมูล Coding System ตาม System ที่ระบุ (อยู่ในระหว่างการปรับปรุงข้อมูล)

### api สำหรับแจ้งข้อมูล Encounter ไม่ถูกต้อง
ใช้สำหรับตรวจสอบหรือแจ้งข้อมูล Encounter ในระบบ PHR จากผู้รับบริการ กรณีตรวจพบว่าข้อมูลที่แสดงไม่ถูกต้อง

url ที่ใช้ 
https://phr1.moph.go.th/api/WebApp?Action=ReportEncounter&mode=ADD
method : POST
หมายเหตุ : mode เป็นได้อย่างใดอย่างหนึ่งในรายการนี้ ADD , DELETE , LIST โดย กรณี LIST ระบุเฉพาะ cid เข้ามาอย่างเดียวได้
payload (body) : 
```json
{ 
    "cid" : "0000000000000",
    "encounter_ref_code" : "xxxxx:yyyyyyyyyyyyyy",
    "reason_text" : "Reason Text"
}
```
ตัวอย่าง response
```json
{
  "result": 1,  // จำนวน Encounter ทั้งหมดที่มีการรายงานเข้ามาในระบบ
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2022-12-20T10:47:39.581Z",
  "EndpointIP": "192.168.86.5",
  "EndpointPort": 19004,
  "processing_time_ms": 16
}
```

### api สำหรับตรวจสอบสถานะการทำ eKYC
ใช้สำหรับตรวจสอบข้อมูลสถานะการทำ eKYC
หมายเหตุ ต้องระบุ authorization header เป็น JWT ที่ได้รับจาก MOPH-Account Center ที่ได้สิทธิ MOPH_IDP_API

url ที่ใช้
https://phr1.moph.go.th/idp/api/check_ekyc
method : POST
payload (body) : 
```json
{ 
    "cid" : "0000000000000"
}
```
ตัวอย่าง response
```json
{
  "result": 1,  // จำนวนครั้งที่มีได้มีการใช้ระบบ eKYC และได้นำรหัส PIN Code ไปใช้ยืนยันตัวตนใน application หมอพร้อมแล้ว
  "MessageCode": 200,
  "Message": "OK",
  "RequestTime": "2022-12-20T10:47:39.581Z",
  "EndpointIP": "192.168.86.5",
  "EndpointPort": 19004,
  "processing_time_ms": 16
}
```
### api สำหรับ ฝากข้อมูล Payload ชั่วคราว
ในการใช้งาน Web Application บางระบบจำเป็นต้องมีการรับส่งข้อมูลด้วย method GET ซึ่งหากจำเป็นต้องส่งข้อมูลด้วย method GET สามารถใช้บริการ PasteJSON เพื่อฝาก payload ไว้และได้ id ที่ได้รับส่งไปให้ระบบปลายทางได้ โดยข้อมูลจะถูกเก็บไว้ 1 ชม. หากไม่มีการดึงกลับจะหายไป และจะถูกลบออกทันทีที่มีการดึงกลับ



การ ส่งข้อมูล Payload เข้า Endpoint
https://phr1.moph.go.th/api/PasteJSON?Action=POST
method : POST
payload (body) : // sample json payload data 
```json
{  
   "data" : "xxx"
}
```

ตัวอย่าง result
```json
{
  "result" : "{aaaaa-bbbbb-ccccc-ddddd-eeeee}"
}
```

การใช้ id จาก result ดึงข้อมูลกลับ
https://phr1.moph.go.th/api/PasteJSON?Action=GET
method : GET
```
https://phr1.moph.go.th/api/PasteJSON?Action=GET&code={aaaaa-bbbbb-ccccc-ddddd-eeeee}
```

### api สำหรับ update สถาุนะการส่งข้อมูล จากระบบ HIS
เพื่อให้การตรวจสอบการส่งข้อมูลเข้าระบบ PHR สามารถตรวจสอบสถานะการส่งข้อมูลแยกตามหน่วยให้บริการได้ ระบบส่งข้อมูล (agent) ที่ทำหน้าที่ส่งข้อมูลสามารถส่งข้อมูลเข้ามา update สถานะได้ แยกเป็น 2 ประเภทคือ สถานะ (status) และ ข้อผิดพลาด (error) โดยการส่งข้อมูลสามารถส่งเข้าตาม url ด้านล่าง

หมายเหตุ : การส่ง status / error ควรเว้นระยะการส่งไว้อย่างน้อย 5 วินาที เพื่อป้องกัน error จากการเรียกใช้ api ที่เกิน rate limit ของระบบ



กรณี ส่ง สถานะปกติ
{BASEURL}/**UpdateAgentStatus**
method : POST
payload (body) : 
```json
{  
  "hospital_code" : "00000",
  "agent_status" : "processing ...",
  "agent_computer_name" : "Agent-PC",
  "most_client_version" : "1.0.0.0",
  "agent_version" : "Agent v1.1.1.1"
}
```

กรณี ส่ง สถานะผิดปกติ
{BASEURL}/**UpdateAgentStatus?mode=Error**
method : POST
payload (body) : 
```json
{
  "hospital_code" : "00000",
  "agent_status" : "Error ..."
}
```

### api สำหรับ ตรวจสอบชื่อ Agent ที่กำลังส่งข้อมูล จากระบบ HIS
 

โดยปกติการส่งข้อมูลจากระบบ HIS ไม่จำเป็นต้องส่งข้อมูลพร้อมๆ กันจากระบบส่งหลายๆ เครื่องเพราะอาจจะติด limit จำนวน transaction ที่ถูกส่งเข้าระบบต่อนาที ดังนั้นก่อนที่ agent ที่ส่งข้อมูลจะเริ่มทำงาน สามารถตรวจสอบได้ว่ามีการส่งข้อมูลมาจากเครื่องอื่นๆ หรือเปล่า 



{BASEURL}/**GetAgentComputerName**
method : POST
payload (body) : 
```json
{  
  "hospital_code" : "00000",
}
```


### api สำหรับตรวจสอบข้อมูลที่อยู่บนฐานข้อมูล PHR


api สำหรับ ตรวจสอบรายการข้อมูล Encounter ที่อยู่ใน MOPH-PHR สำหรับตรวจสอบแก้ไขรายการหรือนำไปใช้งานด้านอื่นๆ

การดึงรายการ encounter_ref_code (อยู่ในรูปแบบของ รหัสหน่วยให้บริการ:visit_ref_code) กลับมาจากฐานข้อมูล PHR เพื่อนำมาตรวจสอบข้อมูลรายวันว่าควรส่งข้อมูลของใครเข้าไปเพิ่ม หรือควรลบข้อมูลของใครออกจาก PHR , ใช้ตรวจสอบได้ครั้งละ 1 วัน ระบุ parameter date ให้เป็นวันที่ต้องการตรวจสอบ , data ระบุเป็น encounter_ref_code , hospital_code ระบุเป็นรหัส 5 หลักของหน่วยให้บริการ (ตรวจสอบได้เฉพาะหน่วยให้บริการของตนเอง)

method : GET
```
https://phr1.moph.go.th/api/OrganizationSummary?date=yyyy-mm-dd&data=encounter_ref_code&hospital_code=xxxxx
```


ตัวอย่างการเรียกใช้ api ด้วย curl ผ่าน shell script
```bash
```

ตัวอย่าง payload ที่ได้รับ
```json
```


การดึงรายการ สรุปข้อมูลรายเดือนว่ามีข้อมูลของหน่วยให้บริการแยกเป็นรายวันจำนวนเท่าไหร่ กลับมาจากฐานข้อมูล PHR ใช้ตรวจสอบได้ครั้งละ 1 เดือน ระบุ parameter month เป็นเดือนที่ต้องการตรวจสอบในรูปแบบ yyyy-mm  , data ระบุเป็น month_summary , hospital_code ระบุเป็นรหัส 5 หลักของหน่วยให้บริการ (ตรวจสอบได้เฉพาะหน่วยให้บริการของตนเอง)

method : GET
```
https://phr1.moph.go.th/api/OrganizationSummary?month=yyyy-mm&data=month_summary&hospital_code=xxxxx
```
ตัวอย่าง payload ที่ได้รับ
```json
```

ตัวอย่างการเรียกใช้ api ด้วย curl ผ่าน shell script
```bash
```

### api สำหรับลบข้อมูลของหน่วยให้บริการออกจากระบบ PHR ตาม Encounter
 
การลบข้อมูลของหน่วยให้บริการออกจากฐานข้อมูล PHR สามารถใช้ api RemoveEncounter เพื่อลบออกได้ โดยหลังจากที่ตรวจสอบรายการ encounter_ref_code จาก API OrganizationSummary ได้แล้ว สามารถนำ encounter_ref_code นั้นมาส่งเพื่อให้ระบบลบข้อมูลออกได้ ตาม url ด้านล่างนี้

method : GET
```
{BASEURL}/api/RemoveEncounter?hospital_code=xxxxx&encounter_ref_code=zzzzz:yyyyyyyyyyyyy
```

ตัวอย่างการเรียกใช้ api ด้วย curl ผ่าน shell script
```bash
```


# ภาคผนวก ก. อธิบายโครสร้างข้อมูล

เนื่องจากชุดข้อมูลประกอบไปด้วยโครงสร้างข้อมูลหลายประเภทเพื่อใช้งานในหลายวัตถุประสงค์ รายละเอียดของแต่ละชุดข้อมูลจะถูกอธิบายไว้ในภาคผนวกนี้

## รายละเอียดประเภทของข้อมูล

### identifier 
เป็นข้อมูลประเภทตัวเลข หรือตัวอักษร ที่เกี่ยวข้องกับข้อมูลในชุดข้อมูลนั้นๆ โดย ใช้อ้างอิง/เชื่อมโยงกับแหล่งข้อมูลภายนอก โครงสร้าง

* **identifier**
  * use (code) ประเภทการใช้งาน (usual | official | temp | secondary | old)
  * type รายละเอียดของ identifier
  * system uri ที่อ้างอิงถึง identifier นี้
  * value รหัสของข้อมูล identifier นี้
  * period ช่วงเวลาที่ข้อมูลใน identifier นี้ใช้งานได้
  * assigner หน่วยงานที่ออก value ของ identifier นี้

### HumanName
เป็นข้อมูลชื่อของบุคคล ที่ประกอบไปด้วย ข้อความและการใช้งาน โครสร้าง

* **HumanName**
  * use (code) ประเภทการใช้งาน (usual | official | temp | nickname | anonymous | old | maiden)
  * text ชื่อเต็ม
  * family ชื่อสกุล
  * given ชื่อ (รวมชื่อกลาง)
  * prefix คำนำหน้า
  * suffix ส่วนที่ตามหลังชื่อ 
  * period ช่วงเวลาที่มีการใช้ชื่อนี้

### ContactPoint
เป็นข้อมูลของช่องทางติดต่อสื่อสาร โครงสร้าง

* **ContactPoint**
  * system (code) ประเภทของช่องทาง (phone | fax | email | pager | url | sms | other)
  * value รายละเอียดของช่องทางติดต่อ
  * use (code) วัตถุประสงค์ (home | work | temp | old | mobile)
  * rank ลำดับความสำคัญ (1 = สูงสุด)
  * period ช่วงเวลาที่ช่องทางนี้ถูกใช้งาน

## ชุดข้อมูล Patient

### ขอบเขตการใช้งาน
ข้อมูลในชุดนี้ครอบคลุมข้อมูลส่วนบุคคล ที่ระบุว่าเป็น ใคร โดยเน้นไปที่ข้อมูลประชากร เพื่อรองรับการนำไปบริหารจัดการด้าน งานธุรการ การเงินและบัญชี และการจัดการส่งสินค้า

### โครงสร้างข้อมูล (ชื่อ (ประเภทข้อมูล) คำอธิบาย)

#### Patient
* identifier (identifier) เป็นข้อมูลอ้างอิง ID ของบุคคล
* active (boolean) สถานะการใช้งานข้อมูลของบุคคล
* name (HumanName) ข้อมูลชื่อของบุคคล
* telecom (ContactPoint) รายละเอียดข้อมูลที่ใช้ติดต่อสื่อสาร
* gender (code) ข้อมูลเพศ


# ภาคผนวก ข. การขอ OTP โดยการใช้บัตรประชาชนของผู้รับบริการ

เพื่อให้การเข้าถึงข้อมูลในระบบ PHR สามารถนำไปประยุกต์ใช้กับระบบอื่นๆ ได้ จึงได้มีการพัฒนาระบบ OAuth2.0 ที่มีการปรับปรุงให้ตรวจสอบข้อมูลจากการอ่านบัตร โดย Flow การใช้งานจะเหมือนกับ OAuth2.0 ทั่วไป แต่ใช้ข้อมูลจากการอ่านบัตรประชาชนแทนการใส่ UserID / Password โดยในการอ่านบัตรประชาชนจำเป็นต้องติดตั้ง SmartCard Agent ที่ทำหน้าที่ในการตรวจสอบว่ามีการเสียบบัตรประชาชนในเครื่องอ่านบัตรจริงๆ 
สามารถ Download Agent ได้จาก https://phr1.moph.go.th/webapp/EHPClientAgent_v45.zip

ตัวอย่างหน้าจอ Application SmartCard Agent

![2024-12-12_9-58-13.png](https://wiki.bmscloud.in.th/2024-12-12_9-58-13.png)

โดยสามารถใช้งานได้ผ่าน url https://phr1.moph.go.th/oauth2/auth ซึ่งต้องระบุ parameter เหล่านี้มาด้วย

client_id=client-id: รหัส client-id ของระบบที่ใช้งาน (ช่วงทดสอบใช้รหัส client-id จนกว่าจะเปิดใช้ระบบลงทะเบียนที่เป็นทางการ)
redirect_uri=CALLBACK_URL: url สำหรับให้ web browser ทำการ redirect เพื่อส่ง code ไปให้ กรณีที่ authorize สำเร็จ
response_type=code: กำหนดเป็น code
scope=read: scope ที่ต้องการ ปัจจุบันยังไม่ได้นำไปใช้ สามารถส่ง read เข้ามาได้
state=random code รหัสสุ่มเพื่อป้องกันการ replay attack
ตัวอย่าง url ใช้งาน
```
https://phr1.moph.go.th/oauth2/auth?response_type=code&client_id=client-id&redirect_uri=http://127.0.0.1:8080&scope=read&state=65A062D61FBD44A09C75C80E4D7FBEEA
```
หากเครื่องที่ใช้งานไม่ได้ติดตั้ง SmartCard Agent จะมีปุ่มสีนำเงินแสดงให้ download และข้อความแจ้งเตือนด้านล่าง

![2024-12-12_10-01-19.png](https://wiki.bmscloud.in.th/2024-12-12_10-01-19.png)

เมื่อทำการเปิดโปรแกรม SmartCard Agent และเสียบบัตรประชาชนแล้ว ระบบจะส่งคำขอ Authorization ไปยังระบบ PHR และจะได้ Code ตอบกลับมากับ redirect uri ดังตัวอย่าง
```
http://127.0.0.1:8080/?code=73403a71fe6b4aae938a22338a476e7c&state=65A062D61FBD44A09C75C80E4D7FBEEA
```
ที่ endpoint ฝั่ง redirect uri จะต้องนำ code ที่ได้ ในตัวอย่างคือ 73403a71fe6b4aae938a22338a476e7c ส่งไปขอรหัส OTP ที่ PHR API Endpoint จาก URL https://phr1.moph.go.th/oauth2/token โดยต้องระบุ client_id,client_secret,authorization_code,state,redirect_uri (ตอนนี้สามารถใช้ client_secret=client-secret เพื่อทดสอบก่อนได้) ดังตัวอย่างนี้ ด้วย method POST

https://phr1.moph.go.th/oauth2/token
content-type=application/x-www-form-urlencoded
ตัวอย่าง payload body,
```
client_id=client-id&client_secret=client-secret&grant_type=authorization_code&code=73403a71fe6b4aae938a22338a476e7c&redirect_uri=http://127.0.0.1:8080&state=65A062D61FBD44A09C75C80E4D7FBEEA
```




โดยจะได้รับ payload เป็น json ตามตัวอย่างนี้
```json
{
 "access_token" : "xxxxxxxxxxxxxxxx",
 "otp" : "aaaaaaaaaaa:bbbbbbbbbbb"

}
```
ซึ่ง otp ที่ได้รับจะอยู่ในรูปแบบของ cid:access_token โดยต้องใช้ ข้อมูล cid และ access_token ที่ได้รับ ทำการส่งเข้าไปขอ OTP จริงๆ จากระบบ PHR API โดยจะต้องส่ง JWT ของ MOPH Account Center เพื่อระบุว่าใครเป็นผู้เข้าถึงข้อมูล จาก API นี้

https://phr1.moph.go.th/api/GetPHROTP
method : POST
authorization header เป็น JWT ที่ได้รับจาก MOPH-Account Center
ตัวอย่าง payload (body)

```json
{
 "cid" : "aaaaaaaaaaaaaaa",
 "access_token" : "bbbbbbbbbbbbbb"
}
```

ตัวอย่าง payload ที่ได้รับ
```json
{
  "result" : "XY123456"
}
```
โดยสามารถนำ result ซึ่งเป็นรหัส OTP จริงๆ ในการเข้าถึงข้อมูล นำไปใช้เข้าถึงข้อมูลจาก API หรือจาก WebApp ได้ 


# ภาคผนวก ค. การส่งข้อมูลประวัติสุขภาพของผู้รับบริการราย Encounter

ในการส่งข้อมูลเข้า MOPH PHR ที่ https://phr1.moph.go.th/api/UpdatePHRv1 นั้นสามารถส่งได้ 2 รูปแบบคือ ส่งประวัติทั้งหมดในครั้งเดียว โดยการกำหนด scope ของ Resource managingOrganization เป็น ALL หรือส่งทีละ Encounter (1 Payload มี 1 Encounter) ซึ่งทั้ง 2 รูปแบบมีข้อดีและข้อเสียต่างกัน จากการทดสอบส่งข้อมูลแบบ scope = ALL เข้าระบบนั้น ทางทีมพัฒนาพบว่าการประมวลผลข้อมูลที่ Endpoint จะใช้เวลาค่อนข้างนาน เพราะบางคนมีประวัติการรักษาเป็นหลัก 100 Encounter ซึ่งหากปรับมาใช้การส่งครั้งละ 1 Encounter จะทำให้การส่งในแต่ละครั้งใช้เวลารอการประมวลผลไม่นาน ซึ่งสามารถปรับ Flow การส่งของ Agent ที่พัฒนาเองได้ดังนี้


1.    ตรวจสอบ MOPH-ACC JWT ว่าสามารถใช้งานได้
2.    ตรวจสอบข้อมูลผู้รับบริการโดยแยกให้ประมวลผลครั้งละ 1 วัน ตามช่วงเวลาที่กำหนด (ย้อนหลัง 5 ปี)
    2.1 ตรวจสอบ MOPH-ACC JWT ว่ามีแล้ว และยังไม่หมดอายุ (ควรขอใหม่ ถ้าจะหมดอายุในอีก 15 นาที)
    2.2 เรียกใช้ api /api/OrganizationSummary?date=yyyy-mm-dd&data=encounter_ref_code&hospital_code=xxxxx เพื่อดึงข้อมูล encounter_ref_code ที่มีในระบบ PHR กลับมา ตามวันที่ดำเนินการ โดย encounter_ref_code จะเป็นรหัส หน่วยงาน:encounter_ref_code ที่ส่งเข้าไป (ถ้าส่ง encounter_ref_code เป็นรหัส zzzzzzzzzz ข้อมูลที่ได้รับกลับมาจะเป็น xxxxx:zzzzzzzzzz) และอยู่ในรูปแบบของ array
    2.3 นำ ข้อมูล encounter_ref_code ที่ได้รับนำมาตัดรหัสหน่วยงานออก ให้เหลือ เฉพาะ encounter_ref_code (zzzzzzzzzz) และนำไปตรวจสอบกับข้อมูลในระบบ HIS ว่าควรจะส่งใหม่หรือว่าจะข้ามไป หากมีข้อมูลแล้ว (อาจจะนับจำนวน ว่าหากในวันนั้นจำนวนข้อมูลใน PHR มีเท่ากับจำนวน ผู้รับบริการในวันในระบบ HIS แล้วให้ข้ามไป หรือตรวจสอบข้อมูลในเงื่อนไข อื่นๆ เพื่อที่จะไม่ต้องส่งข้อมูลเข้าไปใหม่ทุกครั้ง) 
    2.4 ส่งข้อมูลในแต่ละ encounter เข้า api /api/UpdatePHRv1 โดยไม่ต้องระบุ scope เป็น ALL (เป็นค่าว่างหรือค่าอื่นๆ)
    2.5 กรณีที่ข้อมูลใน PHR มีมากกว่าข้อมูลในระบบ HIS อาจจะหมายถึงมีการลบข้อมูลการรับบริการออกจากระบบ HIS โดยสามารถลบข้อมูลใน PHR ออกได้ โดยการส่ง encounter_ref_code ที่ตรวจสอบแล้วว่าไม่มีในระบบ HIS เข้าไปลบที่ PHR ผ่าน api /api/RemoveEncounter?hospital_code=xxxxx&encounter_ref_code=xxxxx:yyyyyyyyyyyyy

Flow ขั้นตอนการส่งข้อมูล
```kroki
mermaid
flowchart TD
    Start([เริ่มต้น]) --> CheckToken[ตรวจสอบ MOPH-ACC JWT]
    CheckToken --> ValidToken{Token ใช้งานได้?}
    ValidToken -->|ไม่| GetNewToken[ขอ Token ใหม่]
    GetNewToken --> CheckToken
    
    ValidToken -->|ใช่| ProcessData[ประมวลผลข้อมูลทีละวัน
    ย้อนหลัง 5 ปี]
    
    ProcessData --> CheckTokenExpiry{Token จะหมดอายุ
    ใน 15 นาที?}
    CheckTokenExpiry -->|ใช่| GetNewToken
    
    CheckTokenExpiry -->|ไม่| GetPHRData[เรียก API OrganizationSummary
    เพื่อดึงข้อมูล encounter_ref_code
    ตรวจสอบครั้งละ 1 วัน]
    
    GetPHRData --> CompareData[เปรียบเทียบข้อมูล
    PHR vs HIS
    โดยใช้ encounter_ref_code เทียบข้อมูลทั้ง 2 ฝั่ง]
    
    CompareData --> DataCheck{มีข้อมูลใน HIS?}
    DataCheck -->|ใช่| CheckNeedUpdate{ต้องอัพเดท?}
    CheckNeedUpdate -->|ใช่| UpdatePHR[ส่งข้อมูลเข้า UpdatePHRv1 API
    ทีละ Encounter]
    CheckNeedUpdate -->|ไม่| NextDay[ดำเนินการวันถัดไป]
    
    DataCheck -->|ไม่| RemoveFromPHR[ลบข้อมูลผ่าน RemoveEncounter API]
    
    UpdatePHR --> NextDay
    RemoveFromPHR --> NextDay
    
    NextDay --> CheckComplete{ครบทุกวันที่กำหนด?}
    CheckComplete -->|ไม่| ProcessData
    CheckComplete -->|ใช่| End([จบการทำงาน])
```

# ภาคผนวก ง. API สำหรับแจ้งข้อมูลไม่ถูกต้อง

ในการส่งข้อมูลเข้า MOPH PHR นั้นมีความเป็นไปได้ที่ข้อมูลฝั่งระบบ HIS นั้นไม่ถูกต้อง ซึ่งเกิดขึ้นได้จากหลายปัจจัย เช่น
- ระบุเลขบัตร ปชช. ของผู้รับบริการผิด
- ระบุข้อมูลการเข้ารับบริการที่ไม่ถูกต้อง
และเนื่องจากข้อมูลนี้ผู้รับบริการที่เป็นเจ้าของข้อมูลสามารถตรวจสอบข้อมูลได้จาก Platform หมอพร้อม App และ หมอพร้อม Line OA จึงจำเป็นต้องมีระบบให้เจ้าของข้อมูลสามารถแจ้งข้อมูลที่ไม่ถูกต้องกลับไปยังหน่วยให้บริการทำการตรวจสอบหรือแก้ไขให้ถูกต้องได้


method : POST
```
{BASEURL}/api/MaskEncounter?mode=get
{BASEURL}/api/MaskEncounter?mode=set
```

ตัวอย่าง payload
```json
{
 "cid" : "xxxxxxxxxxxxx",
 "encounter_ref_code" : "hhhhh:zzzzzzzzzzzzz"
}
```

ข้อมูลที่ถูกระบุผ่าน mode=set จะถูกซ่อนจากข้อมูลที่ส่งออกจาก MOPH PHR ผ่าน API และจะถูกนำไปแสดงในทะเบียนข้อมูลที่เจ้าของข้อมูลแจ้งว่าไม่ถูกต้องในระบบ MOPH PHR Dashboard


# ภาคผนวก จ. การสร้าง Token สำหรับส่งข้อมูลเข้า ระบบผ่าน PHR Endpoint

เนื่องจากในบางระบบการส่งข้อมูลไม่สามารถทำการ Login ใหม่ทุกครั้งเพื่อส่งข้อมูลเข้าระบบได้ ระบบ MOPH-PHR จึงได้เตรียมระบบ ส่งข้อมูลด้วย token base แทน JWT ที่ต้องได้รับจาก Account Center หรือ ProviderID โดยมีขั้นตอนการสร้างและการส่งข้อมูลดังนี้

ขั้นตอนแรก สร้าง Token ที่ระบบ PHR Dashboard เข้าเมนู รายการข้อมูล Encounters ที่ส่งเข้ามาจากหน่วยให้บริการ แล้วกดปุ่ม สรุปจำนวนแยกตามวันที่

![phr-token-access.png](/moph-phr/phr-token-access.png)

ถ้า API Token ด้านล่างเป็นค่าว่าง สามารถกดปุ่ม Generate เพื่อสร้างใหม่ (จะเป็นการยกเลิก Token เดิมโดยอัตโนมัติ) Token มีอายุ 1 ปี

![phr-token-create.png](/moph-phr/phr-token-create.png)



การส่งข้อมูล PHR เข้า /api/UpdatePHRv1 สามารถใช้ token ที่ได้รับแทน JWT ได้โดยกำหนดให้อยู่ในรูปแบบของ HCODE:TOKEN เช่น 99999:{AAAAAAA-BBBBBBB-CCCCCCC-DDDDDD} ใช้แทน JWT ในส่วนของ Authorization Bearer ได้ (ใช้ได้เฉพาะ /api/UpdatePHRv1)

ตัวอย่าง
```
Authorization: Bearer 99999:{AAAAAAA-BBBBBBB-CCCCCCC-DDDDDD}
```

