# Product Requirements: House Inventory & Maintenance System

## Business Case
Homeowners often struggle with managing the lifecycle of their home's assets. Critical information (warranties, manuals, model numbers) is scattered or lost, leading to:
-   **Inefficient Maintenance**: Missed filter changes or service intervals reduce appliance lifespan.
-   **Insurance Gaps**: Inability to prove value or ownership during theft or disaster claims.
-   **Resale Friction**: Lack of documentation devalues the home during sales.

**Value Proposition**: A centralized, digital "Home Manual" that simplifies asset management, ensures timely maintenance, and preserves home value.

## Business Value: Chores & Task Management
Integrating chores adds a layer of **operational efficiency** to the static asset management.
-   **Preventative Maintenance**: Linking chores to assets (e.g., "Clean Dryer Vent") prevents costly repairs.
-   **Accountability**: Assigning tasks to family members fosters shared responsibility.
-   **Habit Formation**: Recurring schedules ensure routine maintenance isn't neglected.
-   **Flexibility**: Supports both property-specific tasks (lawn care) and general lifestyle tasks (grocery shopping).

## Feature Set: House Details & Inventory

### 1. House Details Dashboard
The central hub for a specific property.
-   **Overview**: Quick stats (Total Items, Upcoming Maintenance).
-   **Tabs/Sections**: Inventory, Maintenance, Documents.

### 2. Smart Inventory Management
Focus on friction-less data entry.
-   **Quick Add**:
    -   **Barcode/QR Scanner**: Instantly retrieve product details (Brand, Model) by scanning the appliance tag.
    -   **Visual Search (Future)**: Identify items via camera.
-   **Item Details**:
    -   **Core Data**: Name, Category (Appliance, HVAC, Plumbing), Brand, Model, Serial #.
    -   **Lifecycle**: Purchase Date, Price, Warranty Expiration.
    -   **Media**: Photos of item, receipt, and installation.
    -   **Documentation**: Link to PDF manuals.

### 3. Maintenance & Care
-   **Auto-Schedules**: "Refrigerator" entry suggests "Change Water Filter every 6 months".
### 3. Maintenance & Care
-   **Auto-Schedules**: "Refrigerator" entry suggests "Change Water Filter every 6 months".
-   **Log**: History of repairs and service.

### 4. Chores Management
-   **Scope**: Tasks can be linked to a House or independent.
-   **Attributes**:
    -   **Title/Description**: What needs to be done.
    -   **Assignment**: Who is responsible (link to Family Member).
    -   **Schedule**: Due date and Frequency (Daily, Weekly, Monthly).
    -   **Priority**: Low, Medium, High.
    -   **Status**: Pending, Completed.

## User Flow (Add Item)
1.  User taps "Add Item" in House Details.
2.  Selects "Scan Barcode".
3.  Camera opens -> Scans barcode on fridge.
4.  App pre-fills "LG Refrigerator", Model #, etc.
5.  User confirms and adds purchase date.
6.  Item added to Inventory.

## Technical Requirements
-   **Camera Integration**: For scanning and photos.
-   **Barcode API**: Integration with a product database (e.g., UPC lookup).
-   **Data Structure**: Relational structure linking Houses -> Items -> Maintenance Tasks.
