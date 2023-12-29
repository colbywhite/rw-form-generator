#!/usr/bin/env bash

# i still find little shell scripts easier for smaller monorepo than a tool like lerna, so here we are.

set -e

function lint {
    yarn workspace @colbyw/autoform lint
}

function test {
    yarn workspace @colbyw/autoform test
}

function build_lib {
    cp README.md lib/autoform/README.md && NODE_ENV=production yarn workspace @colbyw/autoform build
}

function build_docs {
    yarn workspace docs build
}

function release {
    yarn workspace @colbyw/autoform semantic-release
}

run_parallel() {
    local pids=()

    # Iterate over all arguments
    local cmd
    for cmd in "$@"; do
        # Execute each command in the background
        eval "$cmd" &
        # Store the PID of the background process
        pids+=($!)
    done

    # Wait for all commands to complete
    local status
    for pid in "${pids[@]}"; do
        wait $pid
        status=$?
        # Check if any command failed
        if [ $status -ne 0 ]; then
            echo "Command with PID $pid failed."
            return 1
        fi
    done

    return 0
}

echo "🔨 linting and testing"
run_parallel "lint" "test"
echo "🔨 building"
run_parallel "build_docs" "build_lib"
echo "🔨 releasing"
echo 'git tag --list'
git tag --list
echo 'git tag --contains main'
git tag --contains main
echo 'git show v1.0.0-rc.1 -q'
git show v1.0.0-rc.1 -q
release
echo "✅ done"

