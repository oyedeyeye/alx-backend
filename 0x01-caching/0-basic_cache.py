#!/usr/bin/env python3
"""
class BasicCache that inherits from BaseCaching and is a caching system:
"""


BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """inherits from BaseCaching and is a caching system
        Methods:
            def put(self, key, item): assign to the dictionary self.cache_data
                the item value for the key key
            def get(self, key): return value in self.cache_data linked to key
        Args:
            self.cache_data - dictionary from the parent class BaseCaching
    """
    def put(self, key, item):
        """update the cache"""
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key."""
        if key is None and key not in self.cache_data.keys():
            return None
        return self.cache_data.get(key)
