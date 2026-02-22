import os

file_path = r'c:\Users\yassir\Downloads\ecom index\backend\main.py'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

updated = False
with open(file_path, 'w', encoding='utf-8') as f:
    for line in lines:
        if '"is_active": db_user.is_active' in line and 'onboarding_completed' not in line:
            f.write(line.replace('"is_active": db_user.is_active', '"is_active": db_user.is_active,'))
            indent = line[:line.find('"')]
            f.write(f'{indent}"onboarding_completed": db_user.onboarding_completed\n')
            updated = True
        else:
            f.write(line)

if updated:
    print("Successfully updated main.py")
else:
    print("Could not find the target line or it was already updated")
