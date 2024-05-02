def astar_search(graph, start, goal):
    open_set = [(0, start)]
    came_from = {}
    g_score = {city: float('inf') for city in graph}
    g_score[start] = 0
    f_score = {city: float('inf') for city in graph}
    f_score[start] = heuristic(start, goal)

    while open_set:
        current_f, current = min(open_set)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        
        open_set.remove((current_f, current))
        
        for neighbor, cost in graph[current].items():
            tentative_g = g_score[current] + cost
            if tentative_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + heuristic(neighbor, goal)
                if (tentative_g, neighbor) not in open_set:
                    open_set.append((f_score[neighbor], neighbor))
    return None

def heuristic(city1, city2):
    return abs(ord(city1[0]) - ord(city2[0]))
