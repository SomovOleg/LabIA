import csv
from astar import astar_search
from bidirectional import bidirectional_search
from breadth import breadth_first_search
from depth import depth_first_search
from greedy import greedy_best_first_search

def load_map_data(file_path):
    graph = {}
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        cities = next(reader)
        for city in cities:
            graph[city] = {}
        for i, row in enumerate(reader):
            city = cities[i]
            for j, distance in enumerate(row):
                if distance != '-1' and distance != '0':
                    graph[city][cities[j]] = int(distance)
    return graph

map_data = load_map_data("map.csv")


start_city = "Timisoara"
goal_city = "Bucharest"
path = astar_search(map_data, start_city, goal_city)
print("The path of Astar is:", path)
path = bidirectional_search(map_data, start_city, goal_city)
print("The path of Bidirectional is:", path)
path = breadth_first_search(map_data, start_city, goal_city)
print("The path of Breadth first search is:", path)
path = depth_first_search(map_data, start_city, goal_city)
print("The path of Depth first search is:", path)
path = greedy_best_first_search(map_data, start_city, goal_city)
print(" The path of Greedy search is:", path)