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
        self.keys_freq = []

    def __reorder_items(self, mru_key):
        """Reorder the items in this cache based on the MRU items"""
        max_positions = []
        mru_freq = 0
        mru_pos = 0
        ins_pos = 0

        for i, key_freq in enumerate(self.keys_freq):
            if key_freq[0] == mru_key:
                mru_freq = key_freq[1] + 1
                mru_pos = i
                break
            elif len(max_positions) == 0:
                max_positions.append(i)
            elif key_freq[1] < self.keys_freq[max_positions[-1]][1]:
                max_positions.append(i)

        max_positions.reverse()
        for posit in max_positions:
            if self.keys_freq[posit][1] > mru_freq:
                break
            ins_pos = posit
            self.keys_freq.pop(mru_pos)
            self.keys_freq.insert(ins_pos, [mru_key, mru_freq])

    def put(self, key, item):
        """adds to the cache"""
        if key is not None and item is not None:
            if key not in self.cache_data.keys():
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    lfu_key, _ = self.keys_freq[-1]
                    self.cache_data.popitem(lfu_key)
                    self.keys_freq.pop()
                    print("DISCARD: {}".format(lfu_key))

                self.cache_data[key] = item
                ins_index = len(self.keys_freq)
                for i, key_freq in enumerate(self.keys_freq):
                    if key_freq[1] == 0:
                        ins_index = i
                        break
                self.keys_freq.insert(ins_index, [key, 0])
            else:
                self.cache_data[key] = item
                self.__reorder_items(key)

    def get(self, key):
        """return the value in self.cache_data linked to key."""
        if key is not None and key in self.cache_data.keys():
            self.__reorder_items(key)
            return self.cache_data.get(key)
        return None
