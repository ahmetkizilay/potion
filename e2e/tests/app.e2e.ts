
import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();

  it('signs in a registered user', async function () {
    const {page} = getBrowserState();
    // Waiting for an element to exist on the page, so we know the page is loaded.
    await page.locator('#email').wait();
    console.log('page ready');

    await page.locator('#email').fill('user1@test.com');
    await page.locator('#password').fill('aB3DfG5hI7jK9mN1pQrStU3');
    await page.locator('#btn-submit').click();
    console.log('after click');

    await page.waitForNavigation();
    console.log('after navigation');

    const text = await page.locator('#btn-save').wait();
    expect(text).not.toBeNull();

    console.log('logging out');
    await page.locator('#btn-logout').click();
    await page.waitForNavigation();

    await page.locator('#email').wait();
    console.log('back to the login page');
  });

  it('does not sign in an unregistered user', async function () {
    const {page} = getBrowserState();

    // Waiting for an element to exist on the page, so we know the page is loaded.
    // then we check if the error message is NOT present.
    await page.locator('#email').wait();
    console.log('page ready');
    let bodyText = await page.evaluate(() => document.body.textContent);
    expect(bodyText).not.toContain('Invalid email or password');

    await page.locator('#email').fill('unregistered@test.com');
    await page.locator('#password').fill('letmein');
    await page.locator('#btn-submit').click();
    console.log('after click');

    // Waiting for the error message to appear on the page.
    const text = await page.locator('//label[text(), "Invalid email or password"').wait();
    expect(text).not.toBeNull();
  });
});
