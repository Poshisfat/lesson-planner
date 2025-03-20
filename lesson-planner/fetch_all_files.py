import requests
import os

# GitHub Repository Info (No Authentication Needed)
REPO_OWNER = "Poshisfat"  # Change this to your GitHub username
REPO_NAME = "lesson-planner"  # Change this to your GitHub repo name

# GitHub API URL to list all files
url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents"

# Folder to save the downloaded files
save_folder = "github_files"

# Function to fetch all files from the repository
def fetch_all_files(url):
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)

    response = requests.get(url)  # No authentication needed

    if response.status_code == 200:
        files = response.json()
        
        for file in files:
            if file["type"] == "file":  # Only fetch files, not directories
                file_name = file["name"]
                file_url = file["download_url"]
                
                if file_url:
                    save_file(file_url, file_name)
                
            elif file["type"] == "dir":  # If it's a folder, fetch files inside it
                fetch_all_files(file["url"])

    else:
        print("❌ Error fetching file list:", response.status_code)

# Function to save a file locally
def save_file(file_url, file_name):
    response = requests.get(file_url)

    if response.status_code == 200:
        with open(os.path.join(save_folder, file_name), "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {file_name}")
    else:
        print(f"❌ Error fetching {file_name}: {response.status_code}")

# Run script to fetch all files
print("🔄 Fetching files from GitHub repository...")
fetch_all_files(url)

print("\n✅ All files have been downloaded into the 'github_files' folder!")
