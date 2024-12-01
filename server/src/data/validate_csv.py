import csv

def validate_csv(file_path):
    with open(file_path, mode='r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                int(row['session_id'])
                int(row['student_id'])
                int(row['test_id'])
                int(row['total_marks'])
                int(row['answer_id'])
                int(row['question_id'])
                int(row['selected_choice_id'])
                int(row['course_id'])
                int(row['programme_id'])
                int(row['grade_id'])
                int(row['term_id'])
                # Add checks for other integer columns as necessary
            except ValueError as e:
                print(f"Invalid data type found: {e}")
                print(f"Row: {row}")
                return False
    return True

if __name__ == "__main__":
    file_path = 'extracted_data.csv'  # Path to your downloaded CSV file
    if validate_csv(file_path):
        print("CSV file is correctly formatted.")
    else:
        print("CSV file has formatting issues.")
