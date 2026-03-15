# Heart Rate Controller

Standalone Python GUI for simulating heart rate data and sending it to the Flask backend. Fully separate from the backend — uses only Python stdlib (tkinter, urllib). No pip install required.

## Controls

| Control | Behavior |
|---------|----------|
| **Session ID** | Optional. Paste the Session ID from the app's Focus screen to sync with the frontend. If empty on Start, one is auto-generated. |
| **Current BPM** | Large readout, updates every 1 second when running |
| **Start / Stop** | Toggle; when started, sends heart rate every 1 second |
| **+5 / −5** | Increase or decrease base BPM by 5 |
| **+10 / −10** | Increase or decrease base BPM by 10 |
| **Stress** | Checkbox; when checked, adds a +40–50 BPM spike (decays when unchecked) |

## How to run

Two independent processes. Run in any order:

1. **Backend** (optional; required to persist data):
   ```bash
   cd backend
   .\.venv\Scripts\Activate.ps1   # Windows
   flask --app app run --debug
   ```
   Backend runs at `http://127.0.0.1:5000`.

2. **Controller** (standalone):
   ```bash
   cd controller
   python app.py
   ```
   A native window opens. No browser or npx serve needed.

3. Use Start, adjust BPM with +/- buttons, enable Stress for spikes, then Stop when done.

### Syncing with the Flow app

To drive the app's displayed heartbeat with the controller:

1. Start a session in the app (Start Session).
2. On the Focus screen, copy the **Session ID** (click "Session: flow-session-…" to copy).
3. Paste that ID into the controller's Session ID field.
4. Click **Start** in the controller.
5. The app will now show the controller's heart rate instead of the mock.

If the backend is not running, the controller UI still updates but requests will fail. A status message shows success or error.

## API

The controller sends `POST http://127.0.0.1:5000/api/heart-rate` with:

```json
{ "session_id": "...", "bpm": 72 }
```
