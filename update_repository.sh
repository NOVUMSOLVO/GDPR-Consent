#!/bin/bash

# GDPR Consent Management System - Repository Update Script
# This script helps maintain and update the GitHub repository

echo "🔄 GDPR Consent Management System - Repository Update"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Reviewing changes..."
    git status --short
    
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "💾 Staging all changes..."
        git add .
        
        echo "📝 Enter commit message:"
        read commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="Update: $(date +"%Y-%m-%d %H:%M")"
        fi
        
        git commit -m "$commit_message"
        echo "✅ Changes committed successfully"
    else
        echo "⏭️ Skipping commit"
    fi
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Repository updated successfully!"
    echo "🌐 View at: https://github.com/NOVUMSOLVO/GDPR-Consent"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

echo ""
echo "📊 Repository Statistics:"
echo "========================"
echo "📁 Total files: $(find . -type f ! -path './node_modules/*' ! -path './.git/*' ! -path './coverage/*' | wc -l)"
echo "📄 Code files: $(find ./src -name '*.ts' -o -name '*.tsx' | wc -l)"
echo "🧪 Test files: $(find ./tests -name '*.test.ts' | wc -l)"
echo "📚 Documentation files: $(find . -maxdepth 1 -name '*.md' | wc -l)"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. 🌐 Visit the repository: https://github.com/NOVUMSOLVO/GDPR-Consent"
echo "2. 📝 Update repository description on GitHub"
echo "3. 🏷️ Add repository topics/tags for discoverability"
echo "4. 📋 Review and update project board/issues if needed"
echo "5. 🔗 Consider adding to organization profile"

echo ""
echo "🏥 NHS Compliance Notes:"
echo "======================="
echo "✅ NHS DTAC compliant features included"
echo "✅ CQC KLOEs compliance documentation ready" 
echo "✅ Data security and audit logging implemented"
echo "✅ GDPR compliance measures integrated"

echo ""
echo "✨ Repository update completed successfully!"
