#!/usr/bin/env python3
"""
class LIFOCache that inherits from BaseCaching and is a caching system:
"""


BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """inherits from BaseCaching and is a caching system
        Methods:
            def put(self, key, item):
            def get(self, key):
    """
    def __init__(self):
        """Initializes the class instance"""
        super().__init__()

    def put(self, key, item):
        """adds to the cache"""
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                last = self.cache_data.popitem()
                print("DISCARD: {}".format(last[0]))
            self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key."""
        if key is None and key not in self.cache_data.keys():
            return None
        return self.cache_data.get(key)
