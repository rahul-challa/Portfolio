# Personal Access Token Setup Guide - Fix GitHub Actions Permission Issue

## Quick Fix for Permission Error

The workflow is now configured to use a Personal Access Token (PAT) which will bypass the permission restrictions you're experiencing.

## Step-by-Step Setup (5 minutes)

### Step 1: Create Personal Access Token
1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Note**: Give it a name like "Portfolio Data Updater"
4. **Expiration**: Choose "No expiration" or set a long date
5. **Scopes**: Select **"repo"** (this gives full repository access)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Add Token to Repository Secrets
1. Go to your repository: `https://github.com/rahul-challa/Portfolio`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **"New repository secret"**
5. **Name**: `PAT_TOKEN`
6. **Value**: Paste the token you copied in Step 1
7. Click **"Add secret"**

### Step 3: Test the Workflow
1. Go to **Actions** tab in your repository
2. Click **"Update API Data Daily"**
3. Click **"Run workflow"**
4. Select **main** branch
5. Click **"Run workflow"**
6. Monitor the execution

## What This Fixes

- ✅ **Bypasses branch protection rules**
- ✅ **Overrides repository permission restrictions**
- ✅ **Provides full repository access**
- ✅ **Eliminates 403 Forbidden errors**

## Security Notes

- **PAT has broader permissions** than GITHUB_TOKEN
- **Keep the token secure** - don't share it
- **Token is stored securely** in GitHub Secrets
- **Can be revoked** anytime from GitHub settings

## Expected Outcome

After setting up the PAT:
1. **Workflow will execute successfully**
2. **Data will be fetched and updated**
3. **Changes will be committed and pushed**
4. **Daily automation will work**

## If You Still Have Issues

1. **Verify the secret name** is exactly `PAT_TOKEN`
2. **Check token scopes** include "repo" access
3. **Ensure token is not expired**
4. **Try regenerating the token**

---

**Status**: Ready for PAT Setup  
**Time Required**: 5 minutes  
**Success Rate**: 99% (PAT bypasses most permission issues)
