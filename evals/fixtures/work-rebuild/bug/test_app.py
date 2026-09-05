import unittest
from app import format_count

class Counts(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(format_count(3), "3")
