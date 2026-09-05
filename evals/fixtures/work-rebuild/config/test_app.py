import unittest
from app import allowed

class Limits(unittest.TestCase):
    def test_boundary(self):
        self.assertTrue(allowed(10))
        self.assertFalse(allowed(11))
