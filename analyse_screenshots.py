import os
import shutil
from PIL import Image
import pytesseract

# Set the path to the tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Define the path to the Screenshorts folder and subfolders for categorization
SCREENSHOT_PATH = os.path.join(os.getcwd(), r'C:\Users\Thendo\Desktop\2025\Masters in Computer Science\Websites\LecturerView\Screenshorts')
DISHONESTY_FOLDER = os.path.join(SCREENSHOT_PATH, 'dishonesty')
NOT_DISHONESTY_FOLDER = os.path.join(SCREENSHOT_PATH, 'not_dishonesty')

# Create subfolders if they don't exist
os.makedirs(DISHONESTY_FOLDER, exist_ok=True)
os.makedirs(NOT_DISHONESTY_FOLDER, exist_ok=True)

# Rule list for categorizing screenshots
rules = []

# Example default rules
def rule_1(image_text):
    return "assessment" in image_text.lower()

def rule_2(image_text):
    return "dashboard" in image_text.lower()

def rule_3(image_text):
    return "screenshort" in image_text.lower()

def rule_4(image_text):
    return "proposal" in image_text.lower()

# Add rules dynamically by modifying the 'rules' list
def add_rule(rule_function, category):
    rules.append({"rule": rule_function, "category": category})

# Define your custom rules here using 'add_rule' to specify category
add_rule(rule_1, 'dishonesty')
add_rule(rule_2, 'not_dishonesty')
add_rule(rule_3, 'dishonesty')
add_rule(rule_4, 'not_dishonesty')

# Function to apply all rules to a given image text
def apply_rules(image_text):
    for rule in rules:
        if rule["rule"](image_text):
            return rule["category"]
    return 'not_dishonesty'  # Default category if no rule applies

# Function to process the screenshots
def analyze_screenshots():
    # Get all screenshot files in the Screenshorts folder
    screenshots = [f for f in os.listdir(SCREENSHOT_PATH) if f.endswith('.png')]
    
    for screenshot in screenshots:
        screenshot_path = os.path.join(SCREENSHOT_PATH, screenshot)

        # Use OCR to extract text from the screenshot
        try:
            image = Image.open(screenshot_path)
            image_text = pytesseract.image_to_string(image)

            # Apply the rules to determine the category
            category = apply_rules(image_text)

            # Move the screenshot to the appropriate folder
            if category == 'dishonesty':
                shutil.move(screenshot_path, os.path.join(DISHONESTY_FOLDER, screenshot))
            else:
                shutil.move(screenshot_path, os.path.join(NOT_DISHONESTY_FOLDER, screenshot))

            print(f"Processed {screenshot} - Category: {category}")
        except Exception as e:
            print(f"Error processing {screenshot}: {e}")

if __name__ == "__main__":
    analyze_screenshots()
