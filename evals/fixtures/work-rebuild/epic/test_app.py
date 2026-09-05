import unittest
from app import slug

class Slugs(unittest.TestCase):
    def test_plain(self):
        self.assertEqual(slug("Hello World"), "hello-world")
