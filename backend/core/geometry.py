import networkx as nx
from shapely.geometry import Polygon, LineString, MultiLineString
from shapely.ops import polygonize, unary_union

def reconstruct_geometry(cv_data):
    """
    Stage 2: Geometry Reconstruction (Graph Math)
    Convert CV coordinates into a mathematical graph and classify load-bearing vs partition.
    """
    lines = cv_data.get("lines", [])
    
    G = nx.Graph()
    shapely_lines = []
    
    # Example logic to populate nodes and edges
    # We treat junctions as Nodes and walls as Edges.
    for idx, line in enumerate(lines):
        pt1 = tuple(line['points'][0])
        pt2 = tuple(line['points'][1])
        
        G.add_edge(pt1, pt2, id=f"wall_{idx}", type="unknown")
        shapely_lines.append(LineString([pt1, pt2]))

    # --- OUTER HULL DETECTION LOGIC ---
    # 1. Try to form closed polygons from the lines (rooms)
    polygons = list(polygonize(shapely_lines))
    
    outer_boundary_lines = []
    if polygons:
        # 2. Merge all found rooms into one giant mega-polygon representing the entire building
        building_footprint = unary_union(polygons)
        
        # 3. Extract the exterior boundary coordinates
        if building_footprint.geom_type == 'Polygon':
            coords = list(building_footprint.exterior.coords)
            # Re-convert the boundary coordinates back into LineStrings for comparison
            for i in range(len(coords) - 1):
                outer_boundary_lines.append(LineString([coords[i], coords[i+1]]))
        elif building_footprint.geom_type == 'MultiPolygon':
            for poly in building_footprint.geoms:
                coords = list(poly.exterior.coords)
                for i in range(len(coords) - 1):
                    outer_boundary_lines.append(LineString([coords[i], coords[i+1]]))
                    
    elements = []
    
    for u, v, data in G.edges(data=True):
        edge_id = data.get("id")
        current_line = LineString([u, v])
        
        # Determine span distance
        span = current_line.length
        
        # Check if this edge is part of the outer hull
        is_outer_hull = False
        if outer_boundary_lines:
            for boundary_line in outer_boundary_lines:
                # If the line overlaps substantially with the boundary, it's load-bearing
                # Buffer slightly to account for floating point inaccuracies
                if current_line.buffer(0.1).contains(boundary_line) or boundary_line.buffer(0.1).contains(current_line):
                    is_outer_hull = True
                    break
        
        # Structural Spines (Internal large walls) heuristics fallback
        is_internal_spine = span > 8.0 # If a wall is internally massive, tag it load bearing
        
        wall_type = "load-bearing" if (is_outer_hull or is_internal_spine) else "partition"
        
        elements.append({
            "id": edge_id,
            "type": wall_type,
            "p1": [u[0], u[1]],
            "p2": [v[0], v[1]],
            "span_m": span, 
            "height": 3 # 3 meters defined in PS
        })

    return {
        "elements": elements,
        "nodes": list(G.nodes),
        "edges": list(G.edges),
        "metrics": {
            "rooms_detected": len(polygons)
        }
    }
