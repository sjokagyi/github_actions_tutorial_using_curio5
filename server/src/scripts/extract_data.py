import psycopg2
import csv
import os

def extract_data():
    # Ensure the directory exists
    output_dir = 'data'
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'extracted_data.csv')

    # Database connection parameters
    conn = psycopg2.connect(
        dbname="curio4",
        user="postgres",
        password="maristprep",
        host="localhost",
        port="5432"
    )

    # Query to extract data related to test sessions and student answers
    query = """
    SELECT 
        sts.id AS session_id,
        sts.student_id,
        sts.test_id,
        sts.start_time,
        sts.end_time,
        sts.total_marks,
        sa.id AS answer_id,
        sa.question_id,
        sa.selected_choice_id,
        sa.text_answer,
        sa.is_fill_in_correct,
        t.title AS test_title,
        t.course_id,
        t.programme_id,
        t.grade_id,
        t.term_id
    FROM 
        questions_studenttestsession AS sts
    JOIN 
        questions_studentanswer AS sa ON sa.test_session_id = sts.id
    JOIN 
        questions_test AS t ON t.id = sts.test_id
    """

    # Execute query and fetch data
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()

    # Get column names
    column_names = [desc[0] for desc in cursor.description]

    # Save data to CSV
    with open(output_file, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(column_names)
        csvwriter.writerows(rows)

    # Close cursor and connection
    cursor.close()
    conn.close()

    # Print the path of the created file
    print(f"Data extracted and saved to {os.path.abspath(output_file)}")

if __name__ == "__main__":
    extract_data()
