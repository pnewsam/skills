import tempfile
import unittest
from pathlib import Path
from validate_registry import dependency_closure, validate_metadata


class DependencyTests(unittest.TestCase):
    def test_diamond_and_optional_route(self):
        skills = {"a": {"requires": ["b", "c"], "optional_skills": ["d"]},
                  "b": {"requires": ["c"]}, "c": {}, "d": {}}
        self.assertEqual(dependency_closure({"a"}, skills), {"a", "b", "c"})

    def test_cycle_and_unknown(self):
        for skills in ({"a": {"requires": ["a"]}}, {"a": {"requires": ["missing"]}}):
            with self.assertRaises(ValueError):
                dependency_closure({"a"}, skills)

    def test_resource_dependency_integrity(self):
        with tempfile.TemporaryDirectory() as folder:
            registry = Path(folder) / "registry"
            for name in ("a", "b"):
                (registry / name).mkdir(parents=True)
                (registry / name / "SKILL.md").write_text("# Skill\n")
            ref = registry / "b/references/rules.md"
            ref.parent.mkdir()
            ref.write_text("Actual rules\n")
            (registry / "a/SKILL.md").write_text("Read `b/references/rules.md`.\n")
            metadata = {name: {"layer": "reference", "scope": "shared", "effects": ["read_local"],
                               "requires": [], "optional_skills": [], "resources": []} for name in ("a", "b")}
            metadata["b"]["resources"] = ["references/rules.md"]
            self.assertTrue(any("undeclared" in e for e in validate_metadata({"skills": metadata}, registry)))
            metadata["a"]["requires"] = ["b"]
            self.assertEqual(validate_metadata({"skills": metadata}, registry), [])
            ref.unlink()
            self.assertTrue(any("missing cross-package" in e for e in validate_metadata({"skills": metadata}, registry)))

    def test_retired_route_in_supporting_resource(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "registry/a").mkdir(parents=True)
            (root / "archive/old").mkdir(parents=True)
            (root / "archive/old/SKILL.md").write_text("old")
            (root / "registry/a/SKILL.md").write_text("Use `old`.\n")
            metadata = {"a": {"layer": "operation", "scope": "work", "effects": ["read_local"],
                              "requires": [], "optional_skills": [], "resources": []}}
            self.assertIn("a: route to retired skill old", validate_metadata({"skills": metadata}, root / "registry"))


if __name__ == "__main__":
    unittest.main()
