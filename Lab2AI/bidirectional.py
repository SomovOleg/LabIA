from collections import deque

def bidirectional_search(graph, start, goal):
    start_queue = deque([(start, [start])])
    goal_queue = deque([(goal, [goal])])
    start_visited = set([start])
    goal_visited = set([goal])

    while start_queue and goal_queue:
        start_current, start_path = start_queue.popleft()
        goal_current, goal_path = goal_queue.popleft()

        if start_current in goal_visited:
            return start_path + goal_path[::-1]

        if goal_current in start_visited:
            return start_path[::-1] + goal_path

        for neighbor in graph[start_current]:
            if neighbor not in start_visited:
                start_visited.add(neighbor)
                start_queue.append((neighbor, start_path + [neighbor]))

        for neighbor in graph[goal_current]:
            if neighbor not in goal_visited:
                goal_visited.add(neighbor)
                goal_queue.append((neighbor, goal_path + [neighbor]))

    return None
