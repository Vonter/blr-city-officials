import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('./officials/master-list.xlsx')

# Fill NaN values with empty string
df = df.fillna('')

# Convert all columns to string type
for col in df.columns:
    df[col] = df[col].astype(str)

# Convert DataFrame to dictionary
data = df.to_dict('records')

# Write to JSON file
with open('./officials.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
