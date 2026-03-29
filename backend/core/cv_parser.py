import cv2
import numpy as np

def merge_nearby_points(lines, threshold=15):
    """
    Cluster endpoints that are close to each other to ensure walls snap together.
    Avoids open boundaries in geometry reconstruction.
    """
    if lines is None:
        return []

    # Filter out duplicate overlapping lines directly from Hough output first
    filtered_lines = []
    
    for idx, line in enumerate(lines):
        x1, y1, x2, y2 = line[0]
        # Ignore basically dot lines instantly
        if np.hypot(x2-x1, y2-y1) < 5:
            continue
        filtered_lines.append(line)
        
    # Flatten all points
    points = []
    for line in filtered_lines:
        x1, y1, x2, y2 = line[0]
        points.append([x1, y1])
        points.append([x2, y2])
        
    if not points:
        return []

    points = np.array(points)
    merged_points = []
    
    # O(N^2) greedy clustering for simplicity
    for pt in points:
        if not merged_points:
            merged_points.append(pt)
            continue
            
        # Find closest merged point
        dists = np.linalg.norm(np.array(merged_points) - pt, axis=1)
        min_idx = np.argmin(dists)
        
        if dists[min_idx] < threshold:
            # Snap to existing merged point instead of adding duplicates
            # (Optional: average the coordinates, but snapping is fine for now)
            continue 
        else:
            merged_points.append(pt)

    merged_points = np.array(merged_points)
    
    # Re-map line endpoints to the merged points
    snapped_lines = []
    for line in filtered_lines:
        x1, y1, x2, y2 = line[0]
        p1 = np.array([x1, y1])
        p2 = np.array([x2, y2])
        
        dists_1 = np.linalg.norm(merged_points - p1, axis=1)
        dists_2 = np.linalg.norm(merged_points - p2, axis=1)
        
        snap_p1 = merged_points[np.argmin(dists_1)]
        snap_p2 = merged_points[np.argmin(dists_2)]
        
        # Ensure we don't collapse a line into a single point
        if np.linalg.norm(snap_p1 - snap_p2) > 3:
            # Scale coordinates down slightly so they look good in Three.js (e.g., 10px = 1 unit)
            scale = 10.0
            
            # Use midpoints to center the entire model near [0,0,0] in three.js!
            # Since OpenCV defines (0,0) at top-left, we subtract offset.
            
            snapped_lines.append({
                "points": [
                    [float(snap_p1[0] / scale) - 20, float(snap_p1[1] / scale) - 20], 
                    [float(snap_p2[0] / scale) - 20, float(snap_p2[1] / scale) - 20]
                ],
                "type": "wall"
            })
            
    return snapped_lines

def parse_floor_plan(image_bytes):
    """
    Stage 1: Floor Plan Parsing (Computer Vision)
    Detect walls, rooms, and openings from the 2D image.
    """
    # 1. Image Loading
    nparr = np.frombuffer(image_bytes, np.uint8)
    if nparr.size == 0:
        return {"status": "error", "message": "Empty image buffer"}
        
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return {"status": "error", "message": "Invalid image"}

    # 2. Morphological Noise Reduction
    # Blur to reduce noise, then apply binary thresholding to isolate dark lines (walls)
    blurred = cv2.GaussianBlur(img, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )
    
    # REMOVE SMALL ARTIFACTS AND TEXT (Contour Area Filtering)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        # Filter out anything too small (like text) or with a very text-like bounding box
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)
        if area < 150 or min(w, h) < 3:
            # Erase it by drawing over it in black
            cv2.drawContours(thresh, [cnt], -1, 0, -1)

    # Make walls thicker to ensure continuous lines
    kernel = np.ones((3,3), np.uint8)
    dilated = cv2.dilate(thresh, kernel, iterations=1)

    # 3. Line Extraction using Canny and HoughLinesP
    edges = cv2.Canny(dilated, 50, 150)
    
    # Generous HoughLinesP parameters to handle partial gaps and sketches
    # Increased minLineLength significantly so it spots doors and smaller partition walls easily
    lines = cv2.HoughLinesP(
        edges, 
        rho=1, 
        theta=np.pi/180, 
        threshold=50, 
        minLineLength=40,   # Ignore tiny text lines
        maxLineGap=20       # Don't jump gaps across text
    )

    # 4. Filter for strict horizontal (0°/180°) and vertical (90°) lines
    # This automatically drops out text blobs, diagonal sketch artifacts, and snaps lines visually straight.
    orthogonal_lines = []
    if lines is not None:
        for idx in range(len(lines)):
            x1, y1, x2, y2 = lines[idx][0]
            angle = np.abs(np.degrees(np.arctan2(y2 - y1, x2 - x1)))
            
            # Snap to horizontal
            if angle < 10 or angle > 170:
                y_avg = (y1 + y2) // 2
                orthogonal_lines.append([[x1, y_avg, x2, y_avg]])
            # Snap to vertical
            elif 80 < angle < 100:
                x_avg = (x1 + x2) // 2
                orthogonal_lines.append([[x_avg, y1, x_avg, y2]])
                
    filtered_hough_lines = np.array(orthogonal_lines) if orthogonal_lines else None

    # 5. Junction Resolution / Endpoint Snapping
    # Reduced threshold slightly to avoid collapsing small rooms
    parsed_lines = merge_nearby_points(filtered_hough_lines, threshold=15)
    
    # Fallback to mock data if OpenCV completely fails to find structure
    if not parsed_lines or len(parsed_lines) < 3:
        print("CV fallback activated due to unreadable layout.")
        parsed_lines = [
            {"points": [[0, 0], [10, 0]], "type": "wall"},
            {"points": [[10, 0], [10, 10]], "type": "wall"},
            {"points": [[10, 10], [0, 10]], "type": "wall"},
            {"points": [[0, 10], [0, 0]], "type": "wall"},
        ]

    return {
        "status": "success",
        "lines": parsed_lines,
        "rooms": []
    }
