import csv
import re
import codecs

input_files = []
# input_files.append("v2_COI_Set_1_modified.csv")
# input_files.append("v2COI_Set_2_modified.csv")
# input_files.append("v2COI_Set_3_modified.csv")
# input_files.append("v2_Updated_Additional_COI.csv")
#input_files.append("v2COI_TrainingSet4_4_18_modified.csv")
input_files.append("additional_100_emails.csv")

## the below file is encoded in "ISO-8859-1" - must take care when opening it
#input_files.append("Additional_COI_50_modified_edited.csv")

pattern1 = re.compile("\.\.\.")
pattern2 = re.compile("\.\.")
pattern3 = re.compile("\.\s")
pattern4 = re.compile("\?")
pattern5 = re.compile("\?\s")
pattern6 = re.compile("\.\,")
pattern7 = re.compile("\r|\n")
pattern8 = re.compile("\n")

## extra work for the 100 emails file. starts as a weirdly encoded xlsx
# excelFileString = "IBM_EntityExtraction 1";
# import pandas as pd
# xls_file = pd.read_excel("email_data/input_files/"+excelFileString+".xlsx", sheetname="GroundTruth_Training")
# xls_file.to_csv("email_data/input_files/Training_Data/100_emails_intermediate_output.csv", index = False, encoding='utf-8')
# input_files.append("100_emails_intermediate_output.csv")

for input_file in input_files:
    with codecs.open("email_data/input_files/Training_Data/output_transformed/transformed_" + input_file, "w", "utf8") as output:
        writer = csv.writer(output, delimiter=',', quotechar='"', quoting=csv.QUOTE_ALL) # define the output
        print("beginning with " + input_file)

        with codecs.open("email_data/input_files/Training_Data/"+input_file, "r", "utf-8") as f:
            reader = csv.reader(f, delimiter=',', quotechar='"')
            for row in reader:
                #print("******* TESTING ********\n\n\n")
                #print("input string")
                #print(row[1])
                outString = pattern1.sub(" ", row[1])
                outString = pattern2.sub(" ", outString)
                outString = pattern3.sub(" ", outString)
                outString = pattern4.sub(" ", outString)
                outString = pattern5.sub(" ", outString)
                outString = pattern6.sub(",", outString)
                outString = pattern7.sub(" ", outString)
                outString = pattern8.sub(" ", outString)
                #print ("******* output string *********")
                #print(outString)
                writer.writerow([row[0], outString])
        print("finished with " + input_file)
