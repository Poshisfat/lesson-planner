#!/bin/bash

# Navigate to the project directory
cd "C:/Users/Posh/OneDrive/Lesson Planner/GitHub Repository/lesson-planner/lesson-planner"

# Add all changes
git add .

# Commit with a timestamp
commit_message="Auto-upload: $(date)"
git commit -m "$commit_message"

# Push to GitHub
git push origin main

echo "✅ Upload complete!"
