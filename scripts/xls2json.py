import pandas as pd
import json

# Read the Excel file
df1 = pd.read_excel('./officials/master-list.xlsx', sheet_name=0)
df2 = pd.read_excel('./officials/master-list.xlsx', sheet_name=1)

# Merge the two dataframes by row number
df = pd.concat([df1, df2], axis=1)

# Add cell references
df['cellRef'] = df.index.map(lambda x: f'A{x+2}')  # +2 because Excel is 1-based and has header

# Rename columns
df = df.rename(columns={
    'Area (Kannada)': 'AreaKN',
    'Designation (Kannada)': 'DesignationKN',
    'Name (Kannada)': 'NameKN'
})

# Fill NaN values with empty string
df = df.fillna('')

# Replace specified text in cells
df = df.replace({
    'Administrative (District)': 'admin_district',
    'Administrative (Taluk)': 'admin_taluk',
    'BBMP (Ward)': 'bbmp_wards',
    'BBMP (Zone)': 'bbmp_zone',
    'BESCOM (Division)': 'bescom_division',
    'BESCOM (Subdivision)': 'bescom_subdivision',
    'BWSSB (Division)': 'bwssb_division',
    'BWSSB (Service Station)': 'bwssb_service_station',
    'Elections (Assembly Constituency)': 'election_ac',
    'Elections (Parliamentary Constituency)': 'election_pc',
    'Pincode': 'pincode',
    'City Police': 'police_city',
    'Traffic Police': 'police_traffic',  
    'Stamps (SRO)': 'stamps_sro',
    'Stamps (DRO)': 'stamps_dro',
})

# Convert all columns to string type
for col in df.columns:
    df[col] = df[col].astype(str)

# Convert DataFrame to dictionary
data = df.to_dict('records')

# Write to JSON file
with open('./officials.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
