import requests
import os

# GitHub API Info (No Authentication Needed)
REPO_OWNER = "Poshisfat"  # Change this to your GitHub username
REPO_NAME = "lesson-planner"  # Change this to your GitHub repo name

# GitHub API URL to list all files
url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents"

# Output file to store all files in one place
output_file = "github_files.txt"

# Function to fetch all files from the repository
def fetch_all_files(url, file_list=None):
    if file_list is None:
        file_list = []

    response = requests.get(url)  # No authentication needed

    if response.status_code == 200:
        files = response.json()
        
        for file in files:
            if file["type"] == "file":  # Only fetch files, not directories
                file_name = file["name"]
                file_url = file["download_url"]
                
                if file_url:
                    file_list.append((file_name, file_url))
                
            elif file["type"] == "dir":  # If it's a folder, fetch files inside it
                fetch_all_files(file["url"], file_list)

    else:
        print("❌ Error fetching file list:", response.status_code)

    return file_list

# Function to save all fetched files to one text file
def save_files_to_txt(file_list):
    with open(output_file, "w", encoding="utf-8") as f:
        for file_name, file_url in file_list:
            response = requests.get(file_url)
            
            if response.status_code == 200:
                file_content = response.text
                
                # Write file name as a header
                f.write(f"\n📄 FILE: {file_name}\n")
                f.write("=" * 50 + "\n")
                f.write(file_content + "\n\n")
                
                print(f"✅ Added: {file_name}")

            else:
                print(f"❌ Error fetching {file_name}: {response.status_code}")

# Run script
print("🔄 Fetching files from GitHub repository...")
file_list = fetch_all_files(url)

if file_list:
    save_files_to_txt(file_list)
    print(f"\n✅ All files saved to {output_file}!")
    print("📂 Open `github_files.txt`, copy everything, and paste into Claude.")
else:
    print("❌ No files found or an error occurred.")
