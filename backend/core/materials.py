import json

# Starter database from PS mapped to numeric values for formula
MATERIAL_DB = [
    {"name": "AAC Blocks", "cost": 1, "strength": 5, "durability": 8, "best_use": "Partition walls"},
    {"name": "Red Brick", "cost": 5, "strength": 8, "durability": 5, "best_use": "Load-bearing walls"},
    {"name": "RCC", "cost": 9, "strength": 10, "durability": 10, "best_use": "Columns, slabs"},
    {"name": "Steel Frame", "cost": 10, "strength": 10, "durability": 10, "best_use": "Long spans (>5m)"},
    {"name": "Hollow Concrete Block", "cost": 3, "strength": 5, "durability": 5, "best_use": "Non-structural walls"},
    {"name": "Fly Ash Brick", "cost": 2, "strength": 6, "durability": 8, "best_use": "General walling"},
    {"name": "Precast Concrete Panel", "cost": 7, "strength": 8, "durability": 10, "best_use": "Structural walls, slabs"}
]

def analyze_materials(graph_data):
    """
    Score = (w1 * Strength) + (w2 * Durability) - (w3 * Cost)
    """
    recommendations = {}
    
    for element in graph_data.get('elements', []):
        el_type = element['type']
        
        # Dynamic Weighting depending on element type
        # For load-bearing elements, heavily weight Strength. For partition elements, heavily weight Cost.
        if el_type == 'load-bearing':
            w1, w2, w3 = 0.6, 0.3, 0.1
        else:
            w1, w2, w3 = 0.2, 0.3, 0.5
            
        scores = []
        for mat in MATERIAL_DB:
            score = (w1 * mat['strength']) + (w2 * mat['durability']) - (w3 * mat['cost'])
            scores.append({
                "material": mat['name'],
                "score": round(score, 2),
                "details": mat
            })
            
        # Top 3 options recommendations
        scores.sort(key=lambda x: x['score'], reverse=True)
        recommendations[element['id']] = scores[:3]
        
    return recommendations
