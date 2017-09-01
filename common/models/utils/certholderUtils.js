let entities_dummy_data_simple = [ { type: 'Company_Name',
    text: 'LUAU TECHNOLOGY',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Policy_Number',
    text: '61UECJA4444',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Address_City',
    text: 'HOUSTON, HARRIS',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Address_State',
    text: 'TX',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Address_ZIP',
    text: '77056',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'COI_Wording_Additional_Insured',
    text: 'Additional Insured',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'COI_Wording_All_Other',
    text: 'Special Wording',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Company_Name',
    text: 'LUAU TECHNOLOGY',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Company_Name',
    text: 'Hartford',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Company_Name',
    text: 'Hartford',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Policy_Number',
    text: '61UECJA4444',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'COI_FormType_COI',
    text: 'Certificate',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'COI_FormType_COI',
    text: 'Certificate Holder Name',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Company_Name',
    text: 'ANGLE CONSTRUCTION, LLC',
    disambiguation: { subtype: [Array] },
    count: 1 },
  { type: 'Address_StreetNumber',
    text: '1001 WOODS WAY STE 440',
    disambiguation: { subtype: [Array] },
    count: 1 } ];

let relations_dummy_data_simple = [
    {
      "type": "certholder",
      "sentence": "Subject: LUAU TECHNOLOGY 61UECJA4444 Insured Name: LUAU TECHNOLOGY Line: CAU: Commercial Auto Carrier: Hartford: Hartford Policy Number: 61UECJA4444 Certificate Request Effective Date: 08/07/2017 Certificate Holder Name: ANGLE CONSTRUCTION, LLC Address View Map 1001 WOODS WAY STE 440 HOUSTON, HARRIS, TX 77056 Additional Information Additional Insured Yes Special Wording: Not Entered Any other lines of coverages (Auto, work comp, etc.) Not Entered Comments: Not Entered",
      "score": 0.927308,
      "arguments": [
        {
          "text": "ANGLE CONSTRUCTION, LLC",
          "entities": [
            {
              "type": "Company_Name",
              "text": "ANGLE CONSTRUCTION, LLC",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Certificate Holder Name",
          "entities": [
            {
              "type": "COI_FormType_COI",
              "text": "Certificate Holder Name",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: LUAU TECHNOLOGY 61UECJA4444 Insured Name: LUAU TECHNOLOGY Line: CAU: Commercial Auto Carrier: Hartford: Hartford Policy Number: 61UECJA4444 Certificate Request Effective Date: 08/07/2017 Certificate Holder Name: ANGLE CONSTRUCTION, LLC Address View Map 1001 WOODS WAY STE 440 HOUSTON, HARRIS, TX 77056 Additional Information Additional Insured Yes Special Wording: Not Entered Any other lines of coverages (Auto, work comp, etc.) Not Entered Comments: Not Entered",
      "score": 0.871437,
      "arguments": [
        {
          "text": "1001 WOODS WAY STE 440",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "1001 WOODS WAY STE 440",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "ANGLE CONSTRUCTION, LLC",
          "entities": [
            {
              "type": "Company_Name",
              "text": "ANGLE CONSTRUCTION, LLC",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: LUAU TECHNOLOGY 61UECJA4444 Insured Name: LUAU TECHNOLOGY Line: CAU: Commercial Auto Carrier: Hartford: Hartford Policy Number: 61UECJA4444 Certificate Request Effective Date: 08/07/2017 Certificate Holder Name: ANGLE CONSTRUCTION, LLC Address View Map 1001 WOODS WAY STE 440 HOUSTON, HARRIS, TX 77056 Additional Information Additional Insured Yes Special Wording: Not Entered Any other lines of coverages (Auto, work comp, etc.) Not Entered Comments: Not Entered",
      "score": 0.982719,
      "arguments": [
        {
          "text": "HOUSTON, HARRIS",
          "entities": [
            {
              "type": "Address_City",
              "text": "HOUSTON, HARRIS",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "1001 WOODS WAY STE 440",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "1001 WOODS WAY STE 440",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: LUAU TECHNOLOGY 61UECJA4444 Insured Name: LUAU TECHNOLOGY Line: CAU: Commercial Auto Carrier: Hartford: Hartford Policy Number: 61UECJA4444 Certificate Request Effective Date: 08/07/2017 Certificate Holder Name: ANGLE CONSTRUCTION, LLC Address View Map 1001 WOODS WAY STE 440 HOUSTON, HARRIS, TX 77056 Additional Information Additional Insured Yes Special Wording: Not Entered Any other lines of coverages (Auto, work comp, etc.) Not Entered Comments: Not Entered",
      "score": 0.969398,
      "arguments": [
        {
          "text": "TX",
          "entities": [
            {
              "type": "Address_State",
              "text": "TX",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "HOUSTON, HARRIS",
          "entities": [
            {
              "type": "Address_City",
              "text": "HOUSTON, HARRIS",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: LUAU TECHNOLOGY 61UECJA4444 Insured Name: LUAU TECHNOLOGY Line: CAU: Commercial Auto Carrier: Hartford: Hartford Policy Number: 61UECJA4444 Certificate Request Effective Date: 08/07/2017 Certificate Holder Name: ANGLE CONSTRUCTION, LLC Address View Map 1001 WOODS WAY STE 440 HOUSTON, HARRIS, TX 77056 Additional Information Additional Insured Yes Special Wording: Not Entered Any other lines of coverages (Auto, work comp, etc.) Not Entered Comments: Not Entered",
      "score": 0.992369,
      "arguments": [
        {
          "text": "77056",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "77056",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "TX",
          "entities": [
            {
              "type": "Address_State",
              "text": "TX",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    }
  ];

let entities_dummy_data = [
    {
      "type": "Policy_Number",
      "text": "#76WEG GX1030",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "COI_FormType_COI",
      "text": "insurance certificate",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "MA",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "02062",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "30 nox Street Unit 1 through 9",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "Norwood",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "MA",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "02062",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "Jon S Martini Management",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "700 Ponset Street",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "Canton",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "MA",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "02021",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "Town Of Norwood",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "45 N Central St",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "Norwood",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    }
  ]

  let relations_dummy_data= [
    {
      "type": "certholder",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.98572,
      "arguments": [
        {
          "text": "Jon S Martini Management",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Jon S Martini Management",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "insurance certificate",
          "entities": [
            {
              "type": "COI_FormType_COI",
              "text": "insurance certificate",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.994248,
      "arguments": [
        {
          "text": "02062",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "02062",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.982585,
      "arguments": [
        {
          "text": "Norwood",
          "entities": [
            {
              "type": "Address_City",
              "text": "Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "30 nox Street Unit 1 through 9",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "30 nox Street Unit 1 through 9",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.993355,
      "arguments": [
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Norwood",
          "entities": [
            {
              "type": "Address_City",
              "text": "Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.998654,
      "arguments": [
        {
          "text": "02062",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "02062",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "certholder",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.551161,
      "arguments": [
        {
          "text": "Town Of Norwood",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Town Of Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "insurance certificate",
          "entities": [
            {
              "type": "COI_FormType_COI",
              "text": "insurance certificate",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.995673,
      "arguments": [
        {
          "text": "700 Ponset Street",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "700 Ponset Street",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Jon S Martini Management",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Jon S Martini Management",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.997283,
      "arguments": [
        {
          "text": "Canton",
          "entities": [
            {
              "type": "Address_City",
              "text": "Canton",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "700 Ponset Street",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "700 Ponset Street",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.993975,
      "arguments": [
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Canton",
          "entities": [
            {
              "type": "Address_City",
              "text": "Canton",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.996619,
      "arguments": [
        {
          "text": "02021",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "02021",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.986839,
      "arguments": [
        {
          "text": "45 N Central St",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "45 N Central St",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Town Of Norwood",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Town Of Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.990043,
      "arguments": [
        {
          "text": "Norwood",
          "entities": [
            {
              "type": "Address_City",
              "text": "Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "45 N Central St",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "45 N Central St",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: Policy #76WEG GX1030 Can you send me an insurance certificate to the following: Jon S Martini Management 700 Ponset Street Canton, MA 02021 Town Of Norwood 45 N Central St Norwood, MA 02062 Work performed at 30 nox Street Unit 1 through 9 Norwood, MA 02062",
      "score": 0.980303,
      "arguments": [
        {
          "text": "MA",
          "entities": [
            {
              "type": "Address_State",
              "text": "MA",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Norwood",
          "entities": [
            {
              "type": "Address_City",
              "text": "Norwood",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    }
  ]


  entities_dummy_data = [
    {
      "type": "Company_Name",
      "text": "STARLIT CUSTOM DESIGN, INC",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Policy_Number",
      "text": "76WEGGI1234",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "446 Kentucky Avenue 9th Floor",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "New York",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "NY",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "10447",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "Starlit Custom Design, Inc",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "455 Wrong Street",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "Lark",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "NJ",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "07114",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Phone_Number",
      "text": "(973) 621-1234",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "COI_FormType_COI",
      "text": "CERTIFICATE HOLDER",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Delivery_Method",
      "text": "email",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Email",
      "text": "rm@starlit.com",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "Starlit Custom Design, Inc",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "CAM Industries, Inc",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_StreetNumber",
      "text": "133 W 22nd Street 90th Floor",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_City",
      "text": "New York",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_State",
      "text": "NY",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Address_ZIP",
      "text": "10447",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "COI_FormType_COI",
      "text": "CERTIFICATE HOLDER",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    },
    {
      "type": "Company_Name",
      "text": "Lansky Properties, Inc",
      "disambiguation": {
        "subtype": [
          "NONE"
        ]
      },
      "count": 1
    }
  ]

  relations_dummy_data = [
    {
      "type": "certholder",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.921769,
      "arguments": [
        {
          "text": "CAM Industries, Inc",
          "entities": [
            {
              "type": "Company_Name",
              "text": "CAM Industries, Inc",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "CERTIFICATE HOLDER",
          "entities": [
            {
              "type": "COI_FormType_COI",
              "text": "CERTIFICATE HOLDER",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.995129,
      "arguments": [
        {
          "text": "10447",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "10447",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "NY",
          "entities": [
            {
              "type": "Address_State",
              "text": "NY",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.993186,
      "arguments": [
        {
          "text": "455 Wrong Street",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "455 Wrong Street",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Starlit Custom Design, Inc",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Starlit Custom Design, Inc",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.987668,
      "arguments": [
        {
          "text": "Lark",
          "entities": [
            {
              "type": "Address_City",
              "text": "Lark",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "455 Wrong Street",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "455 Wrong Street",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.990321,
      "arguments": [
        {
          "text": "NJ",
          "entities": [
            {
              "type": "Address_State",
              "text": "NJ",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Lark",
          "entities": [
            {
              "type": "Address_City",
              "text": "Lark",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.998448,
      "arguments": [
        {
          "text": "07114",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "07114",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "NJ",
          "entities": [
            {
              "type": "Address_State",
              "text": "NJ",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "send_to",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.563817,
      "arguments": [
        {
          "text": "email",
          "entities": [
            {
              "type": "Delivery_Method",
              "text": "email",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "rm@starlit.com",
          "entities": [
            {
              "type": "Email",
              "text": "rm@starlit.com",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.995179,
      "arguments": [
        {
          "text": "133 W 22nd Street 90th Floor",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "133 W 22nd Street 90th Floor",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "CAM Industries, Inc",
          "entities": [
            {
              "type": "Company_Name",
              "text": "CAM Industries, Inc",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.997121,
      "arguments": [
        {
          "text": "New York",
          "entities": [
            {
              "type": "Address_City",
              "text": "New York",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "133 W 22nd Street 90th Floor",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "133 W 22nd Street 90th Floor",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.992565,
      "arguments": [
        {
          "text": "NY",
          "entities": [
            {
              "type": "Address_State",
              "text": "NY",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "New York",
          "entities": [
            {
              "type": "Address_City",
              "text": "New York",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "zip_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.99713,
      "arguments": [
        {
          "text": "10447",
          "entities": [
            {
              "type": "Address_ZIP",
              "text": "10447",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "NY",
          "entities": [
            {
              "type": "Address_State",
              "text": "NY",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "certholder",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.874471,
      "arguments": [
        {
          "text": "Lansky Properties, Inc",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Lansky Properties, Inc",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "CERTIFICATE HOLDER",
          "entities": [
            {
              "type": "COI_FormType_COI",
              "text": "CERTIFICATE HOLDER",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "related_to",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.974408,
      "arguments": [
        {
          "text": "446 Kentucky Avenue 9th Floor",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "446 Kentucky Avenue 9th Floor",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "Lansky Properties, Inc",
          "entities": [
            {
              "type": "Company_Name",
              "text": "Lansky Properties, Inc",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "city_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.978931,
      "arguments": [
        {
          "text": "New York",
          "entities": [
            {
              "type": "Address_City",
              "text": "New York",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "446 Kentucky Avenue 9th Floor",
          "entities": [
            {
              "type": "Address_StreetNumber",
              "text": "446 Kentucky Avenue 9th Floor",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "state_of",
      "sentence": "Subject: FW: STARLIT CUSTOM DESIGN, INC - POLICY # 76WEGGI1234 CERTIFICATE HOLDER # 1: CAM Industries, Inc 133 W 22nd Street 90th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office CERTIFICATE HOLDER # 2: Lansky Properties, Inc 446 Kentucky Avenue 9th Floor New York, NY 10447 DESCRIPTION OF OPERATIONS MUST STATE THE FOLLOWING: Job # 17-0017- WISH-NY Office Real Marchins - OFFICE MANAGER ___________________________________ Starlit Custom Design, Inc 455 Wrong Street, Lark, NJ 07114 Tel: (973) 621-1234 email: rm@starlit.com CONFIDENTIALITY NOTE This message is the property of Starlit Custom Design, Inc It may be legally privileged and/or confidential and is intended only for the use of the addressee(s) No addressee should forward,",
      "score": 0.992675,
      "arguments": [
        {
          "text": "NY",
          "entities": [
            {
              "type": "Address_State",
              "text": "NY",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        },
        {
          "text": "New York",
          "entities": [
            {
              "type": "Address_City",
              "text": "New York",
              "disambiguation": {
                "subtype": [
                  "NONE"
                ]
              }
            }
          ]
        }
      ]
    }
  ]

const create_entities_relations = (entities, relations, email_id) => {
  var Graph = require("graph-data-structure");
  let g = Graph();
  let _relations = relations
  //console.log(JSON.stringify(_relations, null, 4));
  // _entities = entities.filter(_entity => (_entity.type != "Company_Name" && _entity.text != "Hartford" || _entity.type == "COI_Wording_All_Other"))
  //console.log(JSON.stringify(_entities, null, 4));

  // TODO: FIX THIS FILTERING IT"S NOT WORKING
  // console.log("now filtered out unique")
  // var _entities = _entities.filter(function(elem, index, self) {
  //   return index == self.indexOf(elem);
  // })
  // console.log(JSON.stringify(_entities, null, 4));

  let id = 0
  let _entities = {}

  // strip down the entities, and give them all ids
  // these can be accessed using a dictionary
  entities.forEach(function(_entity) {
    _entities[id] = {}
    _entities[id]["type"] = _entity.type
    _entities[id]["text"] = _entity.text
    id++;
  });
  // add the nodes to the graph
  for (let entity_id of Object.keys(_entities)) {
    g.addNode(entity_id)
  }
  // NEW RELATION LOGIC
  let ordered_relations = ['certholder','related_to', 'city_of', 'state_of', 'zip_of']// 'state_of', 'zip_of']

  for (let ordered_relation of ordered_relations) {
    //console.log("focusing on relation: " + ordered_relation)
    let focus_relations = _relations.filter((relation => relation.type == ordered_relation))
    for (let focus_relation of focus_relations) {
      // first, find the source_id
      let source_type = focus_relation.arguments[1].entities[0].type;
      let source_text = focus_relation.arguments[1].entities[0].text;
      let source_id = null;
      for (let entity_id of Object.keys(_entities)) { // iterate through possible source entities
        if (_entities[entity_id].text == source_text && _entities[entity_id].type == source_type){
          if (ordered_relation == 'certholder') {
            source_id = entity_id; // with certholder, allow multiple companies to point to it
            break;
          } else if (_entities[entity_id].visited_as_source != true){ // for all other entity types, need to ensure that it hasn't been visited as a source before
            source_id = entity_id;                                    // should skip over an entity_id that has been visited, and find the next matching entity
            _entities[entity_id].visited_as_source = true;
            break;
          }
        }
      }
      let target_type = focus_relation.arguments[0].entities[0].type;
      let target_text = focus_relation.arguments[0].entities[0].text;
      let target_id = null;
      for (let entity_id of Object.keys(_entities)) { // iterate through possible target entities
        if (_entities[entity_id].text == target_text && _entities[entity_id].type == target_type){
          if (ordered_relation == 'certholder') {
            target_id = entity_id; // with certholder, allow multiple companies to point to it automatically
            break;
          } else if (_entities[entity_id].visited_as_target != true){ // for all other entity types, need to ensure that it hasn't been visited as a source before
            target_id = entity_id;                                    // should skip over an entity_id that has been visited, and find the next matching entity
            _entities[entity_id].visited_as_target = true;
            break;
          }
        }
      }
      // now, should have found both the source and target_id
      if(target_id && source_id) {
          g.addEdge(source_id, target_id)
          // console.log("source: " + source_id + "                            ====>  target: " + target_id)
          // console.log("source_text: " + source_text + "   ====>  target_text: " + target_text)
          // console.log("source_type: " + source_type + "   ====>  target_type: " + target_type)
      } else {
        console.log("FAILED TO FIND EDGE on email: " + email_id)
        console.log(JSON.stringify(focus_relation, null, 2))
        console.log("source: " + source_id + "                            ====>  target: " + target_id)
        console.log("source_text: " + source_text + "   ====>  target_text: " + target_text)
        console.log("source_type: " + source_type + "   ====>  target_type: " + target_type)
        let add_unfound_entity = true;
        if (add_unfound_entity) {
          console.log("need to add an unfound entity ^ the above")
          if (!source_id) {
            let next_id = (Math.max(...(Object.keys(_entities)).map((s) => parseInt(s))) + 1).toString() // get the next id for entities
            console.log("next id is: from source id: " + next_id)
            _entities[next_id] = {}
            _entities[next_id].text = source_text
            _entities[next_id].type = source_type
            _entities[next_id].visited_as_source = true
            source_id = next_id;
          }
          if (!target_id) {
            let next_id = (Math.max(...(Object.keys(_entities)).map((s) => parseInt(s))) + 1).toString() // get the next id for entities
            console.log("next id is: from target id: " + next_id)
            _entities[next_id] = {}
            _entities[next_id].text = target_text
            _entities[next_id].type = target_type
            _entities[next_id].visited_as_target = true
            target_id = next_id;
            console.log("new id added")
            console.log(JSON.stringify(_entities[next_id], null, 2))
          }
          g.addEdge(source_id, target_id)
          // console.log("entities: ")
          // console.log(_entities)
          // console.log("relations: ")
          // console.log(_relations)
          // process.exit()
        }
      }
    }
  }
  // END NEW RELATION LOGIC

  // OLD RELATION LOGIC
  //now, trying to add each relation to the graph.
  // console.log("\n\n-------finding the following relations: -------")
  //
  // for (let _relation of _relations) {
  //   // find the source node ID
  //   // console.log(JSON.stringify(_relation, null, 2))
  //   let source_type = _relation.arguments[0].entities[0].type;
  //   let source_text = _relation.arguments[0].entities[0].text;
  //   let source_id = null;
  //   // console.log("looking for source text " + source_text)
  //   // console.log("looking for source type " + source_type)
  //
  //   for (let entity_id of Object.keys(_entities)) {
  //     if (_entities[entity_id].text == source_text && _entities[entity_id].type == source_type){
  //       // console.log("found it")
  //
  //       // console.log(_entities[entity_id])
  //       source_id = entity_id
  //       break;
  //     }
  //   }
  //
  //   // find the target node id
  //   let target_type = _relation.arguments[1].entities[0].type
  //   let target_text = _relation.arguments[1].entities[0].text
  //   let target_id = null;
  //
  //   // console.log("looking for target text " + target_text)
  //   // console.log("looking for target type " + target_type)
  //   for (let entity_id of Object.keys(_entities)) {
  //     if (_entities[entity_id].text == target_text && _entities[entity_id].type == target_type && !_entities[entity_id].visited) {
  //       if (_entities[entity_id].type == 'Address_StreetNumber' || _entities[entity_id].type == 'Address_City' ||
  //           _entities[entity_id].type == 'Address_State' || _entities[entity_id].type == 'Address_Zip') {
  //             // need to mark visited
  //             _entities[entity_id].visited = true
  //           }
  //       target_id = entity_id;
  //       break;
  //     }
  //   }
  //   //let source_id = _entities.filter(_entity => (_entity.type == source_type && _entity.text == source_text));
  //   console.log(target_id + " " + target_type + ": "+ target_text + "'  ---> " + source_id + ": "+ source_type + ": '"+ source_type+ "'")
  //   // note, switching the relationships order from the WKS model to make them more intuitive
  //   if(target_id && source_id) {
  //     g.addEdge(target_id, source_id)
  //   }
  // }
  // END OLD RELATION LOGIC

  console.log("\n\n ~~~~~~~~~   entities are   ~~~~~~~~~")
  console.log(_entities)
  console.log(" ~~~~~~~~~   end entities   ~~~~~~~~~")

  console.log("\n\n ~~~~~~~~~   relations are   ~~~~~~~~~")
  console.log(JSON.stringify(g.serialize().links, null, 2))
  console.log(" ~~~~~~~~~   end relations   ~~~~~~~~~")
  let returns = {}

// BUILD OUT THE CERTHOLDERS DFS
  let certholders = []
  for (let entity_id of Object.keys(_entities)) {
    if(_entities[entity_id].type == "COI_FormType_COI") {
      certholders.push(entity_id)
    }
  }
  console.log("\n\n ~~~~~~~~~   certholders are are   ~~~~~~~~~")
  console.log(certholders)
  console.log(" ~~~~~~~~~   end certholders   ~~~~~~~~~")
  console.log("\n\ncertholder DFS")
  returns['certholder_dfs'] = []
  for (let certholder of certholders) {
    let dfs_object = {}
    let elements = []
    console.log(g.depthFirstSearch([certholder], true).reverse())
    let dfs = g.depthFirstSearch([certholder], true).reverse()
    let certholder_simple_string = ""
    let certholderDataString = ""
    for (let d of dfs) {
      certholder_simple_string += _entities[d].text + " "
      certholderDataString += _entities[d].type + ": " + _entities[d].text + " =>\n"
      let element = {}
      element['text'] = _entities[d].text
      element['type'] = _entities[d].type
      elements.push(element)
    }
    dfs_object['simpleString'] = certholder_simple_string;
    dfs_object['dataString'] = certholderDataString
    dfs_object['elements'] = elements
    returns['certholder_dfs'].push(dfs_object)
  }

  // BUILD OUT THE COMPANIES DFS
  let companies = []
  for (let entity_id of Object.keys(_entities)) {
    if(_entities[entity_id].type == "Company_Name") {
      companies.push(entity_id)
    }
  }

  console.log("\n\n ~~~~~~~~~   companies are are   ~~~~~~~~~")
  console.log(companies)
  console.log(" ~~~~~~~~~   end companies   ~~~~~~~~~")
  console.log("\n\ncertholder DFS")
  returns['companies_dfs'] = []
  for (let company of companies) {
    let dfs_object = {} // represents the dfs object starting from a single point
    let elements = [] // represents all elements itereated through on the DFS
    let dfs = g.depthFirstSearch([company], true).reverse()
    let company_simple_string = ""
    let companyDataString = ""
    for (let d of dfs) {
      company_simple_string += _entities[d].text + " "
      companyDataString += _entities[d].type + ": " + _entities[d].text + " =>\n"
      let element = {}
      element['text'] = _entities[d].text
      element['type'] = _entities[d].type
      elements.push(element)
    }
    dfs_object['simpleString'] = company_simple_string;
    dfs_object['dataString'] = companyDataString
    dfs_object['elements'] = elements
    returns['companies_dfs'].push(dfs_object)
  }
  console.log("finished creating return object")
  returns['entities'] = _entities

  let street_addresses = []
  for (let entity_id of Object.keys(_entities)) {
    if(_entities[entity_id].type == "Address_StreetNumber") {
      street_addresses.push(entity_id)
    }
  }

  console.log("\n\n ~~~~~~~~~   street_addresses are are   ~~~~~~~~~")
  console.log(street_addresses)
  console.log(" ~~~~~~~~~   end street_addresses   ~~~~~~~~~")
  console.log("\n\n street addresses DFS")
  returns['street_addresses_dfs'] = []
  for (let street_address of street_addresses) {
    let dfs_object = {} // represents the dfs object starting from a single point
    let elements = [] // represents all elements itereated through on the DFS
    let dfs = g.depthFirstSearch([street_address], true).reverse()
    let street_address_simple_string = ""
    let street_address_data_string = ""
    for (let d of dfs) {
      street_address_simple_string += _entities[d].text + " "
      street_address_data_string += _entities[d].type + ": " + _entities[d].text + " =>\n"
      let element = {}
      element['text'] = _entities[d].text
      element['type'] = _entities[d].type
      elements.push(element)
    }
    dfs_object['simpleString'] = street_address_simple_string;
    dfs_object['dataString'] = street_address_data_string
    dfs_object['elements'] = elements
    returns['street_addresses_dfs'].push(dfs_object)
  }


  returns['entities'] = _entities
  //build a more complete relations object, that is more human readable
  // add in the text and type
  relations = g.serialize().links
 _relations = []
  for (let rel of relations) {
    let _relation = {}

    for (let key of Object.keys(rel)) { // keys are "source" and "target"
      let _id = rel[key]
      _relation[key] = {}
      _relation[key]['id'] = _id
      Object.assign(_relation[key], _entities[_id])
      console.log(_relation)
    }
    _relations.push(_relation)

  }
  returns['relations'] = _relations
  console.log(returns)
  return returns;
}
require("./email_entities_and_relations.js")
// create_entities_relations(entities_dummy_data, relations_dummy_data, 1488)
//create_entities_relations(entities_dummy_data_simple, relations_dummy_data_simple, 1522)
// create_entities_relations(email_1578['entities_extracted'], email_1578['relations_extracted'], "email_1578")
// create_entities_relations(email_1560['entities_extracted'], email_1560['relations_extracted'], "email_1560")
module.exports = {
  create_entities_relations: create_entities_relations
}

// console.log(JSON.stringify(email_1484, null, 2))
