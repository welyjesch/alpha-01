import os
import subprocess
import sys

def run_command(command, shell=True):
    """Utility to run shell commands and return output."""
    try:
        result = subprocess.run(command, shell=shell, check=True, 
                               capture_output=True, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return None

def setup_repo():
    # 1. Get the current folder name
    cwd = os.getcwd()
    repo_name = os.path.basename(cwd)
    print(f"🚀 Initializing sync for: {repo_name}")

    # 2. Check if GitHub repo exists
    print("🔍 Checking if repo exists on GitHub...")
    check_repo = run_command(f"gh repo view {repo_name}")

    if check_repo is None:
        print(f"✨ Repo '{repo_name}' not found. Creating it now...")
        # Create repo, initialize git locally, and push
        create_cmd = f"gh repo create {repo_name} --public --source=. --push"
        run_command(create_cmd)
    else:
        print(f"✅ Repo '{repo_name}' already exists on GitHub.")

    # 3. Start Gitwatch in the background
    print("📡 Starting Gitwatch auto-sync...")
    # nohup keeps it running even if you close this script
    # & puts it in the background
    gitwatch_cmd = f"nohup gitwatch -r origin -b main . > /dev/null 2>&1 &"
    subprocess.Popen(gitwatch_cmd, shell=True)
    
    print(f"\n🎉 Success! '{repo_name}' is now being watched.")
    print("Any file changes will be automatically pushed to GitHub.")

if __name__ == "__main__":
    setup_repo()
