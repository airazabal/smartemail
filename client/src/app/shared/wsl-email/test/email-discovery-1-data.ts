const emailResults:any = {
  "id": "9d3d3787-b317-487a-9727-da4abb36b0e3",
  "score": 1,
  "source_email": {
    "body": "From: Williams, Mrs  [mailto:Mrs.Williams@signselect.com] \nSent: Tuesday, March 14, 2017 8:09 AM\nTo: Services, Agency (Comm Lines, San Antonio/SCIC)\nSubject: Policy Cancellation - Kansas Filtration LLC - 37WECBK7671\n\nGood Morning, \n\nPer the insured?s request please cancel the above policy effective 3/20/17.\n\nPlease let me know if you need any additional information.\n\nThank you,\nMrs Williams\nMrs Williams, AINS, Commercial Client Advisor\n",
    "subject": "Policy Cancellation - Kansas Filtration LLC - 37WECBK1234"
  },
  "exception": [],
  "text": "From: Williams, Mrs  [mailto:Mrs.Williams@signselect.com] \nSent: Tuesday, March 14, 2017 8:09 AM\nTo: Services, Agency (Comm Lines, San Antonio/SCIC)\nSubject: Policy Cancellation - Kansas Filtration LLC - 37WECBK7671\n\nGood Morning, \n\nPer the insured?s request please cancel the above policy effective 3/20/17.\n\nPlease let me know if you need any additional information.\n\nThank you,\nMrs Williams\nMrs Williams, AINS, Commercial Client Advisor\n",
  "end_date_time": 1491331780499,
  "transaction_types": [
    {
      "confidence_level": "0.995543971779",
      "priority": "Normal",
      "context": {
        "conversation_id": "80514c57-87e2-45c0-8154-f8eca85f1a27",
        "system": {
          "branch_exited_reason": "completed",
          "dialog_request_counter": 1,
          "branch_exited": true,
          "dialog_turn_counter": 1,
          "dialog_stack": [
            "root"
          ],
          "_node_output_map": {
            "conversation_start": [
              0
            ]
          }
        }
      },
      "mapped_backend_api": "",
      "transaction_type": "Cancellation",
      "closed_entities": []
    }
  ],
  "ground_truth": {
    "extracted_entities": [
      {
        "text": "37WECBK1234",
        "type": "Policy Number "
      },
      {
        "text": "3/20/2017",
        "type": "Effective Date of Cancellation "
      },
      {
        "text": "Agent ",
        "type": "Source of Submission "
      },
      {
        "text": "Mrs.Williams@signselect.com",
        "type": "Requestor Email ID or Fax ID "
      },
      {
        "text": "\nPer the insured?s request please cancel the above policy effective 3/20/17.",
        "type": "Instructions"
      }
    ],
    "transaction_types": [
      {
        "transaction_type": "Cancellation"
      }
    ]
  },
  "start_date_time": 1491331780079,
  "source_id": "T1_231",
  "enriched_text": {
    "status": "OK",
    "language": "english",
    "entities": [
      {
        "count": 3,
        "sentiment": {
          "type": "positive",
          "score": 0.290581,
          "mixed": false
        },
        "text": "Mrs Williams",
        "relevance": 0.903791,
        "type": "Person"
      },
      {
        "count": 1,
        "sentiment": {
          "type": "neutral",
          "mixed": false
        },
        "text": "Kansas Filtration LLC",
        "relevance": 0.268081,
        "type": "Company"
      },
      {
        "count": 1,
        "sentiment": {
          "type": "neutral",
          "mixed": false
        },
        "text": "Commercial Client Advisor",
        "relevance": 0.255205,
        "type": "JobTitle"
      },
      {
        "count": 1,
        "sentiment": {
          "type": "neutral",
          "mixed": false
        },
        "text": "San Antonio/SCIC",
        "relevance": 0.197873,
        "type": "City"
      },
      {
        "count": 1,
        "sentiment": {
          "type": "neutral",
          "mixed": false
        },
        "text": "Mrs.Williams@signselect.com",
        "relevance": 0.197873,
        "type": "EmailAddress"
      }
    ]
  }
}
export {emailResults}
