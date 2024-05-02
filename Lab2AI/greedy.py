def greedy_best_first_search(graph, start, goal):
    queue = [(heuristic(start, goal), start)]
    visited = set()
    came_from = {}

    while queue:
        _, current = min(queue)
        queue.remove((heuristic(current, goal), current))
        if current == goal:
            path = []
            while current != start:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        visited.add(current)
        for neighbor in graph[current]:
            if neighbor not in visited:
                queue.append((heuristic(neighbor, goal), neighbor))
                came_from[neighbor] = current
    return None


def heuristic(city1, city2):
    return abs(ord(city1[0]) - ord(city2[0]))
