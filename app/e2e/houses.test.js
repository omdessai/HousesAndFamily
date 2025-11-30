describe('App E2E Tests', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should show houses dashboard on launch', async () => {
        await expect(element(by.id('add-house-fab'))).toBeVisible();
    });

    it('should add a new house', async () => {
        // Tap the FAB to navigate to Add House screen
        await element(by.id('add-house-fab')).tap();

        // Verify we're on the Add House screen
        await expect(element(by.text('Add New House'))).toBeVisible();

        // Fill in house details
        await element(by.id('house-name-input')).typeText('Test House');
        await element(by.id('house-address-input')).typeText('123 Test Street');

        // Save the house
        await element(by.id('save-house-button')).tap();

        // Verify we're back on the dashboard by checking FAB is visible
        await expect(element(by.id('add-house-fab'))).toBeVisible();

        // Verify the new house appears in the list
        await expect(element(by.text('Test House'))).toBeVisible();
        await expect(element(by.text('123 Test Street'))).toBeVisible();
    });

    it('should toggle favorite status', async () => {
        // Find the first house card (assuming initial houses exist)
        const favoriteButton = element(by.id('favorite-button-1'));

        // Tap to favorite
        await favoriteButton.tap();

        // Tap again to unfavorite
        await favoriteButton.tap();

        // The test passes if no errors occur
    });

    it('should edit house name', async () => {
        // Tap the house card to enter edit mode (navigates to AddHouse screen)
        await element(by.id('house-card-1')).tap();

        // Verify we are on the Edit House screen
        await expect(element(by.text('Edit House'))).toBeVisible();

        // Clear and type new name
        await element(by.id('house-name-input')).clearText();
        await element(by.id('house-name-input')).typeText('Updated House Name');

        // Save
        await element(by.id('save-house-button')).tap();

        // Verify we're back on the dashboard
        await expect(element(by.id('add-house-fab'))).toBeVisible();

        // Verify the name was updated
        await expect(element(by.text('Updated House Name'))).toBeVisible();
    });

    it('should delete house via swipe', async () => {
        // Get the initial house name
        const houseName = 'My Sweet Home';

        // Verify house exists
        await expect(element(by.text(houseName))).toBeVisible();

        // Swipe the house card to reveal delete button - use a slower swipe
        await element(by.id('house-card-1')).swipe('left', 'slow', 0.5);

        // Wait for delete button to appear
        await waitFor(element(by.text('Delete')))
            .toBeVisible()
            .withTimeout(3000);

        // Tap the delete button
        await element(by.text('Delete')).tap();

        // Confirm deletion in alert
        await waitFor(element(by.text('Delete House')))
            .toBeVisible()
            .withTimeout(2000);

        // Tap the Delete button in the alert
        await element(by.text('Delete').and(by.type('_UIAlertControllerActionView'))).tap();

        // Verify house is removed
        await waitFor(element(by.text(houseName)))
            .not.toBeVisible()
            .withTimeout(2000);
    });

    it('should navigate to add house and cancel', async () => {
        // Tap the FAB
        await element(by.id('add-house-fab')).tap();

        // Verify we're on Add House screen
        await expect(element(by.text('Add New House'))).toBeVisible();

        // Tap cancel
        await element(by.text('Cancel')).tap();

        // Verify we're back on dashboard
        await expect(element(by.id('add-house-fab'))).toBeVisible();
    });

    it('should show validation error when saving empty house', async () => {
        // Tap the FAB
        await element(by.id('add-house-fab')).tap();

        // Try to save without entering anything
        await element(by.id('save-house-button')).tap();

        // Verify error alert appears
        await waitFor(element(by.text('Error')))
            .toBeVisible()
            .withTimeout(2000);

        // Dismiss alert
        await element(by.text('OK')).tap();
    });

    it('should navigate to family dashboard', async () => {
        // Tap the Family tab
        await element(by.text('Family')).tap();

        // Verify Family Dashboard is visible (check for FAB)
        await expect(element(by.id('add-person-fab'))).toBeVisible();
    });

    it('should add a new person', async () => {
        // Tap the FAB
        await element(by.id('add-person-fab')).tap();

        // Verify we're on Add Person screen
        await expect(element(by.text('Add Person'))).toBeVisible();

        // Fill in details
        await element(by.id('person-name-input')).typeText('Jane Doe');
        await element(by.id('person-birthdate-input')).typeText('1980-01-01');

        // Save
        await element(by.id('save-person-button')).tap();

        // Verify we're back on dashboard
        await expect(element(by.id('add-person-fab'))).toBeVisible();

        // Verify the new person appears
        await expect(element(by.text('Jane Doe'))).toBeVisible();
        // Date might be formatted, so we might not check for exact date string unless we know the format displayed
    });

    it('should edit person', async () => {
        // Tap the person card (assuming Jane Doe is visible)
        await element(by.text('Jane Doe')).tap();

        // Verify we're on Edit Person screen
        await expect(element(by.text('Edit Person'))).toBeVisible();

        // Change name
        await element(by.id('person-name-input')).clearText();
        await element(by.id('person-name-input')).typeText('Jane Smith');

        // Save
        await element(by.id('save-person-button')).tap();

        // Verify update
        await expect(element(by.text('Jane Smith'))).toBeVisible();
    });
});
