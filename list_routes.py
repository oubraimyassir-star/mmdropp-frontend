from main import app
import json

routes = []
for route in app.routes:
    methods = list(route.methods) if hasattr(route, 'methods') else []
    routes.append({
        "path": route.path,
        "name": route.name,
        "methods": methods
    })

print(json.dumps(routes, indent=2))
