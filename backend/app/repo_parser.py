def extract_structure(files):

    structure = []

    for f in files:
        structure.append({
            "name": f["name"],
            "type": f["type"]
        })

    return structure