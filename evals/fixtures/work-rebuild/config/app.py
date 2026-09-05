import json
from pathlib import Path

def allowed(count):
    limit = json.loads(Path(__file__).with_name("settings.json").read_text())["max_items"]
    if type(limit) is not int or limit < 1:
        raise ValueError("max_items must be a positive integer")
    return count <= limit
