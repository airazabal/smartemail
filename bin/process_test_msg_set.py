import requests
import codecs
import json
import csv

# Global values for post service (to externalize)
USERNAME = 'admin'
PASSWORD = '@dm1n'
#URL = 'http://localhost:5000/api/classify'
#URL = 'http://Message-Classifier.mybluemix.net/api/classify'
#URL = 'https://smartemail-hig.mybluemix.net/api/SmartEmails/save'
URL = 'http://localhost:3000/api/SmartEmails/categorize'

#ENTITY_CSV = './data/eval/vehicle_entity.csv'
#TT_CSV = './data/eval/vehicle_tt.csv'
#ENTITY_CSV = './data/eval/coi_entity.csv'
#TT_CSV = './data/eval/coi_tt.csv'
#ENTITY_CSV = './data/eval/cancel_entity.csv'
#TT_CSV = './data/eval/cancel_tt.csv'
ENTITY_CSV = './data/eval/location_entity.csv'
TT_CSV = './data/eval/location_tt.csv'

#--	Conversation Service Wrapper


def post_message(input_message):
  global URL, USERNAME, PASSWORD
  try:
    export_message = {}
    POST_SUCCESS = 200

    local_message_data = json.dumps(input_message)
  #-- PRINT MESSAGE
  #	print('//local_message_data---')
  #	print(local_message_data)

    headerinfo = {'content-type': 'application/json'}
  #-- SECURITY ON SERVICE
    r = requests.post(URL, auth=(USERNAME, PASSWORD),
                      headers=headerinfo, data=json.dumps(input_message))
  #-- NO SECURITY ON SERVICE
  #-- r = requests.post(URL, headers=headerinfo, data=local_message_data)

    if r.status_code == POST_SUCCESS:
      export_message = r.json()
    else:
      print('--r.status_code != POST_SUCCESS')
      print(r.status_code)

  except Exception as e:
    print('--Exception')
    print(e)

  return export_message


#--	Add transaction_type object to transaction_types list
def add_message_type(message_types, transaction_type):
  message_type = {}
  if transaction_type is not None and transaction_type != '' and transaction_type != '{NULL}':
    message_type["transaction_type"] = transaction_type
  #	message_type["confidence_level"] = None
  #	message_type["priority"] = None
  #	message_type["closed_entities"] = []
  #	message_type["context"] = []
  #	message_type["mapped_backend_api"] = None
    message_types.append(message_type)
  return message_types


#--	Read 1st tab: "master-info"
print("## -------------------------------------------------------------------------------")
print("## Loading content...")
print("##  From file: " + TT_CSV)
content = {}
with codecs.open(TT_CSV, 'rb') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    message = {}

  #	root level attributes
    message['id'] = row['Email_#']
  #	message['start_date_time'] = None
  #	message['end_date_time'] = None
  #	message['successfully_processed'] = None

  #	source_email object
    message['source_email'] = {}
  #	message['source_email']['from'] = None
    message['source_email']['subject'] = row['GT_SubjectLine'].decode(
        'ascii', 'ignore')
  #	message['source_email']['date_time'] = None
  #	message['source_email']['to'] = None
    message['source_email']['body'] = row['GT_Body'].decode('ascii', 'ignore')

  #	transaction_types list
    message['transaction_types'] = []

  #	entities_extracted list
    message['entities_extracted'] = []

  #	transaction_api_message_input list
  #	message['transaction_api_message_input'] = []

  #	exception list
    message['exception'] = []

  #	ground_truth object
    message['ground_truth'] = {}
    message['ground_truth']['transaction_types'] = []
    message['ground_truth']['extracted_entities'] = []

    content[row['Email_#']] = message

csvfile.close()
print("")

#--	Read 1st tab: "transaction types"
print("## -------------------------------------------------------------------------------")
print("## Loading transaction_types...")
transaction_types = {}
with codecs.open(TT_CSV, 'rb') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    message_types = []
    message_types = add_message_type(message_types, row['GT_TransType1'])
    message_types = add_message_type(message_types, row['GT_TransType2'])
    message_types = add_message_type(message_types, row['GT_TransType3'])
    message_types = add_message_type(message_types, row['GT_TransType4'])
    transaction_types[row['Email_#']] = message_types
csvfile.close()
print("")


#--	Read 3rd tab: "entity values"
print("## -------------------------------------------------------------------------------")
print("## Loading extracted_entities...")
extracted_entities = {}
with codecs.open(ENTITY_CSV, 'rb') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    if row['EE_EntitiyData'] is not None and row['EE_EntitiyData'] != '' and row['EE_EntitiyData'] != '{NULL}' and row['EE_EntitiyData'] != 'Null':
      wks_entity = {}
      wks_entity["type"] = row['EE_EntityElement'].decode('ascii', 'ignore')
      wks_entity["text"] = row['EE_EntitiyData'].decode('ascii', 'ignore')
    #	wks_entity["offset"] = None
    #	wks_entity["relevance"] = None
    #	wks_entity["count"] = None

    #	Insert blank list if this is the first extracted entity for e-mail
      if row['Email_#'] not in extracted_entities:
        extracted_entities[row['Email_#']] = []
      extracted_entities[row['Email_#']].append(wks_entity)

csvfile.close()
print("")


#--	Assemble object, write messages to log file, call classification message service
print("## -------------------------------------------------------------------------------")
print("## Writing message json to file...")
with codecs.open('./output/Messages.json', 'wb', encoding='utf-8') as f:
  local_messages = []
  print('//--------------------------------------------------')
  print('//--------------------------------------------------')
  print('//len(content)---')
  print(len(content))
  i = 0
  for key in content:
    i += 1
    print('//--------------------------------------------------')
    print('//--------------------------------------------------')
    print('//key---' + str(i))
    print(key)
    if key in transaction_types:
      content[key]['ground_truth']['transaction_types'] = transaction_types[key]
    if key in extracted_entities:
      content[key]['ground_truth']['extracted_entities'] = extracted_entities[key]
  #	new logic to call classifier
    print('//input_message dict---')
    input_message = content[key]
    print(input_message)
    print('//posting message---')
    local_message = post_message(input_message)
  #	print('//local_message---')
  #	print(local_message)
    local_messages.append(local_message)
  #	f.write("Message: " + key + "\n")
  #	for transaction_type in local_message['transaction_types']:
  #		f.write(transaction_type['transaction_type'] + ': ')
  #		f.write(str(transaction_type['confidence_level']) + "\n")
  #	f.write("\n")
  f.write(json.dumps(local_messages, sort_keys=True,
                     indent=4, separators=(',', ': ')) + "\n")
  f.close()
print("")


while True:
  i = 0
