from flask import Flask, send_from_directory, jsonify, request
import os
import mss
import time
import threading
import subprocess

app = Flask(__name__)

# Define the path to the Screenshorts folder
SCREENSHOT_PATH = os.path.join(os.getcwd(), r'C:\Users\Thendo\Desktop\2025\Masters in Computer Science\Websites\LecturerView\Screenshorts')

# Global variables to control screenshot capturing
is_capturing = False
screenshot_thread = None
stop_event = threading.Event()

# Function to take screenshots
def capture_screenshots():
    global is_capturing
    screenshot_counter = 0
    with mss.mss() as sct:
        while not stop_event.is_set():  # Check for stop event
            screenshot = sct.shot(output=os.path.join(SCREENSHOT_PATH, f"screenshot_{screenshot_counter}.png"))
            screenshot_counter += 1
            time.sleep(2)  # Capture a screenshot every 2 seconds

# Route to serve index.html (Front-end)
@app.route('/')
def index():
    return send_from_directory(os.getcwd(), 'index.html')

# Route to serve lectureview.html
@app.route('/lecturerview.html')
def lecture_view():
    return send_from_directory(os.getcwd(), 'lecturerview.html')

# Route to serve adminpanel.html
@app.route('/adminpanel.html')
def admin_panel():
    return send_from_directory(os.getcwd(), 'adminpanel.html')

# Route to handle starting assessment (start capturing screenshots)
@app.route('/start_assessment', methods=['POST'])
def start_assessment():
    global is_capturing, screenshot_thread, stop_event
    if not is_capturing:
        is_capturing = True
        stop_event.clear()  # Clear any previous stop event
        screenshot_thread = threading.Thread(target=capture_screenshots)
        screenshot_thread.start()
        return jsonify({"message": "Assessment started."}), 200
    return jsonify({"message": "Assessment is already in progress."}), 400

# Route to handle stopping assessment (stop capturing screenshots)
@app.route('/stop_assessment', methods=['POST'])
def stop_assessment():
    global is_capturing, screenshot_thread, stop_event
    if is_capturing:
        stop_event.set()  # Signal the screenshot thread to stop
        screenshot_thread.join()  # Wait for the thread to finish
        is_capturing = False
        return jsonify({"message": "Assessment stopped."}), 200
    return jsonify({"message": "No active assessment to stop."}), 400

# Route to trigger screenshot analysis
@app.route('/analyse_screenshots', methods=['POST'])
def analyse_screenshots():
    try:
        # Run the analyse_screenshots.py script
        subprocess.run(["python", "analyse_screenshots.py"], check=True)
        return jsonify({"message": "Screenshots analysed and categorized."})
    except subprocess.CalledProcessError as e:
        return jsonify({"message": "Error occurred while analyzing screenshots."}), 500

if __name__ == '__main__':
    app.run(debug=True)
