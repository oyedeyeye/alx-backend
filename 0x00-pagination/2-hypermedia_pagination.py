#!/usr/bin/env python3
"""
Implement a method named get_page that takes two integer arguments page with
default value 1 and page_size with default value 10
"""


import csv
import math
from typing import List, Tuple, Union, Dict


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Return a tuple of size two containing a start index and an end index
    corresponding to the range of indexes to return in a list"""
    return ((page - 1) * page_size, page * page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """return the appropriate page of the dataset"""
        assert type(page) == int and type(page_size) == int
        assert page > 0 and page_size > 0
        idx = index_range(page, page_size)
        data = self.dataset()

        if idx[0] > len(data):
            return []
        return data[idx[0]: idx[1]]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """returns a dictionary containing the page information"""
        data = self. get_page(page, page_size)
        idx = index_range(page, page_size)
        total_pages = math.ceil(len(self.__dataset) / page_size)
        output_info = {
            "page_size": page_size,
            "page": page,
            "data": data,
            "next_page": page + 1 if idx[1] < len(self.__dataset) else None,
            "prev_page": page - 1 if idx[0] > 0 else None,
            "total_pages": total_pages
        }

        return output_info
