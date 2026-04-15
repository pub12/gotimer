from playwright.sync_api import sync_playwright
import time

SCREENSHOTS_DIR = "/Users/pubs/Local/01.code/gotimer/screenshots"

def capture(page, url, output_path, wait_ms=2000):
    page.goto(url, wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(wait_ms)
    page.screenshot(path=output_path, full_page=False)
    print(f"Saved: {output_path}")

def capture_full(page, url, output_path, wait_ms=2000):
    page.goto(url, wait_until='networkidle', timeout=30000)
    page.wait_for_timeout(wait_ms)
    page.screenshot(path=output_path, full_page=True)
    print(f"Saved full: {output_path}")

with sync_playwright() as p:
    browser = p.chromium.launch()

    # 1. Desktop homepage - above fold
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    capture(page, 'https://gotimer.org', f'{SCREENSHOTS_DIR}/desktop_home_abovefold.png')

    # 2. Desktop homepage - full page
    capture_full(page, 'https://gotimer.org', f'{SCREENSHOTS_DIR}/desktop_home_full.png')

    # 3. Mobile homepage - above fold
    page_mobile = browser.new_page(viewport={'width': 375, 'height': 812})
    capture(page_mobile, 'https://gotimer.org', f'{SCREENSHOTS_DIR}/mobile_home_abovefold.png')

    # 4. Mobile homepage - full page
    capture_full(page_mobile, 'https://gotimer.org', f'{SCREENSHOTS_DIR}/mobile_home_full.png')

    # 5. Desktop timer page - above fold
    page2 = browser.new_page(viewport={'width': 1920, 'height': 1080})
    capture(page2, 'https://gotimer.org/5-minute-timer', f'{SCREENSHOTS_DIR}/desktop_timer_abovefold.png')

    # 6. Desktop timer page - full page
    capture_full(page2, 'https://gotimer.org/5-minute-timer', f'{SCREENSHOTS_DIR}/desktop_timer_full.png')

    # 7. Mobile timer page - above fold
    page_mobile2 = browser.new_page(viewport={'width': 375, 'height': 812})
    capture(page_mobile2, 'https://gotimer.org/5-minute-timer', f'{SCREENSHOTS_DIR}/mobile_timer_abovefold.png')

    # 8. Mobile timer page - full page
    capture_full(page_mobile2, 'https://gotimer.org/5-minute-timer', f'{SCREENSHOTS_DIR}/mobile_timer_full.png')

    # 9. Tablet homepage
    page_tablet = browser.new_page(viewport={'width': 768, 'height': 1024})
    capture(page_tablet, 'https://gotimer.org', f'{SCREENSHOTS_DIR}/tablet_home_abovefold.png')

    browser.close()
    print("All screenshots captured.")
