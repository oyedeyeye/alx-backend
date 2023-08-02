#!/usr/bin/env python3
"""
class LRUCache that inherits from BaseCaching and is a caching system:
"""


from collections import OrderedDict
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """inherits from BaseCaching and is a caching system
        Methods:
            def put(self, key, item):
            def get(self, key):
    """
    def __init__(self):
        """Initializes the class instance"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """adds to the cache"""
        if key is not None and item is not None:
            if key not in self.cache_data.keys():
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    last = self.cache_data.popitem()
                    print("DISCARD: {}".format(last[0]))
                self.cache_data[key] = item
                self.cache_data.move_to_end(key, last=False)
            else:
                self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key."""
        if key is not None and key in self.cache_data.keys():
            self.cache_data.move_to_end(key, last=False)
            return self.cache_data.get(key)
        return None
