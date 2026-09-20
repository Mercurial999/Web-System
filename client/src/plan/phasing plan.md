Bakery Distribution Management System (BDMS)
Development Roadmap — Phase 1 to Future Scaling
Project Direction
The goal of the Bakery Distribution Management System (BDMS) is to create a practical system for managing the operations of a bakery distribution business.
The system will initially focus on the internal operations of the business, particularly staff, products, inventory, bakery stores, deliveries, and reports.
The system will be developed in phases.
The main principle is:
Build a smaller operational system first, finish it completely, then scale it with future upgrades.
This prevents the project from becoming unnecessarily large while still keeping the architecture ready for future expansion.
________________________________________
1. Important Business Decision
Bakery Stores Will NOT Have User Accounts in Phase 1
Bakery stores will be treated as customers/business entities, not system users.
For example:
Store
•	ID 
•	Store Name 
•	Address 
•	Contact Person 
•	Phone Number 
•	Status 
•	Created At 
•	Updated At 
Example:
Mary's Bakery
•	Address: Koronadal 
•	Contact Person: Maria Santos 
•	Phone: 09XXXXXXXXX 
•	Status: ACTIVE 
There will be no:
•	Store password 
•	Store login 
•	Store authentication 
•	Store role 
Instead, staff members will use the system and record the orders/deliveries for the bakery stores.
This makes the first version much smaller and easier to complete.
________________________________________
2. Difference Between Users and Stores
The system will separate these two concepts.
System Users
These are people who actually log into BDMS.
Examples:
•	Admin 
•	Manager 
•	Staff 
They belong to the users table.
Bakery Stores
These are businesses/customers that receive bakery ingredients.
Examples:
•	Mary's Bakery 
•	J&J Bakeshop 
•	ABC Bakery 
They belong to the stores table.
Therefore:
User = person operating the system
Store = business/customer receiving products
This separation should remain even when the system becomes larger.
________________________________________
3. Phase 1 — Operational MVP
Goal
The goal of Phase 1 is to create a working internal bakery distribution system that can actually be used for the basic business workflow.
The first version will contain:
1.	Authentication 
2.	Users 
3.	Products 
4.	Inventory 
5.	Stores 
6.	Deliveries 
7.	Basic Reports 
________________________________________
4. Phase 1 Modules
4.1 Authentication & Users
Purpose:
Allow staff members to securely access the system.
Initial responsibilities:
•	Staff login 
•	User accounts 
•	Roles 
•	Basic authorization 
Possible roles:
•	Admin 
•	Manager 
•	Staff 
We will keep the existing User/Role architecture because it will be useful later when permissions become more advanced.
________________________________________
5. Products Module
Purpose:
Manage the bakery ingredients/products distributed to stores.
Examples:
•	Flour 
•	Sugar 
•	Yeast 
•	Margarine 
•	Chocolate 
•	Milk 
•	Other bakery ingredients 
Possible functionality:
•	Create product 
•	View products 
•	Update product 
•	Activate/deactivate product 
•	View product information 
________________________________________
6. Inventory Module
Purpose:
Track the available quantity of bakery ingredients.
The inventory module will handle:
•	Current stock 
•	Stock-in 
•	Stock-out 
•	Stock movements 
•	Inventory validation 
•	Transaction-safe stock updates 
The inventory system should maintain a history of stock movements.
Example:
Flour
Starting stock:
100 kg
Delivery:
30 kg
Remaining:
70 kg
Stock movement:
Type: OUT
Reason: DELIVERY
Quantity: 30 kg
Reference: DEL-2026-0001
The concurrency protection already implemented in the project should remain part of the inventory foundation.
________________________________________
7. Stores Module
Purpose:
Manage the bakery stores that receive products.
The Stores module should initially support:
•	Create store 
•	View stores 
•	View individual store 
•	Update store 
•	Activate/deactivate store 
•	Search/filter stores 
Example:
Mary's Bakery
J&J Bakeshop
ABC Bakery
The stores do not need accounts in Phase 1.
________________________________________
8. Delivery Module
This will become one of the most important modules of BDMS.
A delivery connects:
Staff + Store + Products + Inventory
Example:
Delivery #: DEL-2026-0001

Store:
Mary's Bakery

Delivered By:
John - Staff

Items:

Flour       30 kg
Sugar       10 kg
Yeast        5 kg
When the delivery is confirmed:
Delivery
   ↓
Validate Inventory
   ↓
Database Transaction
   ↓
Deduct Inventory
   ↓
Create Stock Movement
   ↓
Save Delivery
________________________________________
9. Important Architecture Rule
The Delivery module should not directly manipulate inventory quantities.
For example, the Delivery module should not simply do something like:
inventory.quantity = inventory.quantity - delivery.quantity
Instead:
Delivery Module
       ↓
Inventory Service
       ↓
Validate Stock
       ↓
Database Transaction
       ↓
Update Inventory
       ↓
Create Stock Movement
This keeps inventory logic centralized.
It also protects the system against problems such as:
•	insufficient stock 
•	concurrent deliveries 
•	incorrect stock movements 
•	inconsistent inventory data 
This is especially important because the inventory/concurrency functionality has already been developed.
________________________________________
10. Phase 1 Main Business Workflow
The main workflow will be:
Staff Login
      ↓
Select Bakery Store
      ↓
Create Delivery
      ↓
Add Products
      ↓
Enter Quantities
      ↓
Validate Inventory
      ↓
Database Transaction
      ↓
Deduct Inventory
      ↓
Create Stock Movement
      ↓
Save Delivery
      ↓
Generate/View Report
This is the first major end-to-end workflow we want to complete.
________________________________________
11. Phase 1 Backend Architecture
We will continue using a feature-based modular architecture.
Conceptually:
src/
│
├── modules/
│   │
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── inventory/
│   ├── stores/
│   ├── deliveries/
│   └── reports/
│
├── shared/
│   ├── middleware/
│   ├── errors/
│   ├── utilities/
│   └── ...
│
├── app.ts
└── index.ts
Each major business module should contain its own responsibilities.
For example:
stores/
├── store.controller.ts
├── store.service.ts
├── store.repository.ts
├── store.routes.ts
├── store.validation.ts
└── store.types.ts
We will adjust the exact structure according to the backend structure that already exists instead of unnecessarily rewriting working code.
________________________________________
12. Phase 1 Completion Criteria
Phase 1 will be considered complete when the following workflow works:
Staff
•	Staff can log in. 
•	Staff has an appropriate role. 
Products
•	Products can be created. 
•	Products can be viewed. 
•	Products can be updated. 
•	Products can be activated/deactivated. 
Inventory
•	Current stock can be viewed. 
•	Stock can be added through controlled transactions. 
•	Stock can be deducted through controlled transactions. 
•	Stock movements are recorded. 
•	Concurrency protection works. 
Stores
•	Staff can create bakery stores. 
•	Staff can view stores. 
•	Staff can update stores. 
•	Staff can activate/deactivate stores. 
Deliveries
•	Staff can create a delivery. 
•	A delivery can be assigned to a bakery store. 
•	Products can be added to the delivery. 
•	Quantities can be entered. 
•	Inventory is validated. 
•	Inventory is safely deducted. 
•	Stock movements are created. 
•	Delivery information is stored. 
Reports
Basic reports should eventually show information such as:
•	Current inventory 
•	Stock movements 
•	Deliveries 
•	Products delivered 
•	Store delivery history 
________________________________________
13. What We Are NOT Building Yet
To keep the project manageable, Phase 1 will intentionally not include:
•	Bakery-store login 
•	Customer accounts 
•	Online ordering 
•	Customer portal 
•	Mobile application 
•	Complex approval systems 
•	Route optimization 
•	Multiple warehouses 
•	Advanced notifications 
•	Every possible BIR reporting requirement 
•	Large-scale analytics 
These features are not rejected.
They are simply postponed until the core system is operational.
________________________________________
14. Phase 2 — Operations Upgrade
After Phase 1 is completed and stable, we move to Phase 2.
The goal is to make the system more useful for actual business operations.
Phase 2 Features
Suppliers
Add suppliers that provide bakery ingredients.
Possible functionality:
•	Supplier records 
•	Supplier contact information 
•	Supplier status 
•	Supplier products 
________________________________________
Purchase Receiving / Stock-In
Instead of manually increasing inventory, the system can record where stock came from.
Example:
Supplier
    ↓
Purchase/Receiving
    ↓
Products
    ↓
Inventory Stock-In
    ↓
Stock Movement
Example:
Supplier: ABC Trading

Flour: 500 kg

Received Date:
August 28, 2026
________________________________________
Stock Adjustments
Allow authorized staff to correct inventory when necessary.
Examples:
•	Damaged goods 
•	Expired products 
•	Counting errors 
•	Missing stock 
•	Other approved adjustments 
Every adjustment should have a reason.
________________________________________
Returns
Eventually support:
Delivery
    ↓
Customer Return
    ↓
Return Items
    ↓
Inventory Adjustment
This is useful when a bakery store returns damaged or incorrect products.
________________________________________
Delivery Status
Add statuses such as:
PENDING
PREPARING
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURNED
The exact statuses will be decided based on the actual business workflow.
________________________________________
Audit Logs
Record important system actions.
Example:
User: John
Action: UPDATE_PRODUCT
Product: Flour
Date: August 28, 2026
This becomes particularly useful as the system grows.
________________________________________
Improved Reports
Phase 2 reports can include:
•	Daily deliveries 
•	Monthly deliveries 
•	Store delivery history 
•	Product movement 
•	Stock-in reports 
•	Stock-out reports 
•	Inventory adjustments 
•	Returns 
•	Supplier reports 
________________________________________
Stronger Permissions
Instead of only having basic roles, we can eventually have more specific permissions.
Example:
Admin
 ├── Manage Users
 ├── Manage Products
 ├── Manage Inventory
 ├── Manage Stores
 ├── Manage Deliveries
 └── View Reports

Manager
 ├── Manage Inventory
 ├── Manage Stores
 ├── Manage Deliveries
 └── View Reports

Staff
 ├── View Products
 ├── Record Deliveries
 └── View Allowed Information
The exact permissions will be designed later.
________________________________________
15. Phase 3 — Customer Ordering
Only after the internal system is stable should we consider allowing bakery stores to interact directly with BDMS.
At this stage, bakery stores can optionally become system users.
The workflow could become:
Bakery Store
      ↓
Store Login
      ↓
Create Order
      ↓
Submit Order
      ↓
Staff Reviews Order
      ↓
Approve Order
      ↓
Prepare Delivery
      ↓
Deliver
Possible features:
•	Store accounts 
•	Store login 
•	Store dashboard 
•	Online ordering 
•	Order history 
•	Order status 
•	Order cancellation 
•	Staff approval 
•	Order-to-delivery workflow 
This should be treated as an upgrade, not a requirement for the initial system.
________________________________________
16. Phase 4 — Business Scale
If the business grows, the system can support more advanced business requirements.
Potential features:
Advanced Reporting
•	Management dashboards 
•	Sales/delivery analytics 
•	Inventory analytics 
•	Store performance 
•	Product demand 
•	Monthly/annual reports 
BIR-Oriented Reporting
The system can eventually be enhanced based on the business's actual BIR reporting requirements.
We should not guess or overbuild these requirements now.
When this phase arrives, we can identify the actual reports and data required and design them properly.
Multiple Locations
If the business grows:
Main Warehouse
       ↓
Distribution Branch 1
Distribution Branch 2
Distribution Branch 3
The inventory architecture can eventually be expanded to support multiple warehouses or locations.
________________________________________
17. Phase 5 — Multi-Platform System
If the business becomes large enough, BDMS could eventually have:
                 BDMS Backend
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Staff Web      Store Web      Mobile App
Possible platforms:
•	Staff Web Portal 
•	Bakery Store Portal 
•	Delivery Staff Mobile App 
•	Customer Ordering 
•	Notifications 
•	Online ordering 
•	Delivery tracking 
But this is a long-term direction, not something we should build now.
________________________________________
18. Recommended Development Order
This is the roadmap we should follow.
CURRENT PHASE
Inventory Foundation
        ↓
Stores Module
        ↓
Delivery Database
        ↓
Delivery Backend
        ↓
Delivery + Inventory Integration
        ↓
Postman Testing
        ↓
Frontend Integration
        ↓
Basic Reports
        ↓
PHASE 1 COMPLETE
AFTER PHASE 1
PHASE 2
Operations Upgrade
        ↓
Suppliers
        ↓
Purchase Receiving
        ↓
Stock Adjustments
        ↓
Returns
        ↓
Delivery Status
        ↓
Audit Logs
        ↓
Improved Reports
        ↓
Role Permissions
AFTER PHASE 2
PHASE 3
Customer Ordering
        ↓
Store Accounts
        ↓
Store Login
        ↓
Online Orders
        ↓
Order Approval
        ↓
Order → Delivery
LONG TERM
PHASE 4
Business Scale
        ↓
Advanced Reports
        ↓
BIR-Oriented Reports
        ↓
Multiple Locations
        ↓
Advanced Inventory
        ↓
Analytics
FUTURE
PHASE 5
Multi-Platform
        ↓
Customer Portal
        ↓
Mobile App
        ↓
Online Ordering
        ↓
Delivery Tracking
        ↓
Notifications
________________________________________
19. Development Philosophy
We should follow these rules throughout the project:
Rule 1 — Finish before expanding
Don't start Phase 2 while Phase 1 is still broken.
Rule 2 — Build the business workflow, not just CRUD
For example, creating a delivery is more important than simply having a deliveries table.
Rule 3 — Protect data integrity
Inventory must always remain accurate.
Rule 4 — Keep modules separated
Delivery logic should not become mixed with authentication, product logic, or inventory internals.
Rule 5 — Don't over-engineer too early
A medium-sized business does not mean we need to build an enterprise system immediately.
Rule 6 — Design for future expansion
We should avoid architectural decisions that make Phase 2 or Phase 3 difficult.
Rule 7 — Every feature must have a business reason
If a feature does not solve a real operational problem, it can wait.
________________________________________
20. The Main Goal
The first goal is not:
"Build the biggest bakery distribution system possible."
The first goal is:
"Build a working system that a staff member can actually use to manage products, inventory, stores, and deliveries."
Once that works reliably, we expand it.
This gives us a much better development strategy:
Small → Working → Tested → Useful → Scalable
________________________________________
21. FUTURE HANDOFF — PHASE 2
When Phase 1 is finished, save the following text. You can paste it into a future conversation with me:
We are continuing the Bakery Distribution Management System (BDMS) project.
Phase 1 is complete and operational.
The important business decision is that bakery stores do NOT have user accounts in the current version. Bakery stores are customer/business records, while staff members are the actual system users who record deliveries and manage operations.
Phase 1 contains:
•	Authentication / Users 
•	Products 
•	Inventory 
•	Stores 
•	Deliveries 
•	Basic Reports 
The main workflow is:
Staff Login → Select Bakery Store → Create Delivery → Add Products and Quantities → Validate Inventory → Transaction-safe Inventory Deduction → Create Stock Movements → Save Delivery → Reports
The backend uses a feature-based modular architecture.
Delivery should use the centralized Inventory business logic instead of directly manipulating inventory quantities.
Now we are ready to begin Phase 2 — Operations Upgrade.
Phase 2 priorities are:
1.	Suppliers 
2.	Purchase Receiving / Stock-In 
3.	Stock Adjustments 
4.	Returns 
5.	Delivery Status 
6.	Audit Logs 
7.	Improved Reports 
8.	Stronger Role-Based Permissions 
Before changing anything, review the existing backend, frontend, Prisma schema, and current module structure. Do not assume the code structure. Work from the existing implementation.
Teach me step-by-step, like our previous lessons. Explain the business reason first, then the database design, then the backend implementation, then Postman testing, and finally frontend integration where applicable.
Do not jump to Phase 3 customer accounts or online ordering unless I explicitly ask for it.
Continue from Phase 2 and keep the system practical, maintainable, and scalable.

