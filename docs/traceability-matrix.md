# Requirements & Scenario Traceability Matrix

| ID | Risk | Feature / Goal | Layer | Source Ref | Test Data | Expected Outcome | Evidence Path | Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| AE-01 | P0 | Account registration | UI/API | TC 1 | Unique user fixture | User created & logged in; account deleted in teardown | `tests/ui/auth/` | Planned |
| AE-02 | P0 | Valid login/logout | UI | TC 2, 4 | Freshly registered user | Authenticates & terminates session cleanly | `tests/ui/auth/` | Planned |
| AE-03 | P0 | Invalid login | UI/API | TC 3; API 10 | Non-existent credentials | Error shown in UI / API rejects invalid login | `tests/ui/auth/` | Planned |
| AE-04 | P1 | Duplicate registration | UI | TC 5 | Existing user email | Rejects signup with duplicate email warning | `tests/ui/auth/` | Planned |
| AE-05 | P1 | Login API validation | API | API 7, 8, 10 | Valid, invalid & missing params | Returns expected responseCode for each case | `tests/api/` | Planned |
| AE-06 | P0 | Product catalogue | UI/API | TC 8; API 1 | None | Catalogue renders & matches API product structure | `tests/ui/catalog/` | Planned |
| AE-07 | P0 | Search relevance | UI/API | TC 9; API 5 | Known product keyword | Matching items displayed with valid prices | `tests/ui/catalog/` | Planned |
| AE-08 | P1 | Search empty/invalid | UI/API | Discovery; API 6 | Non-existent term / missing param | Zero-result state in UI; error on missing API param | `tests/ui/catalog/` | Planned |
| AE-09 | P1 | Category filtering | UI | TC 18 | Category/subcategory pair | Filtered list displays only matching category items | `tests/ui/catalog/` | Planned |
| AE-10 | P1 | Brand filtering | UI/API | TC 19; API 3 | Brand name | Brand list matches UI filtered items | `tests/ui/catalog/` | Planned |
| AE-11 | P0 | Cart multiple items | UI | TC 12 | Two distinct products | Both items appear with accurate unit prices | `tests/ui/cart/` | Planned |
| AE-12 | P0 | Quantity calculation | UI | TC 13 | Product qty = 4 | Line total equals `unit_price * 4` | `tests/ui/cart/` | Planned |
| AE-13 | P0 | Remove from cart | UI | TC 17 | Item in cart | Item removed and cart updates cleanly | `tests/ui/cart/` | Planned |
| AE-14 | P0 | Cart persists on login | UI | TC 20 | Guest cart + valid user | Items remain in cart after logging in | `tests/ui/cart/` | Planned |
| AE-15 | P0 | End-to-end order | UI | TC 14–16 | Unique user + dummy card | Order confirmed & account deleted afterward | `tests/ui/checkout/` | Planned |
| AE-16 | P0 | Address consistency | UI/API | TC 23; API 14 | Address fixture | Delivery & billing addresses match source fixture | `tests/ui/checkout/` | Planned |
| AE-17 | P1 | Invoice download | UI | TC 24 | Completed order | Downloaded invoice file exists, non-empty & parseable | `tests/ui/checkout/` | Planned |
| AE-18 | P1 | Product review | UI | TC 21 | Valid review payload | Review submission confirmation shown | `tests/ui/ancillary/` | Planned |
| AE-19 | P1 | Contact form upload | UI | TC 6 | Dummy `.txt` file | Contact form accepts file upload & confirms submission | `tests/ui/ancillary/` | Planned |
| AE-20 | P2 | Subscriptions | UI | TC 10, 11 | Unique dummy email | Subscription confirmation banner displayed | `tests/ui/ancillary/` | Planned |
| AE-21 | P2 | Recommended items | UI | TC 22 | Homepage carousel item | Recommended item added to cart successfully | `tests/ui/ancillary/` | Planned |
| AE-22 | P1 | Account API CRUD | API | API 11–14 | Unique user payload | Create, read, update, and delete user via API | `tests/api/` | Planned |
| AE-23 | P1 | API method validation | API | API 2, 4 | Unsupported HTTP verbs | Returns method-not-supported responseCode | `tests/api/` | Planned |
| AE-24 | P1 | UI/API consistency | UI/API | API 1, 3 | Live product/brand data | UI prices/brands match API responses | `tests/integration/` | Planned |
