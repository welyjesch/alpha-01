#!/usr/bin/env python3
"""Interactive git global config setup."""

import subprocess
import sys


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr.strip()}", file=sys.stderr)
    return result.stdout.strip()


def main():
    print("Git Global Config Setup")
    print("=" * 40)

    name = input("Enter your name (e.g., Jane Doe): ").strip()
    if name:
        run(["git", "config", "--global", "user.name", name])
        print(f"  Set user.name = {name}")

    email = input("Enter your email (e.g., jane@example.com): ").strip()
    if email:
        run(["git", "config", "--global", "user.email", email])
        print(f"  Set user.email = {email}")

    editor = input("Enter your preferred editor (e.g., vim, nano, code --wait): ").strip()
    if editor:
        run(["git", "config", "--global", "core.editor", editor])
        print(f"  Set core.editor = {editor}")

    pull_rebase = input("Pull with rebase instead of merge? (y/N): ").strip().lower()
    if pull_rebase in ("y", "yes"):
        run(["git", "config", "--global", "pull.rebase", "true"])
        print("  Set pull.rebase = true")

    signing_key = input("Enter your GPG signing key (leave empty to skip): ").strip()
    if signing_key:
        run(["git", "config", "--global", "user.signingkey", signing_key])
        print(f"  Set user.signingkey = {signing_key}")
        run(["git", "config", "--global", "commit.gpgsign", "true"])
        print("  Enabled commit.gpgsign = true")

    print("\n" + "=" * 40)
    print("Your current git global config:\n")
    run(["git", "config", "--global", "--list"])


if __name__ == "__main__":
    main()
