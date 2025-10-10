from playwright.sync_api import sync_playwright, Page, expect
import time

def run_verification(page: Page):
    """
    This script verifies that the application loads correctly, a user can log in,
    and the dashboard displays data from the backend.
    """
    # 1. Navigate to the application.
    page.goto("http://localhost:3000/")

    # 2. Log in.
    page.get_by_label("Correu electrònic").fill("admin@tossa.cat")
    page.get_by_label("Contrasenya").fill("masterpassword")
    page.get_by_role("button", name="Entrar").click()

    # 3. Wait for the welcome toast to appear and disappear, confirming login.
    expect(page.get_by_text("Benvingut/da, Admin Master!")).to_be_visible()
    expect(page.get_by_text("Benvingut/da, Admin Master!")).to_be_hidden(timeout=10000)

    # 4. Check for the main title from the Header component.
    expect(page.get_by_role("heading", name="Comissió d'Urbanisme")).to_be_visible()
    expect(page.get_by_text("Ajuntament de Tossa de Mar")).to_be_visible()

    # 5. Check for commission data to confirm the backend is serving data.
    expect(page.locator('text="1"').first).to_be_visible()

    # 6. Take a screenshot.
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()