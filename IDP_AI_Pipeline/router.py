ROUTING_MAP = {
    "HR Document": "HR Department",
    "Invoice": "Finance Team",
    "Purchase Order": "Procurement Team",
    "Engineering Document": "Engineering Manager",
    "Safety Document": "Safety Officer",
    "Compliance Document": "Compliance Department",
    "General Operations Document": "Operations Manager",
}

def route_document(category: str):
    return ROUTING_MAP.get(category, "General Review Team")
