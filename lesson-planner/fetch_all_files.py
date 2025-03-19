import requests
import os
from dotenv import load_dotenv
import base64

# Load .env file (if using API tokens)
load_dotenv()

# GitHub credentials
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_OWNER = "Poshisfat"  # Your GitHub username
REPO_NAME = "lesson-planner"  # Your repository name

# GitHub API URL to list all files
url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents"
headers = {"Authorization": f"token {GITHUB_TOKEN}"}

# Function to fetch all files from the repository
def fetch_all_files(url, save_folder="github_files"):
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)

    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        files = response.json()
        
        for file in files:
            if file["type"] == "file":  # Only fetch files, not directories
                file_name = file["name"]
                file_url = file["download_url"]
                
                if file_url:
                    save_file(file_url, save_folder, file_name)
                
            elif file["type"] == "dir":  # If it's a folder, fetch files inside it
                fetch_all_files(file["url"], save_folder)

# Function to save a file locally
def save_file(file_url, save_folder, file_name):
    response = requests.get(file_url)
    
    if response.status_code == 200:
        with open(os.path.join(save_folder, file_name), "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {file_name}")
    else:
        print(f"❌ Error fetching {file_name}: {response.status_code}")

# Run script to fetch all files
fetch_all_files(url)
