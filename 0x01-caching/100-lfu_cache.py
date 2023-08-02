#!/usr/bin/env python3
"""
class LFUCache that inherits from BaseCaching and is a caching system:
"""


from collections import OrderedDict
BaseCaching = __import__('base_caching').BaseCaching


class LFUCache(BaseCaching):
    """inherits from BaseCaching and is a caching system
        Methods:
            def put(self, key, item):
            def get(self, key):
    """
    def __init__(self):
        """Initializes the class instance"""
        super().__init__()
        self.cache_data = OrderedDict()
        self.mru = ''

    def put(self, key, item):
        """adds to the cache"""
        if key is not None and item is not None:
            if key not in self.cache_data.keys():
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    discarded = self.mru
                    self.cache_data.popitem(discarded)
                    print("DISCARD: {}".format(discarded))
                self.cache_data[key] = item
                self.mru = key
            else:
                self.cache_data.update({key: item})
                self.mru = key

    def get(self, key):
        """return the value in self.cache_data linked to key."""
        if key is not None and key in self.cache_data.keys():
            self.mru = key
            return self.cache_data.get(key)
        return None
