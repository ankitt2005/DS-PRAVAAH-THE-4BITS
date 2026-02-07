import json
import os

def check_json():
    # Define the path to your huge file
    file_path = os.path.join("data", "transcript.json")
    
    print(f"🩺 SCANNING: {file_path}...")

    if not os.path.exists(file_path):
        print("❌ Error: File not found. Make sure you are in the 'backend' folder.")
        return

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            # Read the raw lines first so we can show them later
            lines = f.readlines()
            
            # Reset pointer and try to parse
            f.seek(0)
            data = json.load(f)
            
        print(f"✅ PASSED: Your JSON file is valid! ({len(lines)} lines)")
        
    except json.JSONDecodeError as e:
        print("\n" + "="*50)
        print(f"❌ SYNTAX ERROR FOUND")
        print(f"📍 Location: Line {e.lineno}")
        print(f"📝 Error Message: {e.msg}")
        print("-" * 50)
        
        # Show the user the exact lines around the error
        start_line = max(0, e.lineno - 3)
        end_line = min(len(lines), e.lineno + 2)
        
        for i in range(start_line, end_line):
            prefix = ">> " if i + 1 == e.lineno else "   "
            # distinct color/arrow for the error line
            print(f"{prefix}Line {i+1}: {lines[i].rstrip()}")
            
        print("-" * 50)
        print("💡 HOW TO FIX:")
        if "Expecting ','" in e.msg:
            print("👉 You are likely missing a COMMA (,) at the end of the previous line.")
        elif "Expecting value" in e.msg:
            print("👉 You might have an extra COMMA (,) at the end of a list, or a missing quote.")
        elif "Unterminated string" in e.msg:
            print("👉 You forgot to close a quote (\") somewhere.")
        print("="*50 + "\n")

if __name__ == "__main__":
    check_json()