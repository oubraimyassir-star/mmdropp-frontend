import sqlite3
import os

db_path = "c:\\Users\\yassir\\Downloads\\ecom index\\backend\\convertai.db"
if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Listing Users and Roles:")
cursor.execute("SELECT id, email, role, is_active FROM users")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
