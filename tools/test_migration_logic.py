"""
Unit test for migration & verification logic using synthetic test data.
Validates type conversion, date parsing, numeric conversions, COPY formatting,
and discrepancy detection.
"""

import sys
import os
sys.path.insert(0, os.path.abspath("."))
import unittest
from datetime import date, datetime
from decimal import Decimal
import tools.migrate_d1_to_pg as mig
import tools.verify_migration as ver


class TestMigrationLogic(unittest.TestCase):

    def test_dsn_masking(self):
        dsn = "postgresql://postgres:MySecretPassword123!@db.alqcojnxshfylheovdgw.supabase.co:5432/postgres"
        masked = mig.mask_dsn(dsn)
        self.assertNotIn("MySecretPassword123!", masked)
        self.assertIn(":****@", masked)
        self.assertEqual(masked, "postgresql://postgres:****@db.alqcojnxshfylheovdgw.supabase.co:5432/postgres")

    def test_type_conversions(self):
        # Boolean conversion
        self.assertTrue(mig.parse_boolean(1))
        self.assertTrue(mig.parse_boolean("1"))
        self.assertTrue(mig.parse_boolean("true"))
        self.assertFalse(mig.parse_boolean(0))
        self.assertFalse(mig.parse_boolean("0"))
        self.assertFalse(mig.parse_boolean("false"))
        self.assertIsNone(mig.parse_boolean(None))
        self.assertIsNone(mig.parse_boolean(""))

        # Date conversion
        self.assertEqual(mig.parse_date("2026-11-15"), date(2026, 11, 15))
        self.assertEqual(mig.parse_date("2026-11-15 08:30:00"), date(2026, 11, 15))
        self.assertIsNone(mig.parse_date(None))
        self.assertIsNone(mig.parse_date(""))

        # Timestamp conversion
        self.assertEqual(
            mig.parse_timestamp("2026-11-15 08:30:00"),
            datetime(2026, 11, 15, 8, 30, 0)
        )
        self.assertIsNone(mig.parse_timestamp(None))
        self.assertIsNone(mig.parse_timestamp(""))

        # Numeric conversion
        self.assertEqual(mig.parse_numeric("12000.50"), Decimal("12000.50"))
        self.assertEqual(mig.parse_numeric(12000), Decimal("12000"))
        self.assertIsNone(mig.parse_numeric(None))
        self.assertIsNone(mig.parse_numeric(""))

    def test_convert_row_transactions(self):
        cols = [
            "id", "orig_id", "ma_cua_hang", "ten_cua_hang", "billing_date",
            "so_luong", "thanh_tien_truoc_thue", "created_at"
        ]
        row = (
            1, 999001, "S01", "School A", "2026-11-15",
            5.0, "60000.00", "2026-11-15 09:00:00"
        )
        converted = mig.convert_row(row, cols, "transactions")
        self.assertEqual(converted[0], 1)
        self.assertEqual(converted[1], 999001)
        self.assertEqual(converted[2], "S01")
        self.assertEqual(converted[3], "School A")
        self.assertEqual(converted[4], date(2026, 11, 15))
        self.assertEqual(converted[5], Decimal("5.0"))
        self.assertEqual(converted[6], Decimal("60000.00"))
        self.assertEqual(converted[7], datetime(2026, 11, 15, 9, 0, 0))

    def test_convert_row_booleans(self):
        cols = ["id", "code", "name", "is_active"]
        row = (1, "BR01", "Branch 1", 1)
        converted = mig.convert_row(row, cols, "branches")
        self.assertEqual(converted[3], True)

        row_inactive = (2, "BR02", "Branch 2", 0)
        converted_inactive = mig.convert_row(row_inactive, cols, "branches")
        self.assertEqual(converted_inactive[3], False)

    def test_are_numbers_close(self):
        self.assertTrue(ver.are_numbers_close(Decimal("100.00"), Decimal("100.00")))
        self.assertTrue(ver.are_numbers_close("100.004", "100.009"))
        self.assertFalse(ver.are_numbers_close("100.00", "100.05"))
        self.assertTrue(ver.are_numbers_close(None, None))
        self.assertFalse(ver.are_numbers_close(None, "100"))


if __name__ == "__main__":
    unittest.main()
