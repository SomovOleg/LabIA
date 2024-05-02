import heapq

def uniform_cost_search(graph, start, goal):
    priority_queue = [(0, start, [start])]
    visited = set()

    while priority_queue:
        cost, current, path = heapq.heappop(priority_queue)
        if current == goal:
            return path
        if current not in visited:
            visited.add(current)
            for neighbor in graph[current]:
                if neighbor not in visited:
                    heapq.heappush(priority_queue, (cost + graph[current][neighbor], neighbor, path + [neighbor]))
    return None
