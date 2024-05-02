def depth_first_search(graph, start, goal):
    stack = [(start, [start])]
    visited = set([start])

    while stack:
        current, path = stack.pop()
        if current == goal:
            return path
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append((neighbor, path + [neighbor]))
    return None
