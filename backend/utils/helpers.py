"""
Helper functions for the application
"""

import base64
import io
from PIL import Image
import secrets
import string

def validate_image(image_data: str) -> bool:
    """
    Validate if the provided base64 string is a valid image
    """
    try:
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Try to open with PIL
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        
        return True
    except Exception:
        return False

def generate_secure_token(length: int = 32) -> str:
    """
    Generate a secure random token
    """
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def format_duration(milliseconds: int) -> str:
    """
    Format duration from milliseconds to MM:SS format
    """
    seconds = milliseconds // 1000
    minutes = seconds // 60
    seconds = seconds % 60
    return f"{minutes:02d}:{seconds:02d}"

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe storage
    """
    # Remove or replace unsafe characters
    unsafe_chars = '<>:"/\\|?*'
    for char in unsafe_chars:
        filename = filename.replace(char, '_')
    
    return filename[:255]  # Limit length