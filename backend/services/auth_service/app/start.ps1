# Start Auth Service without uvicorn --reload
# Run this from the app folder or adjust module path if running from repo root.
# Usage (PowerShell):
#   .\start.ps1

# This script will try to activate a common virtualenv if present and then
# start uvicorn using `python -m uvicorn` so it works even when uvicorn isn't
# directly on PATH. It intentionally does NOT enable --reload (use your editor
# or a separate dev script for reload behavior).

Write-Host "Preparing to start auth service..."

# Look for common virtualenv locations (current folder and parent folder)
$cwd = Convert-Path .
$venvCandidates = @(
	Join-Path $cwd ".venv\Scripts\Activate.ps1",
	Join-Path $cwd "venv\Scripts\Activate.ps1",
	Join-Path $cwd "env\Scripts\Activate.ps1",
	Join-Path (Join-Path $cwd "..") ".venv\Scripts\Activate.ps1",
	Join-Path (Join-Path $cwd "..") "venv\Scripts\Activate.ps1",
	Join-Path (Join-Path $cwd "..") "env\Scripts\Activate.ps1"
)

$activated = $false
foreach ($candidate in $venvCandidates) {
	if (Test-Path $candidate) {
		Write-Host "Activating virtualenv: $candidate"
		# Use the script to modify the current session (dot-sourcing)
		try {
			& $candidate
			$activated = $true
		} catch {
			Write-Warning "Failed to activate virtualenv at $candidate. Continuing without activation."
		}
		break
	}
}

if (-not $activated) {
	Write-Warning "No virtualenv activation script found. Make sure your venv is activated or that 'python' and 'uvicorn' are available on PATH."
}

Write-Host "Starting uvicorn (main:app) on 0.0.0.0:8000..."

# Use python -m uvicorn to avoid relying on uvicorn being installed as an executable
try {
	& python -m uvicorn main:app --host 0.0.0.0 --port 8000
} catch {
	Write-Error "Failed to start uvicorn. Ensure Python is installed and uvicorn is available (pip install uvicorn). Error: $_"
	exit 1
}

